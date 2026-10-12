/* Loading skeleton */
export function ProgramDetailsSkeleton() {
  return (
    <section
      aria-label="Loading program details"
      aria-busy="true"
      className="animate-pulse space-y-6"
    >
      {/* Cover skeleton */}
      <div className="w-full max-w-123 md:w-1/2">
        <div className="aspect-492/404 w-full rounded-xl bg-foreground/6" />
      </div>

      {/* Heading skeleton */}
      <div>
        <div className="flex gap-2">
          <div className="h-7 w-28 rounded-md bg-foreground/8" />
          <div className="h-7 w-20 rounded-md bg-foreground/8" />
        </div>

        <div className="mt-4 h-8 w-3/4 max-w-md rounded-md bg-foreground/8 sm:h-9" />

        <div className="mt-4 space-y-2">
          <div className="h-3 w-full max-w-2xl rounded bg-foreground/6" />
          <div className="h-3 w-4/5 max-w-xl rounded bg-foreground/6" />
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex flex-wrap gap-2 border-y border-foreground/10 py-4">
        <div className="h-10 w-32 rounded-lg bg-foreground/8" />
        <div className="h-10 w-28 rounded-lg bg-foreground/8" />
        <div className="h-10 w-28 rounded-lg bg-foreground/8" />
      </div>

      {/* Details skeleton */}
      <div>
        <div className="h-6 w-36 rounded bg-foreground/8" />
        <div className="mt-2 h-4 w-64 max-w-full rounded bg-foreground/6" />

        <div className="mt-4 grid grid-cols-1 divide-y divide-foreground/10 border-y border-foreground/10 sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0 lg:grid-cols-3 lg:gap-x-10">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="space-y-3 py-5">
              <div className="h-3 w-28 rounded bg-foreground/6" />
              <div className="h-4 w-36 max-w-full rounded bg-foreground/8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
