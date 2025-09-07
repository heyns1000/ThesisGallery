#!/usr/bin/env python3
"""
Create Admin User Script
Run this to create the first admin user for the PayPal integration system
"""

from app import app, db
from services.admin_auth import admin_auth_service
import getpass
import sys

def create_admin_user():
    """Interactive script to create admin user"""
    print("🔐 PayPal Integration System - Admin User Creation")
    print("=" * 50)
    
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        try:
            print("\nEnter admin user details:")
            username = input("Username: ").strip()
            
            if not username:
                print("❌ Username cannot be empty")
                return False
            
            # Check if user already exists
            from models import AdminUser
            existing_user = AdminUser.query.filter_by(username=username).first()
            if existing_user:
                print(f"❌ Admin user '{username}' already exists")
                return False
            
            email = input("Email (optional): ").strip()
            password = getpass.getpass("Password: ")
            password_confirm = getpass.getpass("Confirm Password: ")
            
            if password != password_confirm:
                print("❌ Passwords do not match")
                return False
            
            if len(password) < 8:
                print("❌ Password must be at least 8 characters long")
                return False
            
            # Create admin user
            result = admin_auth_service.create_admin_user(
                username=username,
                password=password,
                email=email if email else None
            )
            
            if result['success']:
                print(f"✅ Admin user '{username}' created successfully!")
                print(f"\n🚀 You can now log in at: /admin/login")
                return True
            else:
                print(f"❌ Error: {result['message']}")
                return False
                
        except KeyboardInterrupt:
            print("\n\n❌ Operation cancelled")
            return False
        except Exception as e:
            print(f"❌ Unexpected error: {str(e)}")
            return False

if __name__ == "__main__":
    if create_admin_user():
        sys.exit(0)
    else:
        sys.exit(1)