function ProductCardPlaceholder() {
  return (
    <div className="w-[min(84vw,22rem)] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03] sm:w-[21rem]">
      <div className="aspect-[5/4] animate-pulse bg-slate-200 dark:bg-white/10" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  );
}

export function CatalogLoadingSkeleton() {
  return (
    <section className="bg-white py-7 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        <div className="mt-6 flex gap-5 overflow-hidden pb-4">
          <ProductCardPlaceholder />
          <ProductCardPlaceholder />
          <ProductCardPlaceholder />
        </div>
        <div className="mt-8 border-t border-slate-200 pt-7 dark:border-white/10">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-6 flex gap-5 overflow-hidden pb-4">
            <ProductCardPlaceholder />
            <ProductCardPlaceholder />
          </div>
        </div>
      </div>
    </section>
  );
}
