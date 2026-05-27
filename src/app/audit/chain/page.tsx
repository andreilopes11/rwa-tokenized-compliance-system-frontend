import { AuChainActivityScreen } from "@/features/audit/components/AuChainActivityScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function AuditChainPage() {
  await requireSession("audit");
  return <AuChainActivityScreen />;
}
