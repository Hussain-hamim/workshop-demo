"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  Deal,
  GenerateStep,
  AccountBrief,
  DiscoveryPlan,
  StructuredRequirements,
  FollowUpQuestions,
  SolutionHypothesis,
  Proposal,
} from "@/lib/types";
import { proposalToMarkdown } from "@/lib/proposalMarkdown";
import { AccountBriefView } from "./AccountBriefView";
import { DiscoveryPlanView } from "./DiscoveryPlanView";
import { FollowUpQuestionsView } from "./FollowUpQuestionsView";
import { ModeBadge } from "./ModeBadge";
import { ProposalView } from "./ProposalView";
import { SolutionHypothesisView } from "./SolutionHypothesisView";
import { Stepper } from "./Stepper";
import { StructuredRequirementsView } from "./StructuredRequirementsView";
import { Pipeline } from "./visuals";
import { AiLoadingState, AiWorkingBanner } from "./AiLoadingState";
import {
  ArrowRight,
  Copy,
  Pencil,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const FLOW_INDEX: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 6,
  6: 7,
};

const META: Array<{
  n: number;
  step: GenerateStep | null;
  title: string;
  generate: string;
  loading: string;
}> = [
  {
    n: 1,
    step: "account_brief",
    title: "Account Research",
    generate: "Generate Account Brief",
    loading: "Researching account...",
  },
  {
    n: 2,
    step: "discovery_plan",
    title: "Discovery Prep",
    generate: "Generate Discovery Plan",
    loading: "Building discovery plan...",
  },
  {
    n: 3,
    step: "structured_requirements",
    title: "Transcript",
    generate: "Generate Structured Requirements",
    loading: "Structuring transcript...",
  },
  {
    n: 4,
    step: "follow_up_questions",
    title: "Gap Analysis",
    generate: "Generate Follow-up Questions",
    loading: "Finding gaps...",
  },
  {
    n: 5,
    step: "solution_hypothesis",
    title: "Solution",
    generate: "Generate Solution Hypothesis",
    loading: "Drafting solution...",
  },
  {
    n: 6,
    step: "proposal",
    title: "Proposal",
    generate: "Generate Proposal",
    loading: "Writing proposal...",
  },
];

function artifactForStep(deal: Deal, n: number) {
  switch (n) {
    case 1:
      return deal.account_brief;
    case 2:
      return deal.discovery_plan;
    case 3:
      return deal.structured_requirements;
    case 4:
      return deal.follow_up_questions;
    case 5:
      return deal.solution_hypothesis;
    case 6:
      return deal.proposal;
    default:
      return null;
  }
}

function columnForStep(n: number): GenerateStep {
  return META[n - 1].step as GenerateStep;
}

function canGenerate(deal: Deal, n: number) {
  if (n < 1 || n > 6) return false;
  if (columnForStep(n) === "structured_requirements" && !deal.transcript?.trim()) {
    return false;
  }
  return true;
}

type GenResult = { deal?: Deal; liveAi?: boolean; error?: string };

export function DealWizard({
  initialDeal,
  initialLiveAi,
}: {
  initialDeal: Deal;
  initialLiveAi: boolean;
}) {
  const [deal, setDeal] = useState(initialDeal);
  const [liveAi, setLiveAi] = useState(initialLiveAi);
  const [step, setStep] = useState(initialDeal.current_step || 1);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<unknown>(null);
  const [transcriptDraft, setTranscriptDraft] = useState(
    initialDeal.transcript ?? "",
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [preparing, setPreparing] = useState<string | null>(null);

  const inflight = useRef<Partial<Record<GenerateStep, Promise<GenResult>>>>(
    {},
  );
  const aborts = useRef<Partial<Record<GenerateStep, AbortController>>>({});
  const dealRef = useRef(deal);
  dealRef.current = deal;

  const meta = META[step - 1];
  const artifact = artifactForStep(deal, step);
  const viewData = editing && draft ? draft : artifact;

  function refreshFrom(payload: { deal?: Deal; liveAi?: boolean }) {
    if (payload.deal) {
      setDeal(payload.deal);
      setTranscriptDraft(payload.deal.transcript ?? "");
    }
    if (typeof payload.liveAi === "boolean") setLiveAi(payload.liveAi);
  }

  function requestGenerate(
    stepKey: GenerateStep,
    opts: { skipIfPresent?: boolean; prefetch?: boolean } = {},
  ) {
    const existing = inflight.current[stepKey];
    if (existing) return existing;

    const ac = new AbortController();
    aborts.current[stepKey] = ac;

    const promise = (async () => {
      const res = await fetch(`/api/deals/${dealRef.current.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: stepKey,
          skipIfPresent: opts.skipIfPresent ?? false,
          prefetch: opts.prefetch ?? false,
        }),
        signal: ac.signal,
      });
      const json = (await res.json()) as GenResult;
      if (!res.ok) throw new Error(json.error || "Generation failed");
      return json;
    })().finally(() => {
      if (inflight.current[stepKey] === promise) {
        delete inflight.current[stepKey];
      }
    });

    inflight.current[stepKey] = promise;
    return promise;
  }

  function prefetchStep(n: number) {
    if (!canGenerate(dealRef.current, n)) return;
    if (artifactForStep(dealRef.current, n)) return;
    const key = columnForStep(n);
    const label = META[n - 1]?.title;
    setPreparing(label);
    requestGenerate(key, { skipIfPresent: true, prefetch: true })
      .then((json) => refreshFrom(json))
      .catch(() => {})
      .finally(() => {
        setPreparing((current) => (current === label ? null : current));
      });
  }

  const skipStepEffect = useRef(true);

  useEffect(() => {
    if (!artifactForStep(initialDeal, 1) && canGenerate(initialDeal, 1)) {
      requestGenerate("account_brief", {
        skipIfPresent: true,
        prefetch: true,
      }).catch(() => {});
    } else {
      prefetchStep((initialDeal.current_step || 1) + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skipStepEffect.current) {
      skipStepEffect.current = false;
      return;
    }
    const key = columnForStep(step);
    if (artifactForStep(dealRef.current, step)) return;
    const pending = inflight.current[key];
    if (!pending) return;
    setBusy(META[step - 1].loading);
    let cancelled = false;
    pending
      .then((json) => {
        if (!cancelled) refreshFrom(json);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Generation failed");
        }
      })
      .finally(() => {
        if (!cancelled) setBusy(null);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function generate() {
    setError(null);
    setBusy(meta.loading);
    setEditing(false);
    try {
      if (step === 3) {
        const saved = await fetch(`/api/deals/${deal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: transcriptDraft }),
        });
        const savedJson = await saved.json();
        if (!saved.ok) throw new Error(savedJson.error || "Could not save transcript");
        refreshFrom(savedJson);
      }
      const json = await requestGenerate(columnForStep(step), {
        skipIfPresent: !artifact,
      });
      refreshFrom(json);
      if (json.deal) prefetchStep(step + 1);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(null);
    }
  }

  function cancelCurrent() {
    const key = columnForStep(step);
    aborts.current[key]?.abort();
    delete inflight.current[key];
    setBusy(null);
  }

  const isWorking =
    Boolean(busy) && busy !== "Saving..." && busy !== "Saving transcript...";

  async function saveEdits() {
    setError(null);
    setBusy("Saving...");
    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [columnForStep(step)]: draft }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      refreshFrom(json);
      setEditing(false);
      setDraft(null);
      prefetchStep(step + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  async function saveTranscript() {
    setError(null);
    setBusy("Saving transcript...");
    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptDraft }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      refreshFrom(json);
      if (step === 3) prefetchStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(null);
    }
  }

  async function goNext() {
    const next = Math.min(6, step + 1);
    setStep(next);
    setEditing(false);
    setDraft(null);
    setError(null);
    await fetch(`/api/deals/${deal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_step: next }),
    });
  }

  const markdown = useMemo(() => {
    if (!deal.proposal) return "";
    return proposalToMarkdown(deal.company_name, deal.proposal);
  }, [deal.company_name, deal.proposal]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-teal-900 hover:underline"
          >
            ← All deals
          </Link>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-slate-900">
            {deal.company_name}
          </h1>
          <p className="text-sm text-slate-600">
            {deal.contact_name}
            {deal.contact_title ? ` · ${deal.contact_title}` : ""}
            {deal.company_url ? ` · ${deal.company_url}` : ""}
            {deal.is_sample ? " · Sample: Northline" : ""}
          </p>
        </div>
        <ModeBadge liveAi={liveAi} />
      </div>

      <div className="card p-4">
        <Pipeline active={FLOW_INDEX[step] ?? 0} />
      </div>

      <Stepper
        current={step}
        onSelect={(n) => {
          setStep(n);
          setEditing(false);
          setDraft(null);
          setError(null);
        }}
      />

      <section className="card p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">
              Step {step} of 6
            </p>
            <h2 className="font-display text-2xl text-slate-900">
              {meta.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {preparing ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-950/8 px-3 py-1.5 text-xs font-medium text-teal-900">
                <span className="status-dot" />
                {preparing} · running in background
              </span>
            ) : null}
            {artifact && !editing ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-2 text-sm"
                onClick={() => {
                  setDraft(artifact);
                  setEditing(true);
                }}
              >
                <Pencil size={14} /> Edit
              </button>
            ) : null}
            {editing ? (
              <>
                <button
                  type="button"
                  className="rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  onClick={() => {
                    setEditing(false);
                    setDraft(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-teal-900 px-3 py-2 text-sm text-white disabled:opacity-50"
                  disabled={Boolean(busy)}
                  onClick={saveEdits}
                >
                  Save changes
                </button>
              </>
            ) : null}
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
                artifact ? "bg-slate-900" : "pulse-ring bg-teal-900"
              }`}
              disabled={isWorking || Boolean(busy)}
              onClick={generate}
            >
              {isWorking ? (
                <>
                  <span className="status-dot" /> Working
                </>
              ) : artifact ? (
                <>
                  <RefreshCw size={14} /> Regenerate
                </>
              ) : (
                <>
                  <Sparkles size={14} /> {meta.generate}
                </>
              )}
            </button>
            {step < 6 ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-900 px-3 py-2 text-sm text-teal-950"
                onClick={goNext}
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : null}
            {step === 6 && deal.proposal ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-2 text-sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(markdown);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                <Copy size={14} /> {copied ? "Copied" : "Copy Markdown"}
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}{" "}
            <button type="button" className="underline" onClick={generate}>
              Regenerate
            </button>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mb-8 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Call transcript
              </h3>
              <button
                type="button"
                className="text-sm text-teal-900 underline disabled:opacity-50"
                disabled={Boolean(busy)}
                onClick={saveTranscript}
              >
                Save transcript
              </button>
            </div>
            <textarea
              className="min-h-[200px] w-full rounded-2xl border border-stone-300 bg-[#fbfaf6] px-4 py-3 font-mono text-xs leading-relaxed outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20"
              value={transcriptDraft}
              onChange={(e) => setTranscriptDraft(e.target.value)}
              placeholder="Paste the discovery call transcript here."
            />
          </div>
        ) : null}

        <div key={step} className="slide-in">
          {isWorking && !viewData ? (
            <AiLoadingState
              step={columnForStep(step)}
              title={meta.title}
              onCancel={cancelCurrent}
            />
          ) : isWorking && viewData ? (
            <>
              <AiWorkingBanner title={meta.title} onCancel={cancelCurrent} />
              <div className="pointer-events-none opacity-70">
                {step === 1 ? (
                  <AccountBriefView
                    data={viewData as AccountBrief}
                    editing={false}
                    onChange={setDraft}
                  />
                ) : step === 2 ? (
                  <DiscoveryPlanView
                    data={viewData as DiscoveryPlan}
                    editing={false}
                    onChange={setDraft}
                  />
                ) : step === 3 ? (
                  <StructuredRequirementsView
                    data={viewData as StructuredRequirements}
                    editing={false}
                    onChange={setDraft}
                  />
                ) : step === 4 ? (
                  <FollowUpQuestionsView
                    data={viewData as FollowUpQuestions}
                    editing={false}
                    onChange={setDraft}
                  />
                ) : step === 5 ? (
                  <SolutionHypothesisView
                    data={viewData as SolutionHypothesis}
                    editing={false}
                    onChange={setDraft}
                  />
                ) : (
                  <ProposalView
                    data={viewData as Proposal}
                    editing={false}
                    onChange={setDraft}
                  />
                )}
              </div>
            </>
          ) : !viewData ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center">
              <Sparkles className="mx-auto text-teal-800" />
              <p className="mt-3 font-display text-xl">Nothing on this stage yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Use {meta.generate} so the room can watch this appear.
              </p>
            </div>
          ) : step === 1 ? (
            <AccountBriefView
              data={viewData as AccountBrief}
              editing={editing}
              onChange={setDraft}
            />
          ) : step === 2 ? (
            <DiscoveryPlanView
              data={viewData as DiscoveryPlan}
              editing={editing}
              onChange={setDraft}
            />
          ) : step === 3 ? (
            <StructuredRequirementsView
              data={viewData as StructuredRequirements}
              editing={editing}
              onChange={setDraft}
            />
          ) : step === 4 ? (
            <FollowUpQuestionsView
              data={viewData as FollowUpQuestions}
              editing={editing}
              onChange={setDraft}
            />
          ) : step === 5 ? (
            <SolutionHypothesisView
              data={viewData as SolutionHypothesis}
              editing={editing}
              onChange={setDraft}
            />
          ) : (
            <ProposalView
              data={viewData as Proposal}
              editing={editing}
              onChange={setDraft}
            />
          )}
        </div>
      </section>
    </div>
  );
}
