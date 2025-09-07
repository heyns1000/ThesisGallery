import logging
from datetime import datetime, timezone
from typing import List, Dict
from celery import Celery
import time
import json
from app import celery, db
from models import (
    Brand, PayPalProduct, PayPalPlan, BulkJob,
    PayPalProductStatus, PayPalPlanStatus, JobStatus
)
from services.paypal_service import PayPalService, PayPalAPIError
from services.database_service import DatabaseService
from services.bulk_paypal_processor import BulkPayPalProcessor
from services.faa_data_importer import FAADataImporter
import os

logger = logging.getLogger(__name__)

@celery.task(bind=True, max_retries=3)
def create_paypal_products_bulk(self, brand_ids: List[str], job_id: str):
    """Create PayPal products for multiple brands using bulk processor"""
    processor = BulkPayPalProcessor()
    return processor.create_products_bulk(brand_ids, job_id)

@celery.task(bind=True, max_retries=3) 
def create_paypal_plans_bulk(self, product_ids: List[str], job_id: str):
    """Create PayPal plans for multiple products using bulk processor"""
    processor = BulkPayPalProcessor()
    return processor.create_plans_bulk(product_ids, job_id)

@celery.task(bind=True, max_retries=3)
def import_faa_zone_data(self):
    """Import FAA.ZONE ecosystem data into the database"""
    try:
        logger.info("Starting FAA.ZONE data import")
        importer = FAADataImporter()
        result = importer.import_faa_sectors()
        logger.info(f"FAA.ZONE data import completed: {result}")
        return result
    except Exception as e:
        logger.error(f"FAA.ZONE data import failed: {str(e)}")
        raise

@celery.task(bind=True, max_retries=3)
def sync_brand_data_from_admin_portal(self):
    """Sync brand data from admin portal to prevent ID duplication"""
    try:
        logger.info("Starting brand data sync from admin portal")
        
        # First import FAA.ZONE data
        import_result = import_faa_zone_data.delay()
        
        # Wait for import to complete
        result = import_result.get(timeout=300)  # 5 minute timeout
        
        if result.get("success"):
            logger.info(f"Brand data sync completed: {result['imported_brands']} brands imported")
            return {
                "success": True,
                "message": f"Imported {result['imported_sectors']} sectors and {result['imported_brands']} brands",
                "sectors": result['imported_sectors'],
                "brands": result['imported_brands']
            }
        else:
            logger.error(f"Brand data sync failed: {result.get('error')}")
            return {
                "success": False,
                "error": result.get('error', 'Unknown error')
            }
            
    except Exception as e:
        logger.error(f"Brand data sync failed: {str(e)}")
        raise

@celery.task(bind=True, max_retries=3)
def original_create_paypal_products_bulk(self, brand_ids: List[str], job_id: str):
    """Create PayPal products for multiple brands"""
    try:
        logger.info(f"Starting bulk PayPal product creation for {len(brand_ids)} brands")
        
        # Initialize PayPal service
        paypal_service = PayPalService(
            client_id=os.environ.get('PAYPAL_CLIENT_ID'),
            client_secret=os.environ.get('PAYPAL_CLIENT_SECRET'),
            sandbox=os.environ.get('PAYPAL_SANDBOX', 'true').lower() == 'true'
        )
        
        # Update job status
        DatabaseService.update_bulk_job_progress(
            job_id, 
            status=JobStatus.PROCESSING
        )
        
        processed = 0
        successful = 0
        failed = 0
        errors = []
        
        batch_size = int(os.environ.get('PAYPAL_BATCH_SIZE', 50))
        rate_limit_delay = int(os.environ.get('PAYPAL_RATE_LIMIT_DELAY', 1))
        
        # Process brands in batches
        for i in range(0, len(brand_ids), batch_size):
            batch = brand_ids[i:i + batch_size]
            
            logger.info(f"Processing batch {i//batch_size + 1}: {len(batch)} brands")
            
            for brand_id in batch:
                try:
                    # Get brand from database
                    brand = Brand.query.get(brand_id)
                    if not brand:
                        logger.warning(f"Brand not found: {brand_id}")
                        failed += 1
                        errors.append(f"Brand not found: {brand_id}")
                        continue
                    
                    # Check if PayPal product already exists
                    existing_product = PayPalProduct.query.filter_by(brand_id=brand_id).first()
                    if existing_product and existing_product.status == PayPalProductStatus.ACTIVE:
                        logger.info(f"PayPal product already exists for brand {brand.name}")
                        processed += 1
                        successful += 1
                        continue
                    
                    # Create or get PayPal product record
                    if not existing_product:
                        paypal_product = DatabaseService.create_paypal_product(
                            brand_id=brand_id,
                            name=f"{brand.name} - {brand.sector.name}",
                            description=f"Subscription service for {brand.name} in {brand.sector.name} sector",
                            category='SERVICE',
                            home_url=f"https://seedwave.faa.zone/brands/{brand.slug}"
                        )
                    else:
                        paypal_product = existing_product
                    
                    # Create product in PayPal
                    product_data = {
                        'name': paypal_product.name,
                        'description': paypal_product.description,
                        'type': 'SERVICE',
                        'category': paypal_product.category,
                        'image_url': paypal_product.image_url,
                        'home_url': paypal_product.home_url
                    }
                    
                    paypal_response = paypal_service.create_product(product_data)
                    
                    # Update database with PayPal product ID
                    DatabaseService.update_paypal_product_status(
                        str(paypal_product.id),
                        PayPalProductStatus.ACTIVE,
                        paypal_product_id=paypal_response['id'],
                        paypal_response=paypal_response
                    )
                    
                    logger.info(f"Created PayPal product for {brand.name}: {paypal_response['id']}")
                    successful += 1
                    
                except PayPalAPIError as e:
                    logger.error(f"PayPal API error for brand {brand_id}: {str(e)}")
                    if existing_product:
                        DatabaseService.update_paypal_product_status(
                            str(existing_product.id),
                            PayPalProductStatus.ERROR,
                            error_message=str(e)
                        )
                    failed += 1
                    errors.append(f"Brand {brand_id}: {str(e)}")
                    
                except Exception as e:
                    logger.error(f"Unexpected error for brand {brand_id}: {str(e)}")
                    failed += 1
                    errors.append(f"Brand {brand_id}: {str(e)}")
                
                finally:
                    processed += 1
                    
                    # Update job progress
                    DatabaseService.update_bulk_job_progress(
                        job_id,
                        processed_items=processed,
                        successful_items=successful,
                        failed_items=failed,
                        error_log=errors[-10:]  # Keep only last 10 errors
                    )
            
            # Rate limiting between batches
            if i + batch_size < len(brand_ids):
                logger.info(f"Rate limiting: waiting {rate_limit_delay} seconds")
                time.sleep(rate_limit_delay)
        
        # Final job update
        final_status = JobStatus.COMPLETED if failed == 0 else JobStatus.COMPLETED
        DatabaseService.update_bulk_job_progress(
            job_id,
            status=final_status,
            result_data={
                'processed': processed,
                'successful': successful,
                'failed': failed,
                'completion_rate': (successful / processed * 100) if processed > 0 else 0
            }
        )
        
        logger.info(f"Bulk PayPal product creation completed: {successful}/{processed} successful")
        
        return {
            'processed': processed,
            'successful': successful,
            'failed': failed,
            'errors': errors
        }
        
    except Exception as e:
        logger.error(f"Fatal error in bulk PayPal product creation: {str(e)}")
        
        # Update job as failed
        DatabaseService.update_bulk_job_progress(
            job_id,
            status=JobStatus.FAILED,
            error_log=[str(e)]
        )
        
        # Retry if we haven't exceeded max retries
        if self.request.retries < self.max_retries:
            logger.info(f"Retrying bulk product creation in 60 seconds (attempt {self.request.retries + 1})")
            raise self.retry(countdown=60)
        
        raise

@celery.task(bind=True, max_retries=3)
def create_paypal_plans_bulk(self, product_ids: List[str], job_id: str):
    """Create PayPal billing plans for multiple products"""
    try:
        logger.info(f"Starting bulk PayPal plan creation for {len(product_ids)} products")
        
        # Initialize PayPal service
        paypal_service = PayPalService(
            client_id=os.environ.get('PAYPAL_CLIENT_ID'),
            client_secret=os.environ.get('PAYPAL_CLIENT_SECRET'),
            sandbox=os.environ.get('PAYPAL_SANDBOX', 'true').lower() == 'true'
        )
        
        # Update job status
        DatabaseService.update_bulk_job_progress(
            job_id,
            status=JobStatus.PROCESSING
        )
        
        processed = 0
        successful = 0
        failed = 0
        errors = []
        
        batch_size = int(os.environ.get('PAYPAL_BATCH_SIZE', 50))
        rate_limit_delay = int(os.environ.get('PAYPAL_RATE_LIMIT_DELAY', 1))
        
        # Process products in batches
        for i in range(0, len(product_ids), batch_size):
            batch = product_ids[i:i + batch_size]
            
            logger.info(f"Processing batch {i//batch_size + 1}: {len(batch)} products")
            
            for product_id in batch:
                try:
                    # Get PayPal product from database
                    paypal_product = PayPalProduct.query.get(product_id)
                    if not paypal_product or not paypal_product.paypal_product_id:
                        logger.warning(f"PayPal product not found or not synced: {product_id}")
                        failed += 1
                        errors.append(f"PayPal product not found: {product_id}")
                        continue
                    
                    # Get brand for pricing info
                    brand = paypal_product.brand
                    if not brand:
                        logger.warning(f"Brand not found for product: {product_id}")
                        failed += 1
                        errors.append(f"Brand not found for product: {product_id}")
                        continue
                    
                    # Create monthly plan
                    monthly_plan = None
                    if brand.monthly_fee:
                        existing_monthly = PayPalPlan.query.filter_by(
                            product_id=product_id,
                            billing_cycle_interval_unit='MONTH',
                            billing_cycle_interval_count=1
                        ).first()
                        
                        if not existing_monthly or existing_monthly.status != PayPalPlanStatus.ACTIVE:
                            if not existing_monthly:
                                monthly_plan = DatabaseService.create_paypal_plan(
                                    product_id=product_id,
                                    name=f"{brand.name} - Monthly Subscription",
                                    description=f"Monthly subscription for {brand.name}",
                                    billing_cycle_interval_unit='MONTH',
                                    billing_cycle_interval_count=1,
                                    currency_code='USD',
                                    fixed_price_value=float(brand.monthly_fee)
                                )
                            else:
                                monthly_plan = existing_monthly
                            
                            # Create plan in PayPal
                            plan_data = {
                                'product_id': paypal_product.paypal_product_id,
                                'name': monthly_plan.name,
                                'description': monthly_plan.description,
                                'status': 'ACTIVE',
                                'billing_cycles': [{
                                    'frequency': {
                                        'interval_unit': 'MONTH',
                                        'interval_count': 1
                                    },
                                    'tenure_type': 'REGULAR',
                                    'sequence': 1,
                                    'total_cycles': 0,  # Infinite
                                    'pricing_scheme': {
                                        'fixed_price': {
                                            'value': str(monthly_plan.fixed_price_value),
                                            'currency_code': monthly_plan.currency_code
                                        }
                                    }
                                }],
                                'payment_preferences': {
                                    'auto_bill_outstanding': True,
                                    'setup_fee': {
                                        'value': '0',
                                        'currency_code': monthly_plan.currency_code
                                    },
                                    'setup_fee_failure_action': 'CONTINUE',
                                    'payment_failure_threshold': 3
                                }
                            }
                            
                            paypal_response = paypal_service.create_plan(plan_data)
                            
                            # Update database with PayPal plan ID
                            DatabaseService.update_paypal_plan_status(
                                str(monthly_plan.id),
                                PayPalPlanStatus.ACTIVE,
                                paypal_plan_id=paypal_response['id'],
                                paypal_response=paypal_response
                            )
                            
                            logger.info(f"Created monthly PayPal plan for {brand.name}: {paypal_response['id']}")
                    
                    # Create annual plan
                    annual_plan = None
                    if brand.annual_fee:
                        existing_annual = PayPalPlan.query.filter_by(
                            product_id=product_id,
                            billing_cycle_interval_unit='YEAR',
                            billing_cycle_interval_count=1
                        ).first()
                        
                        if not existing_annual or existing_annual.status != PayPalPlanStatus.ACTIVE:
                            if not existing_annual:
                                annual_plan = DatabaseService.create_paypal_plan(
                                    product_id=product_id,
                                    name=f"{brand.name} - Annual Subscription",
                                    description=f"Annual subscription for {brand.name}",
                                    billing_cycle_interval_unit='YEAR',
                                    billing_cycle_interval_count=1,
                                    currency_code='USD',
                                    fixed_price_value=float(brand.annual_fee)
                                )
                            else:
                                annual_plan = existing_annual
                            
                            # Create plan in PayPal
                            plan_data = {
                                'product_id': paypal_product.paypal_product_id,
                                'name': annual_plan.name,
                                'description': annual_plan.description,
                                'status': 'ACTIVE',
                                'billing_cycles': [{
                                    'frequency': {
                                        'interval_unit': 'YEAR',
                                        'interval_count': 1
                                    },
                                    'tenure_type': 'REGULAR',
                                    'sequence': 1,
                                    'total_cycles': 0,  # Infinite
                                    'pricing_scheme': {
                                        'fixed_price': {
                                            'value': str(annual_plan.fixed_price_value),
                                            'currency_code': annual_plan.currency_code
                                        }
                                    }
                                }],
                                'payment_preferences': {
                                    'auto_bill_outstanding': True,
                                    'setup_fee': {
                                        'value': '0',
                                        'currency_code': annual_plan.currency_code
                                    },
                                    'setup_fee_failure_action': 'CONTINUE',
                                    'payment_failure_threshold': 3
                                }
                            }
                            
                            paypal_response = paypal_service.create_plan(plan_data)
                            
                            # Update database with PayPal plan ID
                            DatabaseService.update_paypal_plan_status(
                                str(annual_plan.id),
                                PayPalPlanStatus.ACTIVE,
                                paypal_plan_id=paypal_response['id'],
                                paypal_response=paypal_response
                            )
                            
                            logger.info(f"Created annual PayPal plan for {brand.name}: {paypal_response['id']}")
                    
                    successful += 1
                    
                except PayPalAPIError as e:
                    logger.error(f"PayPal API error for product {product_id}: {str(e)}")
                    failed += 1
                    errors.append(f"Product {product_id}: {str(e)}")
                    
                except Exception as e:
                    logger.error(f"Unexpected error for product {product_id}: {str(e)}")
                    failed += 1
                    errors.append(f"Product {product_id}: {str(e)}")
                
                finally:
                    processed += 1
                    
                    # Update job progress
                    DatabaseService.update_bulk_job_progress(
                        job_id,
                        processed_items=processed,
                        successful_items=successful,
                        failed_items=failed,
                        error_log=errors[-10:]  # Keep only last 10 errors
                    )
            
            # Rate limiting between batches
            if i + batch_size < len(product_ids):
                logger.info(f"Rate limiting: waiting {rate_limit_delay} seconds")
                time.sleep(rate_limit_delay)
        
        # Final job update
        final_status = JobStatus.COMPLETED if failed == 0 else JobStatus.COMPLETED
        DatabaseService.update_bulk_job_progress(
            job_id,
            status=final_status,
            result_data={
                'processed': processed,
                'successful': successful,
                'failed': failed,
                'completion_rate': (successful / processed * 100) if processed > 0 else 0
            }
        )
        
        logger.info(f"Bulk PayPal plan creation completed: {successful}/{processed} successful")
        
        return {
            'processed': processed,
            'successful': successful,
            'failed': failed,
            'errors': errors
        }
        
    except Exception as e:
        logger.error(f"Fatal error in bulk PayPal plan creation: {str(e)}")
        
        # Update job as failed
        DatabaseService.update_bulk_job_progress(
            job_id,
            status=JobStatus.FAILED,
            error_log=[str(e)]
        )
        
        # Retry if we haven't exceeded max retries
        if self.request.retries < self.max_retries:
            logger.info(f"Retrying bulk plan creation in 60 seconds (attempt {self.request.retries + 1})")
            raise self.retry(countdown=60)
        
        raise

@celery.task
def process_webhook_event(webhook_event_id: str):
    """Process a PayPal webhook event"""
    try:
        from models import PayPalWebhookEvent, PayPalSubscription
        
        webhook_event = PayPalWebhookEvent.query.get(webhook_event_id)
        if not webhook_event:
            logger.error(f"Webhook event not found: {webhook_event_id}")
            return
        
        if webhook_event.processed:
            logger.info(f"Webhook event already processed: {webhook_event_id}")
            return
        
        event_type = webhook_event.event_type
        event_data = webhook_event.event_data
        
        logger.info(f"Processing webhook event: {event_type}")
        
        # Handle subscription events
        if event_type.startswith('BILLING.SUBSCRIPTION.'):
            resource = event_data.get('resource', {})
            subscription_id = resource.get('id')
            
            if subscription_id:
                # Find existing subscription in database
                subscription = PayPalSubscription.query.filter_by(
                    paypal_subscription_id=subscription_id
                ).first()
                
                if subscription:
                    # Update subscription status
                    old_status = subscription.status
                    subscription.status = resource.get('status')
                    
                    # Add event to webhook events list
                    if not subscription.webhook_events:
                        subscription.webhook_events = []
                    subscription.webhook_events.append({
                        'event_type': event_type,
                        'timestamp': datetime.now(timezone.utc).isoformat(),
                        'data': event_data
                    })
                    
                    subscription.updated_at = datetime.now(timezone.utc)
                    
                    # Create audit log
                    DatabaseService.create_audit_log(
                        'paypal_subscription',
                        str(subscription.id),
                        'webhook_update',
                        old_values={'status': old_status},
                        new_values={'status': subscription.status}
                    )
                    
                    logger.info(f"Updated subscription {subscription_id}: {old_status} -> {subscription.status}")
        
        # Mark webhook as processed
        webhook_event.processed = True
        webhook_event.processed_at = datetime.now(timezone.utc)
        
        db.session.commit()
        logger.info(f"Webhook event processed successfully: {webhook_event_id}")
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error processing webhook event {webhook_event_id}: {str(e)}")
        
        # Update webhook with processing error
        webhook_event = PayPalWebhookEvent.query.get(webhook_event_id)
        if webhook_event:
            webhook_event.processing_error = str(e)
            db.session.commit()
        
        raise

@celery.task
def sync_brand_data_from_admin_portal():
    """Sync brand data from the admin portal to prevent duplicates"""
    try:
        logger.info("Starting brand data sync from admin portal")
        
        # This would integrate with the existing admin portal data
        # For now, we'll create the sectors and brands that are mentioned in the portal
        
        sectors_data = [
            {"name": "Agriculture & Biotech", "slug": "agriculture-biotech", "glyph": "🌱"},
            {"name": "Food, Soil & Farming", "slug": "food-soil-farming", "glyph": "🥦"},
            {"name": "Banking & Finance", "slug": "banking-finance", "glyph": "🏦"},
            {"name": "Creative Tech", "slug": "creative-tech", "glyph": "🖋️"},
            {"name": "Logistics & Packaging", "slug": "logistics-packaging", "glyph": "📦"},
            {"name": "Education & IP", "slug": "education-ip", "glyph": "📚"},
            {"name": "Fashion & Identity", "slug": "fashion-identity", "glyph": "✂"},
            {"name": "Gaming & Simulation", "slug": "gaming-simulation", "glyph": "🎮"},
            {"name": "Health & Hygiene", "slug": "health-hygiene", "glyph": "🧠"},
            {"name": "Housing & Infrastructure", "slug": "housing-infrastructure", "glyph": "🏗️"},
            {"name": "Justice & Ethics", "slug": "justice-ethics", "glyph": "⚖"},
            {"name": "Knowledge & Archives", "slug": "knowledge-archives", "glyph": "📖"},
            {"name": "Micro-Mesh Logistics", "slug": "micromesh-logistics", "glyph": "☰"},
            {"name": "Motion, Media & Sonic", "slug": "motion-media-sonic", "glyph": "🎬"},
            {"name": "Nutrition & Food Chain", "slug": "nutrition-food-chain", "glyph": "✿"},
            {"name": "AI, Logic & Grid", "slug": "ai-logic-grid", "glyph": "🧠"},
            {"name": "Packaging & Materials", "slug": "packaging-materials", "glyph": "📦"},
            {"name": "Quantum Protocols", "slug": "quantum-protocols", "glyph": "✴️"},
            {"name": "Ritual & Culture", "slug": "ritual-culture", "glyph": "☯"},
            {"name": "SaaS & Licensing", "slug": "saas-licensing", "glyph": "🔑"},
            {"name": "Trade Systems", "slug": "trade-systems", "glyph": "🧺"},
            {"name": "Utilities & Energy", "slug": "utilities-energy", "glyph": "🔋"},
            {"name": "Voice & Audio", "slug": "voice-audio", "glyph": "🎙️"},
            {"name": "Webless Tech & Nodes", "slug": "webless-tech-nodes", "glyph": "📡"},
            {"name": "NFT & Ownership", "slug": "nft-ownership", "glyph": "🔁"},
            {"name": "Education & Youth", "slug": "education-youth", "glyph": "🎓"},
            {"name": "Zero Waste", "slug": "zero-waste", "glyph": "♻️"},
            {"name": "Professional Services", "slug": "professional-services", "glyph": "🧾"},
            {"name": "Payroll Mining & Accounting", "slug": "payroll-mining-accounting", "glyph": "🪙"},
            {"name": "Mining & Resources", "slug": "mining-resources", "glyph": "⛏️"},
            {"name": "Wildlife & Habitat", "slug": "wildlife-habitat", "glyph": "🦁"},
        ]
        
        created_sectors = 0
        for sector_data in sectors_data:
            sector = DatabaseService.get_or_create_sector(
                name=sector_data["name"],
                slug=sector_data["slug"],
                glyph=sector_data["glyph"]
            )
            if sector:
                created_sectors += 1
        
        logger.info(f"Brand data sync completed: {created_sectors} sectors processed")
        return {"sectors_processed": created_sectors}
        
    except Exception as e:
        logger.error(f"Error syncing brand data: {str(e)}")
        raise
