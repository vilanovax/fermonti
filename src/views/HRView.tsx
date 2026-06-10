import { useMemo, useState } from "react";
import {
  Award,
  Calendar,
  ChefHat,
  MessageSquareWarning,
  TrendingUp,
  UserCircle,
  Users,
} from "lucide-react";
import { PeriodFilter } from "../components/PeriodFilter";
import { Sparkline } from "../components/Sparkline";
import { useHR } from "../hooks/useHR";
import { Card, PageShell, SectionTitle, TrendIcon } from "../components/ui";
import type { StaffMember, StaffRoleType, TimePeriod } from "../types";

type RoleFilter = "all" | StaffRoleType;

const rankAccent = [
  "border-violet-400 bg-violet-50/80",
  "border-sky-400 bg-sky-50/80",
  "border-rose-400 bg-rose-50/80",
];

const FILTER_TABS: { id: RoleFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "waiter", label: "گارسون" },
  { id: "host", label: "میزبان" },
  { id: "chef", label: "آشپزخانه" },
];

export function HRView() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [filter, setFilter] = useState<RoleFilter>("all");
  const { data, loading } = useHR(period);

  const filtered = useMemo(() => {
    if (!data) return [];
    const list =
      filter === "all" ? data.staff : data.staff.filter((p) => p.roleType === filter);
    return list;
  }, [data, filter]);

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-200" />
            ))}
          </div>
          <div className="h-32 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary, highlights, insights } = data;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-4 bg-gradient-to-br from-pink-600 via-rose-600 to-violet-700 text-white border-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white/85 shrink-0" />
              <p className="text-sm text-white/80">میانگین امتیاز تیم</p>
            </div>
            <p className="text-4xl font-extrabold mt-1 leading-none">
              {summary.avgRating.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}
            </p>
            <p className="text-[11px] text-white/65 mt-2">
              رضایت {summary.avgSatisfaction.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} —{" "}
              {summary.activeStaff.toLocaleString("fa-IR")} نفر فعال
            </p>
          </div>
          <Sparkline data={summary.sparkline} positive />
        </div>
        <p className="text-xs font-medium mt-3 px-2 py-1.5 rounded-lg bg-white/15 inline-block">
          {summary.headline}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {highlights.map((h) => (
          <Card key={h.key} className="p-3">
            <p className="text-[10px] text-slate-500 leading-snug">{h.label}</p>
            <p className="font-bold text-sm mt-1 text-brand-900 truncate">{h.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-4 p-3 flex justify-between text-center text-xs">
        <div>
          <p className="text-slate-500">شکایت دوره</p>
          <p className="font-bold text-red-600">
            {summary.totalComplaints.toLocaleString("fa-IR")}
          </p>
        </div>
        <div>
          <p className="text-slate-500">حقوق/فروش</p>
          <p className="font-bold text-brand-900">{summary.laborCostRatio}</p>
          <p className="text-[10px] text-slate-400">{summary.laborCostCompare}</p>
        </div>
      </Card>

      <div
        className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-3 overflow-x-auto"
        role="tablist"
        aria-label="فیلتر نقش"
      >
        {FILTER_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? data.staff.length
              : data.staff.filter((p) => p.roleType === tab.id).length;
          if (tab.id !== "all" && count === 0) return null;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 min-w-[3.5rem] py-2 rounded-lg text-xs font-semibold min-h-[40px] ${
                filter === tab.id
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <SectionTitle
        title="عملکرد پرسنل"
        subtitle={
          period === "today"
            ? "رتبه‌بندی امروز"
            : period === "week"
              ? "رتبه‌بندی این هفته"
              : "رتبه‌بندی ماه"
        }
      />

      <div className="space-y-2 mb-5">
        {filtered.map((person) => (
          <StaffCard
            key={person.id}
            person={person}
            rank={data.staff.findIndex((p) => p.id === person.id) + 1}
          />
        ))}
      </div>

      {insights.length > 0 && (
        <>
          <SectionTitle title="پیشنهاد مدیر" />
          <div className="space-y-2">
            {insights.map((item, idx) => (
              <Card
                key={idx}
                className={`p-3.5 ${
                  item.severity === "warning"
                    ? "border-amber-100 bg-amber-50/40"
                    : ""
                }`}
              >
                <p className="text-sm font-bold text-brand-900">{item.title}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

function StaffCard({ person, rank }: { person: StaffMember; rank: number }) {
  const isTopThree = rank <= 3;
  const accent = isTopThree ? rankAccent[rank - 1] : "border-slate-200";

  return (
    <Card className={`p-4 border-2 ${accent}`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${
            isTopThree ? "bg-white shadow-sm text-brand-900" : "bg-brand-100 text-brand-800"
          }`}
        >
          {person.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-brand-900">{person.name}</p>
                {rank === 1 && <Award className="w-4 h-4 text-violet-600 shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                {person.roleType === "chef" ? (
                  <ChefHat className="w-3 h-3" />
                ) : (
                  <UserCircle className="w-3 h-3" />
                )}
                {person.role}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 shrink-0" aria-hidden />
                استخدام: {person.hireDateShamsi}
              </p>
            </div>
            <div className="text-left shrink-0">
              <span
                className={`text-2xl font-extrabold ${
                  isTopThree ? "text-brand-300" : "text-slate-200"
                }`}
              >
                #{rank.toLocaleString("fa-IR")}
              </span>
              {person.ratingTrend && (
                <div className="flex justify-end mt-0.5">
                  <TrendIcon trend={person.ratingTrend} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mt-3 text-center">
        {[
          { l: "فروش", v: person.salesScore },
          { l: "رضایت", v: person.satisfaction },
          { l: "تاخیر", v: person.delays },
          { l: "امتیاز", v: person.rating },
        ].map((stat) => (
          <div key={stat.l} className="rounded-lg py-1.5 bg-white/80 border border-slate-100">
            <p className="text-[10px] text-slate-500">{stat.l}</p>
            <p className="text-xs font-bold text-brand-900">{stat.v}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
        {person.upsell > 0 && (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium">
            <TrendingUp className="w-3 h-3" />
            فروش افزوده {person.upsell.toLocaleString("fa-IR")}٪
          </span>
        )}
        {person.complaints > 0 && (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-medium">
            <MessageSquareWarning className="w-3 h-3" />
            {person.complaints.toLocaleString("fa-IR")} شکایت
          </span>
        )}
        {person.complaints === 0 && person.upsell === 0 && person.roleType === "chef" && (
          <span className="text-slate-500">بدون شکایت — عملکرد پایدار</span>
        )}
        {person.complaints === 0 && person.upsell > 0 && (
          <span className="text-slate-500">بدون شکایت</span>
        )}
      </div>
    </Card>
  );
}
