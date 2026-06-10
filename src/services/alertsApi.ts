import { getAlertsForPeriod } from "../data/alertsData";
import type { AlertsBundle, TimePeriod } from "../types";

const LATENCY_MS = 220;

export async function fetchAlerts(period: TimePeriod): Promise<AlertsBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getAlertsForPeriod(period);
}
