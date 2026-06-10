import { useEffect, useState } from "react";
import { fetchAiInsights } from "../services/aiInsightsApi";
import type { AiInsightsBundle, TimePeriod } from "../types";

export function useAiInsights(period: TimePeriod) {
  const [data, setData] = useState<AiInsightsBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAiInsights(period)
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
