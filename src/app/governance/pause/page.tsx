import { SaPauseScreen } from "@/features/governance/components/SaPauseScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function GovernancePausePage() {
  await requireSession("governance");
  return <SaPauseScreen />;
}
