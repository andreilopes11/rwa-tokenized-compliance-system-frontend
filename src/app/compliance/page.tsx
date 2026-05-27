import { requireSession } from "@/features/auth/server/session";
import { ComplianceWorkspace } from "@/features/compliance/components/ComplianceWorkspace";

export default async function CompliancePage() {
  await requireSession("compliance");
  return <ComplianceWorkspace />;
}
