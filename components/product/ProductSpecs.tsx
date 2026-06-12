import { CheckCircle2 } from "lucide-react";
import { Product } from "@/types";

export function ProductSpecs({ product }: { product: Product }) {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            Details
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
            Everything needed for a premium installation.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{product.description}</p>
          <div className="mt-6 grid gap-3">
            {product.included.map((item) => (
              <span key={item} className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
          {product.specifications.map((spec) => (
            <div
              key={spec.label}
              className="grid grid-cols-[0.86fr_1.14fr] border-b border-slate-200 last:border-b-0 dark:border-white/10"
            >
              <div className="bg-slate-50 p-4 text-sm font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-300">
                {spec.label}
              </div>
              <div className="p-4 text-sm text-slate-600 dark:text-slate-400">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
