"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Headphones, ShieldCheck, Truck } from "lucide-react";
import { product } from "@/data/product";
import { formatCurrency } from "@/lib/utils";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { Rating } from "@/components/ui/Rating";

const trustBadges = [
  { label: "Insured shipping", icon: Truck },
  { label: "12 month warranty", icon: ShieldCheck },
  { label: "Setup support", icon: Headphones },
  { label: "Verified reviews", icon: BadgeCheck },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ecfeff_48%,#ffffff_100%)] dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_56%,#020617_100%)]">
      <div className="holo-grid pointer-events-none absolute inset-0 opacity-80" />
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <motion.div
          initial={false}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-white/10 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {product.stock} units ready to ship this week
          </div>
          <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Premium 3D holographic fan display for retail launches, menus, events, and showroom advertising that people stop to film.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/product/hologram-fan-display"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-slate-950 px-7 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Shop {formatCurrency(product.price)}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#gallery"
              className="inline-flex h-[52px] items-center justify-center rounded-full border border-slate-300 bg-white/70 px-7 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              View installations
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Rating value={product.rating} count={product.reviewCount} />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Trusted by retailers, cafes, and event teams
            </span>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="rounded-2xl border border-slate-200 bg-white/72 p-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
              >
                <badge.icon className="mb-2 h-4 w-4 text-cyan-500" />
                {badge.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={false}
          className="relative z-10"
        >
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute inset-8 hero-orbit rounded-full border border-cyan-400/20" />
            <div className="absolute inset-16 hero-orbit rounded-full border border-fuchsia-400/20 [animation-direction:reverse]" />
            <Image
              src="/images/hologram-fan-hero.svg"
              alt={product.images[0].alt}
              width={1400}
              height={980}
              priority
              className="float-slow relative z-10 w-full drop-shadow-2xl"
            />
            <div className="glass-panel absolute bottom-5 left-4 right-4 z-20 grid gap-3 rounded-[1.75rem] p-4 sm:left-auto sm:right-6 sm:w-72">
              <CountdownTimer />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
