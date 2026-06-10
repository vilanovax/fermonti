import type { SalesAnalysisBundle, TimePeriod } from "../types";

const sparkToday = [38, 40, 42, 44, 45, 47, 48.2];
const sparkWeek = [36, 38, 40, 41, 42, 44, 285];
const sparkMonth = [820, 880, 940, 1000, 1050, 1090, 1120];

function cmp(
  label: string,
  previous: number,
  current: number
): { label: string; previousMillions: number; currentMillions: number; changePercent: number } {
  const changePercent = Math.round((current / previous - 1) * 100);
  return { label, previousMillions: previous, currentMillions: current, changePercent };
}

const todayHourly = [
  { label: "۱۲", sales: 4.2 },
  { label: "۱۳", sales: 8.5 },
  { label: "۱۴", sales: 6.1 },
  { label: "۱۵", sales: 3.2 },
  { label: "۱۶", sales: 2.8 },
  { label: "۱۷", sales: 4.0 },
  { label: "۱۸", sales: 5.5 },
  { label: "۱۹", sales: 7.2 },
  { label: "۲۰", sales: 9.8 },
  { label: "۲۱", sales: 11.2 },
  { label: "۲۲", sales: 8.4 },
  { label: "۲۳", sales: 4.1 },
];

const weekDaily = [
  { label: "ش", sales: 32 },
  { label: "ی", sales: 38 },
  { label: "د", sales: 41 },
  { label: "س", sales: 36 },
  { label: "چ", sales: 44 },
  { label: "پ", sales: 52 },
  { label: "ج", sales: 42 },
];

const monthWeekly = [
  { label: "هفته ۱", sales: 248 },
  { label: "هفته ۲", sales: 265 },
  { label: "هفته ۳", sales: 278 },
  { label: "هفته ۴", sales: 329 },
];

const bundles: Record<TimePeriod, SalesAnalysisBundle> = {
  today: {
    period: "today",
    summary: {
      currentMillions: 48.2,
      changePercent: 6,
      label: "فروش امروز تا این لحظه",
      compareText: "دیروز همین ساعت: ۴۵.۵ میلیون",
      sparkline: sparkToday,
      headline: "ناهار ضعیف — شام و تراس جبران می‌کنند",
      busiestLabel: "۲۱:۰۰",
      ordersCount: 186,
      avgCheckMillions: 1.85,
    },
    comparisons: [
      cmp("دیروز", 45.5, 48.2),
      cmp("هفته قبل (همین روز)", 46.8, 48.2),
      cmp("میانگین ۴ هفته", 47.1, 48.2),
      cmp("همین روز ماه قبل", 51.0, 48.2),
    ],
    chartPoints: todayHourly,
    chartTitle: "فروش ساعتی",
    chartSubtitle: "شلوغ‌ترین: ۲۱:۰۰ — ۱۱.۲ میلیون",
    zones: [
      { zone: "سالن", lunch: 18.2, dinner: 22.5, total: 40.7, sharePercent: 58, trend: "flat" },
      { zone: "تراس", lunch: 8.1, dinner: 14.3, total: 22.4, sharePercent: 32, trend: "down" },
      { zone: "اینستاگرام/تحویل", lunch: 3.2, dinner: 5.8, total: 9.0, sharePercent: 13, trend: "up" },
    ],
    topItems: [
      { id: "ribeye", name: "استیک ریب‌آی", sales: 42, margin: 28, trend: "up" },
      { id: "truffle", name: "پاستا ترافل", sales: 38, margin: 52, trend: "up" },
      { id: "burger", name: "برگر فرمنوتی", sales: 35, margin: 45, trend: "flat" },
      { id: "caesar", name: "سالاد سزار", sales: 28, margin: 62, trend: "up" },
    ],
    attentionItems: [
      { id: "soup", name: "سوپ روز", sales: 4, margin: 5, trend: "down", issue: "کم‌فروش" },
      { id: "tiramisu", name: "دسر تیرامیسو", sales: 6, margin: 18, trend: "down", discountRate: 25, issue: "تخفیف زیاد" },
      { id: "pizza", name: "پیتزا مارگاریتا", sales: 8, margin: -5, trend: "down", issue: "زیان‌ده" },
    ],
    customerBehavior: [
      { key: "avgTable", label: "میانگین میز", value: "۲.۴M", compare: "دیروز: ۲.۳M" },
      { key: "stay", label: "زمان حضور", value: "۷۸ دقیقه", compare: "دیروز: ۷۲ دقیقه" },
      { key: "return", label: "بازگشت", value: "۳۴٪", compare: "دیروز: ۳۲٪" },
      { key: "vip", label: "VIP", value: "۱۲", compare: "دیروز: ۹" },
      { key: "walkin", label: "بدون رزرو", value: "۸۹", compare: "دیروز: ۹۴" },
      { key: "reserved", label: "رزروی", value: "۵۳", compare: "دیروز: ۴۸" },
    ],
    insights: [
      { title: "ناهار ۳۲٪ زیر میانگین", detail: "۱۸.۲M — بررسی منوی ناهار و سرعت سرو", severity: "critical" },
      { title: "تراس شام قوی", detail: "۱۴.۳M شام — ۶۴٪ فروش تراس در شام", severity: "info" },
    ],
  },
  week: {
    period: "week",
    summary: {
      currentMillions: 285,
      changePercent: 3,
      label: "فروش این هفته",
      compareText: "هفته قبل: ۲۷۷ میلیون",
      sparkline: sparkWeek,
      headline: "پنجشنبه رکورد — یکشنبه و سه‌شنبه ضعیف‌تر",
      busiestLabel: "پنجشنبه",
      ordersCount: 1120,
      avgCheckMillions: 1.92,
    },
    comparisons: [
      cmp("هفته قبل", 277, 285),
      cmp("میانگین ۴ هفته", 268, 285),
      cmp("همین هفته سال قبل", 262, 285),
      cmp("بهترین هفته ماه", 292, 285),
    ],
    chartPoints: weekDaily,
    chartTitle: "فروش روزانه",
    chartSubtitle: "شلوغ‌ترین: پنجشنبه — ۵۲ میلیون",
    zones: [
      { zone: "سالن", lunch: 98, dinner: 124, total: 222, sharePercent: 56, trend: "up" },
      { zone: "تراس", lunch: 42, dinner: 68, total: 110, sharePercent: 28, trend: "down" },
      { zone: "اینستاگرام/تحویل", lunch: 18, dinner: 35, total: 53, sharePercent: 16, trend: "up" },
    ],
    topItems: [
      { id: "ribeye", name: "استیک ریب‌آی", sales: 248, margin: 29, trend: "up" },
      { id: "truffle", name: "پاستا ترافل", sales: 210, margin: 51, trend: "up" },
      { id: "burger", name: "برگر فرمنوتی", sales: 198, margin: 44, trend: "up" },
      { id: "salmon", name: "ماهی سالمون", sales: 156, margin: 34, trend: "flat" },
    ],
    attentionItems: [
      { id: "pizza", name: "پیتزا مارگاریتا", sales: 42, margin: -3, trend: "down", issue: "زیان‌ده" },
      { id: "soup", name: "سوپ روز", sales: 28, margin: 12, trend: "down", issue: "کم‌فروش" },
    ],
    customerBehavior: [
      { key: "avgTable", label: "میانگین میز", value: "۲.۱M", compare: "هفته قبل: ۲.۰M" },
      { key: "stay", label: "زمان حضور", value: "۷۴ دقیقه", compare: "هفته قبل: ۷۶ دقیقه" },
      { key: "return", label: "بازگشت", value: "۳۶٪", compare: "هفته قبل: ۳۳٪" },
      { key: "vip", label: "VIP", value: "۴۸", compare: "هفته قبل: ۴۱" },
      { key: "walkin", label: "بدون رزرو", value: "۶۲۰", compare: "هفته قبل: ۶۴۵" },
      { key: "reserved", label: "رزروی", value: "۳۸۵", compare: "هفته قبل: ۳۶۲" },
    ],
    insights: [
      { title: "رشد ۳٪ نسبت هفته قبل", detail: "تحویل +۱۲٪ — تراس −۸٪", severity: "info" },
      { title: "پیتزا همچنان زیان‌ده", detail: "FC بالا — هماهنگ با پیشنهاد AI", severity: "warning" },
    ],
  },
  month: {
    period: "month",
    summary: {
      currentMillions: 1120,
      changePercent: 11,
      label: "فروش این ماه",
      compareText: "ماه قبل: ۱٬۰۰۹ میلیون",
      sparkline: sparkMonth,
      headline: "رشد ۱۱٪ — هفته ۴ پیش‌بینی قوی",
      busiestLabel: "هفته ۴",
      ordersCount: 4820,
      avgCheckMillions: 1.88,
    },
    comparisons: [
      cmp("ماه قبل", 1009, 1120),
      cmp("همین ماه سال قبل", 985, 1120),
      cmp("میانگین ۶ ماه", 1045, 1120),
      cmp("هدف ماه", 1150, 1120),
    ],
    chartPoints: monthWeekly,
    chartTitle: "فروش هفتگی",
    chartSubtitle: "قوی‌ترین: هفته ۴ — ۳۲۹ میلیون",
    zones: [
      { zone: "سالن", lunch: 385, dinner: 492, total: 877, sharePercent: 55, trend: "up" },
      { zone: "تراس", lunch: 168, dinner: 278, total: 446, sharePercent: 30, trend: "flat" },
      { zone: "اینستاگرام/تحویل", lunch: 72, dinner: 125, total: 197, sharePercent: 15, trend: "up" },
    ],
    topItems: [
      { id: "ribeye", name: "استیک ریب‌آی", sales: 980, margin: 30, trend: "up" },
      { id: "truffle", name: "پاستا ترافل", sales: 820, margin: 53, trend: "up" },
      { id: "burger", name: "برگر فرمنوتی", sales: 760, margin: 46, trend: "up" },
      { id: "caesar", name: "سالاد سزار", sales: 640, margin: 61, trend: "up" },
    ],
    attentionItems: [
      { id: "pizza", name: "پیتزا مارگاریتا", sales: 180, margin: -4, trend: "down", issue: "زیان‌ده" },
      { id: "tiramisu", name: "دسر تیرامیسو", sales: 220, margin: 19, trend: "flat", discountRate: 18, issue: "تخفیف زیاد" },
      { id: "soup", name: "سوپ روز", sales: 95, margin: 10, trend: "down", issue: "کم‌فروش" },
    ],
    customerBehavior: [
      { key: "avgTable", label: "میانگین میز", value: "۲.۰M", compare: "ماه قبل: ۱.۹M" },
      { key: "stay", label: "زمان حضور", value: "۷۶ دقیقه", compare: "ماه قبل: ۷۵ دقیقه" },
      { key: "return", label: "بازگشت", value: "۳۷٪", compare: "ماه قبل: ۳۴٪" },
      { key: "vip", label: "VIP", value: "۱۸۶", compare: "ماه قبل: ۱۶۲" },
      { key: "walkin", label: "بدون رزرو", value: "۲۶۵۰", compare: "ماه قبل: ۲۷۱۰" },
      { key: "reserved", label: "رزروی", value: "۱۵۸۰", compare: "ماه قبل: ۱۴۲۰" },
    ],
    insights: [
      { title: "هدف ماه نزدیک است", detail: "۹۷٪ هدف ۱.۱۵B — ۳۰M مانده تا پایان ماه", severity: "info" },
      { title: "کانال تحویل رشد دو رقمی", detail: "+۱۴٪ نسبت ماه قبل", severity: "info" },
    ],
  },
};

export function getSalesAnalysisForPeriod(period: TimePeriod): SalesAnalysisBundle {
  return bundles[period];
}
