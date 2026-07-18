import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth-server";
import {
  buildMonthlyOrderData,
  buildTopProducts,
  listOrders,
  type MonthlyOrderPoint,
  type TopProductSummary,
} from "@/lib/order-service";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Analytics | GlamShot Admin",
};

export const dynamic = "force-dynamic";

function RevenueChart({ data }: { data: MonthlyOrderPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="grid h-64 place-items-center rounded-2xl bg-slate-50 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
        Revenue trend appears after orders are saved.
      </div>
    );
  }

  const max = Math.max(...data.map((point) => point.revenue), 1);
  const points = data
    .map((point, index) => {
      const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
      const y = 96 - (point.revenue / max) * 84;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <>
      <svg viewBox="0 0 100 104" className="mt-6 h-56 w-full overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="#06b6d4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((point, index) => {
          const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
          const y = 96 - (point.revenue / max) * 84;

          return <circle key={point.key} cx={x} cy={y} r="1.8" fill="#0f172a" className="dark:fill-white" />;
        })}
      </svg>
      <div className="grid grid-cols-4 gap-1 text-center text-[11px] font-medium text-slate-400 sm:grid-cols-6 xl:grid-cols-12">
        {data.map((point) => (
          <span key={point.key}>{point.label}</span>
        ))}
      </div>
    </>
  );
}

function UnitsChart({ data }: { data: MonthlyOrderPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="grid h-64 place-items-center rounded-2xl bg-slate-50 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
        Units sold appears after checkout activity.
      </div>
    );
  }

  const max = Math.max(...data.map((point) => point.units), 1);

  return (
    <div className="mt-6 flex h-64 items-end gap-2">
      {data.map((point) => (
        <div key={point.key} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-52 w-full items-end rounded-full bg-slate-100 p-1 dark:bg-white/10">
            <div
              className="w-full rounded-full bg-[linear-gradient(180deg,#22d3ee,#34d399)]"
              style={{ height: `${Math.max((point.units / max) * 100, 8)}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-400">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

function TopProducts({ products }: { products: TopProductSummary[] }) {
  if (products.length === 0) {
    return (
      <div className="grid min-h-56 place-items-center rounded-2xl bg-slate-50 text-center text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
        Top products are calculated from order line items.
      </div>
    );
  }

  const max = Math.max(...products.map((product) => product.revenue), 1);

  return (
    <div className="grid gap-4">
      {products.slice(0, 8).map((product) => (
        <div key={product.productId}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-semibold text-slate-950 dark:text-white">{product.name}</span>
            <span className="shrink-0 text-slate-500 dark:text-slate-400">
              {product.units} units · {formatCurrency(product.revenue)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#06b6d4,#10b981)]"
              style={{ width: `${Math.max((product.revenue / max) * 100, 6)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const admin = await requireAdmin("/admin/analytics");
  const orders = await listOrders();
  const monthlyData = buildMonthlyOrderData(orders);
  const topProducts = buildTopProducts(orders);
  const revenue = orders.reduce((total, order) => total + order.amount, 0);
  const unitsSold = orders.reduce((total, order) => total + order.quantity, 0);

  const stats = [
    { label: "Revenue", value: formatCompactCurrency(revenue), detail: formatCurrency(revenue) },
    { label: "Order count", value: orders.length.toString(), detail: "Saved orders" },
    { label: "Units sold", value: unitsSold.toString(), detail: "Total item quantity" },
    { label: "Top products", value: topProducts.length.toString(), detail: "Products with sales" },
  ];

  return (
    <AdminShell adminEmail={admin.email} activeLabel="Analytics">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            Analytics
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">Store analytics</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Revenue, volume, and product performance from Supabase orders.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
              <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="font-semibold text-slate-950 dark:text-white">Revenue</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly revenue trend</p>
            <RevenueChart data={monthlyData} />
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="font-semibold text-slate-950 dark:text-white">Units sold</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly item volume</p>
            <UnitsChart data={monthlyData} />
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="font-semibold text-slate-950 dark:text-white">Top products</h2>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Ranked by order line revenue</p>
          <TopProducts products={topProducts} />
        </section>
      </main>
    </AdminShell>
  );
}
