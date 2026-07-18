"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatCurrency, getShippingEstimate, getTax } from "@/lib/utils";

export function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = getShippingEstimate(subtotal);
  const tax = getTax(subtotal);
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] bg-slate-50 py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-sm dark:bg-white/10">
            <ShoppingBag className="h-8 w-8 text-cyan-500" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-normal text-slate-950 dark:text-white">
            Your cart is ready for a hologram.
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Add a product to review shipping, taxes, and checkout options.
          </p>
          <Link
            href="/#products"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-12 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Cart
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950 dark:text-white">
              Review your order
            </h1>
          </div>
          <Link
            href="/#products"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
            {items.map((item) => (
              <div
                key={item.productId}
                className="grid gap-4 border-b border-slate-200 p-4 last:border-b-0 dark:border-white/10 sm:grid-cols-[112px_1fr_auto] sm:items-center"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={180}
                  height={140}
                  className="h-28 w-full rounded-2xl object-cover sm:w-28"
                />
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-lg font-semibold text-slate-950 transition hover:text-cyan-600 dark:text-white"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Product from the current catalog
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.productId, value)}
                    />
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-lg font-semibold text-slate-950 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-slate-400 line-through">
                    {item.compareAtPrice > item.price ? formatCurrency(item.compareAtPrice * item.quantity) : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping estimate</span>
                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST estimate</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4 text-base font-semibold text-slate-950 dark:border-white/10 dark:text-white">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
              <Truck className="mb-2 h-4 w-4" />
              Prepaid orders qualify for free insured shipping.
            </div>
            <Link
              href="/checkout"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
