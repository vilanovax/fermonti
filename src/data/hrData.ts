import type { HRBundle, StaffMember, TimePeriod } from "../types";

const sparkToday = [8.2, 8.4, 8.5, 8.6, 8.7, 8.8, 8.85];
const sparkWeek = [8.0, 8.1, 8.3, 8.4, 8.5, 8.6, 8.7];
const sparkMonth = [7.8, 7.9, 8.1, 8.2, 8.4, 8.5, 8.6];

const todayStaff: StaffMember[] = [
  {
    id: "1",
    name: "سارا احمدی",
    role: "گارسون",
    roleType: "waiter",
    hireDateShamsi: "۱۴۰۰/۰۷/۰۵",
    avatar: "SA",
    salesScore: 94,
    satisfaction: 4.8,
    delays: 0,
    complaints: 0,
    upsell: 18,
    rating: 9.2,
    ratingTrend: "up",
  },
  {
    id: "2",
    name: "علی رضایی",
    role: "گارسون",
    roleType: "waiter",
    hireDateShamsi: "۱۴۰۱/۱۱/۲۰",
    avatar: "AR",
    salesScore: 88,
    satisfaction: 4.5,
    delays: 2,
    complaints: 1,
    upsell: 22,
    rating: 8.5,
    ratingTrend: "flat",
  },
  {
    id: "3",
    name: "مریم کریمی",
    role: "میزبان",
    roleType: "host",
    hireDateShamsi: "۱۴۰۳/۰۱/۱۵",
    avatar: "MK",
    salesScore: 76,
    satisfaction: 4.2,
    delays: 1,
    complaints: 3,
    upsell: 5,
    rating: 7.1,
    ratingTrend: "down",
  },
  {
    id: "4",
    name: "رضا محمدی",
    role: "آشپز",
    roleType: "chef",
    hireDateShamsi: "۱۳۹۹/۰۴/۱۰",
    avatar: "RM",
    salesScore: 82,
    satisfaction: 4.6,
    delays: 0,
    complaints: 0,
    upsell: 0,
    rating: 8.8,
    ratingTrend: "up",
  },
  {
    id: "5",
    name: "نیما حسینی",
    role: "گارسون",
    roleType: "waiter",
    hireDateShamsi: "۱۴۰۳/۰۶/۰۱",
    avatar: "NH",
    salesScore: 71,
    satisfaction: 4.0,
    delays: 3,
    complaints: 2,
    upsell: 9,
    rating: 6.8,
    ratingTrend: "down",
  },
];

const weekStaff: StaffMember[] = [
  { ...todayStaff[0], salesScore: 91, rating: 9.0, complaints: 1 },
  { ...todayStaff[1], salesScore: 90, upsell: 24, rating: 8.8, ratingTrend: "up" },
  { ...todayStaff[3], salesScore: 85, rating: 8.9 },
  { ...todayStaff[2], salesScore: 74, complaints: 5, rating: 6.9, ratingTrend: "down" },
  { ...todayStaff[4], salesScore: 73, rating: 6.5 },
];

const monthStaff: StaffMember[] = [
  { ...todayStaff[0], salesScore: 89, rating: 8.9, satisfaction: 4.7 },
  { ...todayStaff[1], salesScore: 87, upsell: 21, rating: 8.6 },
  { ...todayStaff[3], salesScore: 84, rating: 8.7 },
  { ...todayStaff[2], salesScore: 72, complaints: 8, rating: 6.7 },
  { ...todayStaff[4], salesScore: 70, rating: 6.6 },
];

function sortByRating(staff: StaffMember[]) {
  return [...staff].sort((a, b) => b.rating - a.rating);
}

const bundles: Record<TimePeriod, HRBundle> = {
  today: {
    period: "today",
    summary: {
      activeStaff: 12,
      avgRating: 8.1,
      avgSatisfaction: 4.4,
      laborCostRatio: "۲۸٪",
      laborCostCompare: "هدف: ۲۷٪",
      totalComplaints: 6,
      headline: "سارا رتبه ۱ — مریم نیاز به کوچینگ شکایت",
      lastUpdated: "۱۱:۵۵",
      sparkline: sparkToday,
    },
    highlights: [
      { key: "bestWaiter", label: "بهترین گارسون", value: "سارا احمدی" },
      { key: "bestUpsell", label: "بیشترین فروش افزوده", value: "علی رضایی" },
      { key: "mostComplaints", label: "بیشترین شکایت", value: "مریم کریمی" },
      { key: "labor", label: "حقوق/فروش", value: "۲۸٪" },
    ],
    staff: sortByRating(todayStaff),
    insights: [
      {
        title: "کوچینگ مریم کریمی",
        detail: "۳ شکایت امروز — جلسه ۱۵ دقیقه‌ای پیش از شیفت شام",
        severity: "warning",
      },
      {
        title: "علی — فروش افزوده",
        detail: "۲۲٪ — پیشنهاد نقش مربی برای نیروی جدید",
        severity: "info",
      },
    ],
  },
  week: {
    period: "week",
    summary: {
      activeStaff: 12,
      avgRating: 8.0,
      avgSatisfaction: 4.35,
      laborCostRatio: "۲۹٪",
      laborCostCompare: "هفته قبل: ۲۸٪",
      totalComplaints: 18,
      headline: "امتیاز هفته پایدار — شکایت‌ها ۲ بیشتر از هفته قبل",
      lastUpdated: "امروز ۰۹:۰۰",
      sparkline: sparkWeek,
    },
    highlights: [
      { key: "bestWaiter", label: "بهترین گارسون هفته", value: "سارا احمدی" },
      { key: "bestUpsell", label: "فروش افزوده", value: "علی رضایی (۲۴٪)" },
      { key: "mostComplaints", label: "بیشترین شکایت", value: "مریم کریمی" },
      { key: "labor", label: "حقوق/فروش", value: "۲۹٪" },
    ],
    staff: sortByRating(weekStaff),
    insights: [
      {
        title: "اضافه‌کاری هفته",
        detail: "۱۸٪ بالاتر از برنامه — ۳ رزرو گروهی",
        severity: "warning",
      },
    ],
  },
  month: {
    period: "month",
    summary: {
      activeStaff: 14,
      avgRating: 7.9,
      avgSatisfaction: 4.3,
      laborCostRatio: "۲۸٪",
      laborCostCompare: "ماه قبل: ۲۹٪",
      totalComplaints: 62,
      headline: "روند مثبت رضایت — کاهش ۱٪ هزینه نیرو",
      lastUpdated: "دیروز",
      sparkline: sparkMonth,
    },
    highlights: [
      { key: "bestWaiter", label: "گارسون ماه", value: "سارا احمدی" },
      { key: "bestUpsell", label: "فروش افزوده", value: "علی رضایی" },
      { key: "mostComplaints", label: "شکایت ماه", value: "مریم کریمی" },
      { key: "labor", label: "حقوق/فروش", value: "۲۸٪" },
    ],
    staff: sortByRating(monthStaff),
    insights: [
      {
        title: "استخدام",
        detail: "۲ گارسون جدید — دوره سایه تا ۱۵ تیر",
        severity: "info",
      },
      {
        title: "رضایت آشپزخانه",
        detail: "رضا محمدی ۸.۷ — بدون تاخیر در ماه",
        severity: "info",
      },
    ],
  },
};

export function getHRForPeriod(period: TimePeriod): HRBundle {
  return bundles[period];
}
