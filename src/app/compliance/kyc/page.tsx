import { CoKycQueueScreen } from "@/features/compliance/components/CoKycQueueScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function ComplianceKycPage() {
  await requireSession("compliance");
  return <CoKycQueueScreen />;
}
