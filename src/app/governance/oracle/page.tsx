import { SaOracleScreen } from "@/features/governance/components/SaOracleScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernanceOraclePage() {
  await requireSession("governance");
  return <SaOracleScreen />;
}
