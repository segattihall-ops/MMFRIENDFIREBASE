# Admin Setup Script

This directory contains administrative scripts for setting up and managing the application.

## Setup Admin User

The `setup-admin.ts` script creates an initial admin user with the following credentials:

- **Email**: admin@masseurfriend.com
- **Password**: admin123
- **Tier**: Platinum
- **Admin Access**: Yes

### Usage

Run the script using:

```bash
npm run setup:admin
```

Or directly with tsx:

```bash
npx tsx scripts/setup-admin.ts
```

### What it does

1. Creates a Firebase Authentication user with the admin email and password
2. Creates a Firestore user document with admin privileges
3. Sets the user tier to "platinum" for full feature access
4. Marks the user as an admin with the `isAdmin` flag

### Notes

- The script will notify you if the admin user already exists
- If you need to reset the admin password, use the Firebase Console or the password reset functionality in the app
- Make sure your Firebase configuration is properly set up before running this script
- The script uses the Firebase configuration from `src/firebase/config.ts`

### Security Considerations

- **Important**: Change the default admin password after first login
- Store admin credentials securely
- Consider implementing additional authentication methods (2FA) for admin accounts in production
