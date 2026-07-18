import { AdminProductsClient } from "@/components/admin/AdminProductsClient";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth-server";

export const metadata = {
  title: "Products | HoloVista Admin",
};

export default async function AdminProductsPage() {
  const admin = await requireAdmin("/admin/products");

  return (
    <AdminShell adminEmail={admin.email} activeLabel="Products">
      <AdminProductsClient />
    </AdminShell>
  );
}
