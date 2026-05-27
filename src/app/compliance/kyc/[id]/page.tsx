import { CoCaseReviewScreen } from "@/features/compliance/components/CoCaseReviewScreen";
import { requireSession } from "@/features/auth/server/session";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ComplianceCasePage({ params }: PageProps) {
  await requireSession("compliance");
  const { id } = await params;
  return <CoCaseReviewScreen requestId={id} />;
}
