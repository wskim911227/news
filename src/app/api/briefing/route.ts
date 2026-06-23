import { NextResponse } from "next/server";
import { refreshBriefing } from "@/lib/briefing";

export async function GET() {
  try {
    const briefing = await refreshBriefing();
    return NextResponse.json(briefing);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "브리핑 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
