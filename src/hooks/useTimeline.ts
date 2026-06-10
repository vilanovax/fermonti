import { useEffect, useState } from "react";
import { fetchTimeline } from "../services/timelineApi";
import type { TimelineBundle, TimePeriod } from "../types";

export function useTimeline(period: TimePeriod) {
  const [data, setData] = useState<TimelineBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTimeline(period)
      .then((bundle) => {
        if (!cancelled) setData(bundle);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  return { data, loading };
}
