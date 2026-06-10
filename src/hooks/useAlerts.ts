import { useEffect, useState } from "react";
import { fetchAlerts } from "../services/alertsApi";
import type { AlertsBundle, TimePeriod } from "../types";

export function useAlerts(period: TimePeriod) {
  const [data, setData] = useState<AlertsBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAlerts(period)
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
