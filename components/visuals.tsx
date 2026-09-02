"use client";

import type { LucideIcon } from "lucide-react";

export function IconBubble({
  icon: Icon,
  tone = "teal",
}: {
  icon: LucideIcon;
  tone?: "teal" | "amber" | "ink" | "rose" | "gold";
}) {
  const tones = {
    teal: "bg-teal-950 text-teal-50",
    amber: "bg-orange-700 text-orange-50",
    ink: "bg-slate-900 text-white",
    rose: "bg-rose-800 text-rose-50",
    gold: "bg-amber-500 text-amber-950",
  };
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}
    >
      <Icon size={18} strokeWidth={2} />
    </span>
  );
}

export function Donut({
  value,
  label,
  sub,
}: {
  value: number;
  label: string;
  sub?: string;
}) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;
  return (
    <div className="flex items-center gap-4">
      <svg width="92" height="92" viewBox="0 0 92 92" className="shrink-0">
        <circle
          cx="46"
          cy="46"
          r={r}
          fill="none"
          stroke="#e7e0d4"
          strokeWidth="10"
        />
        <circle
          cx="46"
          cy="46"
          r={r}
          fill="none"
          stroke="#0f766e"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 46 46)"
        />
        <text
          x="46"
          y="50"
          textAnchor="middle"
          className="fill-slate-900"
          fontSize="16"
          fontWeight="700"
        >
          {Math.round(clamped)}%
        </text>
      </svg>
      <div>
        <p className="font-display text-lg leading-tight text-slate-900">
          {label}
        </p>
        {sub ? <p className="text-sm text-slate-600">{sub}</p> : null}
      </div>
    </div>
  );
}

export function HBar({
  items,
}: {
  items: Array<{ label: string; value: number; color: string }>;
}) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <div className="space-y-3">
      <div className="flex h-3 overflow-hidden rounded-full bg-stone-200">
        {items.map((item) => (
          <div
            key={item.label}
            className="bar-fill h-full"
            style={{
              width: `${(item.value / total) * 100}%`,
              background: item.color,
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-xs">
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: item.color }}
            />
            {item.label} · {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Pipeline({
  active = 0,
  compact = false,
}: {
  active?: number;
  compact?: boolean;
}) {
  const nodes = [
    "Company",
    "Brief",
    "Plan",
    "Transcript",
    "Requirements",
    "Gaps",
    "Solution",
    "Proposal",
  ];
  return (
    <ol className="flex flex-wrap items-center gap-1.5">
      {nodes.map((node, i) => {
        const on = i <= active;
        return (
          <li key={node} className="flex items-center gap-1.5">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ${
                on
                  ? "bg-teal-950 text-teal-50"
                  : "bg-white/70 text-slate-500 ring-1 ring-stone-200"
              } ${compact ? "" : "sm:px-3 sm:py-1.5 sm:text-xs"}`}
            >
              {node}
            </span>
            {i < nodes.length - 1 ? (
              <span
                className={`hidden h-px w-3 sm:block ${on ? "bg-teal-800" : "bg-stone-300"}`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
