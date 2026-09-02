"use client";

import {
  Ban,
  ClipboardList,
  FileText,
  Flag,
  ListChecks,
  Sparkles,
} from "lucide-react";
import type { Proposal } from "@/lib/types";
import { FieldCard, SectionCard } from "./SectionCard";
import { EditableSection } from "./EditableSection";

type Props = {
  data: Proposal;
  editing: boolean;
  onChange: (next: Proposal) => void;
};

export function ProposalView({ data, editing, onChange }: Props) {
  const set = <K extends keyof Proposal>(key: K, value: Proposal[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl bg-teal-950 text-teal-50">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 text-xs uppercase tracking-[0.2em] text-teal-200">
          <span>Proposal</span>
          <span>Phase 1</span>
        </div>
        <div className="p-6">
          {editing ? (
            <EditableSection
              editing
              label="Executive summary"
              value={data.executiveSummary}
              onChange={(v) => set("executiveSummary", String(v))}
            />
          ) : (
            <p className="font-display text-2xl leading-snug">
              {data.executiveSummary}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          icon={FileText}
          title="Understanding of the problem"
          editing={editing}
          value={data.problemUnderstanding}
          onChange={(v) => set("problemUnderstanding", String(v))}
        />
        <FieldCard
          icon={Sparkles}
          tone="gold"
          title="Proposed solution"
          editing={editing}
          value={data.proposedSolution}
          onChange={(v) => set("proposedSolution", String(v))}
          highlight
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          icon={ListChecks}
          title="Scope"
          list
          editing={editing}
          value={data.scope}
          onChange={(v) => set("scope", v as string[])}
        />
        <SectionCard icon={Flag} title="Milestones">
          {editing ? (
            <EditableSection
              editing
              label=""
              list
              value={data.milestones}
              onChange={(v) => set("milestones", v as string[])}
            />
          ) : (
            <ol className="relative space-y-4 border-l-2 border-amber-400 pl-5">
              {data.milestones.map((m, i) => (
                <li key={i}>
                  <span className="absolute -left-[9px] mt-1.5 h-3 w-3 rounded-full bg-amber-500" />
                  <p className="text-sm">{m}</p>
                </li>
              ))}
            </ol>
          )}
        </SectionCard>
      </div>

      <FieldCard
        icon={ClipboardList}
        title="Timeline"
        editing={editing}
        value={data.timeline}
        onChange={(v) => set("timeline", String(v))}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          icon={Ban}
          tone="rose"
          title="Exclusions"
          list
          editing={editing}
          value={data.exclusions}
          onChange={(v) => set("exclusions", v as string[])}
        />
        <FieldCard
          icon={ListChecks}
          title="Assumptions"
          list
          editing={editing}
          value={data.assumptions}
          onChange={(v) => set("assumptions", v as string[])}
        />
        <FieldCard
          icon={ClipboardList}
          tone="amber"
          title="Pricing inputs"
          list
          editing={editing}
          value={data.pricingInputs}
          onChange={(v) => set("pricingInputs", v as string[])}
          highlight
        />
        <FieldCard
          icon={Flag}
          tone="teal"
          title="Next steps"
          list
          editing={editing}
          value={data.nextSteps}
          onChange={(v) => set("nextSteps", v as string[])}
        />
      </div>
    </div>
  );
}
