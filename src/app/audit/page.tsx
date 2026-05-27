import { requireSession } from "@/features/auth/server/session";
import { AuditWorkspace } from "@/features/audit/components/AuditWorkspace";

export default async function AuditPage() {
  await requireSession("audit");
  return <AuditWorkspace />;
}
