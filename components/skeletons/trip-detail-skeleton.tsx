export function TripDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-muted rounded animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="h-[50vh] md:h-[60vh] mt-20 bg-muted animate-pulse" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-24 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-40 bg-muted rounded animate-pulse" />
              <div className="grid sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-full bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
            <div className="bg-secondary rounded-2xl p-8">
              <div className="h-6 w-48 bg-muted rounded animate-pulse mb-4" />
              <div className="h-16 w-full bg-muted rounded animate-pulse mb-6" />
              <div className="h-[300px] bg-muted rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-full bg-muted rounded animate-pulse" />
                ))}
              </div>
              <div className="h-12 w-full bg-muted rounded-full animate-pulse" />
              <div className="h-12 w-full bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
