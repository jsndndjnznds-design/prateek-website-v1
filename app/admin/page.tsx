import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdmin } from "@/lib/auth-server";

export const metadata = {
  title: "Admin Dashboard | ClamCart",
};

export default async function AdminPage() {
  const admin = await requireAdmin("/admin");

  return <AdminDashboard adminEmail={admin.email} />;
}
