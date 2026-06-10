/**
 * لایه API داشبورد — فعلاً داده دمو؛ در فاز تولید با fetch واقعی جایگزین شود.
 *
 * مثال آینده:
 * export async function fetchDashboard(period: TimePeriod) {
 *   const res = await fetch(`${API_URL}/dashboard?period=${period}`);
 *   return res.json();
 * }
 */
import { getDashboardForPeriod } from "../data/periodData";
import type { DashboardPeriodData, TimePeriod } from "../types";

const DEMO_LATENCY_MS = 280;

export async function fetchDashboard(
  period: TimePeriod
): Promise<DashboardPeriodData> {
  await new Promise((r) => setTimeout(r, DEMO_LATENCY_MS));
  return getDashboardForPeriod(period);
}

export function isApiDemoMode(): boolean {
  return true;
}
