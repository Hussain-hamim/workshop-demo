"use client";

import { Radio, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ModeBadge({ liveAi }: { liveAi: boolean }) {
  return (
    <Badge
      variant="secondary"
      className={
        liveAi
          ? "h-auto gap-1.5 rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-emerald-950 hover:bg-emerald-400"
          : "h-auto gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-100"
      }
    >
      {liveAi ? <Sparkles /> : <Radio />}
      {liveAi ? "Live AI" : "Demo mode"}
    </Badge>
  );
}
