import os
from datetime import timedelta

class Config:
    # Flask Configuration
    SECRET_KEY = os.environ.get('SESSION_SECRET', 'dev-secret-key-change-in-production')
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://localhost/paypal_integration')
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 300,
        'pool_pre_ping': True,
        'pool_size': 20,
        'max_overflow': 30,
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # PayPal Configuration
    PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID', 'BAAGdPecRsf6dw_nIrWqUen0GdW0UsBZapp1Gn62xkPdD-Vqc-4lqWAidKK8LOObXux8pHJGjXknZoar6Q')
    PAYPAL_CLIENT_SECRET = os.environ.get('PAYPAL_CLIENT_SECRET')
    PAYPAL_SANDBOX = os.environ.get('PAYPAL_SANDBOX', 'false').lower() == 'true'
    PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com' if PAYPAL_SANDBOX else 'https://api-m.paypal.com'
    
    # Redis and Celery Configuration
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = REDIS_URL
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_ACCEPT_CONTENT = ['json']
    CELERY_RESULT_SERIALIZER = 'json'
    CELERY_TIMEZONE = 'UTC'
    
    # Batch Processing Configuration
    PAYPAL_BATCH_SIZE = 50  # Number of products/plans to process in each batch
    PAYPAL_RATE_LIMIT_DELAY = 1  # Seconds to wait between batch requests
    MAX_RETRY_ATTEMPTS = 3
    RETRY_DELAY = 60  # Seconds
    
    # Webhook Configuration
    WEBHOOK_VERIFY_SIGNATURE = True
    WEBHOOK_TIMEOUT = 30  # Seconds
