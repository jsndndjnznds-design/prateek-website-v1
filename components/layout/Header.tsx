"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { product } from "@/data/product";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/product/hologram-fan-display", label: "Product" },
  { href: "/cart", label: "Cart" },
  { href: "/admin", label: "Admin" },
];

const searchableItems = [
  { label: product.name, detail: "Product details and buying options", href: "/product/hologram-fan-display" },
  { label: "Customer reviews", detail: "Verified buyer feedback", href: "/product/hologram-fan-display#reviews" },
  { label: "Shipping and installation", detail: "Pan-India delivery and setup support", href: "/product/hologram-fan-display#shipping" },
  { label: "Cart", detail: "Review items and checkout", href: "/cart" },
  { label: "Admin dashboard", detail: "Orders, revenue, and analytics", href: "/admin" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return searchableItems.slice(0, 3);
    return searchableItems.filter((item) =>
      `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/78 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/76">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-cyan-500/20 transition group-hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-tight text-slate-950 dark:text-white">
              HoloVista
            </span>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              Pro display systems
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/70 p-1 shadow-sm dark:border-white/10 dark:bg-white/5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                pathname === item.href && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white dark:bg-white dark:text-slate-950",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-[260px] max-w-sm flex-1 justify-end lg:flex">
          <div className="group relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setQuery((value) => value)}
              placeholder="Search store"
              className="h-11 w-full rounded-full border border-slate-200 bg-white/80 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            <div className="invisible absolute right-0 top-[3.25rem] w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl shadow-slate-950/10 transition group-focus-within:visible group-focus-within:opacity-100 dark:border-white/10 dark:bg-slate-900">
              {results.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 transition hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <span className="block text-sm font-semibold text-slate-950 dark:text-white">{item.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{item.detail}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:shadow-black/20"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-cyan-400 px-1 text-[11px] font-bold text-slate-950">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm shadow-slate-200/60 lg:hidden dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden">
          <div className="ml-auto h-full w-full max-w-sm border-l border-white/10 bg-white p-5 shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-950 dark:text-white">Menu</span>
              <button
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 dark:border-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-slate-200 p-3 dark:border-white/10">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search store"
                  className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none dark:border-white/10 dark:bg-white/5"
                />
              </div>
              <div className="mt-3 space-y-1">
                {results.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-2xl px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
