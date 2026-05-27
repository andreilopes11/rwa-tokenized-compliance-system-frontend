import { CoDashboardScreen } from "@/features/compliance/components/CoDashboardScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function CompliancePage() {
  await requireSession("compliance");
  return <CoDashboardScreen />;
}
