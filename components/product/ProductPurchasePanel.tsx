"use client";

import { useRouter } from "next/navigation";
import { Check, Heart, Share2, ShieldCheck, ShoppingCart, Truck, Zap } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { Rating } from "@/components/ui/Rating";
import { Product } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const discount = Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);

  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0].src,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    quantity,
  };

  const handleAdd = () => addItem(cartItem);

  const handleBuyNow = () => {
    addItem(cartItem);
    router.push("/checkout");
  };

  const handleWishlist = () => {
    const next = !wishlisted;
    setWishlisted(next);
    if (next) {
      window.localStorage.setItem("holovista-wishlist", product.id);
    } else {
      window.localStorage.removeItem("holovista-wishlist");
    }
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
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            In stock
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{product.shortDescription}</p>
        <div className="mt-5">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-wrap items-end gap-3">
          <span className="text-4xl font-semibold text-slate-950 dark:text-white">
            {formatCurrency(product.price)}
          </span>
          <span className="pb-1 text-lg font-medium text-slate-400 line-through">
            {formatCurrency(product.compareAtPrice)}
          </span>
          <span className="mb-1 rounded-full bg-rose-500/10 px-3 py-1 text-sm font-bold text-rose-600 dark:text-rose-300">
            Save {discount}%
          </span>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Stock counter</span>
            <span className="text-slate-500 dark:text-slate-400">{product.stock} left</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full w-[34%] rounded-full bg-[linear-gradient(90deg,#22d3ee,#34d399)]" />
          </div>
        </div>
      </div>

      <CountdownTimer />

      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <button
          onClick={handleAdd}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 sm:flex-none"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:flex-none"
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleWishlist}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
            wishlisted
              ? "border-rose-300 bg-rose-500/10 text-rose-600 dark:border-rose-400/30 dark:text-rose-300"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10",
          )}
        >
          <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
          Wishlist
        </button>
        <button
          onClick={handleShare}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        >
          <Share2 className="h-4 w-4" />
          {shareLabel}
        </button>
      </div>

      <div id="shipping" className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Truck, label: "Free prepaid shipping" },
          { icon: ShieldCheck, label: "12 month warranty" },
          { icon: Check, label: "Setup assistance" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            <item.icon className="mb-2 h-4 w-4 text-cyan-500" />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
