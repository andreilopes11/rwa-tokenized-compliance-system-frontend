import { InvestorDashboard } from "@/features/investor/components/InvestorDashboard";
import { requireSession } from "@/features/auth/server/session";

export default async function DashboardPage() {
  await requireSession("investor");
  return <InvestorDashboard />;
}
