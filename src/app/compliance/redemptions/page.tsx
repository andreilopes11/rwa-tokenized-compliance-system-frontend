import { CoLifecycleQueueScreen } from "@/features/compliance/components/CoLifecycleQueueScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function ComplianceRedemptionsPage() {
  await requireSession("compliance");
  return <CoLifecycleQueueScreen mode="redemptions" screenId="CO-S06" />;
}
