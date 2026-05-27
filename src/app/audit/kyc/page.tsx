import { AuKycHistoryScreen } from "@/features/audit/components/AuKycHistoryScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function AuditKycPage() {
  await requireSession("audit");
  return <AuKycHistoryScreen />;
}
