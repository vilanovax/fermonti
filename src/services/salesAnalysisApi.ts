import { getSalesAnalysisForPeriod } from "../data/salesAnalysisData";
import type { SalesAnalysisBundle, TimePeriod } from "../types";

const LATENCY_MS = 220;

export async function fetchSalesAnalysis(
  period: TimePeriod
): Promise<SalesAnalysisBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getSalesAnalysisForPeriod(period);
}
