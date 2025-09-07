-- PayPal Integration System Database Schema
-- Designed for PostgreSQL with support for 7000+ products
-- Includes comprehensive indexing, constraints, and audit logging

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE paypal_product_status AS ENUM ('pending', 'created', 'active', 'inactive', 'error');
CREATE TYPE paypal_plan_status AS ENUM ('pending', 'created', 'active', 'inactive', 'error');
CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'retrying');

-- Sectors table
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    glyph VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for sectors
CREATE INDEX idx_sectors_slug ON sectors(slug);
CREATE INDEX idx_sectors_name ON sectors(name);
CREATE INDEX idx_sectors_created_at ON sectors(created_at);

-- Brands table
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_fee DECIMAL(10,2),
    annual_fee DECIMAL(10,2),
    payout_tier VARCHAR(10),
    region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique slug per sector to prevent ID duplication
    CONSTRAINT uq_brand_sector_slug UNIQUE (sector_id, slug)
);

-- Create indexes for brands
CREATE INDEX idx_brands_sector_id ON brands(sector_id);
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_name ON brands(name);
CREATE INDEX idx_brands_created_at ON brands(created_at);
CREATE INDEX idx_brands_monthly_fee ON brands(monthly_fee) WHERE monthly_fee IS NOT NULL;
CREATE INDEX idx_brands_annual_fee ON brands(annual_fee) WHERE annual_fee IS NOT NULL;
CREATE INDEX idx_brands_payout_tier ON brands(payout_tier) WHERE payout_tier IS NOT NULL;

-- Subnodes table
CREATE TABLE subnodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique slug per brand to prevent ID duplication
    CONSTRAINT uq_subnode_brand_slug UNIQUE (brand_id, slug)
);

-- Create indexes for subnodes
CREATE INDEX idx_subnodes_brand_id ON subnodes(brand_id);
CREATE INDEX idx_subnodes_slug ON subnodes(slug);
CREATE INDEX idx_subnodes_name ON subnodes(name);
CREATE INDEX idx_subnodes_created_at ON subnodes(created_at);

-- PayPal Products table
CREATE TABLE paypal_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    paypal_product_id VARCHAR(255) UNIQUE, -- PayPal's product ID
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'SERVICE',
    image_url VARCHAR(500),
    home_url VARCHAR(500),
    status paypal_product_status DEFAULT 'pending',
    paypal_response JSONB, -- Store full PayPal API response
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for paypal_products
CREATE INDEX idx_paypal_products_brand_id ON paypal_products(brand_id);
CREATE INDEX idx_paypal_products_paypal_id ON paypal_products(paypal_product_id) WHERE paypal_product_id IS NOT NULL;
CREATE INDEX idx_paypal_products_status ON paypal_products(status);
CREATE INDEX idx_paypal_products_created_at ON paypal_products(created_at);
CREATE INDEX idx_paypal_products_category ON paypal_products(category);

-- PayPal Plans table
CREATE TABLE paypal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES paypal_products(id) ON DELETE CASCADE,
    paypal_plan_id VARCHAR(255) UNIQUE, -- PayPal's plan ID
    name VARCHAR(255) NOT NULL,
    description TEXT,
    billing_cycle_interval_unit VARCHAR(20) DEFAULT 'MONTH', -- DAY, WEEK, MONTH, YEAR
    billing_cycle_interval_count INTEGER DEFAULT 1,
    billing_cycle_frequency INTEGER DEFAULT 1,
    billing_cycle_total_cycles INTEGER DEFAULT 0, -- 0 for infinite
    currency_code VARCHAR(3) DEFAULT 'USD',
    fixed_price_value DECIMAL(10,2),
    setup_fee_value DECIMAL(10,2) DEFAULT 0,
    taxes_percentage DECIMAL(5,2) DEFAULT 0,
    status paypal_plan_status DEFAULT 'pending',
    paypal_response JSONB, -- Store full PayPal API response
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for paypal_plans
CREATE INDEX idx_paypal_plans_product_id ON paypal_plans(product_id);
CREATE INDEX idx_paypal_plans_paypal_id ON paypal_plans(paypal_plan_id) WHERE paypal_plan_id IS NOT NULL;
CREATE INDEX idx_paypal_plans_status ON paypal_plans(status);
CREATE INDEX idx_paypal_plans_created_at ON paypal_plans(created_at);
CREATE INDEX idx_paypal_plans_billing_cycle ON paypal_plans(billing_cycle_interval_unit, billing_cycle_interval_count);
CREATE INDEX idx_paypal_plans_currency ON paypal_plans(currency_code);
CREATE INDEX idx_paypal_plans_price ON paypal_plans(fixed_price_value) WHERE fixed_price_value IS NOT NULL;

-- PayPal Subscriptions table
CREATE TABLE paypal_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES paypal_plans(id) ON DELETE CASCADE,
    paypal_subscription_id VARCHAR(255) UNIQUE, -- PayPal's subscription ID
    subscriber_email VARCHAR(255),
    subscriber_name VARCHAR(255),
    status VARCHAR(50), -- APPROVAL_PENDING, APPROVED, ACTIVE, SUSPENDED, CANCELLED, EXPIRED
    approval_url VARCHAR(500),
    paypal_response JSONB, -- Store full PayPal API response
    webhook_events JSONB DEFAULT '[]'::jsonb, -- Store webhook events
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for paypal_subscriptions
CREATE INDEX idx_paypal_subscriptions_plan_id ON paypal_subscriptions(plan_id);
CREATE INDEX idx_paypal_subscriptions_paypal_id ON paypal_subscriptions(paypal_subscription_id) WHERE paypal_subscription_id IS NOT NULL;
CREATE INDEX idx_paypal_subscriptions_email ON paypal_subscriptions(subscriber_email) WHERE subscriber_email IS NOT NULL;
CREATE INDEX idx_paypal_subscriptions_status ON paypal_subscriptions(status) WHERE status IS NOT NULL;
CREATE INDEX idx_paypal_subscriptions_created_at ON paypal_subscriptions(created_at);

-- Bulk Jobs table for tracking background processing
CREATE TABLE bulk_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(100) NOT NULL, -- create_products, create_plans, create_subscriptions
    job_name VARCHAR(255) NOT NULL,
    total_items INTEGER NOT NULL DEFAULT 0,
    processed_items INTEGER NOT NULL DEFAULT 0,
    successful_items INTEGER NOT NULL DEFAULT 0,
    failed_items INTEGER NOT NULL DEFAULT 0,
    status job_status DEFAULT 'pending',
    celery_task_id VARCHAR(255) UNIQUE,
    error_log JSONB DEFAULT '[]'::jsonb,
    result_data JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for bulk_jobs
CREATE INDEX idx_bulk_jobs_status ON bulk_jobs(status);
CREATE INDEX idx_bulk_jobs_type ON bulk_jobs(job_type);
CREATE INDEX idx_bulk_jobs_celery_task ON bulk_jobs(celery_task_id) WHERE celery_task_id IS NOT NULL;
CREATE INDEX idx_bulk_jobs_created_at ON bulk_jobs(created_at);
CREATE INDEX idx_bulk_jobs_completed_at ON bulk_jobs(completed_at) WHERE completed_at IS NOT NULL;

-- PayPal Webhook Events table
CREATE TABLE paypal_webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) UNIQUE NOT NULL, -- PayPal's event ID
    event_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    summary TEXT,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for paypal_webhook_events
CREATE INDEX idx_webhook_events_event_id ON paypal_webhook_events(event_id);
CREATE INDEX idx_webhook_events_type ON paypal_webhook_events(event_type);
CREATE INDEX idx_webhook_events_resource_id ON paypal_webhook_events(resource_id) WHERE resource_id IS NOT NULL;
CREATE INDEX idx_webhook_events_processed ON paypal_webhook_events(processed);
CREATE INDEX idx_webhook_events_created_at ON paypal_webhook_events(created_at);
CREATE INDEX idx_webhook_events_resource_type ON paypal_webhook_events(resource_type) WHERE resource_type IS NOT NULL;

-- Audit Logs table for comprehensive tracking
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(100) NOT NULL, -- brand, product, plan, subscription
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL, -- create, update, delete, sync
    old_values JSONB,
    new_values JSONB,
    user_id VARCHAR(255), -- For future user tracking
    ip_address INET,
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for audit_logs
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id) WHERE user_id IS NOT NULL;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subnodes_updated_at BEFORE UPDATE ON subnodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paypal_products_updated_at BEFORE UPDATE ON paypal_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paypal_plans_updated_at BEFORE UPDATE ON paypal_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paypal_subscriptions_updated_at BEFORE UPDATE ON paypal_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bulk_jobs_updated_at BEFORE UPDATE ON bulk_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to prevent duplicate PayPal IDs
CREATE OR REPLACE FUNCTION check_paypal_id_duplicates()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for PayPal product ID duplicates
    IF TG_TABLE_NAME = 'paypal_products' AND NEW.paypal_product_id IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM paypal_products WHERE paypal_product_id = NEW.paypal_product_id AND id != NEW.id) THEN
            RAISE EXCEPTION 'PayPal product ID % already exists', NEW.paypal_product_id;
        END IF;
    END IF;
    
    -- Check for PayPal plan ID duplicates
    IF TG_TABLE_NAME = 'paypal_plans' AND NEW.paypal_plan_id IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM paypal_plans WHERE paypal_plan_id = NEW.paypal_plan_id AND id != NEW.id) THEN
            RAISE EXCEPTION 'PayPal plan ID % already exists', NEW.paypal_plan_id;
        END IF;
    END IF;
    
    -- Check for PayPal subscription ID duplicates
    IF TG_TABLE_NAME = 'paypal_subscriptions' AND NEW.paypal_subscription_id IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM paypal_subscriptions WHERE paypal_subscription_id = NEW.paypal_subscription_id AND id != NEW.id) THEN
            RAISE EXCEPTION 'PayPal subscription ID % already exists', NEW.paypal_subscription_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply duplicate prevention triggers
CREATE TRIGGER prevent_paypal_product_id_duplicates
    BEFORE INSERT OR UPDATE ON paypal_products
    FOR EACH ROW EXECUTE FUNCTION check_paypal_id_duplicates();

CREATE TRIGGER prevent_paypal_plan_id_duplicates
    BEFORE INSERT OR UPDATE ON paypal_plans
    FOR EACH ROW EXECUTE FUNCTION check_paypal_id_duplicates();

CREATE TRIGGER prevent_paypal_subscription_id_duplicates
    BEFORE INSERT OR UPDATE ON paypal_subscriptions
    FOR EACH ROW EXECUTE FUNCTION check_paypal_id_duplicates();

-- Create materialized view for dashboard statistics (for performance with 7000+ records)
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM sectors) as total_sectors,
    (SELECT COUNT(*) FROM brands) as total_brands,
    (SELECT COUNT(*) FROM subnodes) as total_subnodes,
    (SELECT COUNT(*) FROM paypal_products) as total_paypal_products,
    (SELECT COUNT(*) FROM paypal_products WHERE status = 'active') as active_paypal_products,
    (SELECT COUNT(*) FROM paypal_products WHERE status = 'pending') as pending_paypal_products,
    (SELECT COUNT(*) FROM paypal_products WHERE status = 'error') as error_paypal_products,
    (SELECT COUNT(*) FROM paypal_plans) as total_paypal_plans,
    (SELECT COUNT(*) FROM paypal_plans WHERE status = 'active') as active_paypal_plans,
    (SELECT COUNT(*) FROM paypal_plans WHERE status = 'pending') as pending_paypal_plans,
    (SELECT COUNT(*) FROM paypal_plans WHERE status = 'error') as error_paypal_plans,
    (SELECT COUNT(*) FROM paypal_subscriptions) as total_subscriptions,
    (SELECT COUNT(*) FROM bulk_jobs) as total_bulk_jobs,
    (SELECT COUNT(*) FROM bulk_jobs WHERE status = 'pending') as pending_bulk_jobs,
    (SELECT COUNT(*) FROM bulk_jobs WHERE status = 'processing') as processing_bulk_jobs,
    (SELECT COUNT(*) FROM bulk_jobs WHERE status = 'completed') as completed_bulk_jobs,
    (SELECT COUNT(*) FROM bulk_jobs WHERE status = 'failed') as failed_bulk_jobs,
    (SELECT COUNT(*) FROM paypal_webhook_events) as total_webhook_events,
    (SELECT COUNT(*) FROM paypal_webhook_events WHERE processed = true) as processed_webhook_events,
    (SELECT COUNT(*) FROM paypal_webhook_events WHERE processed = false) as pending_webhook_events,
    CURRENT_TIMESTAMP as last_updated;

-- Create index on the materialized view
CREATE UNIQUE INDEX idx_dashboard_stats_last_updated ON dashboard_stats(last_updated);

-- Function to refresh dashboard stats
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_stats;
END;
$$ language 'plpgsql';

-- Create function for batch operations with transaction safety
CREATE OR REPLACE FUNCTION safe_batch_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the operation
    INSERT INTO audit_logs (entity_type, entity_id, action, new_values)
    VALUES (TG_TABLE_NAME, NEW.id, 'create', row_to_json(NEW));
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply audit triggers to main tables
CREATE TRIGGER audit_sectors_insert AFTER INSERT ON sectors
    FOR EACH ROW EXECUTE FUNCTION safe_batch_insert();

CREATE TRIGGER audit_brands_insert AFTER INSERT ON brands
    FOR EACH ROW EXECUTE FUNCTION safe_batch_insert();

CREATE TRIGGER audit_paypal_products_insert AFTER INSERT ON paypal_products
    FOR EACH ROW EXECUTE FUNCTION safe_batch_insert();

CREATE TRIGGER audit_paypal_plans_insert AFTER INSERT ON paypal_plans
    FOR EACH ROW EXECUTE FUNCTION safe_batch_insert();

-- Create partitioning for audit_logs (for high-volume logging)
-- Note: This creates monthly partitions for audit logs
CREATE OR REPLACE FUNCTION create_monthly_audit_partition()
RETURNS void AS $$
DECLARE
    start_date date := date_trunc('month', CURRENT_DATE);
    end_date date := start_date + interval '1 month';
    table_name text := 'audit_logs_' || to_char(start_date, 'YYYY_MM');
BEGIN
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs 
                   FOR VALUES FROM (%L) TO (%L)', 
                   table_name, start_date, end_date);
END;
$$ language 'plpgsql';

-- Initial setup for current month partition
SELECT create_monthly_audit_partition();

-- Grant permissions (adjust as needed for your application user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- Insert initial sector data to prevent duplicates
INSERT INTO sectors (name, slug, glyph, description) VALUES
('Agriculture & Biotech', 'agriculture-biotech', '🌱', 'Agricultural technology and biotechnology solutions'),
('Food, Soil & Farming', 'food-soil-farming', '🥦', 'Sustainable farming and food production systems'),
('Banking & Finance', 'banking-finance', '🏦', 'Financial services and banking technology'),
('Creative Tech', 'creative-tech', '🖋️', 'Creative technology and digital design tools'),
('Logistics & Packaging', 'logistics-packaging', '📦', 'Supply chain and packaging solutions'),
('Education & IP', 'education-ip', '📚', 'Educational technology and intellectual property'),
('Fashion & Identity', 'fashion-identity', '✂', 'Fashion technology and identity solutions'),
('Gaming & Simulation', 'gaming-simulation', '🎮', 'Gaming platforms and simulation technology'),
('Health & Hygiene', 'health-hygiene', '🧠', 'Healthcare and hygiene technology'),
('Housing & Infrastructure', 'housing-infrastructure', '🏗️', 'Construction and infrastructure technology'),
('Justice & Ethics', 'justice-ethics', '⚖', 'Legal technology and ethical frameworks'),
('Knowledge & Archives', 'knowledge-archives', '📖', 'Knowledge management and archival systems'),
('Micro-Mesh Logistics', 'micromesh-logistics', '☰', 'Micro-logistics and mesh networking'),
('Motion, Media & Sonic', 'motion-media-sonic', '🎬', 'Media production and audio technology'),
('Nutrition & Food Chain', 'nutrition-food-chain', '✿', 'Nutrition science and food supply chain'),
('AI, Logic & Grid', 'ai-logic-grid', '🧠', 'Artificial intelligence and logic systems'),
('Packaging & Materials', 'packaging-materials', '📦', 'Advanced packaging and materials science'),
('Quantum Protocols', 'quantum-protocols', '✴️', 'Quantum computing and protocols'),
('Ritual & Culture', 'ritual-culture', '☯', 'Cultural technology and ritual systems'),
('SaaS & Licensing', 'saas-licensing', '🔑', 'Software as a Service and licensing platforms'),
('Trade Systems', 'trade-systems', '🧺', 'Trading platforms and commerce systems'),
('Utilities & Energy', 'utilities-energy', '🔋', 'Utility services and energy technology'),
('Voice & Audio', 'voice-audio', '🎙️', 'Voice technology and audio processing'),
('Webless Tech & Nodes', 'webless-tech-nodes', '📡', 'Offline technology and node networks'),
('NFT & Ownership', 'nft-ownership', '🔁', 'Non-fungible tokens and digital ownership'),
('Education & Youth', 'education-youth', '🎓', 'Youth education and development programs'),
('Zero Waste', 'zero-waste', '♻️', 'Waste reduction and circular economy'),
('Professional Services', 'professional-services', '🧾', 'Professional service platforms'),
('Payroll Mining & Accounting', 'payroll-mining-accounting', '🪙', 'Payroll and accounting automation'),
('Mining & Resources', 'mining-resources', '⛏️', 'Mining technology and resource management'),
('Wildlife & Habitat', 'wildlife-habitat', '🦁', 'Wildlife conservation and habitat management')
ON CONFLICT (slug) DO NOTHING;

-- Create a function to safely add brands to prevent duplicates
CREATE OR REPLACE FUNCTION add_brand_safe(
    p_sector_slug VARCHAR(100),
    p_brand_name VARCHAR(255),
    p_brand_slug VARCHAR(100),
    p_monthly_fee DECIMAL(10,2) DEFAULT NULL,
    p_annual_fee DECIMAL(10,2) DEFAULT NULL,
    p_payout_tier VARCHAR(10) DEFAULT 'B+',
    p_region VARCHAR(100) DEFAULT 'Global'
)
RETURNS UUID AS $$
DECLARE
    v_sector_id UUID;
    v_brand_id UUID;
BEGIN
    -- Get sector ID
    SELECT id INTO v_sector_id FROM sectors WHERE slug = p_sector_slug;
    
    IF v_sector_id IS NULL THEN
        RAISE EXCEPTION 'Sector with slug % not found', p_sector_slug;
    END IF;
    
    -- Insert brand if it doesn't exist
    INSERT INTO brands (sector_id, name, slug, monthly_fee, annual_fee, payout_tier, region)
    VALUES (v_sector_id, p_brand_name, p_brand_slug, p_monthly_fee, p_annual_fee, p_payout_tier, p_region)
    ON CONFLICT (sector_id, slug) DO UPDATE SET
        name = EXCLUDED.name,
        monthly_fee = EXCLUDED.monthly_fee,
        annual_fee = EXCLUDED.annual_fee,
        payout_tier = EXCLUDED.payout_tier,
        region = EXCLUDED.region,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO v_brand_id;
    
    RETURN v_brand_id;
END;
$$ language 'plpgsql';

-- Performance optimization: Create partial indexes for common queries
CREATE INDEX idx_brands_with_products ON brands(id) 
WHERE EXISTS (SELECT 1 FROM paypal_products WHERE paypal_products.brand_id = brands.id);

CREATE INDEX idx_products_needing_plans ON paypal_products(id) 
WHERE status = 'active' AND paypal_product_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM paypal_plans WHERE paypal_plans.product_id = paypal_products.id);

CREATE INDEX idx_active_subscriptions ON paypal_subscriptions(plan_id, status, created_at) 
WHERE status IN ('ACTIVE', 'APPROVED');

-- Final schema validation
DO $$
BEGIN
    -- Verify all tables exist
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') >= 8,
           'Not all required tables were created';
    
    -- Verify indexes exist
    ASSERT (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') >= 20,
           'Not all required indexes were created';
    
    -- Verify triggers exist  
    ASSERT (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') >= 10,
           'Not all required triggers were created';
    
    RAISE NOTICE 'Database schema created successfully with full PayPal integration support for 7000+ products';
END
$$;
