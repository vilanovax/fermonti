import type { TimelineBundle, TimelineEvent, TimePeriod } from "../types";

const sparkToday = [2, 3, 2, 4, 5, 5, 5];
const sparkWeek = [8, 12, 9, 14, 11, 10, 13];
const sparkMonth = [38, 42, 35, 40, 36, 41, 39];

const todayEvents: TimelineEvent[] = [
  {
    id: "te1",
    time: "۱۱:۲۰",
    type: "vip",
    title: "رزرو VIP — میز ۱۲",
    detail: "۴ نفر، منوی ویژه و خوش‌آمدگویی مدیر سالن",
    zone: "سالن",
    impact: "۴ نفر",
  },
  {
    id: "te2",
    time: "۱۰:۴۵",
    type: "marketing",
    title: "حضور بلاگر",
    detail: "استوری اینستاگرام — ۱۵K فالوور، تخفیف ۲۰٪",
    zone: "تراس",
    impact: "رسانه",
  },
  {
    id: "te3",
    time: "۱۰:۳۰",
    type: "incident",
    title: "قطع برق ۲۰ دقیقه",
    detail: "ژنراتور روشن شد — بدون لغو سفارش",
    zone: "کل مجموعه",
    durationMinutes: 20,
    impact: "۲۰ دقیقه",
  },
  {
    id: "te4",
    time: "۰۹:۱۵",
    type: "ops",
    title: "خرابی POS — ترمینال ۲",
    detail: "تعمیر شد — پرداخت نقدی موقت در ترمینال ۱",
    zone: "صندوق",
    durationMinutes: 25,
    impact: "۲۵ دقیقه",
  },
  {
    id: "te5",
    time: "۰۸:۰۰",
    type: "vip",
    title: "تولد مشتری VIP",
    detail: "میز ۸ — دسر رایگان و تزئین میز",
    zone: "سالن",
  },
  {
    id: "te6",
    time: "۰۷:۴۵",
    type: "staff",
    title: "تاخیر ورود ۲ نفر آشپزخانه",
    detail: "شیفت صبح — جبران با نیروی سالن تا ۰۸:۱۵",
    zone: "آشپزخانه",
    durationMinutes: 30,
  },
  {
    id: "te7",
    time: "۰۶:۳۰",
    type: "ops",
    title: "بازرسی بهداشت صبح",
    detail: "بدون مورد بحرانی — ۲ توصیه جزئی ثبت شد",
    zone: "آشپزخانه",
  },
  {
    id: "te8",
    time: "دیروز ۲۳:۱۰",
    type: "positive",
    title: "بسته شدن بدون شکایت",
    detail: "شیفت شب — ۴.۶ رضایت از ۱۲ نظرسنجی",
    zone: "سالن",
  },
];

const weekEvents: TimelineEvent[] = [
  {
    id: "we1",
    dayLabel: "جمعه",
    time: "۲۱:۰۰",
    type: "positive",
    title: "شلوغی پیک شام",
    detail: "۱۲۰٪ ظرفیت — بدون تاخیر بیش از ۱۸ دقیقه",
    zone: "سالن",
    impact: "+۲۰٪ فروش",
  },
  {
    id: "we2",
    dayLabel: "پنجشنبه",
    time: "۱۹:۳۰",
    type: "vip",
    title: "رزرو گروهی ۱۸ نفر",
    detail: "منوی گروهی — پیش‌پرداخت دریافت شد",
    zone: "تراس",
  },
  {
    id: "we3",
    dayLabel: "چهارشنبه",
    time: "۱۱:۰۰",
    type: "incident",
    title: "نشت آب — آشپزخانه",
    detail: "تعمیر لوله — تعطیلی بخش گریل ۴۵ دقیقه",
    durationMinutes: 45,
    zone: "آشپزخانه",
  },
  {
    id: "we4",
    dayLabel: "سه‌شنبه",
    time: "۱۴:۲۰",
    type: "ops",
    title: "قطعی اینترنت POS",
    detail: "حالت آفلاین — ۳۵ دقیقه",
    durationMinutes: 35,
    zone: "صندوق",
  },
  {
    id: "we5",
    dayLabel: "دوشنبه",
    time: "۱۰:۰۰",
    type: "marketing",
    title: "کمپین تخفیف ناهار",
    detail: "۱۵٪ تخفیف — ۲۸٪ افزایش ترافیک ناهار",
    impact: "+۲۸٪",
  },
  {
    id: "we6",
    dayLabel: "یکشنبه",
    time: "۰۹:۰۰",
    type: "staff",
    title: "آموزش گارسون جدید",
    detail: "۲ نفر — شیفت سایه با سارا احمدی",
    zone: "سالن",
  },
];

const monthEvents: TimelineEvent[] = [
  {
    id: "me1",
    dayLabel: "هفته ۴",
    time: "—",
    type: "positive",
    title: "رکورد رضایت ماهانه",
    detail: "میانگین ۴.۲۵ — بالاترین ۶ ماه",
    impact: "۴.۲۵",
  },
  {
    id: "me2",
    dayLabel: "هفته ۳",
    time: "—",
    type: "incident",
    title: "۲ حادثه ایمنی جزئی",
    detail: "سوختگی خفیف و لیز خوردن — گزارش ثبت شد",
    durationMinutes: 0,
  },
  {
    id: "me3",
    dayLabel: "هفته ۲",
    time: "—",
    type: "ops",
    title: "ارتقای سیستم POS",
    detail: "شب تعطیل — ۳ ترمینال به‌روز شد",
    durationMinutes: 180,
  },
  {
    id: "me4",
    dayLabel: "هفته ۲",
    time: "—",
    type: "vip",
    title: "۱۲ رویداد VIP",
    detail: "رزرو و تولد — ۸٪ فروش از VIP",
  },
  {
    id: "me5",
    dayLabel: "هفته ۱",
    time: "—",
    type: "marketing",
    title: "همکاری با اینفلوئنسر",
    detail: "۳ پست — تخمین ۴۰K بازدید",
    impact: "۴۰K",
  },
];

const bundles: Record<TimePeriod, TimelineBundle> = {
  today: {
    period: "today",
    summary: {
      totalEvents: todayEvents.length,
      incidentCount: 1,
      vipCount: 2,
      opsCount: 2,
      positiveCount: 1,
      downtimeMinutes: 45,
      headline: "۱ حادثه و ۴۵ دقیقه توقف — VIP و بلاگر مثبت",
      lastUpdated: "۱۱:۲۵",
      sparkline: sparkToday,
    },
    events: todayEvents,
    insights: [
      {
        title: "POS و برق",
        detail: "۴۵ دقیقه توقف تجمعی — بررسی UPS و قرارداد تعمیرات",
        severity: "warning",
      },
      {
        title: "فرصت رسانه",
        detail: "بلاگر تراس — آماده‌سازی منوی عکاسی برای بازدید بعدی",
        severity: "info",
      },
    ],
  },
  week: {
    period: "week",
    summary: {
      totalEvents: weekEvents.length,
      incidentCount: 1,
      vipCount: 1,
      opsCount: 1,
      positiveCount: 1,
      downtimeMinutes: 80,
      headline: "هفته پرتنش عملیاتی — ۸۰ دقیقه توقف",
      lastUpdated: "امروز ۰۸:۰۰",
      sparkline: sparkWeek,
    },
    events: weekEvents,
    insights: [
      {
        title: "آشپزخانه",
        detail: "نشت آب — پیشنهاد بازرسی لوله‌کشی ماهانه",
        severity: "critical",
      },
      {
        title: "کمپین ناهار موفق",
        detail: "۲۸٪ ترافیک بیشتر — تکرار در هفته آینده",
        severity: "info",
      },
    ],
  },
  month: {
    period: "month",
    summary: {
      totalEvents: monthEvents.length,
      incidentCount: 1,
      vipCount: 1,
      opsCount: 1,
      positiveCount: 1,
      downtimeMinutes: 180,
      headline: "ماه پایدار — تمرکز بر ایمنی و زیرساخت",
      lastUpdated: "دیروز",
      sparkline: sparkMonth,
    },
    events: monthEvents,
    insights: [
      {
        title: "ایمنی",
        detail: "۲ مورد جزئی — آموزش کوتاه شیفت توصیه می‌شود",
        severity: "warning",
      },
      {
        title: "VIP رشد کرد",
        detail: "۱۲ رویداد — نگهداری لیست و پیشنهاد منوی اختصاصی",
        severity: "info",
      },
    ],
  },
};

export function getTimelineForPeriod(period: TimePeriod): TimelineBundle {
  return bundles[period];
}

export function getTodayTimelineEvents(): TimelineEvent[] {
  return bundles.today.events;
}
