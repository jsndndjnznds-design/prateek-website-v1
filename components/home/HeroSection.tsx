"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { storefrontContent } from "@/data/storefront-content";
import { Product } from "@/types";

export function HeroSection({ product }: { product: Product | null }) {
  const heroImage = product?.images[0]?.src ?? "/images/hologram-fan-hero.svg";
  const heroAlt = product?.images[0]?.alt ?? "HoloVista holographic display";

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950">
      <div className="holo-grid pointer-events-none absolute inset-0 opacity-40 dark:opacity-25" />
      <div className="mx-auto grid min-h-[34rem] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
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
              href="#products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {storefrontContent.hero.primaryAction}
              <ArrowDown className="h-4 w-4" />
            </Link>
            {product ? (
              <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-cyan-700 dark:text-slate-200 dark:decoration-white/20 dark:hover:text-cyan-300">
                View featured product
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
            <Image
              src={heroImage}
              alt={heroAlt}
              width={1400}
              height={980}
              priority
              className="aspect-[5/4] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
