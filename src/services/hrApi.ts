import { getHRForPeriod } from "../data/hrData";
import type { HRBundle, TimePeriod } from "../types";

const LATENCY_MS = 200;

export async function fetchHR(period: TimePeriod): Promise<HRBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getHRForPeriod(period);
}
