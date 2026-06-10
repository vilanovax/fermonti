import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/dashboardApi";
import type { DashboardPeriodData, TimePeriod } from "../types";

export function useDashboard(period: TimePeriod) {
  const [data, setData] = useState<DashboardPeriodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDashboard(period)
      .then((bundle) => {
        if (!cancelled) setData(bundle);
      })
      .catch(() => {
        if (!cancelled) setError("بارگذاری داده ناموفق بود");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period]);

  return { data, loading, error };
}
