"use client";

import { Radio, Sparkles } from "lucide-react";

export function ModeBadge({ liveAi }: { liveAi: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        liveAi ? "bg-emerald-400 text-emerald-950" : "bg-amber-100 text-amber-950"
      }`}
    >
      {liveAi ? <Sparkles size={14} /> : <Radio size={14} />}
      {liveAi ? "Live AI" : "Demo mode"}
    </span>
  );
}
