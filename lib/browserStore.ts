import {
  NORTHLINE,
  NORTHLINE_ACCOUNT_BRIEF,
  NORTHLINE_DISCOVERY_PLAN,
  NORTHLINE_FOLLOW_UPS,
  NORTHLINE_PROPOSAL,
  NORTHLINE_REQUIREMENTS,
  NORTHLINE_SOLUTION,
  NORTHLINE_TRANSCRIPT,
} from "./seed/northline";
import type { Deal, DealListItem } from "./types";

const KEY = "deal-prep-deals";

const PATCHABLE = new Set([
  "company_name",
  "company_url",
  "contact_name",
  "contact_title",
  "current_step",
  "transcript",
  "account_brief",
  "discovery_plan",
  "structured_requirements",
  "follow_up_questions",
  "solution_hypothesis",
  "proposal",
]);

function readAll(): Deal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Deal[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(deals: Deal[]) {
  localStorage.setItem(KEY, JSON.stringify(deals));
}

function blankDeal(): Omit<Deal, "id" | "company_name" | "created_at"> {
  return {
    company_url: "",
    contact_name: "",
    contact_title: "",
    current_step: 1,
    is_sample: false,
    account_brief: null,
    discovery_plan: null,
    transcript: null,
    structured_requirements: null,
    follow_up_questions: null,
    solution_hypothesis: null,
    proposal: null,
  };
}

export function listDeals(): DealListItem[] {
  return readAll()
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((deal) => ({
      id: deal.id,
      company_name: deal.company_name,
      contact_name: deal.contact_name,
      contact_title: deal.contact_title,
      current_step: deal.current_step,
      is_sample: deal.is_sample,
      created_at: deal.created_at,
    }));
}

export function getDeal(id: string): Deal | null {
  return readAll().find((deal) => deal.id === id) ?? null;
}

export function createDeal(input: {
  company_name: string;
  company_url?: string;
  contact_name?: string;
  contact_title?: string;
  is_sample?: boolean;
  current_step?: number;
  transcript?: string | null;
  account_brief?: Deal["account_brief"];
  discovery_plan?: Deal["discovery_plan"];
  structured_requirements?: Deal["structured_requirements"];
  follow_up_questions?: Deal["follow_up_questions"];
  solution_hypothesis?: Deal["solution_hypothesis"];
  proposal?: Deal["proposal"];
}): Deal {
  const deal: Deal = {
    ...blankDeal(),
    id: crypto.randomUUID(),
    company_name: input.company_name,
    company_url: input.company_url ?? "",
    contact_name: input.contact_name ?? "",
    contact_title: input.contact_title ?? "",
    is_sample: Boolean(input.is_sample),
    current_step: input.current_step ?? 1,
    transcript: input.transcript ?? null,
    account_brief: input.account_brief ?? null,
    discovery_plan: input.discovery_plan ?? null,
    structured_requirements: input.structured_requirements ?? null,
    follow_up_questions: input.follow_up_questions ?? null,
    solution_hypothesis: input.solution_hypothesis ?? null,
    proposal: input.proposal ?? null,
    created_at: new Date().toISOString(),
  };
  writeAll([deal, ...readAll()]);
  return deal;
}

export function updateDeal(
  id: string,
  patch: Record<string, unknown>,
): Deal | null {
  const deals = readAll();
  const index = deals.findIndex((deal) => deal.id === id);
  if (index < 0) return null;

  const next = { ...deals[index] };
  for (const [key, value] of Object.entries(patch)) {
    if (!PATCHABLE.has(key) || value === undefined) continue;
    (next as Record<string, unknown>)[key] = value;
  }
  deals[index] = next;
  writeAll(deals);
  return next;
}

export function createSample(mode: "walkthrough" | "completed"): Deal {
  if (mode === "completed") {
    return createDeal({
      ...NORTHLINE,
      is_sample: true,
      current_step: 6,
      transcript: NORTHLINE_TRANSCRIPT,
      account_brief: NORTHLINE_ACCOUNT_BRIEF,
      discovery_plan: NORTHLINE_DISCOVERY_PLAN,
      structured_requirements: NORTHLINE_REQUIREMENTS,
      follow_up_questions: NORTHLINE_FOLLOW_UPS,
      solution_hypothesis: NORTHLINE_SOLUTION,
      proposal: NORTHLINE_PROPOSAL,
    });
  }
  return createDeal({
    ...NORTHLINE,
    is_sample: true,
    current_step: 1,
    transcript: NORTHLINE_TRANSCRIPT,
  });
}
