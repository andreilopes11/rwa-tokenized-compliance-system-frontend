import { SaForceSyncScreen } from "@/features/governance/components/SaForceSyncScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceForceSyncPage() {
  await requireSession("governance");
  return <SaForceSyncScreen />;
}
