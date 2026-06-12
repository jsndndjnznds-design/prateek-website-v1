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
import { useState } from "react";
import { analyticsData, customers, orders } from "@/data/mock";
import { product } from "@/data/product";
import { cn, formatCompactCurrency, formatCurrency } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Products", icon: Boxes },
  { label: "Analytics", icon: BarChart3 },
];

const statusClasses: Record<string, string> = {
  Paid: "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300",
  Processing: "bg-amber-400/15 text-amber-700 dark:text-amber-300",
  Packed: "bg-violet-400/15 text-violet-700 dark:text-violet-300",
  Shipped: "bg-blue-400/15 text-blue-700 dark:text-blue-300",
  Delivered: "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300",
};

function RevenueLineChart() {
  const max = Math.max(...analyticsData.map((point) => point.revenue));
  const points = analyticsData
    .map((point, index) => {
      const x = (index / (analyticsData.length - 1)) * 100;
      const y = 100 - (point.revenue / max) * 84;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-950 dark:text-white">Revenue trend</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly revenue across 2026</p>
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
        {analyticsData.map((point, index) => {
          const x = (index / (analyticsData.length - 1)) * 100;
          const y = 100 - (point.revenue / max) * 84;
          return <circle key={point.label} cx={x} cy={y} r="1.7" fill="#0f172a" className="dark:fill-white" />;
        })}
      </svg>
      <div className="grid grid-cols-6 gap-1 text-center text-[11px] font-medium text-slate-400 sm:grid-cols-12">
        {analyticsData.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

function SalesBars() {
  const max = Math.max(...analyticsData.map((point) => point.orders));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <h3 className="font-semibold text-slate-950 dark:text-white">Sales trend</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">Orders by month</p>
      <div className="mt-6 flex h-56 items-end gap-2">
        {analyticsData.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end rounded-full bg-slate-100 p-1 dark:bg-white/10">
              <div
                className="w-full rounded-full bg-[linear-gradient(180deg,#22d3ee,#34d399)]"
                style={{ height: `${(point.orders / max) * 100}%` }}
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
  const totalRevenue = orders.reduce((total, order) => total + order.amount, 0);
  const latest = analyticsData[analyticsData.length - 1];

  const normalizedQuery = query.toLowerCase();
  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.status} ${order.email}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  const widgets = [
    { label: "Total Orders", value: orders.length.toString(), detail: "+18% vs last month" },
    { label: "Revenue", value: formatCompactCurrency(totalRevenue), detail: "Across mock orders" },
    { label: "Conversion Rate", value: `${latest.conversion}%`, detail: "Storefront sessions" },
    { label: "Visitors", value: latest.visitors.toLocaleString("en-IN"), detail: "This month" },
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
              <p className="text-xs opacity-70">Prototype operations</p>
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
                placeholder="Search orders, customers, status"
                className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5"
              />
            </div>
          </div>

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
            <RevenueLineChart />
            <SalesBars />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
                <div>
                  <h2 className="font-semibold">Orders</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{filteredOrders.length} matching orders</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Order ID</th>
                      <th className="px-5 py-4">Customer</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {filteredOrders.slice(0, 12).map((order) => (
                      <tr key={order.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="px-5 py-4 font-semibold">{order.id}</td>
                        <td className="px-5 py-4">
                          <span className="block font-medium">{order.customer}</span>
                          <span className="text-xs text-slate-500">{order.channel}</span>
                        </td>
                        <td className="px-5 py-4 font-semibold">{formatCurrency(order.amount)}</td>
                        <td className="px-5 py-4">
                          <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusClasses[order.status])}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{order.date}</td>
                      </tr>
                    ))}
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
                  {customers.slice(0, 5).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{customer.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{customer.company}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {customer.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
