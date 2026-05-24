import { InvestorDashboard } from "@/features/investor/components/InvestorDashboard";
import { requireSession } from "@/features/auth/server/session";

export default async function DashboardPage() {
  const session = await requireSession("investor");
  return <InvestorDashboard sessionWalletAddress={session.walletAddress} />;
}
