import type { FoodCostBundle, RecipeAnalysis, TimePeriod } from "../types";

const spark = {
  bad: [32, 33, 34, 35, 34, 36, 34],
  good: [30, 29, 28, 28, 27, 28, 28],
  mid: [33, 32, 33, 32, 33, 32, 33],
};

function recipe(partial: RecipeAnalysis): RecipeAnalysis {
  return partial;
}

const baseRecipes: Omit<RecipeAnalysis, "foodCost" | "compareText" | "costTrend" | "sparkline" | "status">[] = [
  { id: "ribeye", name: "استیک ریب‌آی", category: "گوشت", margin: 28, waste: 4.2, menuPrice: 4.8, plateCost: 2.3, salesWeek: 42, alert: "قیمت گوشت ۱۲٪ ↑" },
  { id: "truffle-pasta", name: "پاستا ترافل", category: "پاستا", margin: 52, waste: 1.8, menuPrice: 2.9, plateCost: 0.81, salesWeek: 38 },
  { id: "burger", name: "برگر فرمنوتی", category: "گریل", margin: 45, waste: 2.1, menuPrice: 2.4, plateCost: 0.77, salesWeek: 35 },
  { id: "salmon", name: "ماهی سالمون", category: "غذای دریایی", margin: 35, waste: 5.5, menuPrice: 3.6, plateCost: 1.48, salesWeek: 24, alert: "موجودی ماهی کم" },
  { id: "pizza", name: "پیتزا مارگاریتا", category: "پیتزا", margin: -5, waste: 8.2, menuPrice: 1.8, plateCost: 0.99, salesWeek: 8, alert: "بازنگری قیمت فوری" },
  { id: "caesar", name: "سالاد سزار", category: "پیش‌غذا", margin: 62, waste: 1.2, menuPrice: 1.2, plateCost: 0.46, salesWeek: 28 },
  { id: "tiramisu", name: "دسر تیرامیسو", category: "دسر", margin: 18, waste: 3.1, menuPrice: 0.95, plateCost: 0.78, salesWeek: 14 },
];

function buildRecipes(
  costs: number[],
  compares: string[],
  trends: RecipeAnalysis["costTrend"][],
  statuses: RecipeAnalysis["status"][]
): RecipeAnalysis[] {
  return baseRecipes.map((base, i) =>
    recipe({
      ...base,
      foodCost: costs[i] ?? 30,
      compareText: compares[i] ?? "",
      costTrend: trends[i] ?? "flat",
      status: statuses[i] ?? "ok",
      sparkline: statuses[i] === "ok" ? spark.good : statuses[i] === "critical" ? spark.bad : spark.mid,
    })
  );
}

const bundles: Record<TimePeriod, FoodCostBundle> = {
  today: {
    period: "today",
    summary: {
      avgFoodCost: 34,
      bevCost: 22,
      target: 32,
      wasteMillions: 1.8,
      itemsAtRisk: 3,
      compareText: "دیروز: ۳۲٪",
      changePercent: 2,
      costIncreased: true,
      sparkline: spark.bad,
      headline: "بالای حد مجاز — اقدام روی گوشت و پیتزا",
    },
    recipes: buildRecipes(
      [48, 28, 32, 41, 55, 26, 22],
      ["دیروز: ۴۵٪", "دیروز: ۲۷٪", "دیروز: ۳۱٪", "دیروز: ۳۸٪", "دیروز: ۵۰٪", "دیروز: ۲۵٪", "دیروز: ۲۰٪"],
      ["up", "flat", "up", "up", "up", "flat", "down"],
      ["critical", "ok", "ok", "critical", "critical", "ok", "warning"]
    ),
    insights: [
      { title: "پرت گوشت غیرعادی", detail: "۵.۲٪ در مقابل میانگین ۲.۱٪ — احتمال over-prep", severity: "critical" },
      { title: "پیتزا مارگاریتا زیان‌ده", detail: "Food Cost ۵۵٪ — افزایش قیمت ۱۵٪ یا حذف موقت", severity: "critical" },
      { title: "پاستا ترافل سودده‌ترین", detail: "سود ۵۲٪ — الگو برای منوی جدید", severity: "info" },
    ],
  },
  week: {
    period: "week",
    summary: {
      avgFoodCost: 33,
      bevCost: 21,
      target: 32,
      wasteMillions: 12.4,
      itemsAtRisk: 2,
      compareText: "هفته قبل: ۳۱٪",
      changePercent: 2,
      costIncreased: true,
      sparkline: spark.mid,
      headline: "روند صعودی — عمدتاً قیمت مواد پروتئینی",
    },
    recipes: buildRecipes(
      [46, 27, 31, 39, 52, 25, 21],
      ["هفته قبل: ۴۳٪", "هفته قبل: ۲۷٪", "هفته قبل: ۳۰٪", "هفته قبل: ۳۷٪", "هفته قبل: ۴۸٪", "هفته قبل: ۲۴٪", "هفته قبل: ۱۹٪"],
      ["up", "flat", "up", "up", "up", "flat", "up"],
      ["critical", "ok", "ok", "warning", "critical", "ok", "ok"]
    ),
    insights: [
      { title: "هزینه گوشت هفته", detail: "+۸٪ نسبت به هفته قبل — قرارداد تامین‌کننده را چک کنید", severity: "warning" },
      { title: "۲ غذا بحرانی", detail: "ریب‌آی و پیتزا — اولویت بازنگری رسپی", severity: "critical" },
    ],
  },
  month: {
    period: "month",
    summary: {
      avgFoodCost: 32,
      bevCost: 23,
      target: 32,
      wasteMillions: 48.5,
      itemsAtRisk: 1,
      compareText: "ماه قبل: ۳۳٪",
      changePercent: -1,
      costIncreased: false,
      sparkline: spark.good,
      headline: "در محدوده هدف — یک قلم نیاز بازنگری دارد",
    },
    recipes: buildRecipes(
      [44, 26, 30, 37, 48, 24, 20],
      ["ماه قبل: ۴۶٪", "ماه قبل: ۲۸٪", "ماه قبل: ۳۱٪", "ماه قبل: ۳۹٪", "ماه قبل: ۵۲٪", "ماه قبل: ۲۶٪", "ماه قبل: ۲۲٪"],
      ["down", "down", "down", "down", "down", "flat", "down"],
      ["warning", "ok", "ok", "ok", "critical", "ok", "ok"]
    ),
    insights: [
      { title: "بهبود ماهانه", detail: "Food Cost از ۳۳٪ به ۳۲٪ — اثر مدیریت پرت", severity: "info" },
      { title: "پیتزا همچنان بحرانی", detail: "تنها غذای بالای ۴۵٪ — جلسه قیمت‌گذاری پیشنهاد می‌شود", severity: "warning" },
    ],
  },
};

export function getFoodCostForPeriod(period: TimePeriod): FoodCostBundle {
  return bundles[period];
}
