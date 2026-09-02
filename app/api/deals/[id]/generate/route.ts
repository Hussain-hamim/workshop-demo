import { NextResponse } from "next/server";
import { getDeal, updateDeal } from "@/lib/db";
import { generateStep, isLiveAi } from "@/lib/ai";
import type { GenerateStep } from "@/lib/types";

export const runtime = "nodejs";

const STEPS: GenerateStep[] = [
  "account_brief",
  "discovery_plan",
  "structured_requirements",
  "follow_up_questions",
  "solution_hypothesis",
  "proposal",
];

const STEP_NUMBER: Record<GenerateStep, number> = {
  account_brief: 1,
  discovery_plan: 2,
  structured_requirements: 3,
  follow_up_questions: 4,
  solution_hypothesis: 5,
  proposal: 6,
};

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const deal = getDeal(id);
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const step = body.step as GenerateStep;
  if (!STEPS.includes(step)) {
    return NextResponse.json({ error: "Unknown step" }, { status: 400 });
  }

  if (body.skipIfPresent && deal[step]) {
    return NextResponse.json({ deal, liveAi: isLiveAi() });
  }

  if (step === "structured_requirements" && !deal.transcript?.trim()) {
    return NextResponse.json(
      { error: "Paste a transcript before structuring requirements" },
      { status: 400 },
    );
  }

  try {
    const artifact = await generateStep(step, deal);
    const patch: Record<string, unknown> = { [step]: artifact };
    if (!body.prefetch) {
      patch.current_step = Math.max(deal.current_step, STEP_NUMBER[step]);
    }
    const updated = updateDeal(id, patch);
    return NextResponse.json({ deal: updated, liveAi: isLiveAi() });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
