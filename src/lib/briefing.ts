import { unstable_cache } from "next/cache";
import { generateBriefing } from "./gemini";
import type { DailyBriefing } from "./types";

export const BRIEFING_CACHE_TAG = "daily-briefing";

export const getCachedBriefing = unstable_cache(
  async (): Promise<DailyBriefing> => generateBriefing(),
  ["daily-briefing"],
  {
    revalidate: 60 * 60 * 12,
    tags: [BRIEFING_CACHE_TAG],
  }
);

export async function refreshBriefing(): Promise<DailyBriefing> {
  return generateBriefing();
}
