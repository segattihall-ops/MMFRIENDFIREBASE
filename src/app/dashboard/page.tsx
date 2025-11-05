'use client';

import MasseurProApp from '@/components/MasseurProApp';
import withAuth from '@/components/auth/withAuth';

function DashboardPage() {
  return <MasseurProApp />;
}

export default withAuth(DashboardPage);
