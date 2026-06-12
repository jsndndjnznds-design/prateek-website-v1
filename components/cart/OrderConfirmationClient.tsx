"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, PackageCheck, Truck } from "lucide-react";
import { useSyncExternalStore } from "react";
import { product } from "@/data/product";
import { formatCurrency, getEstimatedDeliveryDate } from "@/lib/utils";
import { CartItem } from "@/types";

type LastOrder = {
  orderNumber: string;
  items: CartItem[];
  total: number;
  method: string;
  delivery: string;
};

function subscribeOrder(listener: () => void) {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

function getOrderSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("holovista-last-order") ?? "";
}

export function OrderConfirmationClient() {
  const storedOrder = useSyncExternalStore(subscribeOrder, getOrderSnapshot, () => "");
  const order = storedOrder ? (JSON.parse(storedOrder) as LastOrder) : null;

  const displayOrder =
    order ??
    ({
      orderNumber: "HVX-104820",
      items: [
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0].src,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          quantity: 1,
        },
      ],
      total: product.price,
      method: "UPI",
      delivery: getEstimatedDeliveryDate(),
    } satisfies LastOrder);

  return (
    <section className="min-h-[80vh] bg-[linear-gradient(180deg,#ecfeff_0%,#f8fafc_48%,#ffffff_100%)] py-16 dark:bg-[linear-gradient(180deg,#082f49_0%,#020617_48%,#020617_100%)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-950/8 dark:border-white/10 dark:bg-slate-950/80">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 15 }}
            className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-400/15"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 12 }}
              className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white"
            >
              <Check className="h-7 w-7" />
            </motion.span>
          </motion.div>
          <h1 className="mt-7 text-4xl font-semibold tracking-normal text-slate-950 dark:text-white">
            Order confirmed
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Order {displayOrder.orderNumber} is confirmed and queued for warehouse processing.
          </p>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <PackageCheck className="h-5 w-5 text-cyan-500" />
              <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Shipping information</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Insured delivery with installation support follow-up after dispatch.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <Truck className="h-5 w-5 text-emerald-500" />
              <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Estimated delivery</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {displayOrder.delivery} via tracked courier.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 text-left dark:border-white/10 dark:bg-white/5">
            {displayOrder.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={86}
                  height={78}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="block">Quantity {item.quantity}</span>
                    <span className="block">Paid by {displayOrder.method}</span>
                  </p>
                </div>
                <p className="font-semibold text-slate-950 dark:text-white">{formatCurrency(displayOrder.total)}</p>
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 dark:bg-white dark:text-slate-950"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
