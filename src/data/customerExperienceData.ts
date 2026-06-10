import type { CustomerExperienceBundle, TimePeriod } from "../types";

const sparkUp = [4.0, 4.1, 4.0, 4.2, 4.1, 4.3, 4.3];
const sparkFlat = [4.2, 4.2, 4.1, 4.2, 4.2, 4.1, 4.2];

const bundles: Record<TimePeriod, CustomerExperienceBundle> = {
  today: {
    period: "today",
    summary: {
      satisfaction: 4.3,
      satisfactionCompare: "دیروز: ۴.۱",
      satisfactionTrend: "up",
      nps: 42,
      npsCompare: "دیروز: ۳۸",
      complaints: 7,
      complaintsCompare: "دیروز: ۵",
      returnRate: "۳۴٪",
      returnCompare: "دیروز: ۳۲٪",
      foodServeMinutes: 18,
      foodServeCompare: "دیروز: ۱۶ دقیقه",
      tableWaitMinutes: 12,
      tableWaitCompare: "دیروز: ۱۰ دقیقه",
      targetServeMin: 15,
      targetWaitMin: 10,
      serveStatus: "warning",
      waitStatus: "warning",
      sparkline: sparkUp,
      headline: "رضایت خوب — تاخیر سرو و تراس نیاز توجه",
      vipToday: 12,
      reservedShare: 37,
    },
    complaintTopics: [
      { id: "delay", label: "تاخیر سرو", count: 3, sharePercent: 43, trend: "up" },
      { id: "terrace", label: "گرمای تراس", count: 2, sharePercent: 29, trend: "up" },
      { id: "price", label: "قیمت", count: 1, sharePercent: 14, trend: "flat" },
      { id: "noise", label: "سر و صدا", count: 1, sharePercent: 14, trend: "down" },
    ],
    recentComplaints: [
      { id: "c1", time: "۱۱:۲۰", topic: "تاخیر سرو", zone: "سالن", severity: "high", excerpt: "غذا بعد از ۳۵ دقیقه رسید" },
      { id: "c2", time: "۱۰:۴۵", topic: "گرمای تراس", zone: "تراس", severity: "medium", excerpt: "تهویه کافی نبود" },
      { id: "c3", time: "۱۰:۱۰", topic: "قیمت", zone: "سالن", severity: "low", excerpt: "منو ناهار گران perceived" },
    ],
    zoneRatings: [
      { zone: "سالن", satisfaction: 4.4, compareText: "دیروز ۴.۲", reviews: 89 },
      { zone: "تراس", satisfaction: 3.9, compareText: "دیروز ۴.۱", reviews: 34 },
      { zone: "تحویل", satisfaction: 4.5, compareText: "دیروز ۴.۴", reviews: 19 },
    ],
    insights: [
      { title: "تراس زیر میانگین", detail: "رضایت ۳.۹ — بررسی تهویه و سایه‌بان قبل از ظهر", severity: "warning" },
      { title: "تاخیر ناهار", detail: "میانگین سرو ۱۸ دقیقه — ۳ دقیقه بالاتر از هدف", severity: "critical" },
      { title: "NPS در حال بهبود", detail: "+۴ نسبت دیروز — رضایت از دسر و سرویس VIP", severity: "info" },
    ],
  },
  week: {
    period: "week",
    summary: {
      satisfaction: 4.2,
      satisfactionCompare: "هفته قبل: ۴.۱",
      satisfactionTrend: "up",
      nps: 40,
      npsCompare: "هفته قبل: ۳۷",
      complaints: 28,
      complaintsCompare: "هفته قبل: ۳۲",
      returnRate: "۳۶٪",
      returnCompare: "هفته قبل: ۳۳٪",
      foodServeMinutes: 17,
      foodServeCompare: "هفته قبل: ۱۸ دقیقه",
      tableWaitMinutes: 11,
      tableWaitCompare: "هفته قبل: ۱۲ دقیقه",
      targetServeMin: 15,
      targetWaitMin: 10,
      serveStatus: "warning",
      waitStatus: "good",
      sparkline: sparkFlat,
      headline: "روند مثبت — شکایت‌ها کمتر شده",
      vipToday: 0,
      reservedShare: 41,
    },
    complaintTopics: [
      { id: "delay", label: "تاخیر سرو", count: 9, sharePercent: 32, trend: "down" },
      { id: "terrace", label: "گرمای تراس", count: 7, sharePercent: 25, trend: "flat" },
      { id: "price", label: "قیمت", count: 5, sharePercent: 18, trend: "up" },
      { id: "quality", label: "کیفیت غذا", count: 4, sharePercent: 14, trend: "down" },
      { id: "staff", label: "رفتار پرسنل", count: 3, sharePercent: 11, trend: "flat" },
    ],
    recentComplaints: [
      { id: "w1", time: "دیروز", topic: "تاخیر سرو", zone: "سالن", severity: "medium", excerpt: "شام شلوغ — تاخیر ۲۵ دقیقه" },
      { id: "w2", time: "۲ روز پیش", topic: "کیفیت غذا", zone: "تراس", severity: "high", excerpt: "استیک بیش‌ازحد پخته" },
    ],
    zoneRatings: [
      { zone: "سالن", satisfaction: 4.3, compareText: "هفته قبل ۴.۲", reviews: 412 },
      { zone: "تراس", satisfaction: 4.0, compareText: "هفته قبل ۳.۹", reviews: 156 },
      { zone: "تحویل", satisfaction: 4.4, compareText: "هفته قبل ۴.۳", reviews: 98 },
    ],
    insights: [
      { title: "شکایت‌ها ۱۳٪ کمتر", detail: "از ۳۲ به ۲۸ — اثر آموزش گارسون‌ها", severity: "info" },
      { title: "قیمت در حال افزایش", detail: "۵ شکایت قیمت — بررسی perceived value منو", severity: "warning" },
    ],
  },
  month: {
    period: "month",
    summary: {
      satisfaction: 4.25,
      satisfactionCompare: "ماه قبل: ۴.۱۵",
      satisfactionTrend: "up",
      nps: 44,
      npsCompare: "ماه قبل: ۴۰",
      complaints: 98,
      complaintsCompare: "ماه قبل: ۱۱۲",
      returnRate: "۳۸٪",
      returnCompare: "ماه قبل: ۳۵٪",
      foodServeMinutes: 16,
      foodServeCompare: "ماه قبل: ۱۷ دقیقه",
      tableWaitMinutes: 10,
      tableWaitCompare: "ماه قبل: ۱۱ دقیقه",
      targetServeMin: 15,
      targetWaitMin: 10,
      serveStatus: "good",
      waitStatus: "good",
      sparkline: sparkUp,
      headline: "بهترین ماه سال — NPS و بازگشت مشتری رشد کرد",
      vipToday: 0,
      reservedShare: 39,
    },
    complaintTopics: [
      { id: "delay", label: "تاخیر سرو", count: 28, sharePercent: 29, trend: "down" },
      { id: "price", label: "قیمت", count: 22, sharePercent: 22, trend: "flat" },
      { id: "terrace", label: "گرمای تراس", count: 18, sharePercent: 18, trend: "down" },
      { id: "quality", label: "کیفیت غذا", count: 15, sharePercent: 15, trend: "down" },
      { id: "noise", label: "سر و صدا", count: 10, sharePercent: 10, trend: "down" },
    ],
    recentComplaints: [
      { id: "m1", time: "هفته گذشته", topic: "قیمت", zone: "سالن", severity: "low", excerpt: "منوی جدید — مقایسه با رقبا" },
    ],
    zoneRatings: [
      { zone: "سالن", satisfaction: 4.35, compareText: "ماه قبل ۴.۲۵", reviews: 1680 },
      { zone: "تراس", satisfaction: 4.1, compareText: "ماه قبل ۳.۹۵", reviews: 620 },
      { zone: "تحویل", satisfaction: 4.45, compareText: "ماه قبل ۴.۳۵", reviews: 410 },
    ],
    insights: [
      { title: "رضایت ماهانه رکورد", detail: "۴.۲۵ میانگین — بالاترین از ۶ ماه گذشته", severity: "info" },
      { title: "تراس همچنان ضعیف‌تر", detail: "۰.۲۵ پایین‌تر از سالن — اولویت بهبود فضا", severity: "warning" },
    ],
  },
};

export function getCustomerExperienceForPeriod(
  period: TimePeriod
): CustomerExperienceBundle {
  return bundles[period];
}
