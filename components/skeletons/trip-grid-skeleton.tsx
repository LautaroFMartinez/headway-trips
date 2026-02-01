export function TripGridSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="h-4 w-32 bg-muted rounded-full mx-auto mb-3 animate-pulse" />
          <div className="h-10 w-80 bg-muted rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-96 bg-muted rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Search skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-12 w-full max-w-md mx-auto bg-muted rounded-full animate-pulse" />
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                <div className="h-6 w-36 bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                  <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
