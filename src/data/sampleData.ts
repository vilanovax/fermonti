import { getTodayAlerts } from "./alertsData";
import { getTodayAiInsights } from "./aiInsightsData";
import { getTodayTimelineEvents } from "./timelineData";
import type {
  Alert,
  TimelineEvent,
  ViewId,
} from "../types";

export const RESTAURANT = {
  name: "فرمنوتی",
  tagline: "اتاق فرمان رستوران",
  location: "تهران — سالن + تراس",
  lastUpdate: "۱۱:۴۵ — به‌روز هر ۵ دقیقه",
};

export const todayVerdict: {
  status: "good" | "caution" | "bad";
  headline: string;
  focus: string;
} = {
  status: "caution",
  headline: "امروز متوسط — ناهار ضعیف، شام قوی‌تر",
  focus: "کنترل هزینه غذا و موجودی نوشیدنی",
};

/** @deprecated از getDashboardForPeriod استفاده کنید */
export const salesSnapshot = {
  todayMillions: 48.2,
  yesterdayMillions: 45.5,
  changePercent: 6,
  label: "فروش امروز تا این لحظه",
};

/** میانبرهای پرکاربرد صفحه خانه */
export const homeQuickShortcuts: {
  id: ViewId;
  label: string;
  icon: string;
  color: string;
}[] = [
  { id: "sales", label: "تحلیل فروش", icon: "chart", color: "from-blue-500 to-cyan-500" },
  { id: "inventory", label: "انبار", icon: "package", color: "from-emerald-500 to-teal-500" },
  { id: "hr", label: "پرسنل", icon: "users", color: "from-pink-500 to-rose-500" },
  { id: "finance", label: "مالی", icon: "wallet", color: "from-violet-500 to-purple-500" },
];

/** بقیه بخش‌ها — از منو یا آکاردئون «سایر» */
export const homeMoreModules: {
  id: ViewId;
  label: string;
  icon: string;
}[] = [
  { id: "foodcost", label: "هزینه غذا", icon: "utensils" },
  { id: "customer", label: "مشتری", icon: "heart" },
  { id: "mailbox", label: "صندوق پستی", icon: "mail" },
  { id: "alerts", label: "هشدارها", icon: "alert" },
  { id: "timeline", label: "تایم‌لاین", icon: "clock" },
  { id: "ai", label: "پیش‌بینی", icon: "sparkles" },
];

export const criticalFive: {
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
  target: string;
  navigateTo: ViewId;
}[] = [
  { label: "رشد فروش", value: "+۴٪", trend: "up", target: "هدف: +۸٪", navigateTo: "sales" },
  { label: "هزینه غذا", value: "۳۴٪", trend: "down", target: "حد: ۳۲٪", navigateTo: "foodcost" },
  { label: "میانگین فاکتور", value: "۱.۸۵M", trend: "up", target: "هدف: ۲M", navigateTo: "sales" },
  { label: "دور میز", value: "۲.۳", trend: "flat", target: "هدف: ۲.۵", navigateTo: "sales" },
  { label: "جریان نقد", value: "+۱۲M", trend: "up", target: "مثبت ✓", navigateTo: "finance" },
];

/** هشدارهای امروز — برای خانه و شمارنده نوتیفیکیشن */
export const alerts: Alert[] = getTodayAlerts();

export const timeline: TimelineEvent[] = getTodayTimelineEvents();

export const aiInsights = getTodayAiInsights();

export const refreshRates = [
  { section: "فروش", rate: "هر ۵ دقیقه" },
  { section: "انبار", rate: "هر ۱ ساعت" },
  { section: "مالی", rate: "روزانه" },
  { section: "حقوق", rate: "هفتگی" },
];
