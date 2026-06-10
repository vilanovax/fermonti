import { useEffect, useState } from "react";
import { fetchInventory } from "../services/inventoryApi";
import type { InventoryBundle, TimePeriod } from "../types";

export function useInventory(period: TimePeriod) {
  const [data, setData] = useState<InventoryBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchInventory(period)
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
