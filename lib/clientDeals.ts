import * as browser from "./browserStore";
import type { Deal, DealListItem, GenerateStep, StorageMode } from "./types";

export type { StorageMode };

const STEP_NUMBER: Record<GenerateStep, number> = {
  account_brief: 1,
  discovery_plan: 2,
  structured_requirements: 3,
  follow_up_questions: 4,
  solution_hypothesis: 5,
  proposal: 6,
};

async function readJson(res: Response) {
  return res.json().catch(() => ({}));
}

export async function fetchLiveAi(): Promise<boolean> {
  const res = await fetch("/api/mode");
  const json = await readJson(res);
  return Boolean(json.liveAi);
}

export async function listDeals(mode: StorageMode): Promise<{
  deals: DealListItem[];
  liveAi?: boolean;
}> {
  if (mode === "browser") return { deals: browser.listDeals() };
  const res = await fetch("/api/deals");
  const json = await readJson(res);
  if (!res.ok) throw new Error(json.error || "Could not load deals");
  return json;
}

export async function getDeal(
  mode: StorageMode,
  id: string,
): Promise<Deal | null> {
  if (mode === "browser") return browser.getDeal(id);
  const res = await fetch(`/api/deals/${id}`);
  if (res.status === 404) return null;
  const json = await readJson(res);
  if (!res.ok) throw new Error(json.error || "Could not load deal");
  return json.deal as Deal;
}

export async function createDeal(
  mode: StorageMode,
  input: {
    company_name: string;
    company_url?: string;
    contact_name?: string;
    contact_title?: string;
  },
): Promise<Deal> {
  if (mode === "browser") return browser.createDeal(input);
  const res = await fetch("/api/deals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await readJson(res);
  if (!res.ok) throw new Error(json.error || "Could not create deal");
  return json.deal as Deal;
}

export async function createSample(
  mode: StorageMode,
  sampleMode: "walkthrough" | "completed",
): Promise<Deal> {
  if (mode === "browser") return browser.createSample(sampleMode);
  const res = await fetch("/api/deals/sample", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: sampleMode }),
  });
  const json = await readJson(res);
  if (!res.ok) throw new Error(json.error || "Could not load sample");
  return json.deal as Deal;
}

export async function patchDeal(
  mode: StorageMode,
  id: string,
  patch: Record<string, unknown>,
): Promise<Deal> {
  if (mode === "browser") {
    const updated = browser.updateDeal(id, patch);
    if (!updated) throw new Error("Deal not found");
    return updated;
  }
  const res = await fetch(`/api/deals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const json = await readJson(res);
  if (!res.ok) throw new Error(json.error || "Save failed");
  return json.deal as Deal;
}

export function mergeArtifact(
  deal: Deal,
  step: GenerateStep,
  artifact: unknown,
  prefetch: boolean,
): Deal {
  return {
    ...deal,
    [step]: artifact,
    current_step: prefetch
      ? deal.current_step
      : Math.max(deal.current_step, STEP_NUMBER[step]),
  } as Deal;
}
