import { getTimelineForPeriod } from "../data/timelineData";
import type { TimelineBundle, TimePeriod } from "../types";

const LATENCY_MS = 200;

export async function fetchTimeline(period: TimePeriod): Promise<TimelineBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getTimelineForPeriod(period);
}
