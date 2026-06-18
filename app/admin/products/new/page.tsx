import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth-server";

export const metadata = {
  title: "Add Product | HoloVista Admin",
};

export default async function NewProductPage() {
  const admin = await requireAdmin("/admin/products/new");

  return (
    <AdminShell adminEmail={admin.email} activeLabel="Products">
      <ProductForm mode="create" />
    </AdminShell>
  );
}
