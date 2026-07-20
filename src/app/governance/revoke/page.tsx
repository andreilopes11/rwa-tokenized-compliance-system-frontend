import { SaRevokeScreen } from "@/features/governance/components/SaRevokeScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceRevokePage() {
  await requireSession("governance");
  return <SaRevokeScreen />;
}
