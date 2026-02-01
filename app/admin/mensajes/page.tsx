import { Suspense } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { MessagesManagement } from '@/components/admin/messages-management';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Mensajes | Admin - Headway Trips',
  robots: 'noindex, nofollow',
};

export default function AdminMensajesPage() {
  return (
    <AdminShell>
      <Suspense fallback={<MessagesTableSkeleton />}>
        <MessagesManagement />
      </Suspense>
    </AdminShell>
  );
}

function MessagesTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
