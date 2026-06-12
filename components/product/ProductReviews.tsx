"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { reviews } from "@/data/mock";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils";

const filters = ["All", "5 star", "4 star", "Retail", "Events", "Hospitality", "Showroom"];

export function ProductReviews() {
  const [filter, setFilter] = useState("All");

  const filteredReviews = useMemo(() => {
    if (filter === "All") return reviews;
    if (filter === "5 star") return reviews.filter((review) => review.rating === 5);
    if (filter === "4 star") return reviews.filter((review) => review.rating === 4);
    return reviews.filter((review) => review.useCase === filter);
  }, [filter]);

  const fiveStar = reviews.filter((review) => review.rating === 5).length;
  const fourStar = reviews.filter((review) => review.rating === 4).length;

  return (
    <section id="reviews" className="bg-slate-50 py-20 dark:bg-slate-900/55">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Customer reviews
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              50 realistic buyer reviews with verified business use cases.
            </h2>
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <Rating value={4.8} count={reviews.length} size="md" />
              <div className="mt-6 space-y-3">
                {[
                  ["5 star", fiveStar, "w-[88%]"],
                  ["4 star", fourStar, "w-[12%]"],
                ].map(([label, count, width]) => (
                  <div key={label as string} className="grid grid-cols-[64px_1fr_32px] items-center gap-3 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{label}</span>
                    <span className="h-2 rounded-full bg-slate-100 dark:bg-white/10">
                      <span className={cn("block h-full rounded-full bg-amber-400", width as string)} />
                    </span>
                    <span className="text-right font-medium text-slate-700 dark:text-slate-300">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={cn(
                    "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition",
                    filter === item
                      ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="grid gap-4">
              {filteredReviews.slice(0, 8).map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Rating value={review.rating} size="xs" />
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {review.useCase}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">{review.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{review.body}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm dark:border-white/10">
                    <span className="font-semibold text-slate-950 dark:text-white">
                      {review.customerName}
                      <span className="font-normal text-slate-500 dark:text-slate-400">, {review.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <MessageCircle className="h-4 w-4" />
                      {review.helpful} helpful
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
