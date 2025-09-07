"""
Admin Authentication Service
Provides secure login functionality for PayPal integration management
"""

import hashlib
import secrets
import os
from datetime import datetime, timedelta
from flask import session, request
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import logging

logger = logging.getLogger(__name__)

class AdminAuthService:
    """Handles admin authentication and session management"""
    
    def __init__(self):
        self.session_timeout = timedelta(hours=2)  # 2 hour session timeout
        self.max_login_attempts = 5
        self.lockout_duration = timedelta(minutes=30)
        
    def create_admin_user(self, username, password, email=None):
        """Create a new admin user with secure password hashing"""
        try:
            from models import AdminUser
            from app import db
            
            # Check if user already exists
            existing_user = AdminUser.query.filter_by(username=username).first()
            if existing_user:
                return {'success': False, 'message': 'Admin user already exists'}
            
            # Create secure password hash
            password_hash = generate_password_hash(password)
            
            # Create new admin user
            admin_user = AdminUser(
                username=username,
                email=email,
                password_hash=password_hash,
                is_active=True,
                created_at=datetime.utcnow()
            )
            
            db.session.add(admin_user)
            db.session.commit()
            
            logger.info(f"Admin user created: {username}")
            return {'success': True, 'message': 'Admin user created successfully'}
            
        except Exception as e:
            logger.error(f"Error creating admin user: {str(e)}")
            return {'success': False, 'message': str(e)}
    
    def authenticate_admin(self, username, password):
        """Authenticate admin user with rate limiting"""
        try:
            from models import AdminUser, AdminLoginAttempt
            from app import db
            
            # Check for account lockout
            if self._is_account_locked(username):
                return {'success': False, 'message': 'Account temporarily locked due to failed login attempts'}
            
            # Find admin user
            admin_user = AdminUser.query.filter_by(username=username, is_active=True).first()
            
            if not admin_user:
                self._log_failed_attempt(username)
                return {'success': False, 'message': 'Invalid credentials'}
            
            # Check password
            if check_password_hash(admin_user.password_hash, password):
                # Successful login
                self._clear_failed_attempts(username)
                self._create_admin_session(admin_user)
                
                # Update last login
                admin_user.last_login = datetime.utcnow()
                db.session.commit()
                
                logger.info(f"Admin login successful: {username}")
                return {'success': True, 'message': 'Login successful', 'user': admin_user}
            else:
                # Failed login
                self._log_failed_attempt(username)
                return {'success': False, 'message': 'Invalid credentials'}
                
        except Exception as e:
            logger.error(f"Error during admin authentication: {str(e)}")
            return {'success': False, 'message': 'Authentication error'}
    
    def _create_admin_session(self, admin_user):
        """Create secure admin session"""
        session['admin_logged_in'] = True
        session['admin_user_id'] = str(admin_user.id)
        session['admin_username'] = admin_user.username
        session['admin_login_time'] = datetime.utcnow().isoformat()
        session['admin_session_token'] = secrets.token_urlsafe(32)
        session.permanent = True
    
    def _is_account_locked(self, username):
        """Check if account is temporarily locked"""
        try:
            from models import AdminLoginAttempt
            
            cutoff_time = datetime.utcnow() - self.lockout_duration
            recent_attempts = AdminLoginAttempt.query.filter(
                AdminLoginAttempt.username == username,
                AdminLoginAttempt.attempt_time > cutoff_time,
                AdminLoginAttempt.success == False
            ).count()
            
            return recent_attempts >= self.max_login_attempts
        except:
            return False
    
    def _log_failed_attempt(self, username):
        """Log failed login attempt"""
        try:
            from models import AdminLoginAttempt
            from app import db
            
            attempt = AdminLoginAttempt(
                username=username,
                ip_address=request.remote_addr,
                attempt_time=datetime.utcnow(),
                success=False
            )
            
            db.session.add(attempt)
            db.session.commit()
        except Exception as e:
            logger.error(f"Error logging failed attempt: {str(e)}")
    
    def _clear_failed_attempts(self, username):
        """Clear failed login attempts after successful login"""
        try:
            from models import AdminLoginAttempt
            from app import db
            
            AdminLoginAttempt.query.filter_by(username=username, success=False).delete()
            db.session.commit()
        except Exception as e:
            logger.error(f"Error clearing failed attempts: {str(e)}")
    
    def is_admin_logged_in(self):
        """Check if admin is currently logged in"""
        if not session.get('admin_logged_in'):
            return False
        
        # Check session timeout
        login_time_str = session.get('admin_login_time')
        if login_time_str:
            login_time = datetime.fromisoformat(login_time_str)
            if datetime.utcnow() - login_time > self.session_timeout:
                self.logout_admin()
                return False
        
        return True
    
    def get_current_admin(self):
        """Get current logged in admin user"""
        if not self.is_admin_logged_in():
            return None
        
        try:
            from models import AdminUser
            admin_id = session.get('admin_user_id')
            if admin_id:
                return AdminUser.query.get(admin_id)
        except:
            pass
        
        return None
    
    def logout_admin(self):
        """Logout current admin user"""
        session.pop('admin_logged_in', None)
        session.pop('admin_user_id', None)
        session.pop('admin_username', None)
        session.pop('admin_login_time', None)
        session.pop('admin_session_token', None)
        logger.info("Admin logout")
    
    def require_admin_login(self, f):
        """Decorator to require admin login for routes"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not self.is_admin_logged_in():
                from flask import redirect, url_for, flash
                flash('Please log in to access the admin area', 'warning')
                return redirect(url_for('admin_login'))
            return f(*args, **kwargs)
        return decorated_function

# Global admin auth service instance
admin_auth_service = AdminAuthService()