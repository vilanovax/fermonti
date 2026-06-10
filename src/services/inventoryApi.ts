import { getInventoryForPeriod } from "../data/inventoryData";
import type { InventoryBundle, TimePeriod } from "../types";

const LATENCY_MS = 200;

export async function fetchInventory(period: TimePeriod): Promise<InventoryBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getInventoryForPeriod(period);
}
