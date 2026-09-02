import OpenAI from "openai";
import type { Deal, GenerateStep } from "./types";
import { buildPrompt } from "./prompts";
import {
  NORTHLINE_ACCOUNT_BRIEF,
  NORTHLINE_DISCOVERY_PLAN,
  NORTHLINE_FOLLOW_UPS,
  NORTHLINE_PROPOSAL,
  NORTHLINE_REQUIREMENTS,
  NORTHLINE_SOLUTION,
} from "./seed/northline";

export const EXPECTED_KEYS: Record<GenerateStep, string[]> = {
  account_brief: [
    "whatTheyDo",
    "businessModel",
    "companySize",
    "locations",
    "recentNews",
    "hiringActivity",
    "leadership",
    "products",
    "competitors",
    "likelyTechStack",
    "strategicInitiatives",
    "publicPainSignals",
  ],
  discovery_plan: [
    "likelyPriorities",
    "painHypotheses",
    "reasonsTheyNeedSoftware",
    "questionsToSkip",
    "discoveryQuestions",
    "likelyObjections",
    "projectWedges",
    "caseStudiesToMention",
    "thingsToListenFor",
  ],
  structured_requirements: [
    "businessContext",
    "problems",
    "requirements",
    "users",
    "workflow",
    "commercial",
    "stakeholders",
    "risks",
  ],
  follow_up_questions: ["gaps"],
  solution_hypothesis: [
    "summary",
    "architecture",
    "majorModules",
    "workflows",
    "integrations",
    "userRoles",
    "milestones",
    "phase1",
    "futurePhases",
  ],
  proposal: [
    "executiveSummary",
    "problemUnderstanding",
    "proposedSolution",
    "scope",
    "milestones",
    "timeline",
    "exclusions",
    "assumptions",
    "pricingInputs",
    "nextSteps",
  ],
};

const SEED_BY_STEP: Record<GenerateStep, unknown> = {
  account_brief: NORTHLINE_ACCOUNT_BRIEF,
  discovery_plan: NORTHLINE_DISCOVERY_PLAN,
  structured_requirements: NORTHLINE_REQUIREMENTS,
  follow_up_questions: NORTHLINE_FOLLOW_UPS,
  solution_hypothesis: NORTHLINE_SOLUTION,
  proposal: NORTHLINE_PROPOSAL,
};

type Provider = {
  name: string;
  client: OpenAI;
  model: string;
};

function env(name: string) {
  return process.env[name]?.trim() || "";
}

function openaiKey() {
  return env("OPENAI_API_KEY");
}

function openrouterKey() {
  return env("OPENROUTER_API_KEY");
}

function fallbackModels() {
  return env("OPENROUTER_FALLBACK_MODELS")
    .split(/[,\s]+/)
    .map((m) => m.trim())
    .filter(Boolean);
}

export function isLiveAi(): boolean {
  return Boolean(openaiKey() || openrouterKey());
}

export function hasExpectedKeys(step: GenerateStep, json: unknown): boolean {
  if (!json || typeof json !== "object") return false;
  const keys = EXPECTED_KEYS[step];
  return keys.every((key) => key in (json as Record<string, unknown>));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function providers(): Provider[] {
  const chain: Provider[] = [];

  if (openaiKey()) {
    chain.push({
      name: "openai",
      model: "gpt-4o-mini",
      client: new OpenAI({ apiKey: openaiKey() }),
    });
  }

  const routerKey = openrouterKey();
  if (routerKey) {
    const router = new OpenAI({
      apiKey: routerKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Deal Prep Workshop Demo",
      },
    });
    const seen = new Set<string>();
    const models = [
      env("OPENROUTER_MODEL") || "openai/gpt-4o-mini",
      ...fallbackModels(),
    ];
    for (const model of models) {
      if (seen.has(model)) continue;
      seen.add(model);
      chain.push({ name: `openrouter:${model}`, client: router, model });
    }
  }

  return chain;
}

const MESSAGES = (step: GenerateStep, deal: Deal) => [
  {
    role: "system" as const,
    content:
      "You produce structured JSON for a deal-prep workshop demo. No markdown. No extra keys wrapping the object.",
  },
  { role: "user" as const, content: buildPrompt(step, deal) },
];

async function complete(provider: Provider, step: GenerateStep, deal: Deal) {
  const messages = MESSAGES(step, deal);
  try {
    return await provider.client.chat.completions.create({
      model: provider.model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages,
    });
  } catch {
    return await provider.client.chat.completions.create({
      model: provider.model,
      temperature: 0.4,
      messages,
    });
  }
}

function parseContent(raw: string | null | undefined) {
  if (!raw?.trim()) {
    throw new Error("Empty model response — hit Regenerate");
  }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const slice =
    start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
  try {
    return JSON.parse(slice) as unknown;
  } catch {
    throw new Error("Model returned invalid JSON — hit Regenerate");
  }
}

export async function generateStep(step: GenerateStep, deal: Deal) {
  const chain = providers();
  if (chain.length === 0) {
    await sleep(1000);
    return SEED_BY_STEP[step];
  }

  const errors: string[] = [];
  for (const provider of chain) {
    try {
      const response = await complete(provider, step, deal);
      const parsed = parseContent(response.choices[0]?.message?.content);
      if (!hasExpectedKeys(step, parsed)) {
        throw new Error("Bad shape — hit Regenerate");
      }
      return parsed;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown provider error";
      errors.push(`${provider.name}: ${message}`);
    }
  }

  throw new Error(errors.join(" → ") || "Generation failed");
}
