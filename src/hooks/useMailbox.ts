import { useEffect, useState } from "react";
import { fetchMailbox } from "../services/mailboxApi";
import type { MailboxBundle, TimePeriod } from "../types";

export function useMailbox(period: TimePeriod) {
  const [data, setData] = useState<MailboxBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMailbox(period)
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
