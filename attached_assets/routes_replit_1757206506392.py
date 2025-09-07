from flask import session
from app import app, db
from services.replit_auth import require_login, make_replit_blueprint
from flask_login import current_user

app.register_blueprint(make_replit_blueprint(), url_prefix="/auth")

# Make session permanent
@app.before_request
def make_session_permanent():
    session.permanent = True

@app.route('/protected')
@require_login
def protected_route():
    """Example protected route using Replit Auth"""
    user = current_user
    return f"Hello {user.username}! You are logged in via Replit Auth."

@app.route('/auth/profile')
@require_login
def user_profile():
    """User profile page"""
    user = current_user
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'auth_provider': user.auth_provider,
        'created_at': user.created_at.isoformat() if user.created_at else None
    }