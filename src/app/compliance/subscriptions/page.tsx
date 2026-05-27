import { CoLifecycleQueueScreen } from "@/features/compliance/components/CoLifecycleQueueScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function ComplianceSubscriptionsPage() {
  await requireSession("compliance");
  return <CoLifecycleQueueScreen mode="subscriptions" screenId="CO-S05" />;
}
