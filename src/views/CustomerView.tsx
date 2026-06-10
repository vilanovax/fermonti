import { useState } from "react";
import {
  Clock,
  Heart,
  MessageSquareWarning,
  RotateCcw,
  TrendingUp,
  Users,
  Utensils,
} from "lucide-react";
import { PeriodFilter } from "../components/PeriodFilter";
import { Sparkline } from "../components/Sparkline";
import { StarRating } from "../components/StarRating";
import { useCustomerExperience } from "../hooks/useCustomerExperience";
import { Card, PageShell, SectionTitle, StatusPill, TrendIcon } from "../components/ui";
import type { TimePeriod } from "../types";

function timingStatusLabel(status: "good" | "warning" | "critical") {
  if (status === "good") return { label: "در هدف", variant: "ok" as const };
  if (status === "warning") return { label: "نزدیک حد", variant: "warning" as const };
  return { label: "بالاتر از هدف", variant: "critical" as const };
}

export function CustomerView() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const { data, loading } = useCustomerExperience(period);

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-36 rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-20 rounded-xl bg-slate-200" />
            <div className="h-20 rounded-xl bg-slate-200" />
            <div className="h-20 rounded-xl bg-slate-200" />
          </div>
          <div className="h-32 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary } = data;
  const servePill = timingStatusLabel(summary.serveStatus);
  const waitPill = timingStatusLabel(summary.waitStatus);

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-5 bg-gradient-to-br from-sky-600 via-indigo-600 to-violet-600 text-white border-0">
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-sm text-white/80">رضایت کلی</p>
            <p className="text-5xl font-extrabold mt-1 leading-none">
              {summary.satisfaction.toLocaleString("fa-IR", { maximumFractionDigits: 2 })}
            </p>
            <div className="mt-2">
              <StarRating value={summary.satisfaction} />
            </div>
            <p className="text-xs text-white/70 mt-2">{summary.satisfactionCompare}</p>
          </div>
          <Sparkline
            data={summary.sparkline}
            positive={summary.satisfactionTrend !== "down"}
          />
        </div>
        <p className="text-xs font-medium mt-3 px-2 py-1.5 rounded-lg bg-white/15 inline-block">
          {summary.headline}
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <Card className="p-3">
          <Heart className="w-5 h-5 text-rose-500 mb-1" />
          <p className="text-[11px] text-slate-500">NPS</p>
          <p className="text-xl font-extrabold text-brand-900">{summary.nps}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{summary.npsCompare}</p>
        </Card>
        <Card className="p-3 border-red-100 bg-red-50/40">
          <MessageSquareWarning className="w-5 h-5 text-red-600 mb-1" />
          <p className="text-[11px] text-slate-500">شکایت</p>
          <p className="text-xl font-extrabold text-red-700">{summary.complaints}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{summary.complaintsCompare}</p>
        </Card>
        <Card className="p-3">
          <RotateCcw className="w-5 h-5 text-emerald-600 mb-1" />
          <p className="text-[11px] text-slate-500">بازگشت</p>
          <p className="text-xl font-extrabold text-brand-900">{summary.returnRate}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{summary.returnCompare}</p>
        </Card>
      </div>

      {period === "today" && (
        <div className="grid grid-cols-2 gap-2 mb-5">
          <Card className="p-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-700 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-500">VIP امروز</p>
              <p className="font-bold text-brand-900">{summary.vipToday} نفر</p>
            </div>
          </Card>
          <Card className="p-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-700 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-500">رزروی</p>
              <p className="font-bold text-brand-900">{summary.reservedShare}٪ مشتری</p>
            </div>
          </Card>
        </div>
      )}

      <SectionTitle title="زمان‌بندی سرویس" subtitle="هدف: سرو زیر ۱۵ دقیقه، انتظار زیر ۱۰" />
      <div className="grid grid-cols-2 gap-2 mb-5">
        <Card className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Utensils className="w-5 h-5 text-brand-700" />
            <StatusPill label={servePill.label} variant={servePill.variant} />
          </div>
          <p className="text-xs text-slate-500">سرو غذا</p>
          <p className="text-2xl font-extrabold text-brand-900 mt-0.5">
            {summary.foodServeMinutes} دقیقه
          </p>
          <p className="text-xs text-slate-500 mt-1">{summary.foodServeCompare}</p>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Clock className="w-5 h-5 text-brand-700" />
            <StatusPill label={waitPill.label} variant={waitPill.variant} />
          </div>
          <p className="text-xs text-slate-500">انتظار میز</p>
          <p className="text-2xl font-extrabold text-brand-900 mt-0.5">
            {summary.tableWaitMinutes} دقیقه
          </p>
          <p className="text-xs text-slate-500 mt-1">{summary.tableWaitCompare}</p>
        </Card>
      </div>

      <SectionTitle title="رضایت به تفکیک فضا" />
      <div className="space-y-2 mb-5">
        {data.zoneRatings.map((z) => (
          <Card key={z.zone} className="p-3.5">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">{z.zone}</span>
              <span className="text-lg font-extrabold text-brand-900">
                {z.satisfaction.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-sky-500 to-indigo-500 rounded-full"
                style={{ width: `${(z.satisfaction / 5) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {z.compareText} — {z.reviews.toLocaleString("fa-IR")} نظر
            </p>
          </Card>
        ))}
      </div>

      <SectionTitle title="موضوعات پرتکرار شکایت" />
      <div className="flex flex-wrap gap-2 mb-5">
        {data.complaintTopics.map((t) => (
          <span
            key={t.id}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-50 border border-red-100 text-red-800 text-xs font-semibold"
          >
            {t.label}
            <span className="bg-red-200/80 text-red-900 px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
              {t.count}
            </span>
            <TrendIcon trend={t.trend} />
          </span>
        ))}
      </div>

      {data.recentComplaints.length > 0 && (
        <>
          <SectionTitle title="آخرین شکایت‌ها" subtitle="نمونه موارد اخیر" />
          <div className="space-y-2 mb-5">
            {data.recentComplaints.map((c) => (
              <Card
                key={c.id}
                className={`p-3.5 ${
                  c.severity === "high"
                    ? "border-red-200 bg-red-50/50"
                    : c.severity === "medium"
                      ? "border-amber-200 bg-amber-50/40"
                      : ""
                }`}
              >
                <div className="flex justify-between gap-2 mb-1">
                  <p className="font-bold text-sm text-brand-900">{c.topic}</p>
                  <span className="text-[11px] text-slate-400 shrink-0">{c.time}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {c.zone} —{" "}
                  <StatusPill
                    label={
                      c.severity === "high" ? "بالا" : c.severity === "medium" ? "متوسط" : "پایین"
                    }
                    variant={
                      c.severity === "high"
                        ? "critical"
                        : c.severity === "medium"
                          ? "warning"
                          : "info"
                    }
                  />
                </p>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{c.excerpt}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      {data.insights.length > 0 && (
        <>
          <SectionTitle title="توصیه برای مدیر" />
          <div className="space-y-2">
            {data.insights.map((ins, i) => (
              <Card
                key={i}
                className={`p-3.5 ${
                  ins.severity === "critical"
                    ? "border-red-200 bg-red-50"
                    : ins.severity === "warning"
                      ? "border-amber-200 bg-amber-50"
                      : "border-blue-100 bg-blue-50/50"
                }`}
              >
                <p className="font-bold text-sm">{ins.title}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ins.detail}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
