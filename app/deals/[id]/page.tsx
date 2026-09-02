import { notFound } from "next/navigation";
import { DealWizard } from "@/components/DealWizard";
import { getDeal } from "@/lib/db";
import { isLiveAi } from "@/lib/ai";

export const dynamic = "force-dynamic";

export default async function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = getDeal(id);
  if (!deal) notFound();
  return <DealWizard initialDeal={deal} initialLiveAi={isLiveAi()} />;
}
