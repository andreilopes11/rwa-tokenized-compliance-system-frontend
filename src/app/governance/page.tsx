import { requireSession } from "@/features/auth/server/session";
import { GovernanceWorkspace } from "@/features/governance/components/GovernanceWorkspace";

export default async function GovernancePage() {
  await requireSession("governance");
  return <GovernanceWorkspace />;
}
