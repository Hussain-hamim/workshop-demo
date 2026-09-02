"use client";

import {
  Building2,
  ClipboardList,
  FileText,
  HelpCircle,
  Lightbulb,
  Search,
} from "lucide-react";

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
            <button
              type="button"
              onClick={() => onSelect(step.n)}
              className={`flex w-full items-center gap-2 rounded-2xl px-3 py-3 text-left transition ${
                active
                  ? "bg-teal-950 text-white shadow-lg shadow-teal-950/20"
                  : done
                    ? "bg-teal-950/10 text-teal-950"
                    : "bg-white/80 text-slate-500 ring-1 ring-stone-200"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  active ? "bg-white/15" : done ? "bg-teal-950 text-white" : "bg-stone-100"
                }`}
              >
                <Icon size={16} />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-widest opacity-70">
                  {String(step.n).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold">{step.label}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
