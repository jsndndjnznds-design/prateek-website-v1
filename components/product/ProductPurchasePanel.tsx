"use client";

import { useRouter } from "next/navigation";
import { Heart, Share2, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Product } from "@/types";
import { cn, formatCurrency, getStockStatus } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const hasDiscount = product.compareAtPrice > product.price;
  const discount = hasDiscount ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;
  const inStock = product.stock > 0;
  const stockStatus = getStockStatus(product.stock);

  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0].src,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    quantity,
    availableStock: product.stock,
  };

  const handleAdd = () => {
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

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: product.shortDescription,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareLabel("Copied");
      window.setTimeout(() => setShareLabel("Share"), 1600);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
            {product.eyebrow}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-semibold",
              stockStatus === "Out of stock"
                ? "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : stockStatus === "Low stock"
                  ? "bg-amber-400/15 text-amber-700 dark:text-amber-300"
                  : "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300",
            )}
          >
            {stockStatus}
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{product.shortDescription}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-wrap items-end gap-3">
          <span className="text-4xl font-semibold text-slate-950 dark:text-white">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount ? (
            <>
              <span className="pb-1 text-lg font-medium text-slate-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
              {discount > 0 ? (
                <span className="mb-1 rounded-full bg-rose-500/10 px-3 py-1 text-sm font-bold text-rose-600 dark:text-rose-300">
                  Save {discount}%
                </span>
              ) : null}
            </>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{inStock ? "Availability is checked again when your order is submitted." : "This product is currently unavailable."}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {inStock ? <QuantitySelector value={quantity} onChange={setQuantity} max={Math.min(product.stock, 9)} /> : null}
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 sm:flex-none"
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? "Added to cart" : "Add to cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className={cn(
            "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:flex-none",
            !inStock && "cursor-not-allowed opacity-60 hover:translate-y-0",
          )}
        >
          <Zap className="h-4 w-4" />
          Buy now
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => toggleItem(product.id)}
          aria-pressed={isWishlisted(product.id)}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
            isWishlisted(product.id)
              ? "border-rose-300 bg-rose-500/10 text-rose-600 dark:border-rose-400/30 dark:text-rose-300"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10",
          )}
        >
          <Heart className={cn("h-4 w-4", isWishlisted(product.id) && "fill-current")} />
          {isWishlisted(product.id) ? "Saved" : "Wishlist"}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        >
          <Share2 className="h-4 w-4" />
          {shareLabel}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">{added ? `${product.name} added to cart` : ""}</p>

    </div>
  );
}
