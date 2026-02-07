import { AdminShell } from '@/components/admin/admin-shell';
import { BlogsManagement } from '@/components/admin/blogs-management';

export default function AdminBlogPage() {
  return (
    <AdminShell>
      <BlogsManagement />
    </AdminShell>
  );
}
