import Link from "next/link";
import { storefrontContent } from "@/data/storefront-content";

export function PolicyPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="min-h-[70vh] bg-slate-50 py-12 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">Store policy</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">{title}</h1>
        <div className="mt-8 rounded-3xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-400/30 dark:bg-amber-400/5">
          <p className="font-semibold text-slate-950 dark:text-white">Owner action required before production</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{storefrontContent.legal.publicationNotice}</p>
        </div>
        <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Policy details</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{description}</p>
          <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">Replace this text with the store’s real policy, including any applicable contact, fulfilment, eligibility, timing, and refund information. Do not publish it unchanged.</p>
        </article>
        <Link href="/contact" className="mt-8 inline-flex text-sm font-semibold text-cyan-700 underline underline-offset-4 dark:text-cyan-300">Contact the store</Link>
      </div>
    </section>
  );
}
