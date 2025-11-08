/**
 * Admin User Setup Script
 * 
 * This script creates an admin user with predefined credentials.
 * Run this script once to set up the initial admin account.
 * 
 * Usage: npx tsx scripts/setup-admin.ts
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config';

const ADMIN_EMAIL = 'admin@masseurfriend.com';
const ADMIN_PASSWORD = 'admin123';

async function setupAdmin() {
  console.log('🔧 Setting up admin user...\n');

  try {
    // Initialize Firebase
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    console.log('📧 Creating admin account...');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}\n`);

    // Create the admin user
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log('✅ Admin user created successfully!');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️  Admin user already exists.');
        console.log('   If you need to reset the password, use the Firebase Console.');
        return;
      }
      throw error;
    }

    const user = userCredential.user;

    // Create the user document in Firestore with admin privileges
    console.log('📄 Creating admin user document in Firestore...');
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
      id: user.uid,
      email: ADMIN_EMAIL,
      tier: 'platinum', // Give admin the highest tier
      status: 'active',
      revenue: 0,
      isAdmin: true, // Mark as admin
      createdAt: new Date().toISOString(),
    });

    console.log('✅ Admin user document created successfully!\n');
    console.log('🎉 Admin setup complete!');
    console.log('\nYou can now log in with:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}\n`);

  } catch (error: any) {
    console.error('❌ Error setting up admin user:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
