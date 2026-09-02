import { NextResponse } from "next/server";
import { createDeal } from "@/lib/db";
import {
  NORTHLINE,
  NORTHLINE_ACCOUNT_BRIEF,
  NORTHLINE_DISCOVERY_PLAN,
  NORTHLINE_FOLLOW_UPS,
  NORTHLINE_PROPOSAL,
  NORTHLINE_REQUIREMENTS,
  NORTHLINE_SOLUTION,
  NORTHLINE_TRANSCRIPT,
} from "@/lib/seed/northline";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const mode = body.mode === "completed" ? "completed" : "walkthrough";

  const deal =
    mode === "completed"
      ? createDeal({
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
        })
      : createDeal({
          ...NORTHLINE,
          is_sample: true,
          current_step: 1,
          transcript: NORTHLINE_TRANSCRIPT,
        });

  return NextResponse.json({ deal });
}
