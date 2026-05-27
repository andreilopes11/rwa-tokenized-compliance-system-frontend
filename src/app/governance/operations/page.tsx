import { SaOperationsScreen } from "@/features/governance/components/SaOperationsScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceOperationsPage() {
  await requireSession("governance");
  return <SaOperationsScreen />;
}
