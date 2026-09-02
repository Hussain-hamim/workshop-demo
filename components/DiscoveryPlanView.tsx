"use client";

import {
  AlertTriangle,
  Ear,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Megaphone,
  SkipForward,
  Sparkles,
  Puzzle,
} from "lucide-react";
import type { DiscoveryPlan } from "@/lib/types";
import { FieldCard, SectionCard } from "./SectionCard";
import { EditableSection } from "./EditableSection";

type Props = {
  data: DiscoveryPlan;
  editing: boolean;
  onChange: (next: DiscoveryPlan) => void;
};

export function DiscoveryPlanView({ data, editing, onChange }: Props) {
  return (
    <div className="space-y-5">
      <SectionCard
        icon={HelpCircle}
        tone="gold"
        title="Ask these — company-specific discovery questions"
        highlight
      >
        {editing ? (
          <EditableSection
            editing
            label=""
            list
            value={data.discoveryQuestions}
            onChange={(v) =>
              onChange({ ...data, discoveryQuestions: v as string[] })
            }
          />
        ) : (
          <ol className="space-y-3">
            {data.discoveryQuestions.filter(Boolean).map((q, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-amber-50/80 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-amber-950">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-900">{q}</p>
              </li>
            ))}
          </ol>
        )}
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          icon={Sparkles}
          title="Likely business priorities"
          list
          editing={editing}
          value={data.likelyPriorities}
          onChange={(v) =>
            onChange({ ...data, likelyPriorities: v as string[] })
          }
        />
        <FieldCard
          icon={AlertTriangle}
          tone="rose"
          title="Pain hypotheses"
          list
          editing={editing}
          value={data.painHypotheses}
          onChange={(v) =>
            onChange({ ...data, painHypotheses: v as string[] })
          }
        />
        <FieldCard
          icon={Lightbulb}
          title="Why they may need software"
          list
          editing={editing}
          value={data.reasonsTheyNeedSoftware}
          onChange={(v) =>
            onChange({ ...data, reasonsTheyNeedSoftware: v as string[] })
          }
        />
        <SectionCard icon={SkipForward} tone="ink" title="Do not waste time asking">
          {editing ? (
            <EditableSection
              editing
              label=""
              list
              value={data.questionsToSkip}
              onChange={(v) =>
                onChange({ ...data, questionsToSkip: v as string[] })
              }
            />
          ) : (
            <ul className="space-y-2 text-sm text-slate-500">
              {data.questionsToSkip.filter(Boolean).map((q, i) => (
                <li key={i} className="line-through decoration-slate-400/80">
                  {q}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <FieldCard
          icon={Megaphone}
          tone="amber"
          title="Likely objections"
          list
          editing={editing}
          value={data.likelyObjections}
          onChange={(v) =>
            onChange({ ...data, likelyObjections: v as string[] })
          }
        />
        <FieldCard
          icon={Puzzle}
          title="Project wedges"
          list
          editing={editing}
          value={data.projectWedges}
          onChange={(v) =>
            onChange({ ...data, projectWedges: v as string[] })
          }
        />
        <FieldCard
          icon={ListChecks}
          title="Case studies to mention"
          list
          editing={editing}
          value={data.caseStudiesToMention}
          onChange={(v) =>
            onChange({ ...data, caseStudiesToMention: v as string[] })
          }
        />
        <SectionCard icon={Ear} tone="teal" title="Listen for on the call" highlight>
          {editing ? (
            <EditableSection
              editing
              label=""
              list
              value={data.thingsToListenFor}
              onChange={(v) =>
                onChange({ ...data, thingsToListenFor: v as string[] })
              }
            />
          ) : (
            <ul className="space-y-2">
              {data.thingsToListenFor.filter(Boolean).map((item, i) => (
                <li
                  key={i}
                  className="rounded-lg bg-teal-950/6 px-3 py-2 text-sm text-slate-800"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
