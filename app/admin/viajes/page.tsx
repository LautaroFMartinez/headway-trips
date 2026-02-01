import { Suspense } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { TripsManagement } from '@/components/admin/trips-management';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Gestión de Viajes | Admin - Headway Trips',
  robots: 'noindex, nofollow',
};

export default function AdminViajesPage() {
  return (
    <AdminShell>
      <Suspense fallback={<TripsTableSkeleton />}>
        <TripsManagement />
      </Suspense>
    </AdminShell>
  );
}

function TripsTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b flex items-center gap-4">
            <Skeleton className="h-16 w-24 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
