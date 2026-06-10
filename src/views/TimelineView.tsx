import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Megaphone,
  Sparkles,
  Star,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PeriodFilter } from "../components/PeriodFilter";
import { Sparkline } from "../components/Sparkline";
import { useTimeline } from "../hooks/useTimeline";
import { Card, PageShell, SectionTitle, StatusPill } from "../components/ui";
import type { TimePeriod, TimelineEvent, TimelineEventType } from "../types";

type TypeFilter = "all" | TimelineEventType;

const typeMeta: Record<
  TimelineEventType,
  { label: string; icon: LucideIcon; pill: "critical" | "warning" | "ok" | "info"; accent: string }
> = {
  incident: {
    label: "حادثه",
    icon: AlertTriangle,
    pill: "critical",
    accent: "border-red-200 bg-red-50/60",
  },
  vip: {
    label: "VIP",
    icon: Star,
    pill: "warning",
    accent: "border-amber-200 bg-amber-50/60",
  },
  ops: {
    label: "عملیات",
    icon: Wrench,
    pill: "info",
    accent: "border-blue-200 bg-blue-50/50",
  },
  positive: {
    label: "مثبت",
    icon: Sparkles,
    pill: "ok",
    accent: "border-emerald-200 bg-emerald-50/50",
  },
  staff: {
    label: "پرسنل",
    icon: Users,
    pill: "info",
    accent: "border-violet-200 bg-violet-50/50",
  },
  marketing: {
    label: "بازاریابی",
    icon: Megaphone,
    pill: "ok",
    accent: "border-pink-200 bg-pink-50/50",
  },
};

const FILTER_TABS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "incident", label: "حادثه" },
  { id: "vip", label: "VIP" },
  { id: "ops", label: "عملیات" },
  { id: "positive", label: "مثبت" },
];

export function TimelineView() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [filter, setFilter] = useState<TypeFilter>("all");
  const { data, loading } = useTimeline(period);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.events;
    return data.events.filter((e) => e.type === filter);
  }, [data, filter]);

  const grouped = useMemo(() => {
    if (period === "today") {
      return [{ label: "امروز", events: filtered }];
    }
    const map = new Map<string, TimelineEvent[]>();
    for (const e of filtered) {
      const key = e.dayLabel ?? "—";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries()).map(([label, events]) => ({ label, events }));
  }, [filtered, period]);

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-200" />
            ))}
          </div>
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary, insights } = data;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-4 bg-gradient-to-br from-slate-800 via-brand-900 to-indigo-900 text-white border-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white/85 shrink-0" />
              <p className="text-sm text-white/80">رویدادهای ثبت‌شده</p>
            </div>
            <p className="text-4xl font-extrabold mt-1 leading-none">
              {summary.totalEvents.toLocaleString("fa-IR")}
            </p>
            <p className="text-xs text-white/75 mt-2 leading-relaxed">{summary.headline}</p>
          </div>
          <Sparkline data={summary.sparkline} positive />
        </div>
        <p className="text-[11px] text-white/55 mt-3">
          آخرین به‌روزرسانی: {summary.lastUpdated}
        </p>
      </Card>

      <div className="grid grid-cols-4 gap-1.5 mb-4">
        <MiniStat label="حادثه" value={summary.incidentCount} className="text-red-700 bg-red-50 border-red-100" />
        <MiniStat label="VIP" value={summary.vipCount} className="text-amber-800 bg-amber-50 border-amber-100" />
        <MiniStat label="عملیات" value={summary.opsCount} className="text-blue-800 bg-blue-50 border-blue-100" />
        <MiniStat
          label="توقف"
          value={summary.downtimeMinutes}
          suffix="دقیقه"
          className="text-slate-800 bg-slate-50 border-slate-200"
        />
      </div>

      <div
        className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-4 overflow-x-auto"
        role="tablist"
        aria-label="فیلتر نوع رویداد"
      >
        {FILTER_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? data.events.length
              : data.events.filter((e) => e.type === tab.id).length;
          if (tab.id !== "all" && count === 0) return null;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 min-w-[3.5rem] py-2 rounded-lg text-xs font-semibold transition-all min-h-[40px] whitespace-nowrap ${
                filter === tab.id
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              {tab.label}
              <span className="mr-1 opacity-70">({count.toLocaleString("fa-IR")})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6 text-center">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="font-bold text-brand-900">رویدادی در این دسته نیست</p>
          <p className="text-sm text-slate-500 mt-1">فیلتر دیگری انتخاب کنید</p>
        </Card>
      ) : (
        grouped.map((group) => (
          <section key={group.label} className="mb-5">
            <SectionTitle
              title={group.label}
              subtitle={period === "today" ? "رویدادها و حوادث — جدیدترین بالا" : undefined}
            />
            <div className="relative pr-3 border-r-2 border-brand-200/80 mr-1 space-y-3">
              {group.events.map((event) => (
                <TimelineEventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        ))
      )}

      {insights.length > 0 && (
        <>
          <SectionTitle title="جمع‌بندی مدیر" className="mt-2" />
          <div className="space-y-2">
            {insights.map((item, i) => (
              <Card
                key={i}
                className={`p-3.5 ${
                  item.severity === "critical"
                    ? "border-red-100 bg-red-50/50"
                    : item.severity === "warning"
                      ? "border-amber-100 bg-amber-50/40"
                      : ""
                }`}
              >
                <div className="flex gap-2 items-start">
                  <Zap
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      item.severity === "critical"
                        ? "text-red-600"
                        : item.severity === "warning"
                          ? "text-amber-600"
                          : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-bold text-brand-900">{item.title}</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

function MiniStat({
  label,
  value,
  suffix,
  className,
}: {
  label: string;
  value: number;
  suffix?: string;
  className: string;
}) {
  return (
    <Card className={`p-2 text-center border ${className}`}>
      <p className="text-base font-extrabold leading-none">
        {value.toLocaleString("fa-IR")}
        {suffix && <span className="text-[9px] font-semibold mr-0.5">{suffix}</span>}
      </p>
      <p className="text-[10px] text-slate-600 mt-0.5">{label}</p>
    </Card>
  );
}

function TimelineEventCard({ event }: { event: TimelineEvent }) {
  const meta = typeMeta[event.type];
  const Icon = meta.icon;

  return (
    <article className="relative">
      <span
        className={`absolute -right-[15px] top-5 w-3 h-3 rounded-full ring-4 ring-surface ${
          event.type === "incident"
            ? "bg-red-500"
            : event.type === "vip"
              ? "bg-amber-500"
              : event.type === "ops"
                ? "bg-blue-500"
                : event.type === "positive"
                  ? "bg-emerald-500"
                  : event.type === "marketing"
                    ? "bg-pink-500"
                    : "bg-violet-500"
        }`}
      />
      <Card className={`mr-3 p-3 border ${meta.accent}`}>
        <div className="flex gap-3 items-start">
          <div className="shrink-0 w-14 text-center">
            <p className="text-xs font-bold text-brand-900 tabular-nums leading-tight">{event.time}</p>
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/90 mt-1.5 shadow-sm">
              <Icon className="w-4 h-4 text-brand-800" />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <StatusPill label={meta.label} variant={meta.pill} />
              {event.zone && (
                <span className="text-[10px] text-slate-500 bg-white/80 px-1.5 py-0.5 rounded">
                  {event.zone}
                </span>
              )}
              {event.durationMinutes != null && event.durationMinutes > 0 && (
                <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {event.durationMinutes.toLocaleString("fa-IR")} دقیقه
                </span>
              )}
            </div>
            <p className="font-bold text-sm text-brand-900 leading-snug">{event.title}</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.detail}</p>
            {event.impact && (
              <span className="inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/90 text-slate-700 border border-slate-200/80">
                {event.impact}
              </span>
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}
