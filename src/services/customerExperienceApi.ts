import { getCustomerExperienceForPeriod } from "../data/customerExperienceData";
import type { CustomerExperienceBundle, TimePeriod } from "../types";

const LATENCY_MS = 260;

export async function fetchCustomerExperience(
  period: TimePeriod
): Promise<CustomerExperienceBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getCustomerExperienceForPeriod(period);
}
