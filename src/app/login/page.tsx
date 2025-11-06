'use client';

import { useState, useEffect } from 'react';
import LoginScreen from '@/components/auth/LoginScreen';
import withAuth from '@/components/auth/withAuth';

function LoginPage() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return <LoginScreen darkMode={darkMode} setDarkMode={setDarkMode} />;
}

// Wrap with withAuth and set 'public' to true
export default withAuth(LoginPage, { public: true });
