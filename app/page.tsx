import { Dashboard } from "@/components/Dashboard";
import type { StorageMode } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const storageMode: StorageMode = process.env.VERCEL ? "browser" : "sqlite";
  return <Dashboard storageMode={storageMode} />;
}
