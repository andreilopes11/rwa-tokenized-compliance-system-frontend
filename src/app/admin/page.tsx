import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { requireSession } from "@/features/auth/server/session";

export default async function AdminPage() {
  await requireSession("admin");
  return <AdminDashboard />;
}
