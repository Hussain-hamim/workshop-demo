import { Dashboard } from "@/components/Dashboard";
import { listDeals } from "@/lib/db";
import { isLiveAi } from "@/lib/ai";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const deals = listDeals();
  return <Dashboard deals={deals} liveAi={isLiveAi()} />;
}
