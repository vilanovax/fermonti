import { getFoodCostForPeriod } from "../data/foodCostData";
import type { FoodCostBundle, TimePeriod } from "../types";

const LATENCY_MS = 260;

export async function fetchFoodCost(period: TimePeriod): Promise<FoodCostBundle> {
  await new Promise((r) => setTimeout(r, LATENCY_MS));
  return getFoodCostForPeriod(period);
}
