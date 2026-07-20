import { SaAuditScreen } from "@/features/governance/components/SaAuditScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceAuditPage() {
  await requireSession("governance");
  return <SaAuditScreen />;
}
