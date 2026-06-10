import { getAiInsightsForPeriod } from "../data/aiInsightsData";
import type { AiInsightsBundle, TimePeriod } from "../types";

const LATENCY_MS = 240;

export async function fetchAiInsights(period: TimePeriod): Promise<AiInsightsBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getAiInsightsForPeriod(period);
}
