import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth-server";
import { getOrderItemsLabel, listOrders } from "@/lib/order-service";
import { cn, formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Orders | HoloVista Admin",
};

export const dynamic = "force-dynamic";

function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("cancel")) {
    return "bg-rose-500/10 text-rose-700 dark:text-rose-300";
  }

  if (normalized.includes("ship") || normalized.includes("deliver")) {
    return "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300";
  }

  return "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300";
}

export default async function AdminOrdersPage() {
  const admin = await requireAdmin("/admin/orders");
  const orders = await listOrders();

  return (
    <AdminShell adminEmail={admin.email} activeLabel="Orders">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            Orders
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">Order management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {orders.length} order{orders.length === 1 ? "" : "s"} saved in Supabase.
          </p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="border-b border-slate-200 p-5 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Orders</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Customer, items, payment, status, and order date.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="grid min-h-72 place-items-center p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Orders will appear here after checkout saves purchases.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Order ID</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Items</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {orders.map((order) => (
                    <tr key={order.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-5 py-4">
                        <span className="block font-semibold text-slate-950 dark:text-white">{order.order_number}</span>
                        <span className="mt-1 block max-w-[140px] truncate text-xs text-slate-400">{order.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="block font-medium text-slate-950 dark:text-white">{order.customer_name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{order.email}</span>
                      </td>
                      <td className="max-w-sm px-5 py-4 text-slate-600 dark:text-slate-300">
                        {getOrderItemsLabel(order)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-950 dark:text-white">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{order.payment_method}</td>
                      <td className="px-5 py-4">
                        <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusClass(order.status))}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                        {formatOrderDate(order.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </AdminShell>
  );
}
