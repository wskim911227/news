import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { BRIEFING_CACHE_TAG, refreshBriefing } from "@/lib/briefing";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const briefing = await refreshBriefing();
    revalidateTag(BRIEFING_CACHE_TAG);

    return NextResponse.json({
      success: true,
      message: "아침 브리핑이 생성되었습니다.",
      date: briefing.date,
      newsCount: briefing.topNews.length,
      kboCount: briefing.kboResults.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "브리핑 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
