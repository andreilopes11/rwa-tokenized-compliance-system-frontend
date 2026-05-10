import { InvestorDashboard } from "@/components/InvestorDashboard";
import { requireSession } from "@/lib/server-auth";

export default async function DashboardPage() {
  await requireSession("investor");
  return <InvestorDashboard />;
}
