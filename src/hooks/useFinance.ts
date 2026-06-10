import { useEffect, useState } from "react";
import { fetchFinance } from "../services/financeApi";
import type { FinanceBundle, TimePeriod } from "../types";

export function useFinance(period: TimePeriod) {
  const [data, setData] = useState<FinanceBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFinance(period)
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
