"use client";

import { MessageCircle } from "lucide-react";

export function ProductReviews() {
  return (
    <section id="reviews" className="bg-slate-50 py-20 dark:bg-slate-900/55">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Customer reviews
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Verified buyer reviews will appear after customer feedback is collected.
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">No verified reviews yet</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
              Only reviews submitted through a post-purchase flow will be shown here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
