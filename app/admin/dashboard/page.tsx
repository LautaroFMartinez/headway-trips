import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/admin-shell';
import { DashboardContent } from '@/components/admin/dashboard-content';

export default async function AdminDashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/admin');
  }

  const adminName = user.fullName || user.firstName || 'Admin';
  const adminEmail = user.primaryEmailAddress?.emailAddress || '';

  return (
    <AdminShell adminName={adminName} adminEmail={adminEmail}>
      <DashboardContent />
    </AdminShell>
  );
}
