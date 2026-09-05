"use client";

import {
  Building2,
  ClipboardList,
  FileText,
  HelpCircle,
  Lightbulb,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Research", icon: Search },
  { n: 2, label: "Prep", icon: Lightbulb },
  { n: 3, label: "Transcript", icon: ClipboardList },
  { n: 4, label: "Gaps", icon: HelpCircle },
  { n: 5, label: "Solution", icon: Building2 },
  { n: 6, label: "Proposal", icon: FileText },
];

type Props = {
  current: number;
  onSelect: (n: number) => void;
};

export function Stepper({ current, onSelect }: Props) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {STEPS.map((step) => {
        const active = current === step.n;
        const done = current > step.n;
        const Icon = step.icon;
        return (
          <li key={step.n}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelect(step.n)}
              className={cn(
                "h-auto w-full justify-start gap-2 rounded-2xl px-3 py-3 text-left transition",
                active &&
                  "border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground",
                done &&
                  !active &&
                  "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                !active &&
                  !done &&
                  "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-xl",
                  active && "bg-white/15",
                  done && !active && "bg-primary text-primary-foreground",
                  !active && !done && "bg-muted",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-widest opacity-70">
                  {String(step.n).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold">{step.label}</span>
              </span>
            </Button>
          </li>
        );
      })}
    </ol>
  );
}
