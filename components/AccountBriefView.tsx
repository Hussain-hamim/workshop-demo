"use client";

import {
  Building2,
  Cpu,
  Flag,
  MapPin,
  Newspaper,
  Siren,
  Target,
  Users,
  Briefcase,
  UserRound,
} from "lucide-react";
import type { AccountBrief } from "@/lib/types";
import { ChipList, FieldCard, SectionCard } from "./SectionCard";
import { EditableSection } from "./EditableSection";

type Props = {
  data: AccountBrief;
  editing: boolean;
  onChange: (next: AccountBrief) => void;
};

export function AccountBriefView({ data, editing, onChange }: Props) {
  const set = <K extends keyof AccountBrief>(key: K, value: AccountBrief[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <FieldCard
          icon={Building2}
          title="What they do"
          editing={editing}
          value={data.whatTheyDo}
          onChange={(v) => set("whatTheyDo", String(v))}
        />
        <FieldCard
          icon={Briefcase}
          title="Business model"
          editing={editing}
          value={data.businessModel}
          onChange={(v) => set("businessModel", String(v))}
        />
        <div className="grid gap-4">
          <FieldCard
            icon={Users}
            tone="gold"
            title="Company size"
            editing={editing}
            value={data.companySize}
            onChange={(v) => set("companySize", String(v))}
          />
          <FieldCard
            icon={MapPin}
            title="Locations / markets"
            editing={editing}
            value={data.locations}
            onChange={(v) => set("locations", String(v))}
          />
        </div>
      </div>

      <SectionCard icon={Siren} tone="rose" title="Public pain signals" highlight>
        {editing ? (
          <EditableSection
            editing
            label=""
            list
            value={data.publicPainSignals}
            onChange={(v) => set("publicPainSignals", v as string[])}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.publicPainSignals.filter(Boolean).map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-950 ring-1 ring-rose-200"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          icon={Newspaper}
          title="Recent news"
          list
          editing={editing}
          value={data.recentNews}
          onChange={(v) => set("recentNews", v as string[])}
        />
        <FieldCard
          icon={Flag}
          title="Hiring activity"
          editing={editing}
          value={data.hiringActivity}
          onChange={(v) => set("hiringActivity", String(v))}
        />
        <SectionCard icon={UserRound} title="Leadership">
          {editing ? (
            <EditableSection
              editing
              label=""
              list
              value={data.leadership}
              onChange={(v) => set("leadership", v as string[])}
            />
          ) : (
            <ul className="space-y-2">
              {data.leadership.filter(Boolean).map((person, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-950 text-xs font-semibold text-teal-50">
                    {person.slice(0, 1)}
                  </span>
                  {person}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
        <FieldCard
          icon={Target}
          title="Strategic initiatives"
          list
          editing={editing}
          value={data.strategicInitiatives}
          onChange={(v) => set("strategicInitiatives", v as string[])}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard icon={Cpu} title="Likely tech stack">
          {editing ? (
            <EditableSection
              editing
              label=""
              list
              value={data.likelyTechStack}
              onChange={(v) => set("likelyTechStack", v as string[])}
            />
          ) : (
            <ChipList items={data.likelyTechStack} />
          )}
        </SectionCard>
        <div className="grid gap-4">
          <FieldCard
            icon={Briefcase}
            title="Products / services"
            list
            editing={editing}
            value={data.products}
            onChange={(v) => set("products", v as string[])}
          />
          <FieldCard
            icon={Users}
            tone="amber"
            title="Competitors"
            list
            editing={editing}
            value={data.competitors}
            onChange={(v) => set("competitors", v as string[])}
          />
        </div>
      </div>
    </div>
  );
}
