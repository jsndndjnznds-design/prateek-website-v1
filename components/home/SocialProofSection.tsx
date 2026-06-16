import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Headphones, PackageCheck, ShieldCheck } from "lucide-react";

const assuranceCards = [
  {
    title: "Checkout-backed orders",
    body: "Every completed order is written to the order system before confirmation.",
    icon: PackageCheck,
  },
  {
    title: "Installation follow-up",
    body: "Shipping and setup details are captured with the order for handoff.",
    icon: Headphones,
  },
  {
    title: "Clear payment record",
    body: "Payment method, amount, quantity, and customer details stay attached to the order.",
    icon: ShieldCheck,
  },
];

export function SocialProofSection() {
  return (
    <AnimatedSection className="bg-slate-50 py-20 dark:bg-slate-900/55">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Buyer assurance
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Built for teams that need a clean path from product interest to confirmed order.
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-3xl font-semibold text-slate-950 dark:text-white">Live</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Checkout records after every saved order</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {assuranceCards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/8 dark:border-white/10 dark:bg-white/5"
            >
              <card.icon className="h-5 w-5 text-cyan-500" />
              <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
