import type { FinanceBundle, TimePeriod } from "../types";

const sparkToday = [82, 84, 83, 85, 84, 85, 85];
const sparkWeek = [78, 80, 82, 83, 84, 85, 85];
const sparkMonth = [92, 88, 85, 82, 80, 83, 85];

const weekCashFlow = [
  { label: "ش", inflow: 42, outflow: 38 },
  { label: "ی", inflow: 48, outflow: 35 },
  { label: "د", inflow: 52, outflow: 40 },
  { label: "س", inflow: 45, outflow: 42 },
  { label: "چ", inflow: 55, outflow: 38 },
  { label: "پ", inflow: 62, outflow: 45 },
  { label: "ج", inflow: 38, outflow: 50 },
];

const todayCashFlow = [
  { label: "صبح", inflow: 8, outflow: 12 },
  { label: "ظهر", inflow: 18, outflow: 14 },
  { label: "عصر", inflow: 12, outflow: 9 },
  { label: "شب", inflow: 22, outflow: 11 },
];

const monthCashFlow = [
  { label: "هفته ۱", inflow: 248, outflow: 235 },
  { label: "هفته ۲", inflow: 265, outflow: 248 },
  { label: "هفته ۳", inflow: 278, outflow: 262 },
  { label: "هفته ۴", inflow: 329, outflow: 298 },
];

const bundles: Record<TimePeriod, FinanceBundle> = {
  today: {
    period: "today",
    summary: {
      cashOnHandMillions: 85,
      cashCompare: "دیروز: ۹۰ میلیون",
      netCashflowMillions: 12,
      netCashflowPositive: true,
      commitmentsTotalMillions: 308.2,
      runwayDays: 18,
      headline: "جریان امروز مثبت — چک ۵ روز آینده ریسک",
      lastUpdated: "۱۱:۴۵",
      sparkline: sparkToday,
    },
    alert: {
      severity: "critical",
      title: "هشدار بحرانی",
      detail: "موجودی بانک برای چک ۵ روز آینده کافی نیست",
      shortageMillions: 12,
    },
    commitments: [
      { id: "c1", label: "چک‌های پیش‌رو (۵ روز)", amountMillions: 35, status: "critical", dueLabel: "۳ روز", category: "checks" },
      { id: "c2", label: "بدهی تامین‌کنندگان", amountMillions: 82, status: "ok", dueLabel: "۱۴ روز", category: "suppliers" },
      { id: "c3", label: "حقوق پرسنل (ماه جاری)", amountMillions: 120, status: "ok", dueLabel: "۱۲ روز", category: "payroll" },
      { id: "c4", label: "اجاره", amountMillions: 45, status: "ok", dueLabel: "۲۰ روز", category: "rent" },
      { id: "c5", label: "مالیات معوق", amountMillions: 18, status: "warning", dueLabel: "۷ روز", category: "tax" },
      { id: "c6", label: "هزینه جاری امروز", amountMillions: 8.2, status: "ok", category: "opex" },
    ],
    cashFlow: todayCashFlow,
    cashFlowTitle: "جریان نقد امروز",
    cashFlowSubtitle: "ورودی و خروجی به تفکیک شیفت — میلیون تومان",
    insights: [
      { title: "تامین نقد برای چک", detail: "۳۵M در ۵ روز — انتقال از صندوق یا تسویه زودهنگام فروش", severity: "critical" },
      { title: "خروجی ظهر بالا", detail: "خرید مواد — هم‌تراز با برنامه هفتگی", severity: "info" },
    ],
  },
  week: {
    period: "week",
    summary: {
      cashOnHandMillions: 85,
      cashCompare: "هفته قبل: ۸۵ میلیون",
      netCashflowMillions: 48,
      netCashflowPositive: true,
      commitmentsTotalMillions: 320,
      runwayDays: 17,
      headline: "هفته مثبت +۴۸M — جمعه خروجی بالاتر",
      lastUpdated: "امروز ۰۹:۰۰",
      sparkline: sparkWeek,
    },
    alert: {
      severity: "warning",
      title: "توجه به مالیات",
      detail: "۱۸M مالیات معوق — سررسید هفته آینده",
      shortageMillions: undefined,
    },
    commitments: [
      { id: "w1", label: "چک‌های این هفته", amountMillions: 42, status: "warning", dueLabel: "۲ روز", category: "checks" },
      { id: "w2", label: "بدهی تامین‌کنندگان", amountMillions: 82, status: "ok", category: "suppliers" },
      { id: "w3", label: "پیش‌پرداخت حقوق", amountMillions: 60, status: "ok", category: "payroll" },
      { id: "w4", label: "اجاره", amountMillions: 45, status: "ok", category: "rent" },
      { id: "w5", label: "مالیات معوق", amountMillions: 18, status: "warning", category: "tax" },
      { id: "w6", label: "هزینه‌های عملیاتی هفته", amountMillions: 73, status: "ok", category: "opex" },
    ],
    cashFlow: weekCashFlow,
    cashFlowTitle: "جریان نقدی هفتگی",
    cashFlowSubtitle: "میلیون تومان — خالص هفته: +۴۸",
    insights: [
      { title: "جمعه خروجی ۵۰M", detail: "حقوق پاره‌ای و تامین‌کننده — برنامه‌ریزی شده", severity: "info" },
      { title: "ورودی پنجشنبه قوی", detail: "۶۲M — بالاترین روز هفته", severity: "info" },
    ],
  },
  month: {
    period: "month",
    summary: {
      cashOnHandMillions: 85,
      cashCompare: "ماه قبل: ۹۷ میلیون",
      netCashflowMillions: 185,
      netCashflowPositive: true,
      commitmentsTotalMillions: 1240,
      runwayDays: 16,
      headline: "جریان ماه +۱۸۵M — موجودی نقد ۱۲٪ کمتر از ماه قبل",
      lastUpdated: "دیروز",
      sparkline: sparkMonth,
    },
    alert: null,
    commitments: [
      { id: "m1", label: "چک‌های ماه", amountMillions: 140, status: "ok", category: "checks" },
      { id: "m2", label: "تامین‌کنندگان", amountMillions: 320, status: "warning", dueLabel: "تجمیع", category: "suppliers" },
      { id: "m3", label: "حقوق و مزایا", amountMillions: 120, status: "ok", category: "payroll" },
      { id: "m4", label: "اجاره و ثابت", amountMillions: 45, status: "ok", category: "rent" },
      { id: "m5", label: "مالیات و عوارض", amountMillions: 38, status: "ok", category: "tax" },
      { id: "m6", label: "سایر هزینه‌ها", amountMillions: 577, status: "ok", category: "opex" },
    ],
    cashFlow: monthCashFlow,
    cashFlowTitle: "جریان نقد ماهانه",
    cashFlowSubtitle: "به تفکیک هفته — میلیون تومان",
    insights: [
      { title: "موجودی نقد پایین‌تر", detail: "۸۵M در مقابل ۹۷M ماه قبل — برنامه واریز فروش", severity: "warning" },
      { title: "جریان مثبت پایدار", detail: "+۱۸۵M — پوشش تعهدات ماه جاری", severity: "info" },
    ],
  },
};

export function getFinanceForPeriod(period: TimePeriod): FinanceBundle {
  return bundles[period];
}
