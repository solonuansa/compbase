export function SkeletonHero() {
  return (
    <section className="rounded-[1.55rem] px-1 py-6 md:px-2 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="space-y-3">
          <span className="skeleton h-3 w-20 rounded-full" />
          <h1 className="skeleton h-[clamp(2.6rem,5vw,4.4rem)] w-[70%] rounded-[0.6rem]" />
          <div className="space-y-2">
            <span className="skeleton h-4 w-full max-w-2xl" />
            <span className="skeleton h-4 w-[65%] max-w-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
          <span className="skeleton h-20 rounded-[1.1rem]" />
          <span className="skeleton h-20 rounded-[1.1rem]" />
          <span className="skeleton h-20 rounded-[1.1rem]" />
        </div>
      </div>
    </section>
  );
}

export function SkeletonFilter() {
  return (
    <section className="rounded-[1.5rem] border border-white/[0.04] bg-white/[0.018] p-4 md:p-5">
      <div className="flex flex-wrap gap-2">
        <span className="skeleton h-11 w-24 rounded-full" />
        <span className="skeleton h-11 w-32 rounded-full" />
        <span className="skeleton h-11 w-28 rounded-full" />
        <span className="skeleton h-11 w-24 rounded-full" />
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_auto]">
        <div className="grid gap-2">
          <span className="skeleton h-4 w-16" />
          <span className="skeleton h-12 rounded-[1.05rem]" />
        </div>
        <div className="grid gap-2">
          <span className="skeleton h-4 w-24" />
          <span className="skeleton h-12 rounded-[1.05rem]" />
        </div>
        <div className="grid gap-2">
          <span className="skeleton h-4 w-14" />
          <span className="skeleton h-12 rounded-[1.05rem]" />
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <span className="skeleton h-12 min-w-24 flex-1 rounded-[1.05rem] sm:flex-none sm:min-w-28" />
          <span className="skeleton h-12 min-w-16 flex-1 rounded-[1.05rem] sm:flex-none sm:min-w-20" />
        </div>
      </div>
    </section>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.035] p-3.5 md:p-[1.125rem]">
      <div className="flex items-center justify-between gap-3">
        <span className="skeleton h-7 w-24 rounded-full" />
        <span className="skeleton h-7 w-7 rounded-full" />
      </div>
      <div className="mt-5 space-y-1.5">
        <span className="skeleton h-4 w-32" />
        <span className="skeleton h-7 w-full" />
      </div>
      <div className="mt-5 grid gap-3 pt-0.5">
        <div className="grid gap-1">
          <span className="skeleton h-3 w-28" />
          <span className="skeleton h-5 w-24" />
        </div>
        <div className="grid gap-1">
          <span className="skeleton h-3 w-20" />
          <span className="skeleton h-5 w-36" />
        </div>
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <span className="skeleton h-3 w-20" />
          <span className="skeleton h-5 w-16" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between pt-0">
        <span className="skeleton h-4 w-20" />
        <span className="skeleton h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 text-center sm:text-left">
        <div className="w-full sm:w-auto">
          <span className="skeleton h-3 w-20 rounded-full" />
          <h2 className="skeleton mt-2 h-8 w-[280px] rounded-[0.5rem]" />
        </div>
        <span className="skeleton h-4 w-[240px]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
