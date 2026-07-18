import Link from "next/link";
import { Mail, Phone, RotateCcw, Truck } from "lucide-react";

const footerLinks = [
  { label: "Shop", href: "/#products" },
  { label: "FAQ", href: "/#faq" },
  { label: "Cart", href: "/cart" },
  { label: "Account", href: "/login" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-950 dark:text-white">GlamShot</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
            A friendly online store for finding useful products and placing orders with confidence.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-cyan-500" />
              +1 (000) 000-0000
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-500" />
              support@glamshot.example
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Store
          </p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <Link
                href={link.href}
                key={link.label}
                className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
            <Truck className="h-5 w-5 text-cyan-500" />
            <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Clear shipping</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Shipping totals are shown before you place the order.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
            <RotateCcw className="h-5 w-5 text-emerald-500" />
            <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Easy returns</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Reach out to the store team with order or product questions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
