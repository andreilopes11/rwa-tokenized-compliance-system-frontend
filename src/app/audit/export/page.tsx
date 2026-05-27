import { AuExportScreen } from "@/features/audit/components/AuExportScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function AuditExportPage() {
  await requireSession("audit");
  return <AuExportScreen />;
}
