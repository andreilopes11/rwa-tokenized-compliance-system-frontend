import { CoRevokeScreen } from "@/features/compliance/components/CoRevokeScreen";
import { requireSession } from "@/features/auth/server/session";

export default async function ComplianceRevokePage() {
  await requireSession("compliance");
  return <CoRevokeScreen />;
}
