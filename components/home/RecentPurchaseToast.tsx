"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RecentOrder = {
  name: string;
  location: string;
  minutesAgo: number;
};

type RecentOrderRow = {
  customer_name: string;
  address: string;
  created_at: string;
};

function getLocation(address: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.at(-2) ?? parts.at(-1) ?? "India";
}

function getMinutesAgo(createdAt: string) {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  return Math.max(1, Math.round(elapsed / 60000));
}

export function RecentPurchaseToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadRecentOrders() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("orders")
        .select("customer_name, address, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!mounted || error) return;

      setRecentOrders(
        ((data ?? []) as RecentOrderRow[]).map((order) => ({
          name: order.customer_name,
          location: getLocation(order.address),
          minutesAgo: getMinutesAgo(order.created_at),
        })),
      );
    }

    loadRecentOrders();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (recentOrders.length === 0) return;

    const initial = window.setTimeout(() => setVisible(true), 1800);
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((value) => (value + 1) % recentOrders.length);
        setVisible(true);
      }, 600);
    }, 7200);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [recentOrders.length]);

  if (recentOrders.length === 0) return null;

  const purchase = recentOrders[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          className="fixed bottom-5 left-4 z-40 hidden max-w-xs rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-2xl shadow-slate-950/15 backdrop-blur md:block dark:border-white/10 dark:bg-slate-900/90"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{purchase.name}</p>
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Ordered from {purchase.location} {purchase.minutesAgo} minutes ago
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
