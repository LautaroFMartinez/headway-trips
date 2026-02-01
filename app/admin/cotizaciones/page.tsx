import { Suspense } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { QuotesManagement } from '@/components/admin/quotes-management';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Cotizaciones | Admin - Headway Trips',
  robots: 'noindex, nofollow',
};

export default function AdminCotizacionesPage() {
  return (
    <AdminShell>
      <Suspense fallback={<QuotesTableSkeleton />}>
        <QuotesManagement />
      </Suspense>
    </AdminShell>
  );
}

function QuotesTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-lg">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
