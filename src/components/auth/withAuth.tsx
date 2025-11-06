'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface WithAuthOptions {
  public?: boolean; // If true, allows access even if not authenticated
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const AuthComponent = (props: P) => {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user && !options.public) {
          // If not loading, not logged in, and not a public route, redirect to login
          router.replace('/login');
        } else if (user && options.public) {
          // If logged in and trying to access a public-only route (like login), redirect to dashboard
          router.replace('/dashboard');
        }
      }
    }, [user, isLoading, router]);

    // Show a loading screen while auth state is being determined
    if (isLoading || (!user && !options.public) || (user && options.public)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
    // If we've passed all checks, render the component
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
