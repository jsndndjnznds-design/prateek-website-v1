"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, Sparkles, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { storefrontContent } from "@/data/storefront-content";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/admin", label: "Admin" },
];

const utilitySearchItems = [
  { label: "Product catalog", detail: "Browse current products", href: "/products" },
  { label: "Wishlist", detail: "Products saved for later", href: "/wishlist" },
  { label: "Cart", detail: "Review items and checkout", href: "/cart" },
  { label: "Admin dashboard", detail: "Orders, revenue, and analytics", href: "/admin" },
];

type StorefrontSearchProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  stock: number;
};

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<StorefrontSearchProduct[]>([]);
  const visibleNavItems = useMemo(() => navItems.filter((item) => item.href !== "/admin" || isAdmin), [isAdmin]);
  const desktopNavItems = useMemo(
    () => visibleNavItems.filter((item) => item.href !== "/wishlist" && item.href !== "/cart"),
    [visibleNavItems],
  );
  const visibleSearchableItems = useMemo(
    () => utilitySearchItems.filter((item) => item.href !== "/admin" || isAdmin),
    [isAdmin],
  );

  useEffect(() => {
    let active = true;

    async function loadSearchProducts() {
      const response = await fetch("/api/storefront/products", { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as { products?: StorefrontSearchProduct[] } | null;

      if (active && response.ok) {
        setProducts(data?.products ?? []);
      }
    }

    void loadSearchProducts();

    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    const productResults = products
      .filter((product) => !searchTerm || `${product.name} ${product.category} ${product.shortDescription}`.toLowerCase().includes(searchTerm))
      .slice(0, searchTerm ? 6 : 3)
      .map((product) => ({
        label: product.name,
        detail: `${product.category} · ${product.stock > 0 ? "In stock" : "Out of stock"}`,
        href: `/product/${product.slug}`,
      }));
    const utilityResults = visibleSearchableItems.filter(
      (item) => !searchTerm || `${item.label} ${item.detail}`.toLowerCase().includes(searchTerm),
    );

    return [...productResults, ...utilityResults].slice(0, 6);
  }, [products, query, visibleSearchableItems]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/78 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/76">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-cyan-500/20 transition group-hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-tight text-slate-950 dark:text-white">
              {storefrontContent.store.name}
            </span>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              {storefrontContent.store.descriptor}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/70 p-1 shadow-sm dark:border-white/10 dark:bg-white/5 xl:flex">
          {desktopNavItems.map((item) => (
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

        <div className="hidden min-w-[260px] max-w-sm flex-1 justify-end xl:flex">
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
              {query.trim() && results.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">No matching products found.</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white sm:inline-flex dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:shadow-black/20"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-400 px-1 text-[11px] font-bold text-slate-950">
                {wishlistCount}
              </span>
            ) : null}
          </Link>
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
          <Link
            href="/login"
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white sm:inline-flex dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:shadow-black/20"
          >
            <UserRound className="h-4 w-4" />
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm shadow-slate-200/60 xl:hidden dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm xl:hidden">
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
              {visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Account
              </Link>
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
                {query.trim() && results.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No matching products found.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
