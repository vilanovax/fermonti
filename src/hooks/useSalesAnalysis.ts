import { useEffect, useState } from "react";
import { fetchSalesAnalysis } from "../services/salesAnalysisApi";
import type { SalesAnalysisBundle, TimePeriod } from "../types";

export function useSalesAnalysis(period: TimePeriod) {
  const [data, setData] = useState<SalesAnalysisBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSalesAnalysis(period)
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
