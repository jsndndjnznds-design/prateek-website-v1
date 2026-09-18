"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Check, PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { PublicOrderConfirmation } from "@/types";

type OrderResponse = {
  order?: PublicOrderConfirmation;
  error?: string;
};

function EmptyConfirmation({
  title,
  message,
  tone = "neutral",
}: {
  title: string;
  message: string;
  tone?: "neutral" | "error";
}) {
  return (
    <section className="min-h-[80vh] bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-950/8 dark:border-white/10 dark:bg-slate-950/80">
          <div
            className={
              tone === "error"
                ? "mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/10 text-red-600 dark:text-red-300"
                : "mx-auto grid h-16 w-16 place-items-center rounded-full bg-cyan-400/15 text-cyan-600 dark:text-cyan-300"
            }
          >
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">{message}</p>
          <Link
            href="/checkout"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 dark:bg-white dark:text-slate-950"
          >
            Back to Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}

export function OrderConfirmationClient({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<PublicOrderConfirmation | null>(null);
  const [loading, setLoading] = useState(Boolean(orderNumber));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`, { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as OrderResponse | null;

      if (!active) return;

      if (!response.ok || !data?.order) {
        setError(data?.error ?? "Unable to load order.");
      } else {
        setOrder(data.order);
      }

      setLoading(false);
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderNumber]);

  if (!orderNumber) {
    return (
      <EmptyConfirmation
        title="No order request selected"
        message="This page only shows orders that were saved after checkout."
      />
    );
  }

  if (loading) {
    return (
      <section className="min-h-[80vh] bg-slate-50 py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/8 dark:border-white/10 dark:bg-slate-950/80">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-500" />
            <p className="mt-5 font-semibold text-slate-950 dark:text-white">Loading order request...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <EmptyConfirmation title="Could not load order" message={error} tone="error" />;
  }

  if (!order) {
    return (
      <EmptyConfirmation
        title="Order was not found"
        message="Supabase did not return an order for this confirmation link."
        tone="error"
      />
    );
  }

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
            Order request received
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Order {order.order_number} has been recorded.
          </p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left dark:border-white/10 dark:bg-white/5">
            <PackageCheck className="h-5 w-5 text-cyan-500" />
            <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Next steps</p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Shipping and payment arrangements are not confirmed by this page. Your personal contact and address details are not shown here.</p>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white text-left dark:border-white/10 dark:bg-white/5">
            {(order.items.length > 0 ? order.items : []).map((item) => (
              <div
                key={`${item.product_id}-${item.name}`}
                className="flex items-center gap-4 border-b border-slate-200 p-4 last:border-b-0 dark:border-white/10"
              >
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
                    <span className="block">Payment: {order.payment_method}</span>
                  </p>
                </div>
                <p className="font-semibold text-slate-950 dark:text-white">{formatCurrency(item.line_total)}</p>
              </div>
            ))}
            {order.items.length === 0 ? (
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">Order items</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="block">Quantity {order.quantity}</span>
                    <span className="block">Payment: {order.payment_method}</span>
                  </p>
                </div>
                <p className="font-semibold text-slate-950 dark:text-white">{formatCurrency(order.amount)}</p>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-slate-200 p-4 text-sm font-semibold text-slate-950 dark:border-white/10 dark:text-white">
              <span>Total</span>
              <span>{formatCurrency(order.amount)}</span>
            </div>
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
