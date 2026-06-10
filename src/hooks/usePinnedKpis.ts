import { useCallback, useEffect, useState } from "react";
import { ALL_KPI_IDS } from "../data/periodData";

const STORAGE_KEY = "fermenuti-pinned-kpis";

function loadPinned(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...ALL_KPI_IDS];
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed) || parsed.length < 4) return [...ALL_KPI_IDS];
    return parsed.filter((id) => ALL_KPI_IDS.includes(id));
  } catch {
    return [...ALL_KPI_IDS];
  }
}

export function usePinnedKpis() {
  const [pinnedIds, setPinnedIds] = useState<string[]>(loadPinned);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  const toggle = useCallback((id: string) => {
    setPinnedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 4) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  }, []);

  const reset = useCallback(() => {
    setPinnedIds([...ALL_KPI_IDS]);
  }, []);

  return { pinnedIds, toggle, reset };
}
