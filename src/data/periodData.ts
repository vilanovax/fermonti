import type {
  CriticalMetric,
  DashboardPeriodData,
  ExecutiveKpi,
  SalesSnapshot,
  TimePeriod,
} from "../types";

const spark = {
  up: [3, 4, 3.5, 5, 4.8, 6, 7],
  down: [7, 6.5, 6, 5.5, 5, 4.5, 4],
  flat: [5, 5.2, 4.8, 5.1, 5, 5.3, 5],
};

function kpi(
  partial: Omit<ExecutiveKpi, "sparkline" | "compareText"> & {
    compareText: string;
    spark?: number[];
  }
): ExecutiveKpi {
  return {
    ...partial,
    sparkline: partial.spark ?? spark.up,
  };
}

const todayKpis: ExecutiveKpi[] = [
  kpi({ id: "sales-today", label: "فروش", value: "۴۸.۲", unit: "میلیون", change: "+۶٪", positive: true, icon: "sales", navigateTo: "sales", compareText: "دیروز: ۴۵.۵ میلیون" }),
  kpi({ id: "avg-check", label: "میانگین فاکتور", value: "۱.۸۵", unit: "میلیون", change: "+۲٪", positive: true, icon: "receipt", navigateTo: "sales", compareText: "دیروز: ۱.۸۱ میلیون", spark: spark.flat }),
  kpi({ id: "customers", label: "تعداد مشتری", value: "۱۴۲", unit: "نفر", change: "-۸٪", positive: false, icon: "users", navigateTo: "customer", compareText: "دیروز: ۱۵۴ نفر", spark: spark.down }),
  kpi({ id: "occupancy", label: "ضریب اشغال", value: "۷۸٪", unit: "", change: "+۵٪", positive: true, icon: "table", navigateTo: "sales", compareText: "دیروز: ۷۴٪" }),
  kpi({ id: "gross-profit", label: "سود ناخالص", value: "۱۸.۴", unit: "میلیون", change: "-۲٪", positive: false, icon: "profit", navigateTo: "finance", compareText: "دیروز: ۱۸.۸ میلیون", spark: spark.down }),
  kpi({ id: "food-cost", label: "هزینه غذا", value: "۳۴٪", unit: "", change: "+۲٪", positive: false, icon: "food", navigateTo: "foodcost", compareText: "دیروز: ۳۲٪", spark: spark.up }),
  kpi({ id: "bev-cost", label: "هزینه نوشیدنی", value: "۲۲٪", unit: "", change: "ثابت", positive: true, icon: "drink", navigateTo: "foodcost", compareText: "دیروز: ۲۲٪", spark: spark.flat }),
  kpi({ id: "cashflow", label: "جریان نقد", value: "+۱۲", unit: "میلیون", change: "مثبت", positive: true, icon: "cash", navigateTo: "finance", compareText: "دیروز: +۱۰ میلیون" }),
  kpi({ id: "cash-stock", label: "موجودی نقد", value: "۸۵", unit: "میلیون", change: "-۵", positive: false, icon: "wallet", navigateTo: "finance", compareText: "دیروز: ۹۰ میلیون", spark: spark.down }),
  kpi({ id: "alerts", label: "وضعیت هشدار", value: "۷", unit: "فعال", change: "۳ بحرانی", positive: false, icon: "alert", navigateTo: "alerts", highlight: true, compareText: "دیروز: ۵ فعال", spark: spark.up }),
];

const weekKpis: ExecutiveKpi[] = [
  kpi({ id: "sales-week", label: "فروش هفته", value: "۲۸۵", unit: "میلیون", change: "+۳٪", positive: true, icon: "chart", navigateTo: "sales", compareText: "هفته قبل: ۲۷۷ میلیون" }),
  kpi({ id: "avg-check", label: "میانگین فاکتور", value: "۱.۹۲", unit: "میلیون", change: "+۴٪", positive: true, icon: "receipt", navigateTo: "sales", compareText: "هفته قبل: ۱.۸۵ میلیون" }),
  kpi({ id: "customers", label: "مشتری هفته", value: "۸۴۰", unit: "نفر", change: "+۲٪", positive: true, icon: "users", navigateTo: "customer", compareText: "هفته قبل: ۸۲۳ نفر" }),
  kpi({ id: "occupancy", label: "ضریب اشغال", value: "۷۲٪", unit: "", change: "+۱٪", positive: true, icon: "table", navigateTo: "sales", compareText: "هفته قبل: ۷۱٪" }),
  kpi({ id: "gross-profit", label: "سود ناخالص", value: "۱۰۲", unit: "میلیون", change: "+۱٪", positive: true, icon: "profit", navigateTo: "finance", compareText: "هفته قبل: ۱۰۱ میلیون" }),
  kpi({ id: "food-cost", label: "هزینه غذا", value: "۳۳٪", unit: "", change: "+۱٪", positive: false, icon: "food", navigateTo: "foodcost", compareText: "هفته قبل: ۳۲٪" }),
  kpi({ id: "bev-cost", label: "هزینه نوشیدنی", value: "۲۱٪", unit: "", change: "-۱٪", positive: true, icon: "drink", navigateTo: "foodcost", compareText: "هفته قبل: ۲۲٪" }),
  kpi({ id: "cashflow", label: "جریان نقد", value: "+۴۸", unit: "میلیون", change: "مثبت", positive: true, icon: "cash", navigateTo: "finance", compareText: "هفته قبل: +۴۲ میلیون" }),
  kpi({ id: "cash-stock", label: "موجودی نقد", value: "۸۵", unit: "میلیون", change: "ثابت", positive: true, icon: "wallet", navigateTo: "finance", compareText: "هفته قبل: ۸۵ میلیون", spark: spark.flat }),
  kpi({ id: "alerts", label: "هشدارهای هفته", value: "۲۳", unit: "مورد", change: "۵ بحرانی", positive: false, icon: "alert", navigateTo: "alerts", highlight: true, compareText: "هفته قبل: ۱۸ مورد" }),
];

const monthKpis: ExecutiveKpi[] = [
  kpi({ id: "sales-month", label: "فروش ماه", value: "۱٬۱۲۰", unit: "میلیون", change: "+۱۱٪", positive: true, icon: "calendar", navigateTo: "sales", compareText: "ماه قبل: ۱٬۰۰۹ میلیون" }),
  kpi({ id: "avg-check", label: "میانگین فاکتور", value: "۱.۸۸", unit: "میلیون", change: "+۳٪", positive: true, icon: "receipt", navigateTo: "sales", compareText: "ماه قبل: ۱.۸۲ میلیون" }),
  kpi({ id: "customers", label: "مشتری ماه", value: "۳٬۴۲۰", unit: "نفر", change: "+۹٪", positive: true, icon: "users", navigateTo: "customer", compareText: "ماه قبل: ۳٬۱۳۸ نفر" }),
  kpi({ id: "occupancy", label: "ضریب اشغال", value: "۶۹٪", unit: "", change: "+۴٪", positive: true, icon: "table", navigateTo: "sales", compareText: "ماه قبل: ۶۵٪" }),
  kpi({ id: "gross-profit", label: "سود ناخالص", value: "۳۸۵", unit: "میلیون", change: "+۸٪", positive: true, icon: "profit", navigateTo: "finance", compareText: "ماه قبل: ۳۵۶ میلیون" }),
  kpi({ id: "food-cost", label: "هزینه غذا", value: "۳۲٪", unit: "", change: "-۱٪", positive: true, icon: "food", navigateTo: "foodcost", compareText: "ماه قبل: ۳۳٪", spark: spark.down }),
  kpi({ id: "bev-cost", label: "هزینه نوشیدنی", value: "۲۳٪", unit: "", change: "+۱٪", positive: false, icon: "drink", navigateTo: "foodcost", compareText: "ماه قبل: ۲۲٪" }),
  kpi({ id: "cashflow", label: "جریان نقد", value: "+۱۸۵", unit: "میلیون", change: "مثبت", positive: true, icon: "cash", navigateTo: "finance", compareText: "ماه قبل: +۱۶۲ میلیون" }),
  kpi({ id: "cash-stock", label: "موجودی نقد", value: "۸۵", unit: "میلیون", change: "-۱۲", positive: false, icon: "wallet", navigateTo: "finance", compareText: "ماه قبل: ۹۷ میلیون" }),
  kpi({ id: "alerts", label: "هشدارهای ماه", value: "۸۹", unit: "مورد", change: "۱۲ بحرانی", positive: false, icon: "alert", navigateTo: "alerts", highlight: true, compareText: "ماه قبل: ۷۶ مورد" }),
];

const salesByPeriod: Record<TimePeriod, SalesSnapshot> = {
  today: {
    currentMillions: 48.2,
    previousMillions: 45.5,
    changePercent: 6,
    label: "فروش امروز تا این لحظه",
    previousPeriodLabel: "دیروز",
    sparkline: spark.up,
  },
  week: {
    currentMillions: 285,
    previousMillions: 277,
    changePercent: 3,
    label: "فروش این هفته",
    previousPeriodLabel: "هفته قبل",
    sparkline: [40, 38, 42, 45, 43, 48, 50],
  },
  month: {
    currentMillions: 1120,
    previousMillions: 1009,
    changePercent: 11,
    label: "فروش این ماه",
    previousPeriodLabel: "ماه قبل",
    sparkline: [800, 850, 900, 920, 980, 1050, 1120],
  },
};

const criticalByPeriod: Record<TimePeriod, CriticalMetric[]> = {
  today: [
    { label: "رشد فروش", value: "+۴٪", trend: "up", target: "هدف: +۸٪", navigateTo: "sales", compareText: "دیروز: +۲٪" },
    { label: "هزینه غذا", value: "۳۴٪", trend: "down", target: "حد: ۳۲٪", navigateTo: "foodcost", compareText: "دیروز: ۳۲٪" },
    { label: "میانگین فاکتور", value: "۱.۸۵M", trend: "up", target: "هدف: ۲M", navigateTo: "sales", compareText: "دیروز: ۱.۸۱M" },
    { label: "دور میز", value: "۲.۳", trend: "flat", target: "هدف: ۲.۵", navigateTo: "sales", compareText: "دیروز: ۲.۳" },
    { label: "جریان نقد", value: "+۱۲M", trend: "up", target: "مثبت ✓", navigateTo: "finance", compareText: "دیروز: +۱۰M" },
  ],
  week: [
    { label: "رشد فروش", value: "+۳٪", trend: "up", target: "هدف: +۸٪", navigateTo: "sales", compareText: "هفته قبل: +۱٪" },
    { label: "هزینه غذا", value: "۳۳٪", trend: "down", target: "حد: ۳۲٪", navigateTo: "foodcost", compareText: "هفته قبل: ۳۲٪" },
    { label: "میانگین فاکتور", value: "۱.۹۲M", trend: "up", target: "هدف: ۲M", navigateTo: "sales", compareText: "هفته قبل: ۱.۸۵M" },
    { label: "دور میز", value: "۲.۴", trend: "up", target: "هدف: ۲.۵", navigateTo: "sales", compareText: "هفته قبل: ۲.۲" },
    { label: "جریان نقد", value: "+۴۸M", trend: "up", target: "مثبت ✓", navigateTo: "finance", compareText: "هفته قبل: +۴۲M" },
  ],
  month: [
    { label: "رشد فروش", value: "+۱۱٪", trend: "up", target: "هدف: +۸٪", navigateTo: "sales", compareText: "ماه قبل: +۶٪" },
    { label: "هزینه غذا", value: "۳۲٪", trend: "up", target: "حد: ۳۲٪", navigateTo: "foodcost", compareText: "ماه قبل: ۳۳٪" },
    { label: "میانگین فاکتور", value: "۱.۸۸M", trend: "up", target: "هدف: ۲M", navigateTo: "sales", compareText: "ماه قبل: ۱.۸۲M" },
    { label: "دور میز", value: "۲.۵", trend: "up", target: "هدف: ۲.۵", navigateTo: "sales", compareText: "ماه قبل: ۲.۳" },
    { label: "جریان نقد", value: "+۱۸۵M", trend: "up", target: "مثبت ✓", navigateTo: "finance", compareText: "ماه قبل: +۱۶۲M" },
  ],
};

const kpiSets: Record<TimePeriod, ExecutiveKpi[]> = {
  today: todayKpis,
  week: weekKpis,
  month: monthKpis,
};

export const ALL_KPI_IDS = [
  ...new Set([
    ...todayKpis.map((k) => k.id),
    ...weekKpis.map((k) => k.id),
    ...monthKpis.map((k) => k.id),
  ]),
];

export const PERIOD_LABELS: Record<TimePeriod, string> = {
  today: "امروز",
  week: "این هفته",
  month: "این ماه",
};

export function getDashboardForPeriod(period: TimePeriod): DashboardPeriodData {
  return {
    period,
    sales: salesByPeriod[period],
    kpis: kpiSets[period],
    criticalFive: criticalByPeriod[period],
  };
}
