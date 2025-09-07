import logging
from datetime import datetime, timezone
from typing import List, Dict, Optional, Tuple
from sqlalchemy import and_, or_, func
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import joinedload
from app import db
from models import (
    Sector, Brand, SubNode, PayPalProduct, PayPalPlan, PayPalSubscription,
    BulkJob, PayPalWebhookEvent, AuditLog, PayPalProductStatus, PayPalPlanStatus, JobStatus
)

logger = logging.getLogger(__name__)

class DatabaseService:
    
    @staticmethod
    def create_audit_log(entity_type: str, entity_id: str, action: str, 
                        old_values: Optional[Dict] = None, new_values: Optional[Dict] = None,
                        user_id: Optional[str] = None, ip_address: Optional[str] = None, user_agent: Optional[str] = None):
        """Create an audit log entry"""
        try:
            audit_log = AuditLog(
                entity_type=entity_type,
                entity_id=entity_id,
                action=action,
                old_values=old_values,
                new_values=new_values,
                user_id=user_id,
                ip_address=ip_address,
                user_agent=user_agent
            )
            db.session.add(audit_log)
            db.session.commit()
            logger.debug(f"Audit log created: {entity_type} {entity_id} {action}")
        except Exception as e:
            logger.error(f"Error creating audit log: {str(e)}")
            db.session.rollback()
    
    @staticmethod
    def get_or_create_sector(name: str, slug: str, glyph: Optional[str] = None, description: Optional[str] = None) -> Optional[Sector]:
        """Get existing sector or create new one"""
        try:
            # Check for existing sector by slug
            sector = Sector.query.filter_by(slug=slug).first()
            
            if not sector:
                sector = Sector(
                    name=name,
                    slug=slug,
                    glyph=glyph,
                    description=description
                )
                db.session.add(sector)
                db.session.commit()
                
                DatabaseService.create_audit_log(
                    'sector', str(sector.id), 'create',
                    new_values={'name': name, 'slug': slug, 'glyph': glyph}
                )
                
                logger.info(f"Created new sector: {name} ({slug})")
            
            return sector
            
        except IntegrityError as e:
            db.session.rollback()
            logger.error(f"Integrity error creating sector {slug}: {str(e)}")
            # Try to get the existing sector in case of race condition
            return Sector.query.filter_by(slug=slug).first()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating/getting sector {slug}: {str(e)}")
            raise
    
    @staticmethod
    def get_or_create_brand(sector_id: str, name: str, slug: str, 
                           monthly_fee: Optional[float] = None, annual_fee: Optional[float] = None,
                           payout_tier: Optional[str] = None, region: Optional[str] = None) -> Optional[Brand]:
        """Get existing brand or create new one, preventing duplicates"""
        try:
            # Check for existing brand by sector_id and slug
            brand = Brand.query.filter_by(sector_id=sector_id, slug=slug).first()
            
            if not brand:
                brand = Brand(
                    sector_id=sector_id,
                    name=name,
                    slug=slug,
                    monthly_fee=monthly_fee,
                    annual_fee=annual_fee,
                    payout_tier=payout_tier,
                    region=region
                )
                db.session.add(brand)
                db.session.commit()
                
                DatabaseService.create_audit_log(
                    'brand', str(brand.id), 'create',
                    new_values={
                        'name': name, 'slug': slug, 'sector_id': str(sector_id),
                        'monthly_fee': monthly_fee, 'annual_fee': annual_fee
                    }
                )
                
                logger.info(f"Created new brand: {name} ({slug}) in sector {sector_id}")
            
            return brand
            
        except IntegrityError as e:
            db.session.rollback()
            logger.error(f"Integrity error creating brand {slug}: {str(e)}")
            # Try to get the existing brand in case of race condition
            return Brand.query.filter_by(sector_id=sector_id, slug=slug).first()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating/getting brand {slug}: {str(e)}")
            raise
    
    @staticmethod
    def create_subnode(brand_id: str, name: str, slug: str, description: Optional[str] = None) -> SubNode:
        """Create a subnode for a brand"""
        try:
            # Check for existing subnode by brand_id and slug
            existing = SubNode.query.filter_by(brand_id=brand_id, slug=slug).first()
            if existing:
                logger.warning(f"Subnode {slug} already exists for brand {brand_id}")
                return existing
            
            subnode = SubNode(
                brand_id=brand_id,
                name=name,
                slug=slug,
                description=description
            )
            db.session.add(subnode)
            db.session.commit()
            
            DatabaseService.create_audit_log(
                'subnode', str(subnode.id), 'create',
                new_values={'name': name, 'slug': slug, 'brand_id': str(brand_id)}
            )
            
            logger.info(f"Created subnode: {name} ({slug}) for brand {brand_id}")
            return subnode
            
        except IntegrityError as e:
            db.session.rollback()
            logger.error(f"Integrity error creating subnode {slug}: {str(e)}")
            raise
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating subnode {slug}: {str(e)}")
            raise
    
    @staticmethod
    def create_paypal_product(brand_id: str, name: str, description: Optional[str] = None,
                             category: str = 'SERVICE', image_url: Optional[str] = None,
                             home_url: Optional[str] = None) -> PayPalProduct:
        """Create a PayPal product record"""
        try:
            product = PayPalProduct(
                brand_id=brand_id,
                name=name,
                description=description,
                category=category,
                image_url=image_url,
                home_url=home_url,
                status=PayPalProductStatus.PENDING
            )
            db.session.add(product)
            db.session.commit()
            
            DatabaseService.create_audit_log(
                'paypal_product', str(product.id), 'create',
                new_values={'name': name, 'brand_id': str(brand_id), 'category': category}
            )
            
            logger.info(f"Created PayPal product record: {name} for brand {brand_id}")
            return product
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating PayPal product: {str(e)}")
            raise
    
    @staticmethod
    def update_paypal_product_status(product_id: str, status: PayPalProductStatus,
                                   paypal_product_id: Optional[str] = None, 
                                   paypal_response: Optional[Dict] = None,
                                   error_message: Optional[str] = None):
        """Update PayPal product status and sync data"""
        try:
            product = PayPalProduct.query.get(product_id)
            if not product:
                raise ValueError(f"PayPal product not found: {product_id}")
            
            old_values = {
                'status': product.status.value if product.status else None,
                'paypal_product_id': product.paypal_product_id
            }
            
            product.status = status
            if paypal_product_id:
                product.paypal_product_id = paypal_product_id
            if paypal_response:
                product.paypal_response = paypal_response
            if error_message:
                product.error_message = error_message
            
            product.updated_at = datetime.now(timezone.utc)
            db.session.commit()
            
            DatabaseService.create_audit_log(
                'paypal_product', str(product.id), 'sync',
                old_values=old_values,
                new_values={
                    'status': status.value,
                    'paypal_product_id': paypal_product_id
                }
            )
            
            logger.info(f"Updated PayPal product {product_id}: {status.value}")
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating PayPal product status: {str(e)}")
            raise
    
    @staticmethod
    def create_paypal_plan(product_id: str, name: str, description: Optional[str] = None,
                          billing_cycle_interval_unit: str = 'MONTH',
                          billing_cycle_interval_count: int = 1,
                          currency_code: str = 'USD',
                          fixed_price_value: Optional[float] = None) -> PayPalPlan:
        """Create a PayPal plan record"""
        try:
            plan = PayPalPlan(
                product_id=product_id,
                name=name,
                description=description,
                billing_cycle_interval_unit=billing_cycle_interval_unit,
                billing_cycle_interval_count=billing_cycle_interval_count,
                currency_code=currency_code,
                fixed_price_value=fixed_price_value,
                status=PayPalPlanStatus.PENDING
            )
            db.session.add(plan)
            db.session.commit()
            
            DatabaseService.create_audit_log(
                'paypal_plan', str(plan.id), 'create',
                new_values={
                    'name': name, 'product_id': str(product_id),
                    'currency_code': currency_code, 'fixed_price_value': fixed_price_value
                }
            )
            
            logger.info(f"Created PayPal plan record: {name} for product {product_id}")
            return plan
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating PayPal plan: {str(e)}")
            raise
    
    @staticmethod
    def update_paypal_plan_status(plan_id: str, status: PayPalPlanStatus,
                                 paypal_plan_id: Optional[str] = None,
                                 paypal_response: Optional[Dict] = None,
                                 error_message: Optional[str] = None):
        """Update PayPal plan status and sync data"""
        try:
            plan = PayPalPlan.query.get(plan_id)
            if not plan:
                raise ValueError(f"PayPal plan not found: {plan_id}")
            
            old_values = {
                'status': plan.status.value if plan.status else None,
                'paypal_plan_id': plan.paypal_plan_id
            }
            
            plan.status = status
            if paypal_plan_id:
                plan.paypal_plan_id = paypal_plan_id
            if paypal_response:
                plan.paypal_response = paypal_response
            if error_message:
                plan.error_message = error_message
            
            plan.updated_at = datetime.now(timezone.utc)
            db.session.commit()
            
            DatabaseService.create_audit_log(
                'paypal_plan', str(plan.id), 'sync',
                old_values=old_values,
                new_values={
                    'status': status.value,
                    'paypal_plan_id': paypal_plan_id
                }
            )
            
            logger.info(f"Updated PayPal plan {plan_id}: {status.value}")
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating PayPal plan status: {str(e)}")
            raise
    
    @staticmethod
    def get_brands_for_paypal_processing(limit: int = 1000) -> List[Brand]:
        """Get brands that need PayPal product creation"""
        try:
            # Find brands without PayPal products or with failed products
            brands = db.session.query(Brand)\
                .outerjoin(PayPalProduct)\
                .filter(
                    or_(
                        PayPalProduct.id.is_(None),
                        PayPalProduct.status == PayPalProductStatus.ERROR
                    )
                )\
                .options(joinedload(Brand.sector))\
                .limit(limit)\
                .all()
            
            logger.info(f"Found {len(brands)} brands needing PayPal processing")
            return brands
            
        except Exception as e:
            logger.error(f"Error getting brands for PayPal processing: {str(e)}")
            raise
    
    @staticmethod
    def get_products_for_plan_creation(limit: int = 1000) -> List[PayPalProduct]:
        """Get PayPal products that need plan creation"""
        try:
            products = db.session.query(PayPalProduct)\
                .outerjoin(PayPalPlan)\
                .filter(
                    and_(
                        PayPalProduct.status == PayPalProductStatus.ACTIVE,
                        PayPalProduct.paypal_product_id.isnot(None),
                        or_(
                            PayPalPlan.id.is_(None),
                            PayPalPlan.status == PayPalPlanStatus.ERROR
                        )
                    )
                )\
                .options(joinedload(PayPalProduct.brand))\
                .limit(limit)\
                .all()
            
            logger.info(f"Found {len(products)} products needing plan creation")
            return products
            
        except Exception as e:
            logger.error(f"Error getting products for plan creation: {str(e)}")
            raise
    
    @staticmethod
    def create_bulk_job(job_type: str, job_name: str, total_items: int) -> BulkJob:
        """Create a bulk job record"""
        try:
            job = BulkJob(
                job_type=job_type,
                job_name=job_name,
                total_items=total_items,
                status=JobStatus.PENDING
            )
            db.session.add(job)
            db.session.commit()
            
            logger.info(f"Created bulk job: {job_name} ({job_type}) for {total_items} items")
            return job
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating bulk job: {str(e)}")
            raise
    
    @staticmethod
    def update_bulk_job_progress(job_id: str, processed_items: Optional[int] = None,
                               successful_items: Optional[int] = None, failed_items: Optional[int] = None,
                               status: Optional[JobStatus] = None, error_log: Optional[List] = None,
                               result_data: Optional[Dict] = None):
        """Update bulk job progress"""
        try:
            job = BulkJob.query.get(job_id)
            if not job:
                raise ValueError(f"Bulk job not found: {job_id}")
            
            if processed_items is not None:
                job.processed_items = processed_items
            if successful_items is not None:
                job.successful_items = successful_items
            if failed_items is not None:
                job.failed_items = failed_items
            if status is not None:
                job.status = status
                if status == JobStatus.PROCESSING and not job.started_at:
                    job.started_at = datetime.now(timezone.utc)
                elif status in [JobStatus.COMPLETED, JobStatus.FAILED]:
                    job.completed_at = datetime.now(timezone.utc)
            if error_log is not None:
                job.error_log = error_log
            if result_data is not None:
                job.result_data = result_data
            
            job.updated_at = datetime.now(timezone.utc)
            db.session.commit()
            
            logger.info(f"Updated bulk job {job_id}: {status.value if status else 'progress'}")
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating bulk job progress: {str(e)}")
            raise
    
    @staticmethod
    def save_webhook_event(event_data: Dict) -> Optional[PayPalWebhookEvent]:
        """Save PayPal webhook event"""
        try:
            # Check if event already exists
            event_id = event_data.get('id')
            if not event_id:
                raise ValueError("Webhook event missing ID")
            
            existing = PayPalWebhookEvent.query.filter_by(event_id=event_id).first()
            if existing:
                logger.info(f"Webhook event {event_id} already processed")
                return existing
            
            webhook_event = PayPalWebhookEvent(
                event_id=event_id,
                event_type=event_data.get('event_type'),
                resource_type=event_data.get('resource_type'),
                resource_id=event_data.get('resource', {}).get('id'),
                summary=event_data.get('summary'),
                event_data=event_data
            )
            db.session.add(webhook_event)
            db.session.commit()
            
            logger.info(f"Saved webhook event: {event_id} ({event_data.get('event_type')})")
            return webhook_event
            
        except IntegrityError as e:
            db.session.rollback()
            logger.warning(f"Webhook event {event_id} already exists")
            return PayPalWebhookEvent.query.filter_by(event_id=event_id).first()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error saving webhook event: {str(e)}")
            raise
    
    @staticmethod
    def get_dashboard_stats() -> Dict:
        """Get dashboard statistics"""
        try:
            stats = {
                'total_sectors': Sector.query.count(),
                'total_brands': Brand.query.count(),
                'total_subnodes': SubNode.query.count(),
                'paypal_products': {
                    'total': PayPalProduct.query.count(),
                    'created': PayPalProduct.query.filter_by(status=PayPalProductStatus.ACTIVE).count(),
                    'pending': PayPalProduct.query.filter_by(status=PayPalProductStatus.PENDING).count(),
                    'error': PayPalProduct.query.filter_by(status=PayPalProductStatus.ERROR).count(),
                },
                'paypal_plans': {
                    'total': PayPalPlan.query.count(),
                    'created': PayPalPlan.query.filter_by(status=PayPalPlanStatus.ACTIVE).count(),
                    'pending': PayPalPlan.query.filter_by(status=PayPalPlanStatus.PENDING).count(),
                    'error': PayPalPlan.query.filter_by(status=PayPalPlanStatus.ERROR).count(),
                },
                'bulk_jobs': {
                    'total': BulkJob.query.count(),
                    'pending': BulkJob.query.filter_by(status=JobStatus.PENDING).count(),
                    'processing': BulkJob.query.filter_by(status=JobStatus.PROCESSING).count(),
                    'completed': BulkJob.query.filter_by(status=JobStatus.COMPLETED).count(),
                    'failed': BulkJob.query.filter_by(status=JobStatus.FAILED).count(),
                },
                'webhook_events': {
                    'total': PayPalWebhookEvent.query.count(),
                    'processed': PayPalWebhookEvent.query.filter_by(processed=True).count(),
                    'pending': PayPalWebhookEvent.query.filter_by(processed=False).count(),
                }
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting dashboard stats: {str(e)}")
            raise
