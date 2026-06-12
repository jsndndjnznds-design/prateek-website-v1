"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CreditCard,
  Landmark,
  MapPin,
  Smartphone,
  Truck,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import {
  formatCurrency,
  getEstimatedDeliveryDate,
  getShippingEstimate,
  getTax,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { label: "UPI", icon: Smartphone },
  { label: "Credit Card", icon: CreditCard },
  { label: "Debit Card", icon: WalletCards },
  { label: "Net Banking", icon: Landmark },
  { label: "Cash on Delivery", icon: Banknote },
];

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </label>
  );
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [method, setMethod] = useState("UPI");
  const shipping = getShippingEstimate(subtotal);
  const tax = getTax(subtotal);
  const total = subtotal + shipping + tax;

  const placeOrder = () => {
    const orderSeed = 104820 + items.reduce((sum, item) => sum + item.quantity * 37, 0) + Math.round(total % 90000);
    const orderNumber = `HVX-${orderSeed}`;

    window.localStorage.setItem(
      "holovista-last-order",
      JSON.stringify({
        orderNumber,
        items,
        subtotal,
        shipping,
        tax,
        total,
        method,
        delivery: getEstimatedDeliveryDate(),
      }),
    );
    clearCart();
    router.push("/order-confirmation");
  };

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] bg-slate-50 py-20 text-center dark:bg-slate-950">
        <div className="mx-auto max-w-xl px-4">
          <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Checkout is waiting on a product.</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Add HoloVista Pro X1 to continue.</p>
          <button
            onClick={() => router.push("/product/hologram-fan-display")}
            className="mt-8 h-12 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
          >
            Shop Product
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-12 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            Secure checkout
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950 dark:text-white">
            Complete your order
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Customer Information</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" placeholder="Priya Mehta" />
                <Field label="Email" placeholder="priya@example.com" type="email" />
                <Field label="Phone" placeholder="+91 98765 43210" />
                <Field label="Company" placeholder="Aurum Retail Studio" />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white">
                <MapPin className="h-5 w-5 text-cyan-500" />
                Shipping Address
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Address line" placeholder="12 Carter Road, Bandra West" />
                <Field label="Apartment, suite" placeholder="Studio 4B" />
                <Field label="City" placeholder="Mumbai" />
                <Field label="State" placeholder="Maharashtra" />
                <Field label="PIN code" placeholder="400050" />
                <Field label="Installation note" placeholder="Countertop demo before wall mount" />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Payment Method</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((payment) => (
                  <button
                    key={payment.label}
                    onClick={() => setMethod(payment.label)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5",
                      method === payment.label
                        ? "border-cyan-400 bg-cyan-400/10 ring-4 ring-cyan-400/10"
                        : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5",
                    )}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-cyan-600 dark:bg-slate-950 dark:text-cyan-300">
                      <payment.icon className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{payment.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Order Summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={90}
                    height={80}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-950 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm dark:border-white/10">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-950 dark:border-white/10 dark:text-white">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-400">
              <Truck className="mb-2 h-4 w-4 text-cyan-500" />
              Estimated delivery: {getEstimatedDeliveryDate()}
            </div>
            <button
              onClick={placeOrder}
              className="mt-6 h-12 w-full rounded-full bg-slate-950 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
              Place Order
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
