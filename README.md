
# MasseurPro - Firebase Application

A Next.js application with Firebase authentication, featuring user management, password reset functionality, and admin capabilities.

## Features

- 🔐 **Authentication**: Email/password, Google, and Apple sign-in
- 🔑 **Password Reset**: Self-service password reset via email
- 👤 **Admin User Management**: Dedicated admin user with elevated permissions
- 🎨 **Modern UI**: Built with Radix UI components and Tailwind CSS
- 🚀 **Next.js 15**: Latest Next.js with Turbopack for fast development

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Update `src/firebase/config.ts` with your Firebase project credentials (already configured)

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`

### Build for Production

```bash
npm run build
npm start
```

## New Features

### Password Reset

Users can now reset their passwords via the login screen:

1. Click "Forgot Password?" on the login page
2. Enter your email address
3. Receive a password reset email
4. Click the link in the email to set a new password

**Implementation Details:**
- Modal-based UI for password reset
- Firebase `sendPasswordResetEmail` integration
- User-friendly error messages
- Auto-closing modal after successful submission

### Admin User Setup

An admin user can be created with predefined credentials:

**Admin Credentials:**
- Email: `admin@masseurfriend.com`
- Password: `admin123`

**To create the admin user:**

```bash
npm run setup:admin
```

**Admin Features:**
- Platinum tier access (full feature set)
- Access to admin dashboard
- Admin-only navigation items
- Elevated permissions in Firestore

**Security Note:** Change the default admin password immediately after first login.

### Dashboard Access

The dashboard is now properly secured with authentication:

- Unauthenticated users are redirected to login
- Authenticated users can access the dashboard
- Protected routes use the `withAuth` HOC
- Automatic navigation after login

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── login/             # Login page
│   │   ├── dashboard/         # Dashboard (protected)
│   │   └── page.tsx           # Root page (redirects)
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── PasswordResetModal.tsx
│   │   │   └── withAuth.tsx   # Auth HOC
│   │   ├── admin/             # Admin-only components
│   │   └── ui/                # Reusable UI components
│   ├── firebase/              # Firebase configuration & utilities
│   │   ├── config.ts          # Firebase config
│   │   ├── index.ts           # Firebase initialization
│   │   ├── non-blocking-login.tsx  # Auth functions
│   │   └── provider.tsx       # Firebase context provider
│   └── lib/
│       └── types.ts           # TypeScript types
├── scripts/
│   ├── setup-admin.ts         # Admin setup script
│   └── README.md              # Scripts documentation
├── TESTING.md                 # Testing guide
└── FIREBASE_AUTH_SETUP.md     # Firebase auth documentation
```

## Authentication Flow

1. **Sign Up**: Users create an account with email/password or OAuth providers
2. **Sign In**: Users authenticate and receive a Firebase auth token
3. **Session Management**: Firebase handles session persistence
4. **Protected Routes**: `withAuth` HOC guards dashboard and admin routes
5. **Sign Out**: Users can sign out to clear their session

## User Roles

### Regular Users
- Tier: Free (default) or upgraded tiers
- Access to standard features
- Personal dashboard

### Admin Users
- Tier: Platinum
- `isAdmin: true` flag in Firestore
- Access to admin dashboard
- User management capabilities

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run setup:admin` - Create admin user

## Testing

See [TESTING.md](./TESTING.md) for comprehensive testing instructions.

## Documentation

- [Firebase Auth Setup](./FIREBASE_AUTH_SETUP.md) - Detailed Firebase authentication guide
- [Scripts Documentation](./scripts/README.md) - Admin and utility scripts
- [Testing Guide](./TESTING.md) - How to test all features

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **AI Integration**: Google Genkit (optional)

## Security

- All authentication routes are protected
- Password reset uses Firebase secure email flow
- Admin credentials should be changed after initial setup
- Firestore security rules enforce user-level permissions
- No sensitive data in client-side code

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private repository - All rights reserved

## Support

For issues or questions, contact: masseurpro@xrankflow.com
