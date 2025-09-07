import os
import logging
from app import celery, app

# Configure logging
logging.basicConfig(level=logging.INFO)

if __name__ == '__main__':
    with app.app_context():
        celery.start()
