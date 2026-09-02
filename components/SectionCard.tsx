"use client";

import type { LucideIcon } from "lucide-react";
import { EditableSection } from "./EditableSection";
import { IconBubble } from "./visuals";

export function SectionCard({
  icon,
  tone = "teal",
  title,
  children,
  highlight = false,
  className = "",
}: {
  icon: LucideIcon;
  tone?: "teal" | "amber" | "ink" | "rose" | "gold";
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`card p-5 ${highlight ? "ring-2 ring-orange-400/70" : ""} ${className}`}
    >
      <div className="mb-3 flex items-center gap-3">
        <IconBubble icon={icon} tone={tone} />
        <h3 className="text-sm font-semibold tracking-wide text-slate-800">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.filter(Boolean).map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="rounded-full bg-teal-950/8 px-3 py-1 text-sm text-slate-800 ring-1 ring-teal-950/10"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function FieldCard({
  icon,
  tone,
  title,
  editing,
  value,
  onChange,
  list,
  highlight,
}: {
  icon: LucideIcon;
  tone?: "teal" | "amber" | "ink" | "rose" | "gold";
  title: string;
  editing: boolean;
  value: string | string[];
  onChange: (v: string | string[]) => void;
  list?: boolean;
  highlight?: boolean;
}) {
  return (
    <SectionCard icon={icon} tone={tone} title={title} highlight={highlight}>
      <EditableSection
        editing={editing}
        label=""
        value={value}
        onChange={onChange}
        list={list}
      />
    </SectionCard>
  );
}
