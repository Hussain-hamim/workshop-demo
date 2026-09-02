import { NextResponse } from "next/server";
import { generateStep, isLiveAi } from "@/lib/ai";
import type { Deal, GenerateStep } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const STEPS: GenerateStep[] = [
  "account_brief",
  "discovery_plan",
  "structured_requirements",
  "follow_up_questions",
  "solution_hypothesis",
  "proposal",
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const step = body.step as GenerateStep;
  const deal = body.deal as Deal | undefined;

  if (!STEPS.includes(step)) {
    return NextResponse.json({ error: "Unknown step" }, { status: 400 });
  }
  if (!deal || typeof deal !== "object") {
    return NextResponse.json({ error: "Deal is required" }, { status: 400 });
  }
  if (body.skipIfPresent && deal[step]) {
    return NextResponse.json({ artifact: deal[step], liveAi: isLiveAi() });
  }
  if (step === "structured_requirements" && !deal.transcript?.trim()) {
    return NextResponse.json(
      { error: "Paste a transcript before structuring requirements" },
      { status: 400 },
    );
  }

  try {
    const artifact = await generateStep(step, deal);
    return NextResponse.json({ artifact, liveAi: isLiveAi() });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
