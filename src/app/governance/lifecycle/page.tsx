import { SaLifecycleScreen } from "@/features/governance/components/SaLifecycleScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceLifecyclePage() {
  await requireSession("governance");
  return <SaLifecycleScreen />;
}
