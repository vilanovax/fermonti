import type {
  AlertCategory,
  CriticalMetric,
  DashboardLayer,
  TimePeriod,
  ViewId,
} from "../types";
import { getAlertsForPeriod } from "./alertsData";

export interface LayerVerdict {
  status: "good" | "caution" | "bad";
  headline: string;
  focus: string;
}

export const verdictByLayer: Record<DashboardLayer, LayerVerdict> = {
  owner: {
    status: "caution",
    headline: "امروز متوسط — ناهار ضعیف، شام قوی‌تر",
    focus: "کنترل هزینه غذا و موجودی نوشیدنی",
  },
  operations: {
    status: "caution",
    headline: "عملیات — تاخیر سرو و ۳ قلم انبار بحرانی",
    focus: "اولویت: انبار نوشیدنی، شیفت ناهار، رضایت تراس",
  },
  finance: {
    status: "caution",
    headline: "مالی — کمبود نقد برای چک ۵ روز آینده",
    focus: "تامین نقد، FC بالای ۳۲٪، پیگیری چک‌ها",
  },
};

const criticalOwner: Record<TimePeriod, CriticalMetric[]> = {
  today: [
    { label: "رشد فروش", value: "+۴٪", trend: "up", target: "هدف: +۸٪", navigateTo: "sales", compareText: "دیروز: +۲٪" },
    { label: "هزینه غذا", value: "۳۴٪", trend: "down", target: "حد: ۳۲٪", navigateTo: "foodcost", compareText: "دیروز: ۳۲٪" },
    { label: "میانگین فاکتور", value: "۱.۸۵M", trend: "up", target: "هدف: ۲M", navigateTo: "sales", compareText: "دیروز: ۱.۸۱M" },
    { label: "ضریب اشغال", value: "۷۸٪", trend: "up", target: "هدف: ۸۵٪", navigateTo: "sales", compareText: "دیروز: ۷۴٪" },
    { label: "جریان نقد", value: "+۱۲M", trend: "up", target: "مثبت ✓", navigateTo: "finance", compareText: "دیروز: +۱۰M" },
  ],
  week: [
    { label: "رشد فروش", value: "+۳٪", trend: "up", target: "هدف: +۸٪", navigateTo: "sales", compareText: "هفته قبل: +۱٪" },
    { label: "هزینه غذا", value: "۳۳٪", trend: "down", target: "حد: ۳۲٪", navigateTo: "foodcost", compareText: "هفته قبل: ۳۲٪" },
    { label: "مشتری هفته", value: "۸۴۰", trend: "up", target: "رشد", navigateTo: "customer", compareText: "هفته قبل: ۸۲۳" },
    { label: "جریان نقد", value: "+۴۸M", trend: "up", target: "مثبت", navigateTo: "finance", compareText: "هفته قبل: +۴۲M" },
    { label: "هشدارها", value: "۲۳", trend: "down", target: "رسیدگی", navigateTo: "alerts", compareText: "۵ بحرانی" },
  ],
  month: [
    { label: "فروش ماه", value: "+۱۱٪", trend: "up", target: "هدف: +۸٪", navigateTo: "sales", compareText: "ماه قبل: +۶٪" },
    { label: "سود ناخالص", value: "۳۸۵M", trend: "up", target: "رشد", navigateTo: "finance", compareText: "ماه قبل: ۳۵۶M" },
    { label: "هزینه غذا", value: "۳۲٪", trend: "up", target: "حد: ۳۲٪", navigateTo: "foodcost", compareText: "ماه قبل: ۳۳٪" },
    { label: "رضایت", value: "۴.۲۵", trend: "up", target: "هدف: ۴.۳", navigateTo: "customer", compareText: "ماه قبل: ۴.۱" },
    { label: "جریان نقد", value: "+۱۸۵M", trend: "up", target: "مثبت", navigateTo: "finance", compareText: "ماه قبل: +۱۶۲M" },
  ],
};

const criticalOperations: Record<TimePeriod, CriticalMetric[]> = {
  today: [
    { label: "موجودی بحرانی", value: "۳ قلم", trend: "down", target: "سفارش فوری", navigateTo: "inventory", compareText: "نوشابه ۱ روز" },
    { label: "زمان سرو ناهار", value: "۱۸ دقیقه", trend: "down", target: "هدف: ۱۵", navigateTo: "customer", compareText: "دیروز: ۱۶ دقیقه" },
    { label: "رضایت تراس", value: "۳.۹", trend: "down", target: "بالای ۴.۲", navigateTo: "customer", compareText: "سالن: ۴.۴" },
    { label: "پرسنل شیفت", value: "۱۲", trend: "flat", target: "کافی", navigateTo: "hr", compareText: "ناهار شلوغ" },
    { label: "شکایت امروز", value: "۷", trend: "down", target: "زیر ۵", navigateTo: "mailbox", compareText: "دیروز: ۵" },
  ],
  week: [
    { label: "پرت هفته", value: "۱.۶M/روز", trend: "down", target: "هدف: ۱.۲M", navigateTo: "foodcost", compareText: "هفته قبل: ۱.۴M" },
    { label: "تاخیر سرو", value: "۹ مورد", trend: "down", target: "کاهش", navigateTo: "customer", compareText: "هفته قبل: ۱۲" },
    { label: "انبار", value: "۲ کسری", trend: "down", target: "صفر", navigateTo: "inventory", compareText: "گوشت، پنیر" },
    { label: "رویداد عملیات", value: "۶", trend: "flat", target: "ثبت", navigateTo: "timeline", compareText: "قطعی POS، VIP" },
    { label: "امتیاز تیم", value: "۸.۱", trend: "up", target: "۸.۵", navigateTo: "hr", compareText: "هفته قبل: ۷.۹" },
  ],
  month: [
    { label: "رضایت ماه", value: "۴.۲۵", trend: "up", target: "رکورد", navigateTo: "customer", compareText: "ماه قبل: ۴.۱" },
    { label: "گردش انبار", value: "۱۲ روز", trend: "up", target: "بهبود", navigateTo: "inventory", compareText: "ماه قبل: ۱۳" },
    { label: "شکایت ماه", value: "۲۸", trend: "up", target: "کاهش", navigateTo: "mailbox", compareText: "ماه قبل: ۳۲" },
    { label: "اضافه‌کاری", value: "+۱۸٪", trend: "down", target: "کنترل", navigateTo: "hr", compareText: "برنامه شیفت" },
    { label: "حوادث", value: "۸۰ دقیقه", trend: "down", target: "کاهش", navigateTo: "timeline", compareText: "توقف عملیات" },
  ],
};

const criticalFinance: Record<TimePeriod, CriticalMetric[]> = {
  today: [
    { label: "موجودی نقد", value: "۸۵M", trend: "down", target: "چک ۵ روز", navigateTo: "finance", compareText: "کمبود ~۱۲M" },
    { label: "هزینه غذا", value: "۳۴٪", trend: "down", target: "حد: ۳۲٪", navigateTo: "foodcost", compareText: "دیروز: ۳۲٪" },
    { label: "جریان امروز", value: "+۱۲M", trend: "up", target: "مثبت", navigateTo: "finance", compareText: "دیروز: +۱۰M" },
    { label: "سود ناخالص", value: "۱۸.۴M", trend: "down", target: "بهبود", navigateTo: "finance", compareText: "دیروز: ۱۸.۸M" },
    { label: "هزینه نوشیدنی", value: "۲۲٪", trend: "flat", target: "هدف: ۲۱٪", navigateTo: "foodcost", compareText: "ثابت" },
  ],
  week: [
    { label: "جریان هفته", value: "+۴۸M", trend: "up", target: "مثبت", navigateTo: "finance", compareText: "هفته قبل: +۴۲M" },
    { label: "FC هفته", value: "۳۳٪", trend: "down", target: "۳۲٪", navigateTo: "foodcost", compareText: "هفته قبل: ۳۲٪" },
    { label: "بدهی تامین", value: "۸۲M", trend: "flat", target: "تسویه", navigateTo: "finance", compareText: "۱۴ روز" },
    { label: "حقوق ماه", value: "۱۲۰M", trend: "flat", target: "برنامه", navigateTo: "finance", compareText: "پرداخت ۱۲ روز" },
    { label: "فروش هفته", value: "۲۸۵M", trend: "up", target: "+۸٪", navigateTo: "sales", compareText: "هفته قبل: ۲۷۷M" },
  ],
  month: [
    { label: "جریان ماه", value: "+۱۸۵M", trend: "up", target: "مثبت", navigateTo: "finance", compareText: "ماه قبل: +۱۶۲M" },
    { label: "سود ناخالص", value: "۳۸۵M", trend: "up", target: "رشد", navigateTo: "finance", compareText: "ماه قبل: ۳۵۶M" },
    { label: "FC ماه", value: "۳۲٪", trend: "up", target: "در هدف", navigateTo: "foodcost", compareText: "ماه قبل: ۳۳٪" },
    { label: "نقد", value: "۸۵M", trend: "down", target: "۹۷M", navigateTo: "finance", compareText: "ماه قبل: ۹۷M" },
    { label: "فروش ماه", value: "۱.۱۲B", trend: "up", target: "هدف", navigateTo: "sales", compareText: "ماه قبل: ۱.۰۰۹B" },
  ],
};

export function getCriticalForLayer(
  layer: DashboardLayer,
  period: TimePeriod
): CriticalMetric[] {
  if (layer === "operations") return criticalOperations[period];
  if (layer === "finance") return criticalFinance[period];
  return criticalOwner[period];
}

export const quickShortcutsByLayer: Record<
  DashboardLayer,
  { id: ViewId; label: string; icon: string; color: string }[]
> = {
  owner: [
    { id: "sales", label: "تحلیل فروش", icon: "chart", color: "from-blue-500 to-cyan-500" },
    { id: "inventory", label: "انبار", icon: "package", color: "from-emerald-500 to-teal-500" },
    { id: "hr", label: "پرسنل", icon: "users", color: "from-pink-500 to-rose-500" },
    { id: "finance", label: "مالی", icon: "wallet", color: "from-violet-500 to-purple-500" },
  ],
  operations: [
    { id: "inventory", label: "انبار", icon: "package", color: "from-emerald-500 to-teal-500" },
    { id: "customer", label: "مشتری", icon: "heart", color: "from-rose-500 to-pink-500" },
    { id: "hr", label: "پرسنل", icon: "users", color: "from-pink-500 to-rose-500" },
    { id: "timeline", label: "تایم‌لاین", icon: "clock", color: "from-slate-600 to-slate-700" },
  ],
  finance: [
    { id: "finance", label: "کنترل مالی", icon: "wallet", color: "from-violet-500 to-purple-500" },
    { id: "foodcost", label: "هزینه غذا", icon: "utensils", color: "from-amber-500 to-orange-500" },
    { id: "sales", label: "فروش", icon: "chart", color: "from-blue-500 to-cyan-500" },
    { id: "alerts", label: "هشدارها", icon: "alert", color: "from-red-500 to-rose-500" },
  ],
};

export interface LayerPulseStat {
  label: string;
  value: string;
  sub?: string;
  navigateTo: ViewId;
  tone?: "ok" | "warn" | "bad";
}

export const pulseByLayer: Record<DashboardLayer, LayerPulseStat[]> = {
  owner: [],
  operations: [
    { label: "بحرانی انبار", value: "۳", sub: "قلم", navigateTo: "inventory", tone: "bad" },
    { label: "سرو ناهار", value: "۱۸", sub: "دقیقه", navigateTo: "customer", tone: "warn" },
    { label: "پیام پرسنل", value: "۴", sub: "جدید", navigateTo: "mailbox", tone: "warn" },
  ],
  finance: [
    { label: "موجودی نقد", value: "۸۵M", sub: "تومان", navigateTo: "finance", tone: "warn" },
    { label: "کمبود چک", value: "~۱۲M", sub: "۵ روز", navigateTo: "finance", tone: "bad" },
    { label: "FC امروز", value: "۳۴٪", sub: "هدف ۳۲٪", navigateTo: "foodcost", tone: "warn" },
  ],
};

export function getLayerHintCounts(period: TimePeriod): Record<DashboardLayer, number> {
  const urgent = getAlertsForPeriod(period).alerts.filter(
    (a) => a.severity === "critical" || a.severity === "warning"
  );
  return {
    owner: urgent.length,
    operations: urgent.filter((a) => alertMatchesLayer("operations", a.actionTarget)).length,
    finance: urgent.filter((a) => alertMatchesLayer("finance", a.actionTarget)).length,
  };
}

const opsCategories: AlertCategory[] = ["inventory", "hr", "customer", "ops"];
const finCategories: AlertCategory[] = ["finance", "foodcost", "sales"];

export function alertCategoryMatchesLayer(
  layer: DashboardLayer,
  category: AlertCategory
): boolean {
  if (layer === "owner") return true;
  if (layer === "operations") return opsCategories.includes(category);
  return finCategories.includes(category);
}

/** فیلتر هشدارهای خانه بر اساس لایه */
export function alertMatchesLayer(layer: DashboardLayer, actionTarget?: ViewId): boolean {
  if (layer === "owner") return true;
  const opsTargets: ViewId[] = ["inventory", "hr", "customer", "timeline", "mailbox", "foodcost"];
  const finTargets: ViewId[] = ["finance", "foodcost", "sales"];
  if (!actionTarget) return false;
  if (layer === "operations") return opsTargets.includes(actionTarget);
  return finTargets.includes(actionTarget);
}
