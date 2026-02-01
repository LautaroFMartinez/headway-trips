import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { AdminShell } from '@/components/admin/admin-shell';
import { DashboardContent } from '@/components/admin/dashboard-content';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin');
  }

  return (
    <AdminShell adminName={session.admin.name} adminEmail={session.admin.email}>
      <DashboardContent />
    </AdminShell>
  );
}
