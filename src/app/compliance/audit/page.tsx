import { CoComplianceAuditScreen } from "@/features/compliance/components/CoComplianceAuditScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function ComplianceAuditPage() {
  await requireSession("compliance");
  return <CoComplianceAuditScreen />;
}
