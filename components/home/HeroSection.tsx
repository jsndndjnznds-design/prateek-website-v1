import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storefrontContent } from "@/data/storefront-content";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950">
      <div className="holo-grid pointer-events-none absolute inset-0 opacity-15 dark:opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              {storefrontContent.hero.eyebrow}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {storefrontContent.hero.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="hidden h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:inline-flex dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {storefrontContent.hero.primaryAction}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
