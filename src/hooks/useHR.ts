import { useEffect, useState } from "react";
import { fetchHR } from "../services/hrApi";
import type { HRBundle, TimePeriod } from "../types";

export function useHR(period: TimePeriod) {
  const [data, setData] = useState<HRBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHR(period)
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
