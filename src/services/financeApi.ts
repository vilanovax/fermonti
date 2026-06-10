import { getFinanceForPeriod } from "../data/financeData";
import type { FinanceBundle, TimePeriod } from "../types";

const LATENCY_MS = 210;

export async function fetchFinance(period: TimePeriod): Promise<FinanceBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getFinanceForPeriod(period);
}
