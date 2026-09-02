import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Database as SqliteDatabase } from "better-sqlite3";
import type {
  AccountBrief,
  Deal,
  DealListItem,
  DiscoveryPlan,
  FollowUpQuestions,
  Proposal,
  SolutionHypothesis,
  StructuredRequirements,
} from "./types";

const JSON_COLUMNS = [
  "account_brief",
  "discovery_plan",
  "structured_requirements",
  "follow_up_questions",
  "solution_hypothesis",
  "proposal",
] as const;

type JsonColumn = (typeof JSON_COLUMNS)[number];

type DealRow = {
  id: string;
  company_name: string;
  company_url: string;
  contact_name: string;
  contact_title: string;
  current_step: number;
  is_sample: number;
  account_brief: string | null;
  discovery_plan: string | null;
  transcript: string | null;
  structured_requirements: string | null;
  follow_up_questions: string | null;
  solution_hypothesis: string | null;
  proposal: string | null;
  created_at: string;
};

const globalForDb = globalThis as unknown as { dealPrepDb?: SqliteDatabase };

function getDb(): SqliteDatabase {
  if (process.env.VERCEL) {
    throw new Error(
      "SQLite is not available on Vercel. Deal data is stored in the browser.",
    );
  }
  if (globalForDb.dealPrepDb) return globalForDb.dealPrepDb;

  // Loaded only when a local API route actually needs the file DB.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3") as typeof import("better-sqlite3");
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const db = new Database(path.join(dataDir, "deals.db"));
  globalForDb.dealPrepDb = db;
  db.exec(`
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      company_url TEXT NOT NULL DEFAULT '',
      contact_name TEXT NOT NULL DEFAULT '',
      contact_title TEXT NOT NULL DEFAULT '',
      current_step INTEGER NOT NULL DEFAULT 1,
      is_sample INTEGER NOT NULL DEFAULT 0,
      account_brief TEXT,
      discovery_plan TEXT,
      transcript TEXT,
      structured_requirements TEXT,
      follow_up_questions TEXT,
      solution_hypothesis TEXT,
      proposal TEXT,
      created_at TEXT NOT NULL
    );
  `);
  return db;
}

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function rowToDeal(row: DealRow): Deal {
  return {
    id: row.id,
    company_name: row.company_name,
    company_url: row.company_url,
    contact_name: row.contact_name,
    contact_title: row.contact_title,
    current_step: row.current_step,
    is_sample: Boolean(row.is_sample),
    account_brief: parseJson<AccountBrief>(row.account_brief),
    discovery_plan: parseJson<DiscoveryPlan>(row.discovery_plan),
    transcript: row.transcript,
    structured_requirements: parseJson<StructuredRequirements>(
      row.structured_requirements,
    ),
    follow_up_questions: parseJson<FollowUpQuestions>(row.follow_up_questions),
    solution_hypothesis: parseJson<SolutionHypothesis>(row.solution_hypothesis),
    proposal: parseJson<Proposal>(row.proposal),
    created_at: row.created_at,
  };
}

export function listDeals(): DealListItem[] {
  const rows = getDb()
    .prepare(
      `SELECT id, company_name, contact_name, contact_title, current_step, is_sample, created_at
       FROM deals ORDER BY created_at DESC`,
    )
    .all() as Omit<
    DealRow,
    | "company_url"
    | "account_brief"
    | "discovery_plan"
    | "transcript"
    | "structured_requirements"
    | "follow_up_questions"
    | "solution_hypothesis"
    | "proposal"
  >[];

  return rows.map((row) => ({
    id: row.id,
    company_name: row.company_name,
    contact_name: row.contact_name,
    contact_title: row.contact_title,
    current_step: row.current_step,
    is_sample: Boolean(row.is_sample),
    created_at: row.created_at,
  }));
}

export function getDeal(id: string): Deal | null {
  const row = getDb()
    .prepare("SELECT * FROM deals WHERE id = ?")
    .get(id) as DealRow | undefined;
  return row ? rowToDeal(row) : null;
}

export function createDeal(input: {
  company_name: string;
  company_url?: string;
  contact_name?: string;
  contact_title?: string;
  is_sample?: boolean;
  current_step?: number;
  transcript?: string | null;
  account_brief?: AccountBrief | null;
  discovery_plan?: DiscoveryPlan | null;
  structured_requirements?: StructuredRequirements | null;
  follow_up_questions?: FollowUpQuestions | null;
  solution_hypothesis?: SolutionHypothesis | null;
  proposal?: Proposal | null;
}): Deal {
  const id = randomUUID();
  const created_at = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO deals (
      id, company_name, company_url, contact_name, contact_title,
      current_step, is_sample, account_brief, discovery_plan, transcript,
      structured_requirements, follow_up_questions, solution_hypothesis,
      proposal, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.company_name,
      input.company_url ?? "",
      input.contact_name ?? "",
      input.contact_title ?? "",
      input.current_step ?? 1,
      input.is_sample ? 1 : 0,
      input.account_brief ? JSON.stringify(input.account_brief) : null,
      input.discovery_plan ? JSON.stringify(input.discovery_plan) : null,
      input.transcript ?? null,
      input.structured_requirements
        ? JSON.stringify(input.structured_requirements)
        : null,
      input.follow_up_questions
        ? JSON.stringify(input.follow_up_questions)
        : null,
      input.solution_hypothesis
        ? JSON.stringify(input.solution_hypothesis)
        : null,
      input.proposal ? JSON.stringify(input.proposal) : null,
      created_at,
    );
  return getDeal(id)!;
}

const PATCHABLE = new Set([
  "company_name",
  "company_url",
  "contact_name",
  "contact_title",
  "current_step",
  "transcript",
  ...JSON_COLUMNS,
]);

export function updateDeal(
  id: string,
  patch: Record<string, unknown>,
): Deal | null {
  const existing = getDeal(id);
  if (!existing) return null;

  const db = getDb();
  const sets: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(patch)) {
    if (!PATCHABLE.has(key) || value === undefined) continue;
    sets.push(`${key} = ?`);
    if (JSON_COLUMNS.includes(key as JsonColumn)) {
      values.push(value === null ? null : JSON.stringify(value));
    } else if (key === "current_step") {
      values.push(Number(value));
    } else {
      values.push(value);
    }
  }

  if (sets.length === 0) return existing;

  values.push(id);
  db.prepare(`UPDATE deals SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  return getDeal(id);
}
