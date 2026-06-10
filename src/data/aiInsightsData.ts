import type { AiInsight, AiInsightsBundle, TimePeriod } from "../types";

const sparkToday = [72, 74, 76, 78, 79, 80, 81];
const sparkWeek = [68, 70, 73, 75, 77, 78, 80];
const sparkMonth = [65, 67, 70, 72, 74, 76, 79];

const todayInsights: AiInsight[] = [
  {
    id: "ai-t1",
    type: "price",
    title: "اصلاح قیمت پیتزا مارگاریتا",
    detail: "Food Cost ۵۵٪ — یا قیمت +۱۵٪ یا حذف از منو",
    confidence: 92,
    priority: "high",
    impact: "تا ۴.۲M سود ماهانه",
    actionLabel: "تحلیل هزینه",
    actionTarget: "foodcost",
  },
  {
    id: "ai-t2",
    type: "inventory",
    title: "سفارش فوری نوشابه",
    detail: "موجودی ۱ روز — پیش‌بینی اتمام فردا ظهر",
    confidence: 94,
    priority: "high",
    impact: "جلوگیری از از دست رفتن فروش",
    actionLabel: "انبار",
    actionTarget: "inventory",
  },
  {
    id: "ai-t3",
    type: "staff",
    title: "شیفت ناهار — یک گارسون کم",
    detail: "ترافیک ۱۱۵٪ میانگین — پیشنهاد اضافه‌کاری ۳ ساعت",
    confidence: 86,
    priority: "high",
    impact: "کاهش تاخیر سرو",
    actionLabel: "پرسنل",
    actionTarget: "hr",
  },
  {
    id: "ai-t4",
    type: "menu",
    title: "دسر تیرامیسو — افزایش قیمت",
    detail: "حاشیه سود ۱۸٪ — فروش بالا، قیمت ۸٪ پایین‌تر از رقبا",
    confidence: 78,
    priority: "medium",
    impact: "+۱.۱M در ماه",
    actionLabel: "تحلیل هزینه",
    actionTarget: "foodcost",
  },
  {
    id: "ai-t5",
    type: "forecast",
    title: "فروش امشب",
    detail: "پیش‌بینی ۴۲M — ۸٪ بالاتر از میانگین چهارشنبه",
    confidence: 81,
    priority: "medium",
    impact: "+۳.۱M",
    actionLabel: "فروش",
    actionTarget: "sales",
  },
  {
    id: "ai-t6",
    type: "marketing",
    title: "پست استوری تراس",
    detail: "بلاگر امروز — تکرار منوی ویژه تراس در آخر هفته",
    confidence: 71,
    priority: "low",
    actionLabel: "تایم‌لاین",
    actionTarget: "timeline",
  },
];

const weekInsights: AiInsight[] = [
  {
    id: "ai-w1",
    type: "inventory",
    title: "سفارش گوشت — چهارشنبه",
    detail: "پیش‌بینی شلوغی جمعه — ۲۰٪ بیشتر از میانگین",
    confidence: 85,
    priority: "high",
    impact: "جلوگیری از اتمام موجودی",
    actionLabel: "انبار",
    actionTarget: "inventory",
  },
  {
    id: "ai-w2",
    type: "staff",
    title: "پنجشنبه — نیروی کم",
    detail: "۳ رزرو گروهی — پیشنهاد اضافه‌کاری ۲ نفر",
    confidence: 78,
    priority: "high",
    actionLabel: "پرسنل",
    actionTarget: "hr",
  },
  {
    id: "ai-w3",
    type: "price",
    title: "۲ غذا FC بالای ۴۵٪",
    detail: "برگر ویژه و پاستا — بازنگری قیمت یا رسپی",
    confidence: 88,
    priority: "high",
    impact: "تا ۶M در هفته",
    actionLabel: "تحلیل هزینه",
    actionTarget: "foodcost",
  },
  {
    id: "ai-w4",
    type: "forecast",
    title: "فروش هفته",
    detail: "پیش‌بینی ۲۸۵M — ۶٪ بالاتر از هفته قبل",
    confidence: 79,
    priority: "medium",
    actionLabel: "فروش",
    actionTarget: "sales",
  },
  {
    id: "ai-w5",
    type: "ops",
    title: "تعمیرات POS پیشگیرانه",
    detail: "۲ خرابی این هفته — قرارداد سرویس ماهانه",
    confidence: 73,
    priority: "medium",
    actionLabel: "تایم‌لاین",
    actionTarget: "timeline",
  },
];

const monthInsights: AiInsight[] = [
  {
    id: "ai-m1",
    type: "forecast",
    title: "فروش پایان ماه",
    detail: "پیش‌بینی: ۱.۱۸B — ۵٪ بالاتر از ماه قبل",
    confidence: 81,
    priority: "high",
    impact: "+۵۶M",
    actionLabel: "فروش",
    actionTarget: "sales",
  },
  {
    id: "ai-m2",
    type: "menu",
    title: "حذف ۲ آیتم کم‌فروش",
    detail: "سالاد سزار و سوپ — FC بالا، فروش زیر ۵ پرس/هفته",
    confidence: 84,
    priority: "medium",
    impact: "ساده‌سازی آشپزخانه",
    actionLabel: "تحلیل هزینه",
    actionTarget: "foodcost",
  },
  {
    id: "ai-m3",
    type: "marketing",
    title: "کمپین ناهار ماه آینده",
    detail: "مدل نشان می‌دهد ۱۵٪ تخفیف → +۲۲٪ ترافیک ناهار",
    confidence: 76,
    priority: "medium",
    impact: "+۱۸M فروش",
  },
  {
    id: "ai-m4",
    type: "staff",
    title: "بهینه‌سازی شیفت آخر هفته",
    detail: "کاهش ۸ ساعت اضافه‌کاری بدون افت سرویس",
    confidence: 72,
    priority: "low",
    actionLabel: "پرسنل",
    actionTarget: "hr",
  },
  {
    id: "ai-m5",
    type: "price",
    title: "قیمت‌گذاری نوشیدنی",
    detail: "حاشیه نوشیدنی ۶٪ پایین‌تر از هدف — بسته ۵٪",
    confidence: 69,
    priority: "low",
    impact: "+۲.۴M",
    actionLabel: "مالی",
    actionTarget: "finance",
  },
];

const dataSources = [
  { label: "فروش POS", status: "demo" as const },
  { label: "انبار و FC", status: "demo" as const },
  { label: "رزرو و VIP", status: "demo" as const },
  { label: "رضایت مشتری", status: "demo" as const },
];

const bundles: Record<TimePeriod, AiInsightsBundle> = {
  today: {
    period: "today",
    summary: {
      totalInsights: todayInsights.length,
      highPriorityCount: 3,
      avgConfidence: 82,
      potentialImpactLabel: "تا ۱۲M تأثیر احتمالی",
      headline: "۳ اولویت بالا — قیمت، موجودی و نیروی ناهار",
      lastUpdated: "۱۱:۴۰",
      sparkline: sparkToday,
    },
    insights: todayInsights,
    dataSources,
  },
  week: {
    period: "week",
    summary: {
      totalInsights: weekInsights.length,
      highPriorityCount: 3,
      avgConfidence: 81,
      potentialImpactLabel: "تا ۳۵M در هفته",
      headline: "تمرکز: تامین گوشت و نیروی پنجشنبه",
      lastUpdated: "امروز ۰۹:۰۰",
      sparkline: sparkWeek,
    },
    insights: weekInsights,
    dataSources,
  },
  month: {
    period: "month",
    summary: {
      totalInsights: monthInsights.length,
      highPriorityCount: 1,
      avgConfidence: 76,
      potentialImpactLabel: "تا ۸۰M در ماه",
      headline: "پیش‌بینی رشد ۵٪ — بهینه‌سازی منو و نیرو",
      lastUpdated: "دیروز",
      sparkline: sparkMonth,
    },
    insights: monthInsights,
    dataSources,
  },
};

export function getAiInsightsForPeriod(period: TimePeriod): AiInsightsBundle {
  return bundles[period];
}

export function getTodayAiInsights(): AiInsight[] {
  return bundles.today.insights;
}
