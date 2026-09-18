"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { cn, formatCurrency } from "@/lib/utils";
import { Product } from "@/types";

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const image = product.images[0];
  const inStock = product.stock > 0;
  const hasDiscount = product.compareAtPrice > product.price;

  const handleAddToCart = () => {
    if (!inStock) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: image.src,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-950/8 dark:border-white/10 dark:bg-white/[0.03]">
      <Link href={`/product/${product.slug}`} className="block overflow-hidden bg-slate-100 dark:bg-white/5">
        <Image
          src={image.src}
          alt={image.alt}
          width={780}
          height={620}
          loading={eager ? "eager" : "lazy"}
          className="aspect-[5/4] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
              {product.eyebrow}
            </p>
            <Link href={`/product/${product.slug}`} className="mt-2 block">
              <h3 className="text-lg font-semibold text-slate-950 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                {product.name}
              </h3>
            </Link>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              inStock
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300",
            )}
          >
            {inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{product.shortDescription}</p>
        <div className="mt-5 flex items-end gap-2">
          <p className="text-xl font-semibold text-slate-950 dark:text-white">{formatCurrency(product.price)}</p>
          {hasDiscount ? (
            <p className="pb-0.5 text-sm text-slate-400 line-through">{formatCurrency(product.compareAtPrice)}</p>
          ) : null}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
              !inStock && "cursor-not-allowed opacity-50 hover:bg-slate-950 dark:hover:bg-white",
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {added ? "Added" : "Add to cart"}
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
