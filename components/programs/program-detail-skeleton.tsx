import { SurfaceCard } from "@/components/ui/dashboard";
import { FLUID_PAGE_X } from "@/lib/dashboard/fluid-spacing";
import { cn } from "@/lib/utils";

function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-surface-raised ${className}`}
      aria-hidden
    />
  );
}

function CompactGridSkeleton() {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <Shimmer className="h-3 w-16" />
          <Shimmer className="mt-1.5 h-4 w-14" />
        </div>
      ))}
    </dl>
  );
}

function FeaturedSummarySkeleton() {
  return (
    <section>
      <Shimmer className="h-4 w-32" />
      <Shimmer className="mt-2 h-4 w-72 max-w-full" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Shimmer className="h-24 rounded-xl" />
        <Shimmer className="h-24 rounded-xl" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </section>
  );
}

function VersionTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-card">
      <div className="flex gap-4 border-b border-card-border bg-surface/50 px-4 py-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-3 w-14 shrink-0" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, row) => (
        <div
          key={row}
          className="flex gap-4 border-b border-card-border px-4 py-3 last:border-b-0"
        >
          {Array.from({ length: 6 }).map((_, col) => (
            <Shimmer key={col} className="h-4 w-12 shrink-0" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProgramDetailSkeleton() {
  return (
    <SurfaceCard
      variant="embedded"
      aria-busy="true"
      aria-label="Loading program details"
    >
      <div
        className={cn(
          "flex flex-col gap-4 border-b border-accent/10 bg-accent-soft/40 py-5 sm:flex-row sm:items-center sm:justify-between",
          FLUID_PAGE_X,
        )}
      >
        <div className="min-w-0 flex-1">
          <Shimmer className="h-8 w-64 max-w-full sm:h-9" />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-7 w-16 rounded-full" />
          </div>
        </div>
        <Shimmer className="h-10 w-28 shrink-0 rounded-lg" />
      </div>

      <section className={cn("border-b border-card-border/60 py-4", FLUID_PAGE_X)}>
        <Shimmer className="h-3 w-24" />
        <Shimmer className="mt-1 h-3 w-56 max-w-full" />
        <div className="mt-4">
          <CompactGridSkeleton />
        </div>
      </section>

      <section className={cn("py-6", FLUID_PAGE_X)}>
        <FeaturedSummarySkeleton />
      </section>

      <section className={cn("bg-surface py-5", FLUID_PAGE_X)}>
        <Shimmer className="h-3 w-28" />
        <Shimmer className="mt-1 h-3 w-64 max-w-full" />
        <div className="mt-4">
          <VersionTableSkeleton />
        </div>
      </section>
    </SurfaceCard>
  );
}
