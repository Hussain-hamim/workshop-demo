"use client";

import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
    <Card
      className={cn(
        "rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_18px_40px_-28px_rgba(15,28,36,0.45)]",
        highlight && "ring-2 ring-orange-400/70",
        className,
      )}
    >
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-3 text-sm font-semibold tracking-wide text-foreground">
          <IconBubble icon={icon} tone={tone} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.filter(Boolean).map((item, i) => (
        <Badge
          key={`${item}-${i}`}
          variant="secondary"
          className="h-auto rounded-full px-3 py-1 text-sm font-normal text-foreground"
        >
          {item}
        </Badge>
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
