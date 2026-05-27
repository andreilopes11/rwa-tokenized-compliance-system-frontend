import { SaForceSyncApproveScreen } from "@/features/governance/components/SaForceSyncApproveScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceForceSyncApprovePage() {
  await requireSession("governance");
  return <SaForceSyncApproveScreen />;
}
