import { AdminDashboard } from "@/components/AdminDashboard";
import { requireSession } from "@/lib/server-auth";

export default async function AdminPage() {
  await requireSession("admin");
  return <AdminDashboard />;
}
