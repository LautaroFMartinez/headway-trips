import { Suspense } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { BookingsManagement } from '@/components/admin/bookings-management';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Gestión de Reservas | Admin - Headway Trips',
  robots: 'noindex, nofollow',
};

export default function AdminReservasPage() {
  return (
    <AdminShell>
      <Suspense fallback={<BookingsTableSkeleton />}>
        <BookingsManagement />
      </Suspense>
    </AdminShell>
  );
}

function BookingsTableSkeleton() {
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
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
