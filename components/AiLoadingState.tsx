"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { GenerateStep } from "@/lib/types";

const STAGES: Record<GenerateStep, string[]> = {
  account_brief: [
    "Request received",
    "Reading company and contact",
    "Gathering public signals",
    "Mapping leadership, stack, and pain",
    "Drafting the account brief",
  ],
  discovery_plan: [
    "Request received",
    "Turning research into a point of view",
    "Writing company-specific questions",
    "Anticipating objections",
    "Preparing the call plan",
  ],
  structured_requirements: [
    "Request received",
    "Reading the transcript",
    "Extracting problems and stakeholders",
    "Structuring requirements",
    "Flagging what is still unknown",
  ],
  follow_up_questions: [
    "Request received",
    "Checking what the call answered",
    "Finding missing commercial facts",
    "Drafting follow-up questions",
  ],
  solution_hypothesis: [
    "Request received",
    "Interpreting approved requirements",
    "Sketching architecture and modules",
    "Splitting phase 1 from later work",
  ],
  proposal: [
    "Request received",
    "Framing the problem",
    "Writing scope and milestones",
    "Preparing pricing inputs and next steps",
  ],
};

export function AiLoadingState({
  step,
  title,
  refining = false,
  onCancel,
}: {
  step: GenerateStep;
  title: string;
  refining?: boolean;
  onCancel?: () => void;
}) {
  const stages = STAGES[step];
  const [active, setActive] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setActive(0);
    setElapsed(0);
    const ticks = setInterval(() => {
      setElapsed((s) => s + 1);
      setActive((i) => Math.min(i + 1, stages.length - 1));
    }, 2200);
    return () => clearInterval(ticks);
  }, [step, stages.length]);

  const longWait = elapsed >= 10;

  return (
    <div className="fade-up grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
      <aside className="rounded-2xl bg-teal-950 p-5 text-teal-50">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-200">
            Activity
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
            <span className="status-dot" />
            Working
          </span>
        </div>
        <p className="font-display mt-3 text-xl leading-snug">
          {refining ? `Updating ${title}` : `Creating ${title.toLowerCase()}`}
        </p>
        <ol className="mt-5 space-y-2.5">
          {stages.map((stage, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <li
                key={stage}
                className={`flex items-start gap-2 text-sm ${
                  current
                    ? "text-white"
                    : done
                      ? "text-teal-200"
                      : "text-teal-200/40"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    done
                      ? "bg-emerald-400 text-emerald-950"
                      : current
                        ? "bg-amber-400"
                        : "bg-white/10"
                  }`}
                >
                  {done ? <Check size={10} strokeWidth={3} /> : null}
                </span>
                {stage}
              </li>
            );
          })}
        </ol>
        {refining ? (
          <p className="mt-5 text-xs leading-relaxed text-teal-200/80">
            Showing the previous version · still refining
          </p>
        ) : (
          <p className="mt-5 text-xs leading-relaxed text-teal-200/80">
            {longWait
              ? "Usually 15–40 seconds. You can keep presenting — this keeps running."
              : "Request received. Visible progress while the brief is produced."}
          </p>
        )}
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="mt-4 text-xs font-medium text-teal-100 underline decoration-teal-100/40 underline-offset-2"
          >
            Cancel this run
          </button>
        ) : null}
      </aside>
      <SkeletonCanvas step={step} />
    </div>
  );
}

export function AiWorkingBanner({
  title,
  onCancel,
}: {
  title: string;
  onCancel: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-teal-950 px-4 py-3 text-teal-50">
      <p className="flex items-center gap-2 text-sm">
        <span className="status-dot" />
        Updating {title} · previous version still visible
      </p>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs font-medium underline decoration-white/30 underline-offset-2"
      >
        Cancel this run
      </button>
    </div>
  );
}

function Bone({ className = "" }: { className?: string }) {
  return <div className={`skeleton-bone rounded-lg ${className}`} />;
}

function SkeletonCanvas({ step }: { step: GenerateStep }) {
  if (step === "account_brief") {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Bone className="h-28" />
          <Bone className="h-28" />
          <Bone className="h-28" />
        </div>
        <Bone className="h-24" />
        <div className="grid gap-3 md:grid-cols-2">
          <Bone className="h-36" />
          <Bone className="h-36" />
        </div>
      </div>
    );
  }
  if (step === "discovery_plan") {
    return (
      <div className="space-y-3">
        <Bone className="h-16" />
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-12" />
        ))}
      </div>
    );
  }
  if (step === "structured_requirements") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Bone className="h-32" />
        <Bone className="h-32" />
        <Bone className="h-40 md:col-span-2" />
        <Bone className="h-28" />
        <Bone className="h-28" />
      </div>
    );
  }
  if (step === "follow_up_questions") {
    return (
      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <Bone className="h-36 rounded-full" />
        <div className="space-y-3">
          <Bone className="h-16" />
          <Bone className="h-16" />
          <Bone className="h-16" />
        </div>
      </div>
    );
  }
  if (step === "solution_hypothesis") {
    return (
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <Bone className="h-16" />
          <Bone className="h-16" />
          <Bone className="h-16" />
        </div>
        <Bone className="h-14" />
        <div className="grid gap-3 md:grid-cols-2">
          <Bone className="h-32" />
          <Bone className="h-32" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <Bone className="h-28" />
      <Bone className="h-20" />
      <Bone className="h-20" />
      <div className="grid gap-3 md:grid-cols-2">
        <Bone className="h-24" />
        <Bone className="h-24" />
      </div>
    </div>
  );
}
