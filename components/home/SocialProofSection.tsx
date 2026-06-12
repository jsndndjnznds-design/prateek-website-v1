import { reviews } from "@/data/mock";
import { product } from "@/data/product";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Rating } from "@/components/ui/Rating";

const featuredReviews = reviews.slice(0, 3);

export function SocialProofSection() {
  return (
    <AnimatedSection className="bg-slate-50 py-20 dark:bg-slate-900/55">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Social proof
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Built for teams that need attention without looking gimmicky.
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <Rating value={product.rating} count={product.reviewCount} size="md" />
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Average verified buyer rating</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {featuredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/8 dark:border-white/10 dark:bg-white/5"
            >
              <Rating value={review.rating} size="xs" />
              <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{review.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{review.body}</p>
              <div className="mt-6 border-t border-slate-200 pt-4 dark:border-white/10">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{review.customerName}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {review.role}, {review.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
