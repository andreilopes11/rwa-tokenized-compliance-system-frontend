import { SaCaseReviewScreen } from "@/features/governance/components/SaCaseReviewScreen";
import { requireSession } from "@/features/auth/server/session";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function GovernanceCasePage({ params }: PageProps) {
  await requireSession("governance");
  const { id } = await params;
  return <SaCaseReviewScreen requestId={id} />;
}
