import { NextResponse } from "next/server";
import { isLiveAi } from "@/lib/ai";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ liveAi: isLiveAi() });
}
