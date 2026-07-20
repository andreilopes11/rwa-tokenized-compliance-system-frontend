import { SaKycQueueScreen } from "@/features/governance/components/SaKycQueueScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceKycPage() {
  await requireSession("governance");
  return <SaKycQueueScreen />;
}
