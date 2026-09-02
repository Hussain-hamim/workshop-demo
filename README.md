# Deal Prep & Discovery Intelligence

Local Next.js + SQLite workshop demo. Walk a prospect from company research to a structured proposal.

This is a demo, not a production product.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — OpenAI and/or OpenRouter keys for Live AI
npm run dev                  # http://localhost:3000
```

Open the app → **Load Sample (walkthrough)** → generate each of the 6 steps.

## Workshop script (~3–4 minutes)

1. Show the before/after panel on the dashboard.
2. Click **Load Sample (walkthrough)** (Northline Logistics / Sarah Chen).
3. Generate Account Brief → Discovery Plan → paste is already filled → Structured Requirements → Follow-up Questions → Solution → Proposal.
4. Optionally **Edit** one section and **Save** to show human review.
5. On the proposal, **Copy Markdown**.
6. If a live key is set, **Regenerate** the proposal to show Live AI on the same deal.

**Load Sample (completed)** skips generation and opens a finished deal — useful if something fails mid-demo.

## Demo mode vs Live AI

| Mode | When | What happens |
|------|------|----------------|
| **Demo mode** | No OpenAI or OpenRouter key | Each Generate button returns the seeded Northline artifacts (~1s delay). |
| **Live AI** | `OPENAI_API_KEY` and/or `OPENROUTER_API_KEY` | Tries OpenAI first, then OpenRouter (`OPENROUTER_MODEL`), then `OPENROUTER_FALLBACK_MODELS`. |

The badge in the header tells you which mode is active. New deals (any company) are disabled without a key so Demo mode cannot accidentally return Northline data for a different company.

## What the 6 steps produce

1. **Account Research** — company brief (model, size, news, stack, pain signals)
2. **Discovery Prep** — point of view, questions to skip, 5–10 discovery questions
3. **Transcript** — paste the call, then structured requirements
4. **Gap Analysis** — missing info and follow-up questions
5. **Solution** — architecture, modules, phase 1 vs later
6. **Proposal** — summary, scope, timeline, exclusions, pricing inputs, next steps

Edits become context for the next Generate. Locally they are stored in SQLite (`data/deals.db`). On Vercel they stay in this browser's `localStorage`.

## Deploy on Vercel

The hosted demo does not use SQLite. Deals live in the browser, and only `/api/generate` plus `/api/mode` run on the server.

Set these in the Vercel project if you want Live AI:

- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `OPENROUTER_FALLBACK_MODELS`

Without keys, the seeded Northline walkthrough still works. A different browser or device starts with an empty deal list.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- SQLite via `better-sqlite3` locally (`data/deals.db`)
- Browser `localStorage` on Vercel
- OpenAI SDK (`gpt-4o-mini`) and optional OpenRouter fallback when keys are present
