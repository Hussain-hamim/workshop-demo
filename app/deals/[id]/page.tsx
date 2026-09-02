import { DealWizard } from "@/components/DealWizard";
import type { StorageMode } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const storageMode: StorageMode = process.env.VERCEL ? "browser" : "sqlite";
  return <DealWizard dealId={id} storageMode={storageMode} />;
}
