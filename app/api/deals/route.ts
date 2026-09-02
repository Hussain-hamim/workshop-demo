import { NextResponse } from "next/server";
import { createDeal, listDeals } from "@/lib/db";
import { isLiveAi } from "@/lib/ai";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ deals: listDeals(), liveAi: isLiveAi() });
}

export async function POST(request: Request) {
  if (!isLiveAi()) {
    return NextResponse.json(
      {
        error:
          "Add OPENAI_API_KEY or OPENROUTER_API_KEY to research any company. Use a sample deal for Demo mode.",
      },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const company_name = String(body.company_name ?? "").trim();
  if (!company_name) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 },
    );
  }

  const deal = createDeal({
    company_name,
    company_url: String(body.company_url ?? "").trim(),
    contact_name: String(body.contact_name ?? "").trim(),
    contact_title: String(body.contact_title ?? "").trim(),
  });

  return NextResponse.json({ deal });
}
