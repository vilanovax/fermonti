import type { MailboxBundle, MailboxMessage, TimePeriod } from "../types";

const todayMessages: MailboxMessage[] = [
  {
    id: "m1",
    channel: "customer",
    category: "complaint",
    status: "new",
    priority: "high",
    fromName: "مهدی رضایی",
    fromMeta: "میز ۱۲ — VIP",
    subject: "تاخیر سرو ناهار",
    body: "غذا بعد از ۴۰ دقیقه رسید. برای رزرو VIP انتظار داشتیم سرو سریع‌تر باشد.",
    time: "۱۱:۱۵",
    zone: "سالن",
    tags: ["سرویس", "ناهار"],
  },
  {
    id: "m2",
    channel: "customer",
    category: "suggestion",
    status: "new",
    priority: "normal",
    fromName: "ناشناس — QR نظرسنجی",
    fromMeta: "تحویل",
    subject: "منوی کم‌کالری روی اپ",
    body: "پیشنهاد می‌کنم فیلتر کم‌کالری و آلرژی روی منوی دیجیتال اضافه شود.",
    time: "۱۰:۴۰",
    tags: ["منو", "دیجیتال"],
  },
  {
    id: "m3",
    channel: "staff",
    category: "improvement",
    status: "in_progress",
    priority: "high",
    fromName: "سارا احمدی",
    fromMeta: "گارسون — شیفت ناهار",
    subject: "چیدمان میز تراس",
    body: "با آفتاب مستقیم ظهر، مشتری‌ها جابجا می‌شوند. پیشنهاد سایه‌بان موقت یا رزرو میز سایه.",
    time: "۱۰:۲۰",
    zone: "تراس",
    managerReply: "در حال بررسی با تیم عملیات — پاسخ تا فردا",
    replyTime: "۱۰:۵۵",
    tags: ["تراس", "عملیات"],
  },
  {
    id: "m4",
    channel: "staff",
    category: "complaint",
    status: "read",
    priority: "normal",
    fromName: "رضا محمدی",
    fromMeta: "آشپز — خط گریل",
    subject: "کمبود نیرو در شلوغی",
    body: "سه‌شنبه ناهار فقط ۲ نفر خط گریل بود؛ ۱۵ دقیقه تاخیر تجمعی.",
    time: "۰۹:۳۰",
    tags: ["آشپزخانه", "نیرو"],
  },
  {
    id: "m5",
    channel: "customer",
    category: "praise",
    status: "resolved",
    priority: "low",
    fromName: "الناز کریمی",
    fromMeta: "اینستاگرام DM",
    subject: "تشکر از سرویس شب",
    body: "دیروز شام عالی بود — به خصوص پیشنهاد شراب گارسون.",
    time: "دیروز",
    zone: "سالن",
    managerReply: "ممنون — به تیم منتقل شد",
    replyTime: "دیروز",
  },
  {
    id: "m6",
    channel: "staff",
    category: "suggestion",
    status: "new",
    priority: "normal",
    fromName: "علی رضایی",
    fromMeta: "گارسون",
    subject: "چک‌لیست پایان شیفت",
    body: "یک چک‌لیست ۵ دقیقه‌ای برای بستن میز و POS کمک می‌کند تا مغایرت کم شود.",
    time: "۰۸:۵۰",
    tags: ["فرایند", "POS"],
  },
  {
    id: "m7",
    channel: "customer",
    category: "complaint",
    status: "in_progress",
    priority: "high",
    fromName: "حسین موسوی",
    fromMeta: "میز ۸ — تراس",
    subject: "گرمای بیش از حد",
    body: "تهویه کافی نبود — درخواست جابجایی با تاخیر انجام شد.",
    time: "۱۱:۰۰",
    zone: "تراس",
    managerReply: "پوزش — پیگیری با تاسیسات",
    replyTime: "۱۱:۱۰",
    tags: ["تراس", "رضایت"],
  },
  {
    id: "m8",
    channel: "staff",
    category: "question",
    status: "read",
    priority: "low",
    fromName: "مریم کریمی",
    fromMeta: "میزبان",
    subject: "سیاست تخفیف گروهی",
    body: "برای رزرو ۱۲ نفره فردا — سقف تخفیف مدیر چقدر است؟",
    time: "۰۸:۱۵",
    managerReply: "حداکثر ۱۰٪ بدون تایید مالک — بالاتر از آن ارجاع به شما",
    replyTime: "۰۸:۴۰",
  },
];

const weekMessages: MailboxMessage[] = [
  {
    id: "w1",
    channel: "customer",
    category: "complaint",
    status: "resolved",
    priority: "high",
    fromName: "چند مشتری",
    fromMeta: "تجمیع نظرسنجی هفته",
    subject: "تاخیر سرو — ۹ مورد",
    body: "میانگین تاخیر ۲۲ دقیقه گزارش شده — بیشتر ناهار و تراس.",
    time: "هفته جاری",
    managerReply: "جلسه با سرآشپز و گارسون‌ها برگزار شد",
    replyTime: "سه‌شنبه",
    tags: ["سرویس"],
  },
  {
    id: "w2",
    channel: "staff",
    category: "improvement",
    status: "in_progress",
    priority: "high",
    fromName: "تیم سالن",
    fromMeta: "۳ گارسون",
    subject: "سیستم رزرو یکپارچه",
    body: "هماهنگی رزرو تلفنی و آنلاین گاه دوبله می‌شود — پیشنهاد یک داشبورد رزرو.",
    time: "دوشنبه",
    tags: ["سیستم", "رزرو"],
  },
  {
    id: "w3",
    channel: "customer",
    category: "suggestion",
    status: "read",
    priority: "normal",
    fromName: "مشتریان وفادار",
    fromMeta: "کارت باشگاه",
    subject: "پاداش بازگشت",
    body: "پیشنهاد امتیاز برای هر بار بازگشت در ماه — ۵٪ تخفیف بعد از ۳ ویزیت.",
    time: "چهارشنبه",
  },
  {
    id: "w4",
    channel: "staff",
    category: "complaint",
    status: "new",
    priority: "normal",
    fromName: "نیما حسینی",
    fromMeta: "گارسون",
    subject: "استراحت بین شیفت",
    body: "فاصله بین شیفت صبح و عصر کم است — خستگی در شلوغی جمعه.",
    time: "جمعه",
    tags: ["HR", "نیرو"],
  },
];

const monthMessages: MailboxMessage[] = [
  {
    id: "mo1",
    channel: "customer",
    category: "improvement",
    status: "resolved",
    priority: "normal",
    fromName: "نظرات ماه",
    fromMeta: "۱۴۲ نظرسنجی",
    subject: "بهبود منوی کودک",
    body: "۲۳٪ پیشنهاد مرتبط با منوی کودک و صندلی‌های کودک.",
    time: "هفته ۲",
    managerReply: "منوی کودک در برنامه Q3",
    replyTime: "هفته ۳",
  },
  {
    id: "mo2",
    channel: "staff",
    category: "suggestion",
    status: "resolved",
    priority: "high",
    fromName: "سارا + علی",
    fromMeta: "گارسون",
    subject: "آموزش فروش افزوده",
    body: "کارگاه ۳۰ دقیقه‌ای ماهانه — نتیجه: فروش افزوده +۴٪",
    time: "هفته ۱",
    managerReply: "ادامه هر ماه",
    replyTime: "هفته ۲",
  },
  {
    id: "mo3",
    channel: "staff",
    category: "complaint",
    status: "in_progress",
    priority: "normal",
    fromName: "آشپزخانه",
    fromMeta: "۴ نفر",
    subject: "گرمای خط سرو",
    body: "تهویه آشپزخانه — درخواست سرویس کولر قبل تابستان.",
    time: "هفته ۴",
    tags: ["تاسیسات"],
  },
];

function bundleFor(period: TimePeriod, messages: MailboxMessage[]): MailboxBundle {
  const unread = messages.filter((m) => m.status === "new").length;
  const pendingReply = messages.filter(
    (m) => m.status !== "resolved" && !m.managerReply
  ).length;
  const customerCount = messages.filter((m) => m.channel === "customer").length;
  const staffCount = messages.filter((m) => m.channel === "staff").length;

  const active = messages.filter((m) => m.status !== "resolved").length;
  const headlines: Record<TimePeriod, string> = {
    today:
      unread > 0
        ? `${unread} پیام جدید — ${pendingReply} مورد بدون پاسخ`
        : pendingReply > 0
          ? `${pendingReply} پیام در انتظار پاسخ شما`
          : "همه پیام‌های فعال پاسخ داده شده",
    week: `${active} پیام فعال — تمرکز بر تاخیر سرو و رزرو`,
    month: `${active} پیام فعال — بهبود روند پاسخ‌گویی`,
  };

  return {
    period,
    summary: {
      total: messages.length,
      unread,
      customerCount,
      staffCount,
      pendingReply,
      headline: headlines[period],
      lastUpdated: period === "today" ? "۱۱:۳۵" : period === "week" ? "امروز" : "دیروز",
    },
    messages: [...messages].sort((a, b) => {
      const statusOrder = { new: 0, in_progress: 1, read: 2, resolved: 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      const pri = { high: 0, normal: 1, low: 2 };
      return pri[a.priority] - pri[b.priority];
    }),
  };
}

const bundles: Record<TimePeriod, MailboxBundle> = {
  today: bundleFor("today", todayMessages),
  week: bundleFor("week", weekMessages),
  month: bundleFor("month", monthMessages),
};

export function getMailboxForPeriod(period: TimePeriod): MailboxBundle {
  return bundles[period];
}

export function getMailboxUnreadCount(period: TimePeriod = "today"): number {
  return bundles[period].summary.unread;
}
