import { SaOverviewScreen } from "@/features/governance/components/SaOverviewScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernancePage() {
  await requireSession("governance");
  return <SaOverviewScreen />;
}
