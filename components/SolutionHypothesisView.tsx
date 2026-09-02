"use client";

import {
  Boxes,
  Layers,
  Puzzle,
  Route,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import type { SolutionHypothesis } from "@/lib/types";
import { FieldCard, SectionCard, ChipList } from "./SectionCard";
import { EditableSection } from "./EditableSection";

type Props = {
  data: SolutionHypothesis;
  editing: boolean;
  onChange: (next: SolutionHypothesis) => void;
};

export function SolutionHypothesisView({ data, editing, onChange }: Props) {
  const set = <K extends keyof SolutionHypothesis>(
    key: K,
    value: SolutionHypothesis[K],
  ) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <SectionCard
        icon={Sparkles}
        tone="gold"
        title="Here is what we think should be built"
        highlight
      >
        <EditableSection
          editing={editing}
          label=""
          value={data.summary}
          onChange={(v) => set("summary", String(v))}
        />
      </SectionCard>

      {!editing ? (
        <SectionCard icon={Layers} title="Architecture at a glance">
          <div className="grid gap-3 text-center text-sm">
            <div className="grid gap-2 sm:grid-cols-3">
              {["Customer portal", "Dispatch board", "Tracking"].map((m) => (
                <div
                  key={m}
                  className="rounded-xl bg-teal-950 px-3 py-4 font-medium text-teal-50"
                >
                  {m}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="h-6 w-px bg-teal-800" />
            </div>
            <div className="rounded-xl bg-slate-900 px-3 py-4 font-medium text-white">
              Shared operations database
            </div>
            <div className="flex justify-center">
              <div className="h-6 w-px bg-stone-300" />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {(data.integrations.length
                ? data.integrations.slice(0, 3)
                : ["QuickBooks", "SSO", "ELD / EDI"]
              ).map((m) => (
                <div
                  key={m}
                  className="rounded-xl bg-amber-50 px-3 py-3 ring-1 ring-amber-200"
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            {data.architecture}
          </p>
        </SectionCard>
      ) : (
        <FieldCard
          icon={Layers}
          title="Recommended architecture"
          editing
          value={data.architecture}
          onChange={(v) => set("architecture", String(v))}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard icon={Boxes} title="Major modules">
          {editing ? (
            <EditableSection
              editing
              label=""
              list
              value={data.majorModules}
              onChange={(v) => set("majorModules", v as string[])}
            />
          ) : (
            <ChipList items={data.majorModules} />
          )}
        </SectionCard>
        <FieldCard
          icon={Route}
          title="Workflows"
          list
          editing={editing}
          value={data.workflows}
          onChange={(v) => set("workflows", v as string[])}
        />
        <FieldCard
          icon={Puzzle}
          title="Integrations"
          list
          editing={editing}
          value={data.integrations}
          onChange={(v) => set("integrations", v as string[])}
        />
        <FieldCard
          icon={Users}
          title="User roles"
          list
          editing={editing}
          value={data.userRoles}
          onChange={(v) => set("userRoles", v as string[])}
        />
      </div>

      <SectionCard icon={Shield} tone="teal" title="Phasing">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-teal-950 p-4 text-teal-50">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-200">
              Phase 1
            </p>
            {editing ? (
              <div className="mt-2 text-slate-900">
                <EditableSection
                  editing
                  label=""
                  list
                  value={data.phase1}
                  onChange={(v) => set("phase1", v as string[])}
                />
              </div>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {data.phase1.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl bg-stone-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Later
            </p>
            {editing ? (
              <EditableSection
                editing
                label=""
                list
                value={data.futurePhases}
                onChange={(v) => set("futurePhases", v as string[])}
              />
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {data.futurePhases.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-4">
          {!editing ? (
            <ol className="relative space-y-4 border-l-2 border-teal-800/30 pl-5">
              {data.milestones.map((m, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-teal-800" />
                  <p className="text-sm text-slate-800">{m}</p>
                </li>
              ))}
            </ol>
          ) : (
            <EditableSection
              editing
              label="Milestones"
              list
              value={data.milestones}
              onChange={(v) => set("milestones", v as string[])}
            />
          )}
        </div>
      </SectionCard>
    </div>
  );
}
