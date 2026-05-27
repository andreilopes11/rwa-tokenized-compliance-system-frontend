import { AuForceSyncTrailScreen } from "@/features/audit/components/AuForceSyncTrailScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function AuditForceSyncPage() {
  await requireSession("audit");
  return <AuForceSyncTrailScreen />;
}
