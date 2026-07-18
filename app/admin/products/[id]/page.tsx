import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth-server";

export const metadata = {
  title: "Edit Product | GlamShot Admin",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, admin] = await Promise.all([params, requireAdmin("/admin/products")]);

  return (
    <AdminShell adminEmail={admin.email} activeLabel="Products">
      <ProductForm mode="edit" productId={id} />
    </AdminShell>
  );
}
