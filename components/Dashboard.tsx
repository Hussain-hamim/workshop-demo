"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Plus,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";
import {
  createDeal as createStoredDeal,
  createSample,
  fetchLiveAi,
  listDeals,
} from "@/lib/clientDeals";
import type { DealListItem, StorageMode } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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

export function Dashboard({ storageMode }: { storageMode: StorageMode }) {
  const router = useRouter();
  const [deals, setDeals] = useState<DealListItem[]>([]);
  const [liveAi, setLiveAi] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    company_name: "",
    company_url: "",
    contact_name: "",
    contact_title: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ai, listed] = await Promise.all([
          fetchLiveAi(),
          listDeals(storageMode),
        ]);
        if (cancelled) return;
        setLiveAi(typeof listed.liveAi === "boolean" ? listed.liveAi : ai);
        setDeals(listed.deals);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load deals");
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storageMode]);

  async function loadSample(mode: "walkthrough" | "completed") {
    setError(null);
    setBusy(mode);
    try {
      const deal = await createSample(storageMode, mode);
      router.push(`/deals/${deal.id}`);
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
      const deal = await createStoredDeal(storageMode, form);
      router.push(`/deals/${deal.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create deal");
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="overflow-hidden rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.4fr_1fr] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="h-auto rounded-full border-transparent bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100 hover:bg-white/10"
              >
                Workshop demo
              </Badge>
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
            <Button
              type="button"
              disabled={Boolean(busy)}
              onClick={() => loadSample("walkthrough")}
              className="pulse-ring h-auto justify-between rounded-2xl bg-amber-400 px-5 py-4 text-left text-amber-950 hover:bg-amber-300"
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
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={Boolean(busy)}
              onClick={() => loadSample("completed")}
              className="h-auto justify-between rounded-2xl bg-white/10 px-5 py-4 text-left text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
            >
              <span>
                <span className="block text-xs uppercase tracking-widest text-teal-200">
                  Skip ahead
                </span>
                <span className="font-medium">Open finished proposal</span>
              </span>
              <ArrowRight />
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_18px_40px_-28px_rgba(15,28,36,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-rose-800">
              <XCircle className="size-4" />
              How it is done today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {BEFORE.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="w-5 text-xs text-muted-foreground/70">
                    {i + 1}
                  </span>
                  <Separator className="flex-1 bg-rose-100" />
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <article className="card-dark p-6">
          <div className="mb-4 flex items-center gap-2 text-amber-300">
            <CheckCircle2 size={18} />
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              What you will demo
            </h2>
          </div>
          <ol className="space-y-2">
            {AFTER.map((item, i) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-[#f7f3ea]"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-amber-950">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      {error ? (
        <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_18px_40px_-28px_rgba(15,28,36,0.45)]">
          <CardHeader>
            <div className="flex items-start gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Truck />
              </span>
              <div>
                <CardTitle className="font-display text-2xl font-normal">
                  Northline Logistics
                </CardTitle>
                <CardDescription>
                  Sarah Chen · VP Operations · regional freight, spreadsheet
                  dispatch, no customer portal.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The walkthrough starts with company + transcript only. Click
              Generate at each stage so the room watches the story build.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_18px_40px_-28px_rgba(15,28,36,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="size-4" />
              New deal
            </CardTitle>
            <CardDescription>
              {!liveAi ? (
                <span className="mt-1 block rounded-xl bg-amber-50 px-3 py-2 text-amber-950">
                  Add <code>OPENAI_API_KEY</code> or{" "}
                  <code>OPENROUTER_API_KEY</code> in <code>.env.local</code> or
                  Vercel env to research any company live.
                </span>
              ) : (
                "Live AI will research this company from the name and URL."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createDeal} className="grid gap-3">
              <Input
                required
                disabled={!liveAi}
                placeholder="Company name"
                className="h-10 rounded-xl bg-background"
                value={form.company_name}
                onChange={(e) =>
                  setForm({ ...form, company_name: e.target.value })
                }
              />
              <Input
                disabled={!liveAi}
                placeholder="Company URL"
                className="h-10 rounded-xl bg-background"
                value={form.company_url}
                onChange={(e) =>
                  setForm({ ...form, company_url: e.target.value })
                }
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  disabled={!liveAi}
                  placeholder="Contact name"
                  className="h-10 rounded-xl bg-background"
                  value={form.contact_name}
                  onChange={(e) =>
                    setForm({ ...form, contact_name: e.target.value })
                  }
                />
                <Input
                  disabled={!liveAi}
                  placeholder="Contact title"
                  className="h-10 rounded-xl bg-background"
                  value={form.contact_title}
                  onChange={(e) =>
                    setForm({ ...form, contact_title: e.target.value })
                  }
                />
              </div>
              <Button
                type="submit"
                disabled={!liveAi || Boolean(busy)}
                className="h-10 rounded-xl"
              >
                <Sparkles />
                {busy === "create" ? "Creating..." : "Start new deal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl">Deals in this session</h2>
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading deals…</p>
        ) : deals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No deals yet. Hit the gold walkthrough button to begin.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {deals.map((deal) => (
              <li key={deal.id}>
                <a href={`/deals/${deal.id}`} className="block">
                  <Card className="rounded-2xl transition hover:-translate-y-0.5 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_18px_40px_-28px_rgba(15,28,36,0.45)]">
                    <CardContent className="flex items-center justify-between gap-3 py-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          {deal.company_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {deal.contact_name}
                          {deal.contact_title
                            ? ` · ${deal.contact_title}`
                            : ""}
                          {deal.is_sample ? " · Sample" : ""}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-xs font-medium"
                      >
                        Step {deal.current_step}/6
                      </Badge>
                    </CardContent>
                  </Card>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
