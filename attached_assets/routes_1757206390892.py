import logging
import json
from datetime import datetime, timezone
from flask import render_template, request, jsonify, redirect, url_for, flash
from app import app, db
from models import (
    Sector, Brand, SubNode, PayPalProduct, PayPalPlan, 
    BulkJob, PayPalWebhookEvent, JobStatus
)
from services.database_service import DatabaseService
from services.paypal_service import PayPalService
from services.background_jobs import (
    create_paypal_products_bulk, create_paypal_plans_bulk,
    process_webhook_event, sync_brand_data_from_admin_portal, import_faa_zone_data
)
from services.faa_data_importer import FAADataImporter
from services.openai_service import OpenAIService
from services.currency_service import currency_service
from flask_login import login_required, current_user

logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """Main dashboard showing system status"""
    try:
        # Get basic statistics for dashboard
        stats = {
            'total_sectors': Sector.query.count(),
            'total_brands': Brand.query.count(),
            'paypal_products': {
                'total': PayPalProduct.query.count(),
                'pending': PayPalProduct.query.filter_by(status='PENDING').count(),
                'created': PayPalProduct.query.filter_by(status='CREATED').count(),
                'active': PayPalProduct.query.filter_by(status='ACTIVE').count(),
                'error': PayPalProduct.query.filter_by(status='ERROR').count(),
            },
            'paypal_plans': {
                'total': PayPalPlan.query.count(),
                'pending': PayPalPlan.query.filter_by(status='PENDING').count(),
                'created': PayPalPlan.query.filter_by(status='CREATED').count(),
                'active': PayPalPlan.query.filter_by(status='ACTIVE').count(),
                'error': PayPalPlan.query.filter_by(status='ERROR').count(),
            },
            'bulk_jobs': {
                'total': BulkJob.query.count(),
                'pending': BulkJob.query.filter_by(status='PENDING').count(),
                'processing': BulkJob.query.filter_by(status='PROCESSING').count(),
                'completed': BulkJob.query.filter_by(status='COMPLETED').count(),
                'failed': BulkJob.query.filter_by(status='FAILED').count(),
            },
            'webhook_events': {
                'total': PayPalWebhookEvent.query.count(),
                'processed': PayPalWebhookEvent.query.filter_by(processed=True).count(),
                'pending': PayPalWebhookEvent.query.filter_by(processed=False).count(),
            }
        }
        return render_template('admin_dashboard.html', stats=stats)
    except Exception as e:
        logger.error(f"Error loading dashboard: {str(e)}")
        # Fallback stats structure
        stats = {
            'total_sectors': 0,
            'total_brands': 0,
            'paypal_products': {'total': 0, 'pending': 0, 'created': 0, 'active': 0, 'error': 0},
            'paypal_plans': {'total': 0, 'pending': 0, 'created': 0, 'active': 0, 'error': 0},
            'bulk_jobs': {'total': 0, 'pending': 0, 'processing': 0, 'completed': 0, 'failed': 0},
            'webhook_events': {'total': 0, 'processed': 0, 'pending': 0}
        }
        return render_template('admin_dashboard.html', stats=stats)

@app.route('/paypal-status')
def paypal_status():
    """PayPal integration status page"""
    try:
        # Get basic statistics for PayPal status
        stats = {
            'total_sectors': Sector.query.count(),
            'total_brands': Brand.query.count(),
            'paypal_products': {
                'total': PayPalProduct.query.count(),
                'pending': PayPalProduct.query.filter_by(status='PENDING').count(),
                'created': PayPalProduct.query.filter_by(status='CREATED').count(),
                'active': PayPalProduct.query.filter_by(status='ACTIVE').count(),
                'error': PayPalProduct.query.filter_by(status='ERROR').count(),
            },
            'paypal_plans': {
                'total': PayPalPlan.query.count(),
                'pending': PayPalPlan.query.filter_by(status='PENDING').count(),
                'created': PayPalPlan.query.filter_by(status='CREATED').count(),
                'active': PayPalPlan.query.filter_by(status='ACTIVE').count(),
                'error': PayPalPlan.query.filter_by(status='ERROR').count(),
            },
            'webhook_events': {
                'total': PayPalWebhookEvent.query.count(),
                'processed': PayPalWebhookEvent.query.filter_by(processed=True).count(),
                'pending': PayPalWebhookEvent.query.filter_by(processed=False).count(),
            },
            'bulk_jobs': {
                'total': BulkJob.query.count(),
                'pending': BulkJob.query.filter_by(status='PENDING').count(),
                'processing': BulkJob.query.filter_by(status='PROCESSING').count(),
                'completed': BulkJob.query.filter_by(status='COMPLETED').count(),
                'failed': BulkJob.query.filter_by(status='FAILED').count(),
            }
        }
        
        # Get recent jobs
        recent_jobs = BulkJob.query.order_by(BulkJob.created_at.desc()).limit(10).all()
        
        # Get recent errors
        error_products = PayPalProduct.query.filter_by(status='ERROR').limit(5).all()
        error_plans = PayPalPlan.query.filter_by(status='ERROR').limit(5).all()
        
        return render_template('paypal_status.html', 
                             stats=stats, 
                             recent_jobs=recent_jobs,
                             error_products=error_products,
                             error_plans=error_plans)
    except Exception as e:
        logger.error(f"Error loading PayPal status: {str(e)}")
        # Fallback stats structure
        stats = {
            'total_sectors': 0,
            'total_brands': 0,
            'paypal_products': {'total': 0, 'pending': 0, 'created': 0, 'active': 0, 'error': 0},
            'paypal_plans': {'total': 0, 'pending': 0, 'created': 0, 'active': 0, 'error': 0},
            'bulk_jobs': {'total': 0, 'pending': 0, 'processing': 0, 'completed': 0, 'failed': 0},
            'webhook_events': {'total': 0, 'processed': 0, 'pending': 0}
        }
        return render_template('paypal_status.html', stats=stats, recent_jobs=[], error_products=[], error_plans=[])

@app.route('/paypal-buttons')
def paypal_buttons():
    """PayPal hosted buttons integration page"""
    return render_template('paypal_buttons.html')

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Admin login page"""
    from services.admin_auth import admin_auth_service
    
    # Redirect if already logged in
    if admin_auth_service.is_admin_logged_in():
        return redirect(url_for('admin_dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        
        if not username or not password:
            flash('Please enter both username and password', 'error')
            return render_template('admin_login.html')
        
        # Authenticate admin
        result = admin_auth_service.authenticate_admin(username, password)
        
        if result['success']:
            flash('Login successful', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash(result['message'], 'error')
            return render_template('admin_login.html')
    
    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    """Admin logout"""
    from services.admin_auth import admin_auth_service
    admin_auth_service.logout_admin()
    flash('You have been logged out', 'info')
    return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
def admin_dashboard():
    """Admin dashboard with deployment and management controls"""
    from services.admin_auth import admin_auth_service
    
    # Check admin login
    if not admin_auth_service.is_admin_logged_in():
        flash('Please log in to access the admin area', 'warning')
        return redirect(url_for('admin_login'))
    
    current_admin = admin_auth_service.get_current_admin()
    
    try:
        # Get comprehensive system stats
        stats = {
            'total_sectors': Sector.query.count(),
            'total_brands': Brand.query.count(),
            'paypal_products': {
                'total': PayPalProduct.query.count(),
                'pending': PayPalProduct.query.filter_by(status='PENDING').count(),
                'created': PayPalProduct.query.filter_by(status='CREATED').count(),
                'active': PayPalProduct.query.filter_by(status='ACTIVE').count(),
                'error': PayPalProduct.query.filter_by(status='ERROR').count(),
            },
            'paypal_plans': {
                'total': PayPalPlan.query.count(),
                'pending': PayPalPlan.query.filter_by(status='PENDING').count(),
                'created': PayPalPlan.query.filter_by(status='CREATED').count(),
                'active': PayPalPlan.query.filter_by(status='ACTIVE').count(),
                'error': PayPalPlan.query.filter_by(status='ERROR').count(),
            },
            'bulk_jobs': {
                'total': BulkJob.query.count(),
                'pending': BulkJob.query.filter_by(status='PENDING').count(),
                'processing': BulkJob.query.filter_by(status='PROCESSING').count(),
                'completed': BulkJob.query.filter_by(status='COMPLETED').count(),
                'failed': BulkJob.query.filter_by(status='FAILED').count(),
            },
            'webhook_events': {
                'total': PayPalWebhookEvent.query.count(),
                'processed': PayPalWebhookEvent.query.filter_by(processed=True).count(),
                'pending': PayPalWebhookEvent.query.filter_by(processed=False).count(),
            }
        }
        
        # Get recent activity
        recent_jobs = BulkJob.query.order_by(BulkJob.created_at.desc()).limit(10).all()
        recent_webhooks = PayPalWebhookEvent.query.order_by(PayPalWebhookEvent.created_at.desc()).limit(5).all()
        
        return render_template('admin_dashboard.html', 
                             stats=stats, 
                             recent_jobs=recent_jobs,
                             recent_webhooks=recent_webhooks,
                             current_admin=current_admin)
        
    except Exception as e:
        logger.error(f"Error loading admin dashboard: {str(e)}")
        flash('Error loading dashboard data', 'error')
        return render_template('admin_dashboard.html', 
                             stats={}, 
                             recent_jobs=[], 
                             recent_webhooks=[],
                             current_admin=current_admin)


@app.route('/api/sync-admin-data', methods=['POST'])
def sync_admin_data():
    """Sync data from admin portal to prevent duplicates"""
    try:
        # Trigger background job to sync data
        task = sync_brand_data_from_admin_portal.delay()
        
        return jsonify({
            'success': True,
            'message': 'Data sync started',
            'task_id': task.id
        })
    except Exception as e:
        logger.error(f"Error starting data sync: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/create-products-bulk', methods=['POST'])
def create_products_bulk():
    """Create PayPal products for brands that don't have them"""
    try:
        # Get brands that need PayPal products
        brands = DatabaseService.get_brands_for_paypal_processing()
        
        if not brands:
            return jsonify({
                'success': True,
                'message': 'No brands need PayPal products',
                'brand_count': 0
            })
        
        # Create bulk job record
        job = DatabaseService.create_bulk_job(
            job_type='create_products',
            job_name=f'Bulk PayPal Product Creation - {datetime.now().strftime("%Y-%m-%d %H:%M")}',
            total_items=len(brands)
        )
        
        # Start background task
        brand_ids = [str(brand.id) for brand in brands]
        task = create_paypal_products_bulk.delay(brand_ids, str(job.id))
        
        # Update job with Celery task ID
        DatabaseService.update_bulk_job_progress(str(job.id), celery_task_id=task.id)
        
        return jsonify({
            'success': True,
            'message': f'Started bulk PayPal product creation for {len(brands)} brands',
            'job_id': str(job.id),
            'task_id': task.id,
            'brand_count': len(brands)
        })
        
    except Exception as e:
        logger.error(f"Error starting bulk product creation: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/create-plans-bulk', methods=['POST'])
def create_plans_bulk():
    """Create PayPal plans for products that don't have them"""
    try:
        # Get products that need PayPal plans
        products = DatabaseService.get_products_for_plan_creation()
        
        if not products:
            return jsonify({
                'success': True,
                'message': 'No products need PayPal plans',
                'product_count': 0
            })
        
        # Create bulk job record
        job = DatabaseService.create_bulk_job(
            job_type='create_plans',
            job_name=f'Bulk PayPal Plan Creation - {datetime.now().strftime("%Y-%m-%d %H:%M")}',
            total_items=len(products)
        )
        
        # Start background task
        product_ids = [str(product.id) for product in products]
        task = create_paypal_plans_bulk.delay(product_ids, str(job.id))
        
        # Update job with Celery task ID
        DatabaseService.update_bulk_job_progress(str(job.id), celery_task_id=task.id)
        
        return jsonify({
            'success': True,
            'message': f'Started bulk PayPal plan creation for {len(products)} products',
            'job_id': str(job.id),
            'task_id': task.id,
            'product_count': len(products)
        })
        
    except Exception as e:
        logger.error(f"Error starting bulk plan creation: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/job-status/<job_id>')
def get_job_status(job_id):
    """Get status of a bulk job"""
    try:
        job = BulkJob.query.get(job_id)
        if not job:
            return jsonify({
                'success': False,
                'message': 'Job not found'
            }), 404
        
        return jsonify({
            'success': True,
            'job': {
                'id': str(job.id),
                'job_type': job.job_type,
                'job_name': job.job_name,
                'status': job.status.value,
                'total_items': job.total_items,
                'processed_items': job.processed_items,
                'successful_items': job.successful_items,
                'failed_items': job.failed_items,
                'progress_percentage': (job.processed_items / job.total_items * 100) if job.total_items > 0 else 0,
                'started_at': job.started_at.isoformat() if job.started_at else None,
                'completed_at': job.completed_at.isoformat() if job.completed_at else None,
                'error_log': job.error_log[-5:] if job.error_log else [],  # Last 5 errors
                'result_data': job.result_data
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting job status: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/brands')
def get_brands():
    """Get all brands with their sectors and PayPal status"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        sector_id = request.args.get('sector_id')
        
        query = Brand.query.options(
            db.joinedload(Brand.sector),
            db.joinedload(Brand.paypal_products)
        )
        
        if sector_id:
            query = query.filter(Brand.sector_id == sector_id)
        
        brands_pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        brands_data = []
        for brand in brands_pagination.items:
            paypal_product = brand.paypal_products[0] if brand.paypal_products else None
            
            brands_data.append({
                'id': str(brand.id),
                'name': brand.name,
                'slug': brand.slug,
                'sector': {
                    'id': str(brand.sector.id),
                    'name': brand.sector.name,
                    'glyph': brand.sector.glyph
                },
                'monthly_fee': float(brand.monthly_fee) if brand.monthly_fee else None,
                'annual_fee': float(brand.annual_fee) if brand.annual_fee else None,
                'payout_tier': brand.payout_tier,
                'region': brand.region,
                'paypal_status': paypal_product.status.value if paypal_product else 'not_created',
                'paypal_product_id': paypal_product.paypal_product_id if paypal_product else None,
                'created_at': brand.created_at.isoformat()
            })
        
        return jsonify({
            'success': True,
            'brands': brands_data,
            'pagination': {
                'page': brands_pagination.page,
                'pages': brands_pagination.pages,
                'per_page': brands_pagination.per_page,
                'total': brands_pagination.total
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting brands: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/sectors')
def get_sectors():
    """Get all sectors"""
    try:
        sectors = Sector.query.order_by(Sector.name).all()
        
        sectors_data = []
        for sector in sectors:
            sectors_data.append({
                'id': str(sector.id),
                'name': sector.name,
                'slug': sector.slug,
                'glyph': sector.glyph,
                'brand_count': len(sector.brands)
            })
        
        return jsonify({
            'success': True,
            'sectors': sectors_data
        })
        
    except Exception as e:
        logger.error(f"Error getting sectors: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/add-brand', methods=['POST'])
def add_brand():
    """Add a new brand to a sector"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['sector_id', 'name', 'monthly_fee']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Create brand slug from name
        brand_slug = data['name'].lower().replace(' ', '-').replace('&', 'and')
        
        # Create brand
        brand = DatabaseService.get_or_create_brand(
            sector_id=data['sector_id'],
            name=data['name'],
            slug=brand_slug,
            monthly_fee=data.get('monthly_fee'),
            annual_fee=data.get('annual_fee'),
            payout_tier=data.get('payout_tier', 'B+'),
            region=data.get('region', 'Global')
        )
        
        # Add subnodes if provided
        subnodes = data.get('subnodes', [])
        for subnode_name in subnodes:
            if subnode_name.strip():
                subnode_slug = subnode_name.lower().replace(' ', '-').replace('&', 'and')
                DatabaseService.create_subnode(
                    brand_id=str(brand.id),
                    name=subnode_name.strip(),
                    slug=subnode_slug
                )
        
        return jsonify({
            'success': True,
            'message': f'Brand "{brand.name}" created successfully',
            'brand': {
                'id': str(brand.id),
                'name': brand.name,
                'slug': brand.slug
            }
        })
        
    except Exception as e:
        logger.error(f"Error adding brand: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/webhook/paypal', methods=['POST'])
def paypal_webhook():
    """Handle PayPal webhook events"""
    try:
        # Get webhook data
        webhook_data = request.get_json()
        
        if not webhook_data:
            logger.warning("Empty webhook data received")
            return jsonify({'status': 'error', 'message': 'Empty data'}), 400
        
        # Verify webhook signature (in production)
        if app.config.get('WEBHOOK_VERIFY_SIGNATURE', True):
            paypal_service = PayPalService(
                client_id=app.config['PAYPAL_CLIENT_ID'],
                client_secret=app.config['PAYPAL_CLIENT_SECRET'],
                sandbox=app.config['PAYPAL_SANDBOX']
            )
            
            if not paypal_service.verify_webhook_signature(
                request.headers, 
                request.get_data(as_text=True), 
                app.config.get('PAYPAL_WEBHOOK_ID')
            ):
                logger.warning("Invalid webhook signature")
                return jsonify({'status': 'error', 'message': 'Invalid signature'}), 401
        
        # Save webhook event
        webhook_event = DatabaseService.save_webhook_event(webhook_data)
        
        # Process webhook event asynchronously
        process_webhook_event.delay(str(webhook_event.id))
        
        logger.info(f"Webhook event received: {webhook_data.get('event_type')}")
        
        return jsonify({'status': 'success', 'message': 'Webhook received'})
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/stats')
def get_stats():
    """Get system statistics"""
    try:
        stats = DatabaseService.get_dashboard_stats()
        return jsonify({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.errorhandler(404)
def not_found_error(error):
    return render_template('base.html', error="Page not found"), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('base.html', error="Internal server error"), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


@app.route("/api/currency-convert", methods=["POST"])
def currency_convert():
    """Convert currency using real-time exchange rates"""
    try:
        data = request.get_json()
        
        amount = float(data.get("amount", 0))
        from_currency = data.get("from_currency", "USD").upper()
        to_currency = data.get("to_currency", "EUR").upper()
        
        if amount <= 0:
            return jsonify({
                "success": False,
                "message": "Amount must be greater than 0"
            }), 400
        
        # Use currency service for conversion
        conversion = currency_service.convert_amount(amount, from_currency, to_currency)
        
        if conversion:
            return jsonify({
                "success": True,
                "conversion": conversion,
                "message": f"Successfully converted {amount} {from_currency} to {to_currency}"
            })
        else:
            return jsonify({
                "success": False,
                "message": "Currency conversion failed. Please check currency codes and try again."
            }), 400
            
    except Exception as e:
        logger.error(f"Currency conversion error: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Conversion error: {str(e)}"
        }), 500

@app.route("/api/paypal-currencies")
def get_paypal_currencies():
    """Get PayPal-supported currencies"""
    try:
        currencies = currency_service.get_paypal_supported_currencies()
        return jsonify({
            "success": True,
            "currencies": currencies,
            "total_count": len(currencies)
        })
    except Exception as e:
        logger.error(f"Error fetching PayPal currencies: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

