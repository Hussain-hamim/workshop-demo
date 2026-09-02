"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Plus,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";
import type { DealListItem } from "@/lib/types";
import { ModeBadge } from "./ModeBadge";
import { Pipeline } from "./visuals";

const BEFORE = [
  "Google the company",
  "Read LinkedIn",
  "Search recent news",
  "Write questions by hand",
  "Messy meeting notes",
  "Re-read the transcript",
  "Try to remember requirements",
  "Write scope and proposal",
  "Realize something was missed",
];

const AFTER = [
  "Company in",
  "Research brief",
  "Discovery plan",
  "Call transcript",
  "Structured requirements",
  "Missing questions",
  "Solution architecture",
  "Scope",
  "Proposal",
];

export function Dashboard({
  deals,
  liveAi,
}: {
  deals: DealListItem[];
  liveAi: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    company_name: "",
    company_url: "",
    contact_name: "",
    contact_title: "",
  });

  async function loadSample(mode: "walkthrough" | "completed") {
    setError(null);
    setBusy(mode);
    try {
      const res = await fetch("/api/deals/sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not load sample");
      router.push(`/deals/${json.deal.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load sample");
      setBusy(null);
    }
  }

  async function createDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!liveAi) return;
    setError(null);
    setBusy("create");
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not create deal");
      router.push(`/deals/${json.deal.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create deal");
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="overflow-hidden rounded-[2rem] bg-teal-950 text-teal-50 shadow-2xl shadow-teal-950/20">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.4fr_1fr] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">
                Workshop demo
              </span>
              <ModeBadge liveAi={liveAi} />
            </div>
            <h1 className="font-display mt-5 text-4xl leading-[1.1] tracking-tight sm:text-5xl">
              Deal Prep & Discovery Intelligence
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-teal-100/80">
              Show a room how AI plus custom software takes a seller from a
              company name to a proposal — without losing the human review in
              the middle.
            </p>
            <div className="mt-8">
              <Pipeline active={7} />
            </div>
          </div>
          <div className="flex flex-col justify-end gap-3">
            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={() => loadSample("walkthrough")}
              className="pulse-ring flex items-center justify-between rounded-2xl bg-amber-400 px-5 py-4 text-left text-amber-950 transition hover:bg-amber-300 disabled:opacity-60"
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-widest">
                  Recommended for the room
                </span>
                <span className="mt-1 block text-lg font-semibold">
                  {busy === "walkthrough"
                    ? "Opening walkthrough…"
                    : "Start live walkthrough"}
                </span>
              </span>
              <Play />
            </button>
            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={() => loadSample("completed")}
              className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 text-left hover:bg-white/15 disabled:opacity-60"
            >
              <span>
                <span className="block text-xs uppercase tracking-widest text-teal-200">
                  Skip ahead
                </span>
                <span className="font-medium">Open finished proposal</span>
              </span>
              <ArrowRight />
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card p-6">
          <div className="mb-4 flex items-center gap-2 text-rose-800">
            <XCircle size={18} />
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              How it is done today
            </h2>
          </div>
          <ol className="space-y-2">
            {BEFORE.map((item, i) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="w-5 text-xs text-slate-400">{i + 1}</span>
                <span className="h-px flex-1 bg-rose-100" />
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </article>
        <article className="card-dark p-6">
          <div className="mb-4 flex items-center gap-2 text-amber-300">
            <CheckCircle2 size={18} />
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              What you will demo
            </h2>
          </div>
          <ol className="space-y-2">
            {AFTER.map((item, i) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[#f7f3ea]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-amber-950">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-950 text-teal-50">
              <Truck />
            </span>
            <div>
              <h2 className="font-display text-2xl">Northline Logistics</h2>
              <p className="text-sm text-slate-600">
                Sarah Chen · VP Operations · regional freight, spreadsheet
                dispatch, no customer portal.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            The walkthrough starts with company + transcript only. Click
            Generate at each stage so the room watches the story build.
          </p>
        </div>

        <form onSubmit={createDeal} className="card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Plus size={18} />
            <h2 className="font-semibold">New deal</h2>
          </div>
          {!liveAi ? (
            <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
              Add <code>OPENAI_API_KEY</code> or <code>OPENROUTER_API_KEY</code>{" "}
              in <code>.env</code> / <code>.env.local</code> to research any
              company live.
            </p>
          ) : (
            <p className="mb-4 text-sm text-slate-600">
              Live AI will research this company from the name and URL.
            </p>
          )}
          <div className="grid gap-3">
            <input
              required
              disabled={!liveAi}
              placeholder="Company name"
              className="rounded-xl border border-stone-300 px-3 py-2 text-sm disabled:bg-stone-100"
              value={form.company_name}
              onChange={(e) =>
                setForm({ ...form, company_name: e.target.value })
              }
            />
            <input
              disabled={!liveAi}
              placeholder="Company URL"
              className="rounded-xl border border-stone-300 px-3 py-2 text-sm disabled:bg-stone-100"
              value={form.company_url}
              onChange={(e) =>
                setForm({ ...form, company_url: e.target.value })
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                disabled={!liveAi}
                placeholder="Contact name"
                className="rounded-xl border border-stone-300 px-3 py-2 text-sm disabled:bg-stone-100"
                value={form.contact_name}
                onChange={(e) =>
                  setForm({ ...form, contact_name: e.target.value })
                }
              />
              <input
                disabled={!liveAi}
                placeholder="Contact title"
                className="rounded-xl border border-stone-300 px-3 py-2 text-sm disabled:bg-stone-100"
                value={form.contact_title}
                onChange={(e) =>
                  setForm({ ...form, contact_title: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={!liveAi || Boolean(busy)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm text-white disabled:opacity-40"
            >
              <Sparkles size={16} />
              {busy === "create" ? "Creating..." : "Start new deal"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl">Deals in this session</h2>
        {deals.length === 0 ? (
          <p className="text-sm text-slate-500">
            No deals yet. Hit the gold walkthrough button to begin.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {deals.map((deal) => (
              <li key={deal.id}>
                <a
                  href={`/deals/${deal.id}`}
                  className="card flex items-center justify-between gap-3 p-4 transition hover:-translate-y-0.5"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {deal.company_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {deal.contact_name}
                      {deal.contact_title ? ` · ${deal.contact_title}` : ""}
                      {deal.is_sample ? " · Sample" : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-teal-950/8 px-3 py-1 text-xs font-medium text-teal-950">
                    Step {deal.current_step}/6
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
