import logging
import time
from datetime import datetime, timezone
from typing import List, Dict, Optional
from celery import Celery
from services.paypal_service import PayPalService, PayPalAPIError
from services.database_service import DatabaseService
from services.openai_service import OpenAIService
from models import Brand, PayPalProduct, PayPalPlan, JobStatus, PayPalProductStatus, PayPalPlanStatus
import os

logger = logging.getLogger(__name__)

class BulkPayPalProcessor:
    """Handle bulk PayPal operations for the FAA.ZONE ecosystem"""
    
    def __init__(self):
        self.paypal_service = None
        self.openai_service = OpenAIService()
        self.batch_size = int(os.environ.get('PAYPAL_BATCH_SIZE', 50))
        self.rate_limit_delay = int(os.environ.get('PAYPAL_RATE_LIMIT_DELAY', 1))
        
    def _initialize_paypal_service(self):
        """Initialize PayPal service with credentials"""
        if not self.paypal_service:
            client_id = os.environ.get('PAYPAL_CLIENT_ID')
            client_secret = os.environ.get('PAYPAL_CLIENT_SECRET')
            
            if not client_id or not client_secret:
                raise ValueError("PayPal credentials not configured")
            
            self.paypal_service = PayPalService(
                client_id=client_id,
                client_secret=client_secret,
                sandbox=os.environ.get('PAYPAL_SANDBOX', 'true').lower() == 'true'
            )
    
    def create_products_bulk(self, brand_ids: List[str], job_id: str) -> Dict:
        """Create PayPal products for multiple brands"""
        try:
            self._initialize_paypal_service()
            
            # Update job status
            DatabaseService.update_bulk_job_progress(
                job_id, 
                status=JobStatus.PROCESSING
            )
            
            processed = 0
            successful = 0
            failed = 0
            errors = []
            results = []
            
            # Process brands in batches
            for i in range(0, len(brand_ids), self.batch_size):
                batch = brand_ids[i:i + self.batch_size]
                
                logger.info(f"Processing batch {i//self.batch_size + 1}: {len(batch)} brands")
                
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
                            results.append({
                                "brand_id": brand_id,
                                "brand_name": brand.name,
                                "status": "already_exists",
                                "paypal_product_id": existing_product.paypal_product_id
                            })
                            continue
                        
                        # Create or get PayPal product record
                        if not existing_product:
                            paypal_product = DatabaseService.create_paypal_product(
                                brand_id=brand_id,
                                name=f"{brand.name} - {brand.sector.name}",
                                description=f"Enterprise subscription service for {brand.name} in {brand.sector.name} sector",
                                category='SERVICE',
                                home_url=f"https://faa.zone/brands/{brand.slug}"
                            )
                        else:
                            paypal_product = existing_product
                        
                        # Create PayPal product via API
                        product_data = {
                            "name": paypal_product.name,
                            "description": paypal_product.description,
                            "type": "SERVICE",
                            "category": "SOFTWARE",
                            "image_url": paypal_product.image_url,
                            "home_url": paypal_product.home_url
                        }
                        
                        try:
                            paypal_response = self.paypal_service.create_product(product_data)
                            
                            # Update database with PayPal response
                            DatabaseService.update_paypal_product_status(
                                str(paypal_product.id),
                                PayPalProductStatus.ACTIVE,
                                paypal_response.get('id'),
                                paypal_response
                            )
                            
                            successful += 1
                            results.append({
                                "brand_id": brand_id,
                                "brand_name": brand.name,
                                "status": "created",
                                "paypal_product_id": paypal_response.get('id')
                            })
                            
                            logger.info(f"Created PayPal product for {brand.name}: {paypal_response.get('id')}")
                            
                        except PayPalAPIError as api_error:
                            # Update database with error
                            DatabaseService.update_paypal_product_status(
                                str(paypal_product.id),
                                PayPalProductStatus.ERROR,
                                error_message=str(api_error)
                            )
                            
                            failed += 1
                            error_msg = f"PayPal API error for {brand.name}: {str(api_error)}"
                            errors.append(error_msg)
                            logger.error(error_msg)
                            
                            results.append({
                                "brand_id": brand_id,
                                "brand_name": brand.name,
                                "status": "error",
                                "error": str(api_error)
                            })
                        
                        processed += 1
                        
                        # Update job progress
                        DatabaseService.update_bulk_job_progress(
                            job_id,
                            processed_items=processed,
                            successful_items=successful,
                            failed_items=failed,
                            error_log=errors
                        )
                        
                        # Rate limiting delay
                        time.sleep(self.rate_limit_delay)
                        
                    except Exception as e:
                        failed += 1
                        error_msg = f"Error processing brand {brand_id}: {str(e)}"
                        errors.append(error_msg)
                        logger.error(error_msg)
                        processed += 1
                
                # Longer delay between batches
                if i + self.batch_size < len(brand_ids):
                    time.sleep(self.rate_limit_delay * 2)
            
            # Complete the job
            final_status = JobStatus.COMPLETED if failed == 0 else JobStatus.FAILED
            DatabaseService.update_bulk_job_progress(
                job_id,
                processed_items=processed,
                successful_items=successful,
                failed_items=failed,
                status=final_status,
                error_log=errors,
                result_data={"products_created": results}
            )
            
            logger.info(f"Bulk product creation completed: {successful} successful, {failed} failed")
            
            return {
                "success": True,
                "processed": processed,
                "successful": successful,
                "failed": failed,
                "results": results,
                "errors": errors
            }
            
        except Exception as e:
            # Mark job as failed
            DatabaseService.update_bulk_job_progress(
                job_id,
                status=JobStatus.FAILED,
                error_log=[str(e)]
            )
            
            logger.error(f"Bulk product creation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "processed": 0,
                "successful": 0,
                "failed": 0
            }
    
    def create_plans_bulk(self, product_ids: List[str], job_id: str) -> Dict:
        """Create PayPal billing plans for multiple products"""
        try:
            self._initialize_paypal_service()
            
            # Update job status
            DatabaseService.update_bulk_job_progress(
                job_id, 
                status=JobStatus.PROCESSING
            )
            
            processed = 0
            successful = 0
            failed = 0
            errors = []
            results = []
            
            # Process products in batches
            for i in range(0, len(product_ids), self.batch_size):
                batch = product_ids[i:i + self.batch_size]
                
                logger.info(f"Processing plans batch {i//self.batch_size + 1}: {len(batch)} products")
                
                for product_id in batch:
                    try:
                        # Get product from database
                        product = PayPalProduct.query.get(product_id)
                        if not product or not product.paypal_product_id:
                            logger.warning(f"Product not found or not active: {product_id}")
                            failed += 1
                            errors.append(f"Product not found or not active: {product_id}")
                            continue
                        
                        # Check if plan already exists
                        existing_plan = PayPalPlan.query.filter_by(product_id=product_id).first()
                        if existing_plan and existing_plan.status == PayPalPlanStatus.ACTIVE:
                            logger.info(f"Plan already exists for product {product.name}")
                            processed += 1
                            successful += 1
                            results.append({
                                "product_id": product_id,
                                "product_name": product.name,
                                "status": "already_exists",
                                "paypal_plan_id": existing_plan.paypal_plan_id
                            })
                            continue
                        
                        # Create plan record in database
                        if not existing_plan:
                            plan_record = DatabaseService.create_paypal_plan(
                                product_id=product_id,
                                name=f"{product.name} - Monthly Plan",
                                description=f"Monthly subscription plan for {product.name}",
                                billing_cycle_interval_unit='MONTH',
                                billing_cycle_interval_count=1,
                                currency_code='USD',
                                fixed_price_value=product.brand.monthly_fee or 99.99
                            )
                        else:
                            plan_record = existing_plan
                        
                        # Create PayPal plan via API
                        plan_data = {
                            "product_id": product.paypal_product_id,
                            "name": plan_record.name,
                            "description": plan_record.description,
                            "status": "ACTIVE",
                            "billing_cycles": [{
                                "frequency": {
                                    "interval_unit": plan_record.billing_cycle_interval_unit,
                                    "interval_count": plan_record.billing_cycle_interval_count
                                },
                                "tenure_type": "REGULAR",
                                "sequence": 1,
                                "total_cycles": 0,  # Infinite
                                "pricing_scheme": {
                                    "fixed_price": {
                                        "value": str(plan_record.fixed_price_value),
                                        "currency_code": plan_record.currency_code
                                    }
                                }
                            }],
                            "payment_preferences": {
                                "auto_bill_outstanding": True,
                                "setup_fee": {
                                    "value": "0",
                                    "currency_code": plan_record.currency_code
                                },
                                "setup_fee_failure_action": "CONTINUE",
                                "payment_failure_threshold": 3
                            }
                        }
                        
                        try:
                            paypal_response = self.paypal_service.create_plan(plan_data)
                            
                            # Update database with PayPal response
                            DatabaseService.update_paypal_plan_status(
                                str(plan_record.id),
                                PayPalPlanStatus.ACTIVE,
                                paypal_response.get('id'),
                                paypal_response
                            )
                            
                            successful += 1
                            results.append({
                                "product_id": product_id,
                                "product_name": product.name,
                                "status": "created",
                                "paypal_plan_id": paypal_response.get('id')
                            })
                            
                            logger.info(f"Created PayPal plan for {product.name}: {paypal_response.get('id')}")
                            
                        except PayPalAPIError as api_error:
                            # Update database with error
                            DatabaseService.update_paypal_plan_status(
                                str(plan_record.id),
                                PayPalPlanStatus.ERROR,
                                error_message=str(api_error)
                            )
                            
                            failed += 1
                            error_msg = f"PayPal API error for plan {product.name}: {str(api_error)}"
                            errors.append(error_msg)
                            logger.error(error_msg)
                            
                            results.append({
                                "product_id": product_id,
                                "product_name": product.name,
                                "status": "error",
                                "error": str(api_error)
                            })
                        
                        processed += 1
                        
                        # Update job progress
                        DatabaseService.update_bulk_job_progress(
                            job_id,
                            processed_items=processed,
                            successful_items=successful,
                            failed_items=failed,
                            error_log=errors
                        )
                        
                        # Rate limiting delay
                        time.sleep(self.rate_limit_delay)
                        
                    except Exception as e:
                        failed += 1
                        error_msg = f"Error processing product {product_id}: {str(e)}"
                        errors.append(error_msg)
                        logger.error(error_msg)
                        processed += 1
                
                # Longer delay between batches
                if i + self.batch_size < len(product_ids):
                    time.sleep(self.rate_limit_delay * 2)
            
            # Complete the job
            final_status = JobStatus.COMPLETED if failed == 0 else JobStatus.FAILED
            DatabaseService.update_bulk_job_progress(
                job_id,
                processed_items=processed,
                successful_items=successful,
                failed_items=failed,
                status=final_status,
                error_log=errors,
                result_data={"plans_created": results}
            )
            
            logger.info(f"Bulk plan creation completed: {successful} successful, {failed} failed")
            
            return {
                "success": True,
                "processed": processed,
                "successful": successful,
                "failed": failed,
                "results": results,
                "errors": errors
            }
            
        except Exception as e:
            # Mark job as failed
            DatabaseService.update_bulk_job_progress(
                job_id,
                status=JobStatus.FAILED,
                error_log=[str(e)]
            )
            
            logger.error(f"Bulk plan creation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "processed": 0,
                "successful": 0,
                "failed": 0
            }