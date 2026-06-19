import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth-server";
import { buildCustomerSummaries, listOrders } from "@/lib/order-service";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Customers | HoloVista Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const admin = await requireAdmin("/admin/customers");
  const customers = buildCustomerSummaries(await listOrders());

  return (
    <AdminShell adminEmail={admin.email} activeLabel="Customers">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            Customers
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-normal">Customer history</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {customers.length} customer{customers.length === 1 ? "" : "s"} grouped by email.
          </p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="border-b border-slate-200 p-5 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Customers</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total orders and spend are calculated from Supabase orders.
            </p>
          </div>

          {customers.length === 0 ? (
            <div className="grid min-h-72 place-items-center p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Customer summaries will appear after orders are saved.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Customer name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Total orders</th>
                    <th className="px-5 py-4">Total spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {customers.map((customer) => (
                    <tr key={customer.email} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-5 py-4 font-semibold text-slate-950 dark:text-white">{customer.name}</td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{customer.email}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{customer.totalOrders}</td>
                      <td className="px-5 py-4 font-semibold text-slate-950 dark:text-white">
                        {formatCurrency(customer.totalSpent)}
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
