import { Check, ShoppingBag, SquareArrowOutUpRight } from "lucide-react";
import { storefrontContent } from "@/data/storefront-content";

const icons = [SquareArrowOutUpRight, ShoppingBag, Check];

export function StorefrontInfoSection() {
  const { support } = storefrontContent;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-white/10 dark:bg-slate-900/40 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{support.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{support.title}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{support.description}</p>
        </div>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          {support.steps.map((step, index) => {
            const Icon = icons[index] ?? Check;

            return (
              <article key={step.title} className="border-t border-slate-300 pt-5 dark:border-white/15">
                <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
