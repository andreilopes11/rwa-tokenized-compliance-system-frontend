import { AuTimelineScreen } from "@/features/audit/components/AuTimelineScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function AuditPage() {
  await requireSession("audit");
  return <AuTimelineScreen />;
}
