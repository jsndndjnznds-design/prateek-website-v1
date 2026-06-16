"use client";

import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  Search,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { product } from "@/data/product";
import { supabase } from "@/lib/supabase";
import { cn, formatCompactCurrency, formatCurrency } from "@/lib/utils";
import { SupabaseOrder } from "@/types";

type MonthlyOrderPoint = {
  label: string;
  orders: number;
  revenue: number;
};

type CustomerSummary = {
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
};

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Products", icon: Boxes },
  { label: "Analytics", icon: BarChart3 },
];

const statusClasses: Record<string, string> = {
  Confirmed: "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300",
};

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function buildMonthlyData(orders: SupabaseOrder[]) {
  const buckets = new Map<string, MonthlyOrderPoint>();

  orders.forEach((order) => {
    const date = new Date(order.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const existing =
      buckets.get(key) ??
      ({
        label: date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        orders: 0,
        revenue: 0,
      } satisfies MonthlyOrderPoint);

    buckets.set(key, {
      ...existing,
      orders: existing.orders + 1,
      revenue: existing.revenue + order.amount,
    });
  });

  return [...buckets.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, point]) => point)
    .slice(-12);
}

function buildCustomerSummaries(orders: SupabaseOrder[]) {
  const customers = new Map<string, CustomerSummary>();

  orders.forEach((order) => {
    const key = order.email.toLowerCase();
    const existing =
      customers.get(key) ??
      ({
        name: order.customer_name,
        email: order.email,
        orderCount: 0,
        totalSpent: 0,
      } satisfies CustomerSummary);

    customers.set(key, {
      ...existing,
      orderCount: existing.orderCount + 1,
      totalSpent: existing.totalSpent + order.amount,
    });
  });

  return [...customers.values()].sort((first, second) => second.totalSpent - first.totalSpent);
}

function EmptyChart({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <h3 className="font-semibold text-slate-950 dark:text-white">{title}</h3>
      <div className="mt-6 grid h-56 place-items-center rounded-2xl bg-slate-50 text-center text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
        {detail}
      </div>
    </div>
  );
}

function RevenueLineChart({ data }: { data: MonthlyOrderPoint[] }) {
  if (data.length === 0) {
    return <EmptyChart title="Revenue trend" detail="Revenue will appear after Supabase returns orders." />;
  }

  const max = Math.max(...data.map((point) => point.revenue), 1);
  const points = data
    .map((point, index) => {
      const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
      const y = 100 - (point.revenue / max) * 84;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-950 dark:text-white">Revenue trend</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly revenue from Supabase orders</p>
        </div>
        <TrendingUp className="h-5 w-5 text-emerald-500" />
      </div>
      <svg viewBox="0 0 100 110" className="mt-6 h-56 w-full overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((point, index) => {
          const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
          const y = 100 - (point.revenue / max) * 84;
          return <circle key={point.label} cx={x} cy={y} r="1.7" fill="#0f172a" className="dark:fill-white" />;
        })}
      </svg>
      <div className="grid grid-cols-4 gap-1 text-center text-[11px] font-medium text-slate-400 sm:grid-cols-6 xl:grid-cols-12">
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

function SalesBars({ data }: { data: MonthlyOrderPoint[] }) {
  if (data.length === 0) {
    return <EmptyChart title="Sales trend" detail="Sales volume will appear after Supabase returns orders." />;
  }

  const max = Math.max(...data.map((point) => point.orders), 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <h3 className="font-semibold text-slate-950 dark:text-white">Sales trend</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">Orders by month from Supabase</p>
      <div className="mt-6 flex h-56 items-end gap-2">
        {data.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end rounded-full bg-slate-100 p-1 dark:bg-white/10">
              <div
                className="w-full rounded-full bg-[linear-gradient(180deg,#22d3ee,#34d399)]"
                style={{ height: `${Math.max((point.orders / max) * 100, 8)}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-slate-400">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      if (!supabase) {
        setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        setLoading(false);
        return;
      }

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select("order_number, customer_name, email, phone, address, quantity, amount, payment_method, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!mounted) return;

      if (ordersError) {
        setError(ordersError.message);
      } else {
        setOrders((data ?? []) as SupabaseOrder[]);
      }

      setLoading(false);
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const monthlyData = useMemo(() => buildMonthlyData(orders), [orders]);
  const customerSummaries = useMemo(() => buildCustomerSummaries(orders), [orders]);
  const totalRevenue = orders.reduce((total, order) => total + order.amount, 0);
  const totalQuantity = orders.reduce((total, order) => total + order.quantity, 0);

  const normalizedQuery = query.toLowerCase();
  const filteredOrders = orders.filter((order) =>
    `${order.order_number} ${order.customer_name} ${order.email} ${order.payment_method}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  const widgets = [
    { label: "Total Orders", value: orders.length.toString(), detail: "Saved in Supabase" },
    { label: "Revenue", value: formatCompactCurrency(totalRevenue), detail: "From Supabase orders" },
    { label: "Units Sold", value: totalQuantity.toString(), detail: "Quantity column total" },
    { label: "Latest Order", value: orders[0]?.order_number ?? "None", detail: orders[0] ? formatOrderDate(orders[0].created_at) : "No orders yet" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 rounded-3xl bg-slate-950 p-4 text-white dark:bg-white dark:text-slate-950">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400 text-slate-950">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">HoloVista Admin</p>
              <p className="text-xs opacity-70">Live orders</p>
            </div>
          </div>
          <nav className="mt-5 grid gap-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActive(item.label)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                  active === item.label
                    ? "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                {active}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-normal">Store performance</h1>
            </div>
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Supabase orders"
                className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5"
              />
            </div>
          </div>

          {error ? (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {widgets.map((widget) => (
              <div
                key={widget.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{widget.label}</p>
                <p className="mt-3 text-3xl font-semibold">{widget.value}</p>
                <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">{widget.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <RevenueLineChart data={monthlyData} />
            <SalesBars data={monthlyData} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
                <div>
                  <h2 className="font-semibold">Orders</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {loading ? "Loading Supabase orders" : `${filteredOrders.length} matching orders`}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Order ID</th>
                      <th className="px-5 py-4">Customer</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Payment</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {filteredOrders.slice(0, 12).map((order) => (
                      <tr key={order.order_number} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="px-5 py-4 font-semibold">{order.order_number}</td>
                        <td className="px-5 py-4">
                          <span className="block font-medium">{order.customer_name}</span>
                          <span className="text-xs text-slate-500">{order.email}</span>
                        </td>
                        <td className="px-5 py-4 font-semibold">{formatCurrency(order.amount)}</td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{order.payment_method}</td>
                        <td className="px-5 py-4">
                          <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusClasses.Confirmed)}>
                            Confirmed
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{formatOrderDate(order.created_at)}</td>
                      </tr>
                    ))}
                    {!loading && filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                          No Supabase orders found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <h2 className="font-semibold">Product</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{product.name}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                    <span className="block text-slate-500 dark:text-slate-400">Price</span>
                    <span className="mt-1 block font-semibold">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                    <span className="block text-slate-500 dark:text-slate-400">Stock</span>
                    <span className="mt-1 block font-semibold">{product.stock} units</span>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                <h2 className="font-semibold">Customers</h2>
                <div className="mt-4 grid gap-3">
                  {customerSummaries.slice(0, 5).map((customer) => (
                    <div key={customer.email} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{customer.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{customer.email}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {customer.orderCount} orders
                      </span>
                    </div>
                  ))}
                  {!loading && customerSummaries.length === 0 ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
                      Customer summaries will appear after orders are saved.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
