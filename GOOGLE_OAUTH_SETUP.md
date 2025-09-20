# Google OAuth Authentication Setup Guide

## Overview

This guide will help you set up Google OAuth authentication for the Fruitful Global Master Hub. The integration has been configured to work alongside the existing Replit authentication system, providing users with multiple sign-in options.

## Prerequisites

✅ **Completed Integration Components:**
- Google OAuth backend authentication strategy configured
- Frontend Google Sign-In buttons implemented
- Session management updated to support both Replit and Google auth
- Environment variable configuration prepared

## Setup Instructions

### Step 1: Add Google OAuth Credentials as Replit Secrets

⚠️ **SECURITY NOTE**: This guide uses placeholder values for all credentials. You must obtain your own Google OAuth credentials from Google Cloud Console and add them as Replit secrets. Never commit real credentials to your repository.

To set up Google OAuth authentication, follow these steps to add your credentials as Replit secrets:

#### 1.1 Open Replit Secrets Manager
1. In your Replit workspace, look for the **Secrets** tab (🔒) in the left sidebar
2. If not visible, click on **Tools** → **Secrets**

#### 1.2 Add the Required Secrets
Add the following three secrets exactly as shown:

**Secret 1:**
- **Key:** `GOOGLE_CLIENT_ID`
- **Value:** `your-google-client-id.apps.googleusercontent.com`

**Secret 2:**
- **Key:** `GOOGLE_CLIENT_SECRET`
- **Value:** `GOCSPX-your-google-client-secret`

**Secret 3:**
- **Key:** `GOOGLE_PROJECT_ID`
- **Value:** `your-google-project-id`

#### 1.3 Verify Secrets
After adding all secrets, verify they appear in your Secrets list:
- ✅ GOOGLE_CLIENT_ID
- ✅ GOOGLE_CLIENT_SECRET  
- ✅ GOOGLE_PROJECT_ID

### Step 2: Restart the Application

After adding the secrets:
1. Go to the **Shell** tab in Replit
2. Press `Ctrl+C` to stop the current application (if running)
3. Run `npm run dev` to restart with the new environment variables
4. The application will automatically detect the Google OAuth credentials

### Step 3: Verify Google OAuth Integration

#### 3.1 Check the Landing Page
1. Open your application in the browser
2. You should see **two authentication options**:
   - "Sign In with Replit" (existing option)
   - "Sign In with Google" (new option)

#### 3.2 Test Google Authentication Flow
1. Click "Sign In with Google" 
2. You should be redirected to Google's OAuth consent screen
3. Sign in with your Google account
4. Grant permissions for the application
5. You should be redirected back to the dashboard

## Technical Implementation Details

### Authentication Flow

```mermaid
graph TD
    A[User clicks "Sign In with Google"] --> B[Redirect to /api/auth/google]
    B --> C[Google OAuth consent screen]
    C --> D[User grants permission]
    D --> E[Google redirects to /api/auth/google/callback]
    E --> F[Backend processes Google profile]
    F --> G[User record created/updated in database]
    G --> H[Session established]
    H --> I[Redirect to dashboard]
```

### Backend Changes Made

1. **Added Google OAuth Strategy** (`server/replitAuth.ts`):
   - Imported `passport-google-oauth20` strategy
   - Configured Google OAuth with environment variables
   - Added user mapping function for Google profiles
   - Updated authentication middleware to handle both auth types

2. **New API Routes**:
   - `GET /api/auth/google` - Initiates Google OAuth flow
   - `GET /api/auth/google/callback` - Handles OAuth callback

3. **Session Management**:
   - Updated `isAuthenticated` middleware to support Google auth
   - Google users don't use token refresh (managed by Google)
   - Existing Replit auth functionality preserved

### Frontend Changes Made

1. **Landing Page Updates** (`client/src/pages/landing.tsx`):
   - Added Google Sign-In buttons with proper styling
   - Implemented `handleGoogleLogin()` function
   - Added Google icon from react-icons/si
   - Responsive design for both authentication options

2. **User Experience**:
   - Clear visual distinction between auth methods
   - Consistent styling with existing design
   - Proper test IDs for automated testing

### Database Schema

No database schema changes were required. Google users are stored in the existing `users` table with:
- `id`: Prefixed with `google_` (e.g., `google_123456789`)
- `email`: From Google profile
- `firstName`: From Google profile  
- `lastName`: From Google profile
- `profileImageUrl`: From Google profile picture

### Security Considerations

1. **Environment Variables**: Credentials stored as Replit secrets (encrypted)
2. **OAuth Scope**: Limited to `profile` and `email` only
3. **Session Management**: Same secure session handling as Replit auth
4. **User Isolation**: Google and Replit users are properly isolated by ID prefix

## Testing Checklist

### ✅ Pre-Authentication Testing
- [ ] Landing page loads correctly
- [ ] Both authentication buttons are visible
- [ ] Google button has proper styling and icon
- [ ] Responsive design works on different screen sizes

### ✅ Google OAuth Flow Testing
- [ ] Click "Sign In with Google" redirects to Google
- [ ] Google consent screen appears
- [ ] After consent, redirected back to application
- [ ] User is logged in and sees dashboard
- [ ] User profile information is correctly populated

### ✅ Session Management Testing
- [ ] Google authenticated users stay logged in on refresh
- [ ] API calls work correctly with Google auth
- [ ] Logout functionality works for Google users
- [ ] No conflicts between Replit and Google sessions

### ✅ Integration Testing
- [ ] Can switch between Replit and Google auth
- [ ] Both auth methods can be used on same device
- [ ] User data is properly isolated between auth types

## Troubleshooting

### Common Issues

#### Issue: "Google OAuth not configured" error
**Solution:** Verify all three environment variables are set in Replit Secrets

#### Issue: Redirect URI mismatch
**Solution:** Ensure your current Replit domain matches the authorized origins in Google Cloud Console

#### Issue: Google Sign-In button not working
**Solution:** Check browser console for errors, verify environment variables are loaded

#### Issue: Users not being created in database
**Solution:** Check server logs for database connection errors

### Verification Commands

Run these in the Replit Shell to verify setup:

```bash
# Check if environment variables are loaded
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:0:10}..."
echo "GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:0:10}..."

# Check if Google OAuth routes are working
curl -I http://localhost:5000/api/auth/google
```

### Expected Success Indicators

✅ **Environment Variables Loaded:**
- Google OAuth secrets appear in process.env
- No "credentials not configured" warnings in logs

✅ **Routes Configured:**
- `/api/auth/google` returns 302 redirect
- `/api/auth/google/callback` is accessible

✅ **Frontend Integration:**
- Google button appears on landing page
- Click triggers redirect to Google OAuth

## Domain Configuration

### Current Setup
- **Authorized Domain:** Your current Replit domain (e.g., `https://your-repl-id.picard.replit.dev`)
- **Callback URL:** `/api/auth/google/callback`

### If Domain Changes
If your Replit domain changes, you may need to update the authorized origins in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Google Cloud project
3. Navigate to **APIs & Services** → **Credentials**
4. Find the OAuth 2.0 Client ID
5. Add new authorized origins if needed

## Support

If you encounter issues:
1. Check the application logs in Replit console
2. Verify all secrets are properly set
3. Test with a fresh browser session
4. Check Google Cloud Console for any OAuth errors

The integration is designed to be robust and fail gracefully - if Google OAuth is not configured, users can still use Replit authentication.