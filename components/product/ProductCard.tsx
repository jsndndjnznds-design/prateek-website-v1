"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { cn, formatCurrency, getStockStatus } from "@/lib/utils";
import { Product } from "@/types";

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const router = useRouter();
  const { addItem, items, updateQuantity } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const [added, setAdded] = useState(false);
  const image = product.images[0];
  const inStock = product.stock > 0;
  const hasDiscount = product.compareAtPrice > product.price;
  const cartQuantity = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const stockStatus = getStockStatus(product.stock);
  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: image.src,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    quantity: 1,
    availableStock: product.stock,
  };

  const handleAddToCart = () => {
    if (!inStock) return;

    addItem(cartItem);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (!inStock) return;

    addItem(cartItem);
    router.push("/checkout");
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-950/8 dark:border-white/10 dark:bg-white/[0.03]">
      <button
        type="button"
        onClick={() => toggleItem(product.id)}
        aria-label={isWishlisted(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={isWishlisted(product.id)}
        className={cn(
          "absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border shadow-sm backdrop-blur transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500",
          isWishlisted(product.id)
            ? "border-rose-200 bg-white text-rose-600 dark:border-rose-400/30 dark:bg-slate-950/90 dark:text-rose-300"
            : "border-white/70 bg-white/90 text-slate-700 hover:text-rose-600 dark:border-white/15 dark:bg-slate-950/80 dark:text-slate-200",
        )}
      >
        <Heart className={cn("h-4 w-4", isWishlisted(product.id) && "fill-current")} />
      </button>
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
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">{product.eyebrow}</p>
        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="text-lg font-semibold text-slate-950 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">{product.name}</h3>
        </Link>
        <div className="mt-4 flex items-end gap-2">
          <p className="text-xl font-semibold text-slate-950 dark:text-white">{formatCurrency(product.price)}</p>
          {hasDiscount ? (
            <p className="pb-0.5 text-sm text-slate-400 line-through">{formatCurrency(product.compareAtPrice)}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "mt-3 w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
            stockStatus === "Out of stock"
              ? "bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300"
              : stockStatus === "Low stock"
                ? "bg-amber-400/15 text-amber-700 dark:text-amber-300"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          {stockStatus}
        </span>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!inStock}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
              !inStock && "cursor-not-allowed opacity-50 hover:bg-slate-950 dark:hover:bg-white",
            )}
          >
            <Zap className="h-4 w-4" />
            Buy now
          </button>
          {cartQuantity > 0 ? (
            <QuantitySelector value={cartQuantity} onChange={(quantity) => updateQuantity(product.id, quantity)} max={Math.min(product.stock, 9)} />
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10",
                !inStock && "cursor-not-allowed opacity-50",
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              {added ? "Added" : "Add to cart"}
            </button>
          )}
        </div>
        <p aria-live="polite" className="sr-only">{added ? `${product.name} added to cart` : ""}</p>
      </div>
    </article>
  );
}
