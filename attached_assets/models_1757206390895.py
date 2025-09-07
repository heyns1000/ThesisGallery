import uuid
from datetime import datetime, timezone
from app import db
from sqlalchemy import Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from flask_login import UserMixin
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
import enum

class PayPalProductStatus(enum.Enum):
    PENDING = "PENDING"
    CREATED = "CREATED"
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    ERROR = "ERROR"

class PayPalPlanStatus(enum.Enum):
    PENDING = "PENDING"
    CREATED = "CREATED"
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    ERROR = "ERROR"

class JobStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    RETRYING = "RETRYING"

class Sector(db.Model):
    __tablename__ = 'sectors'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    glyph = db.Column(db.String(10), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, name, slug, glyph=None, description=None):
        self.name = name
        self.slug = slug
        self.glyph = glyph
        self.description = description
    
    # Relationships
    brands = db.relationship('Brand', back_populates='sector', cascade='all, delete-orphan')
    
    __table_args__ = (
        Index('ix_sectors_slug', 'slug'),
        Index('ix_sectors_name', 'name'),
    )

class Brand(db.Model):
    __tablename__ = 'brands'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sector_id = db.Column(UUID(as_uuid=True), db.ForeignKey('sectors.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    monthly_fee = db.Column(db.Numeric(10, 2), nullable=True)
    annual_fee = db.Column(db.Numeric(10, 2), nullable=True)
    payout_tier = db.Column(db.String(10), nullable=True)
    region = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, sector_id, name, slug, description=None, monthly_fee=None, annual_fee=None, payout_tier=None, region=None):
        self.sector_id = sector_id
        self.name = name
        self.slug = slug
        self.description = description
        self.monthly_fee = monthly_fee
        self.annual_fee = annual_fee
        self.payout_tier = payout_tier
        self.region = region
    
    # Relationships
    sector = db.relationship('Sector', back_populates='brands')
    paypal_products = db.relationship('PayPalProduct', back_populates='brand', cascade='all, delete-orphan')
    nodes = db.relationship('SubNode', back_populates='brand', cascade='all, delete-orphan')
    
    __table_args__ = (
        UniqueConstraint('sector_id', 'slug', name='uq_brand_sector_slug'),
        Index('ix_brands_slug', 'slug'),
        Index('ix_brands_name', 'name'),
        Index('ix_brands_sector_id', 'sector_id'),
    )

class SubNode(db.Model):
    __tablename__ = 'subnodes'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    brand_id = db.Column(UUID(as_uuid=True), db.ForeignKey('brands.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, brand_id, name, slug, description=None):
        self.brand_id = brand_id
        self.name = name
        self.slug = slug
        self.description = description
    
    # Relationships
    brand = db.relationship('Brand', back_populates='nodes')
    
    __table_args__ = (
        UniqueConstraint('brand_id', 'slug', name='uq_subnode_brand_slug'),
        Index('ix_subnodes_slug', 'slug'),
        Index('ix_subnodes_brand_id', 'brand_id'),
    )

class PayPalProduct(db.Model):
    __tablename__ = 'paypal_products'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    brand_id = db.Column(UUID(as_uuid=True), db.ForeignKey('brands.id'), nullable=False)
    paypal_product_id = db.Column(db.String(255), unique=True, nullable=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), default='SERVICE')
    image_url = db.Column(db.String(500), nullable=True)
    home_url = db.Column(db.String(500), nullable=True)
    status = db.Column(db.Enum(PayPalProductStatus), default=PayPalProductStatus.PENDING)
    
    # Individual ID tracking fields as per Copilot guidance
    internal_id = db.Column(db.String(255), nullable=True, index=True)
    custom_id = db.Column(db.String(255), nullable=True, index=True)
    reference_id = db.Column(db.String(255), nullable=True, index=True)
    paypal_response = db.Column(JSONB, nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, brand_id, name, description=None, category='SERVICE', image_url=None, home_url=None, status=PayPalProductStatus.PENDING, internal_id=None, custom_id=None, reference_id=None):
        self.brand_id = brand_id
        self.name = name
        self.description = description
        self.category = category
        self.image_url = image_url
        self.home_url = home_url
        self.status = status
        self.internal_id = internal_id
        self.custom_id = custom_id
        self.reference_id = reference_id
    
    # Relationships
    brand = db.relationship('Brand', back_populates='paypal_products')
    plans = db.relationship('PayPalPlan', back_populates='product', cascade='all, delete-orphan')
    
    __table_args__ = (
        Index('ix_paypal_products_paypal_id', 'paypal_product_id'),
        Index('ix_paypal_products_brand_id', 'brand_id'),
        Index('ix_paypal_products_status', 'status'),
    )

class PayPalPlan(db.Model):
    __tablename__ = 'paypal_plans'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey('paypal_products.id'), nullable=False)
    paypal_plan_id = db.Column(db.String(255), unique=True, nullable=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    billing_cycle_interval_unit = db.Column(db.String(20), default='MONTH')  # DAY, WEEK, MONTH, YEAR
    billing_cycle_interval_count = db.Column(db.Integer, default=1)
    billing_cycle_frequency = db.Column(db.Integer, default=1)
    billing_cycle_total_cycles = db.Column(db.Integer, default=0)  # 0 for infinite
    currency_code = db.Column(db.String(3), default='USD')
    fixed_price_value = db.Column(db.Numeric(10, 2), nullable=True)
    setup_fee_value = db.Column(db.Numeric(10, 2), nullable=True, default=0)
    taxes_percentage = db.Column(db.Numeric(5, 2), nullable=True, default=0)
    status = db.Column(db.Enum(PayPalPlanStatus), default=PayPalPlanStatus.PENDING)
    
    # Individual ID tracking fields as per Copilot guidance
    internal_id = db.Column(db.String(255), nullable=True, index=True)
    custom_id = db.Column(db.String(255), nullable=True, index=True)
    invoice_id = db.Column(db.String(255), nullable=True, index=True)
    paypal_response = db.Column(JSONB, nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, product_id, name, description=None, billing_cycle_interval_unit='MONTH', 
                 billing_cycle_interval_count=1, currency_code='USD', fixed_price_value=None, 
                 status=PayPalPlanStatus.PENDING, internal_id=None, custom_id=None, invoice_id=None):
        self.product_id = product_id
        self.name = name
        self.description = description
        self.billing_cycle_interval_unit = billing_cycle_interval_unit
        self.billing_cycle_interval_count = billing_cycle_interval_count
        self.currency_code = currency_code
        self.fixed_price_value = fixed_price_value
        self.status = status
        self.internal_id = internal_id
        self.custom_id = custom_id
        self.invoice_id = invoice_id
    
    # Relationships
    product = db.relationship('PayPalProduct', back_populates='plans')
    subscriptions = db.relationship('PayPalSubscription', back_populates='plan', cascade='all, delete-orphan')
    
    __table_args__ = (
        Index('ix_paypal_plans_paypal_id', 'paypal_plan_id'),
        Index('ix_paypal_plans_product_id', 'product_id'),
        Index('ix_paypal_plans_status', 'status'),
    )

class PayPalSubscription(db.Model):
    __tablename__ = 'paypal_subscriptions'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id = db.Column(UUID(as_uuid=True), db.ForeignKey('paypal_plans.id'), nullable=False)
    paypal_subscription_id = db.Column(db.String(255), unique=True, nullable=True)
    subscriber_email = db.Column(db.String(255), nullable=True)
    subscriber_name = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=True)  # APPROVAL_PENDING, APPROVED, ACTIVE, SUSPENDED, CANCELLED, EXPIRED
    
    # Individual ID tracking fields as per Copilot guidance
    internal_id = db.Column(db.String(255), nullable=True, index=True)
    custom_id = db.Column(db.String(255), nullable=True, index=True)
    reference_id = db.Column(db.String(255), nullable=True, index=True)
    approval_url = db.Column(db.String(500), nullable=True)
    paypal_response = db.Column(JSONB, nullable=True)
    webhook_events = db.Column(JSONB, nullable=True, default=list)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    plan = db.relationship('PayPalPlan', back_populates='subscriptions')
    
    __table_args__ = (
        Index('ix_paypal_subscriptions_paypal_id', 'paypal_subscription_id'),
        Index('ix_paypal_subscriptions_plan_id', 'plan_id'),
        Index('ix_paypal_subscriptions_email', 'subscriber_email'),
        Index('ix_paypal_subscriptions_status', 'status'),
    )

class BulkJob(db.Model):
    __tablename__ = 'bulk_jobs'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_type = db.Column(db.String(100), nullable=False)  # create_products, create_plans, create_subscriptions
    job_name = db.Column(db.String(255), nullable=False)
    total_items = db.Column(db.Integer, nullable=False, default=0)
    processed_items = db.Column(db.Integer, nullable=False, default=0)
    successful_items = db.Column(db.Integer, nullable=False, default=0)
    failed_items = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(db.Enum(JobStatus), default=JobStatus.PENDING)
    celery_task_id = db.Column(db.String(255), unique=True, nullable=True)
    error_log = db.Column(JSONB, nullable=True, default=list)
    result_data = db.Column(JSONB, nullable=True)
    started_at = db.Column(db.DateTime(timezone=True), nullable=True)
    completed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, job_type, job_name, total_items, status=JobStatus.PENDING, celery_task_id=None):
        self.job_type = job_type
        self.job_name = job_name
        self.total_items = total_items
        self.status = status
        self.celery_task_id = celery_task_id
    
    __table_args__ = (
        Index('ix_bulk_jobs_status', 'status'),
        Index('ix_bulk_jobs_type', 'job_type'),
        Index('ix_bulk_jobs_celery_task', 'celery_task_id'),
    )

class PayPalWebhookEvent(db.Model):
    __tablename__ = 'paypal_webhook_events'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = db.Column(db.String(255), unique=True, nullable=False)
    event_type = db.Column(db.String(100), nullable=False)
    resource_type = db.Column(db.String(100), nullable=True)
    resource_id = db.Column(db.String(255), nullable=True)
    summary = db.Column(db.Text, nullable=True)
    event_data = db.Column(JSONB, nullable=False)
    processed = db.Column(db.Boolean, default=False)
    processing_error = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    processed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    
    def __init__(self, event_id, event_type, event_data, resource_type=None, resource_id=None, summary=None):
        self.event_id = event_id
        self.event_type = event_type
        self.event_data = event_data
        self.resource_type = resource_type
        self.resource_id = resource_id
        self.summary = summary
    
    __table_args__ = (
        Index('ix_webhook_events_event_id', 'event_id'),
        Index('ix_webhook_events_type', 'event_type'),
        Index('ix_webhook_events_resource_id', 'resource_id'),
        Index('ix_webhook_events_processed', 'processed'),
        Index('ix_webhook_events_created_at', 'created_at'),
    )

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = db.Column(db.String(100), nullable=False)  # brand, product, plan, subscription
    entity_id = db.Column(UUID(as_uuid=True), nullable=False)
    action = db.Column(db.String(100), nullable=False)  # create, update, delete, sync
    old_values = db.Column(JSONB, nullable=True)
    new_values = db.Column(JSONB, nullable=True)
    user_id = db.Column(db.String(255), nullable=True)  # For future user tracking
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    def __init__(self, entity_type, entity_id, action, old_values=None, new_values=None, 
                 user_id=None, ip_address=None, user_agent=None):
        self.entity_type = entity_type
        self.entity_id = entity_id
        self.action = action
        self.old_values = old_values
        self.new_values = new_values
        self.user_id = user_id
        self.ip_address = ip_address
        self.user_agent = user_agent
    
    __table_args__ = (
        Index('ix_audit_logs_entity', 'entity_type', 'entity_id'),
        Index('ix_audit_logs_action', 'action'),
        Index('ix_audit_logs_created_at', 'created_at'),
    )

class User(UserMixin, db.Model):
    """User model for Gmail OAuth authentication"""
    __tablename__ = 'users'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)  # For local auth
    auth_provider = db.Column(db.String(50), default='local')  # 'local', 'gmail', etc.
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __init__(self, username, email, password_hash=None, auth_provider='local'):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.auth_provider = auth_provider
    
    __table_args__ = (
        Index('ix_users_email', 'email'),
        Index('ix_users_username', 'username'),
        Index('ix_users_auth_provider', 'auth_provider'),
    )

class OAuth(OAuthConsumerMixin, db.Model):
    """OAuth token storage for Replit Auth"""
    __tablename__ = 'oauth'
    
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey(User.id))
    browser_session_key = db.Column(db.String, nullable=False)
    user = db.relationship(User)

    __table_args__ = (
        UniqueConstraint(
            'user_id',
            'browser_session_key', 
            'provider',
            name='uq_user_browser_session_key_provider',
        ),
    )

class AdminUser(db.Model):
    """Admin users for backend management and deployment"""
    __tablename__ = 'admin_users'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_super_admin = db.Column(db.Boolean, default=False, nullable=False)
    last_login = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    def __repr__(self):
        return f'<AdminUser {self.username}>'

class AdminLoginAttempt(db.Model):
    """Track admin login attempts for security"""
    __tablename__ = 'admin_login_attempts'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)  # Support IPv6
    attempt_time = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    success = db.Column(db.Boolean, default=False, nullable=False)
    user_agent = db.Column(db.String(500), nullable=True)
    
    def __repr__(self):
        return f'<AdminLoginAttempt {self.username} - {self.success}>'
