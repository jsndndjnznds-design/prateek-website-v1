import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storefrontContent } from "@/data/storefront-content";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950">
      <div className="holo-grid pointer-events-none absolute inset-0 opacity-25 dark:opacity-15" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            {storefrontContent.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            {storefrontContent.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            {storefrontContent.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {storefrontContent.hero.primaryAction}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#products" className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-cyan-700 dark:text-slate-200 dark:decoration-white/20 dark:hover:text-cyan-300">
              {storefrontContent.hero.secondaryAction}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
