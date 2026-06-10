import { getMailboxForPeriod } from "../data/mailboxData";
import type { MailboxBundle, TimePeriod } from "../types";

const LATENCY_MS = 200;

export async function fetchMailbox(period: TimePeriod): Promise<MailboxBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getMailboxForPeriod(period);
}
