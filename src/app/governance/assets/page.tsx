import { SaAssetsScreen } from "@/features/governance/components/SaAssetsScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceAssetsPage() {
  await requireSession("governance");
  return <SaAssetsScreen />;
}
