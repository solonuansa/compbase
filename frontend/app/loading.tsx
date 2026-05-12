import { SkeletonHero, SkeletonFilter, SkeletonGrid } from "@/components/Skeleton";

export default function RootLoading() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-16rem] h-[34rem] w-[54rem] -translate-x-1/2 rounded-full bg-violet-300/10 blur-[130px]" />
        <div className="absolute left-[-14rem] top-[28%] h-[30rem] w-[30rem] rounded-full bg-indigo-400/10 blur-[145px]" />
        <div className="absolute right-[-12rem] top-[18%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-300/9 blur-[145px]" />
        <div className="absolute bottom-[10%] right-[6%] h-[24rem] w-[24rem] rounded-full bg-cyan-300/7 blur-[135px]" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 md:gap-6 md:py-8 lg:px-8">
        <SkeletonHero />

        <section className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <span className="skeleton h-5 w-[260px] rounded-full" />
              <span className="skeleton h-4 w-[340px]" />
            </div>
            <span className="skeleton h-12 w-52 rounded-full sm:w-56" />
          </div>
        </section>

        <SkeletonFilter />
        <SkeletonGrid />
      </main>
    </div>
  );
}
