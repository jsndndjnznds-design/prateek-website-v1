export function LoadingSkeleton() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <div className="h-[520px] animate-pulse rounded-[2rem] bg-slate-200 dark:bg-white/10" />
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
        <div className="h-12 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-56 w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  );
}
