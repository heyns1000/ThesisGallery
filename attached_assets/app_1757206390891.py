import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from celery import Celery
import redis

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Celery configuration
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend='redis://localhost:6379/0',
        broker='redis://localhost:6379/0'
    )
    
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    
    celery.Task = ContextTask
    return celery

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "postgresql://localhost/paypal_integration")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# PayPal configuration
app.config['PAYPAL_CLIENT_ID'] = os.environ.get('PAYPAL_CLIENT_ID')
app.config['PAYPAL_CLIENT_SECRET'] = os.environ.get('PAYPAL_CLIENT_SECRET')
app.config['PAYPAL_SANDBOX'] = os.environ.get('PAYPAL_SANDBOX', 'true').lower() == 'true'

# Redis configuration
redis_client = redis.from_url('redis://localhost:6379/0')

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'replit_auth.login'
login_manager.login_message = 'Please log in with Replit to access the PayPal Integration Dashboard'

@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(user_id)

# Initialize extensions
db.init_app(app)
celery = make_celery(app)

# Import routes after app creation - done after db initialization

with app.app_context():
    # Import models to ensure tables are created
    import models
    
    try:
        # Import and register Replit Auth blueprint
        from services.replit_auth import make_replit_blueprint
        app.register_blueprint(make_replit_blueprint(), url_prefix="/auth")
        
        # Initialize currency service
        from services.currency_service import currency_service
        
        db.create_all()
        logger.info("Database tables created successfully")
        logger.info("Replit Auth service initialized")
        logger.info("Currency exchange service initialized")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")

# Import routes after database initialization
from routes import *

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
