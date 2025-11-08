# Testing Guide

This document provides instructions for testing the new features implemented in this repository.

## Features to Test

### 1. Password Reset Functionality

#### Test Steps:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the login page:**
   - Open your browser and go to `http://localhost:9002/login`

3. **Test the "Forgot Password" link:**
   - Click on the "Forgot Password?" link in the login form
   - A modal should appear titled "Reset Password"

4. **Test password reset flow:**
   - Enter a valid email address (e.g., `test@masseurfriend.com`)
   - Click "Send Reset Link"
   - Verify that a success toast notification appears
   - Check the email inbox for the password reset email from Firebase

5. **Test validation:**
   - Try submitting without entering an email - button should be disabled
   - Try entering an invalid email - appropriate error should be shown
   - Try entering a non-existent email - appropriate error message should be shown

6. **Test modal close:**
   - Click the "Cancel" button to close the modal
   - Click outside the modal to close it
   - Verify the modal closes properly and state is reset

### 2. Admin User Setup

#### Test Steps:

1. **Run the admin setup script:**
   ```bash
   npm run setup:admin
   ```

2. **Verify output:**
   - Script should show: "✅ Admin user created successfully!"
   - Or: "ℹ️ Admin user already exists." if it was already created

3. **Test admin login:**
   - Navigate to `http://localhost:9002/login`
   - Enter credentials:
     - Email: `admin@masseurfriend.com`
     - Password: `admin123`
   - Click "Sign In"

4. **Verify admin access:**
   - After successful login, you should be redirected to the dashboard
   - The admin tab should be accessible in the navigation
   - Click on the "Admin" tab to verify admin-only features are available

5. **Verify admin user properties:**
   - Open browser console
   - Check that the user has `isAdmin: true` in their user document
   - Check that the user has `tier: 'platinum'`

### 3. Dashboard Access

#### Test Steps:

1. **Test unauthenticated access:**
   - Navigate to `http://localhost:9002/dashboard` without logging in
   - Should be redirected to `/login`

2. **Test authenticated access:**
   - Log in with valid credentials
   - Should be redirected to `/dashboard` automatically
   - Dashboard should load without errors

3. **Test navigation from root:**
   - Navigate to `http://localhost:9002/`
   - If logged in, should redirect to `/dashboard`
   - If not logged in, should redirect to `/login`

4. **Test withAuth HOC:**
   - Verify that protected routes are properly guarded
   - Try accessing dashboard while logged out - should redirect
   - Log in and verify access is granted

### 4. Integration Tests

#### Test Complete User Flow:

1. **New User Sign Up:**
   - Go to login page
   - Click "Sign Up"
   - Enter email and password
   - Verify successful account creation
   - Verify redirect to dashboard

2. **Password Reset Flow:**
   - Log out
   - Click "Forgot Password?"
   - Enter email
   - Receive reset email
   - Click reset link
   - Set new password
   - Log in with new password

3. **Admin User Flow:**
   - Log in as admin
   - Access admin-only features
   - Verify platinum tier access
   - Test all admin capabilities

## Expected Results

### Password Reset:
- ✅ "Forgot Password?" link is visible on login screen
- ✅ Modal opens when link is clicked
- ✅ Email can be entered and validated
- ✅ Firebase sends password reset email
- ✅ Success/error toasts display appropriately
- ✅ Modal closes after successful submission

### Admin Setup:
- ✅ Admin user can be created via script
- ✅ Admin has credentials: admin@masseurfriend.com / admin123
- ✅ Admin user has isAdmin flag set to true
- ✅ Admin user has platinum tier
- ✅ Admin can access admin-only features

### Dashboard Access:
- ✅ Unauthenticated users are redirected to login
- ✅ Authenticated users can access dashboard
- ✅ Navigation flows work correctly
- ✅ No TypeScript or build errors

## Troubleshooting

### Password Reset Email Not Received:
- Check spam/junk folder
- Verify email address is correct
- Check Firebase Console > Authentication > Templates to ensure email template is configured
- Verify Firebase project has email authentication enabled

### Admin Setup Fails:
- Check Firebase configuration in `src/firebase/config.ts`
- Verify network connectivity to Firebase
- Check console for detailed error messages
- Ensure Firebase Authentication is enabled in Firebase Console

### Dashboard Not Loading:
- Check browser console for errors
- Verify user is authenticated (check Firebase auth state)
- Ensure user document exists in Firestore
- Check network tab for failed API requests

## Manual Verification Checklist

- [ ] Build completes without errors (`npm run build`)
- [ ] TypeScript compilation succeeds (`npm run typecheck`)
- [ ] Password reset modal displays correctly
- [ ] Password reset email is sent successfully
- [ ] Admin script creates admin user
- [ ] Admin can log in with correct credentials
- [ ] Admin has access to admin features
- [ ] Dashboard loads after successful login
- [ ] Routing logic works correctly
- [ ] All authentication flows work properly
- [ ] No console errors during normal operation

## Notes

- The Firebase configuration is already set up in `src/firebase/config.ts`
- No additional environment variables are required for basic functionality
- For email functionality, ensure Firebase email templates are configured
- Consider changing the default admin password after first login for security
