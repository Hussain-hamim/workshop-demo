"use client";

import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import type { FollowUpQuestions } from "@/lib/types";
import { SectionCard } from "./SectionCard";
import { EditableSection } from "./EditableSection";
import { Donut } from "./visuals";

type Props = {
  data: FollowUpQuestions;
  editing: boolean;
  onChange: (next: FollowUpQuestions) => void;
};

function joinGaps(gaps: FollowUpQuestions["gaps"]) {
  return gaps.map((g) => [g.gap, g.question, g.whyItMatters].join(" | "));
}

function parseGaps(lines: string[]): FollowUpQuestions["gaps"] {
  return lines.filter(Boolean).map((line) => {
    const [gap = "", question = "", whyItMatters = ""] = line
      .split("|")
      .map((part) => part.trim());
    return { gap, question, whyItMatters };
  });
}

export function FollowUpQuestionsView({ data, editing, onChange }: Props) {
  const known = Math.max(0, 10 - data.gaps.length);
  const coverage = Math.round((known / 10) * 100);

  return (
    <div className="space-y-5">
      {!editing ? (
        <div className="card grid gap-6 p-5 md:grid-cols-[220px_1fr]">
          <Donut
            value={coverage}
            label="Discovery coverage"
            sub={`${data.gaps.length} open questions before a clean proposal`}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.gaps.slice(0, 6).map((g, i) => (
              <div
                key={i}
                className="rounded-xl bg-orange-50 px-3 py-3 ring-1 ring-orange-200"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-800">
                  Gap {i + 1}
                </p>
                <p className="mt-1 text-sm font-medium text-orange-950">
                  {g.gap}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <SectionCard
        icon={MessageCircleQuestion}
        tone="amber"
        title="Ask these before writing the proposal"
        highlight
      >
        {editing ? (
          <EditableSection
            editing
            label="gap | question | why it matters"
            list
            value={joinGaps(data.gaps)}
            onChange={(v) => onChange({ gaps: parseGaps(v as string[]) })}
          />
        ) : (
          <ol className="space-y-4">
            {data.gaps.map((g, i) => (
              <li
                key={i}
                className="grid gap-2 rounded-2xl bg-white p-4 ring-1 ring-stone-200 md:grid-cols-[1.2fr_2fr]"
              >
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-orange-800">
                    <HelpCircle size={14} /> {g.gap}
                  </p>
                  <p className="mt-2 text-sm italic text-slate-600">
                    {g.whyItMatters}
                  </p>
                </div>
                <p className="rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-slate-900">
                  {g.question}
                </p>
              </li>
            ))}
          </ol>
        )}
      </SectionCard>
    </div>
  );
}
