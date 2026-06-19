"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/components/cart/CartProvider";
import { formatCurrency } from "@/lib/utils";

export function StickyAddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  const inStock = product.stock > 0;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-2xl shadow-slate-950/15 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
      <div className="flex items-center gap-3">
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          width={72}
          height={72}
          className="h-14 w-14 rounded-2xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{product.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{formatCurrency(product.price)}</p>
        </div>
        <button
          onClick={() =>
            inStock
              ? addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0].src,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  quantity: 1,
                })
              : undefined
          }
          disabled={!inStock}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
