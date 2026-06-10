import { useEffect, useState } from "react";
import { fetchFoodCost } from "../services/foodCostApi";
import type { FoodCostBundle, TimePeriod } from "../types";

export function useFoodCost(period: TimePeriod) {
  const [data, setData] = useState<FoodCostBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFoodCost(period)
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
