import { useEffect, useState } from "react";
import { fetchCustomerExperience } from "../services/customerExperienceApi";
import type { CustomerExperienceBundle, TimePeriod } from "../types";

export function useCustomerExperience(period: TimePeriod) {
  const [data, setData] = useState<CustomerExperienceBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCustomerExperience(period)
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
