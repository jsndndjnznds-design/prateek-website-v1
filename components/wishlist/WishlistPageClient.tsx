"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { cn, formatCurrency, getStockStatus } from "@/lib/utils";
import { Product } from "@/types";

export function WishlistPageClient({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const { productIds, removeItem } = useWishlist();
  const savedProducts = products.filter((product) => productIds.includes(product.id));

  if (savedProducts.length === 0) {
    return (
      <section className="min-h-[70vh] bg-slate-50 py-16 dark:bg-slate-950 sm:py-20">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-300">
            <Heart className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Your wishlist is empty</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Save products you want to revisit, then move them to your cart when you are ready.</p>
          <Link href="/products" className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">Wishlist</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Saved products</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{savedProducts.length} {savedProducts.length === 1 ? "product" : "products"} saved</p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedProducts.map((product) => {
            const image = product.images[0];
            const inStock = product.stock > 0;
            const stockStatus = getStockStatus(product.stock);

            return (
              <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <Link href={`/product/${product.slug}`} className="block bg-slate-100 dark:bg-white/5">
                  <Image src={image.src} alt={image.alt} width={780} height={620} className="aspect-[5/4] w-full object-cover" />
                </Link>
                <div className="p-5">
                  <Link href={`/product/${product.slug}`} className="text-lg font-semibold text-slate-950 transition hover:text-cyan-700 dark:text-white dark:hover:text-cyan-300">
                    {product.name}
                  </Link>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xl font-semibold text-slate-950 dark:text-white">{formatCurrency(product.price)}</p>
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", stockStatus === "Out of stock" ? "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300" : stockStatus === "Low stock" ? "bg-amber-400/15 text-amber-700 dark:text-amber-300" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300")}>{stockStatus}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={() => {
                        addItem({ productId: product.id, slug: product.slug, name: product.name, image: image.src, price: product.price, compareAtPrice: product.compareAtPrice, quantity: 1, availableStock: product.stock });
                        removeItem(product.id);
                      }}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Move to cart
                    </button>
                    <button type="button" onClick={() => removeItem(product.id)} aria-label={`Remove ${product.name} from wishlist`} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-300 dark:hover:bg-rose-400/10">
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
