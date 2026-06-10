import { useMemo, useState } from "react";
import {
  BarChart3,
  ChevronLeft,
  Package,
  Sparkles,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Megaphone,
  Wrench,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { PeriodFilter } from "../components/PeriodFilter";
import { Sparkline } from "../components/Sparkline";
import { useAiInsights } from "../hooks/useAiInsights";
import { Card, PageShell, SectionTitle, StatusPill } from "../components/ui";
import type { AiInsight, AiInsightType, TimePeriod, ViewId } from "../types";

type TypeFilter = "all" | AiInsightType;

const typeMeta: Record<
  AiInsightType,
  { label: string; icon: LucideIcon }
> = {
  price: { label: "قیمت", icon: TrendingUp },
  inventory: { label: "موجودی", icon: Package },
  staff: { label: "پرسنل", icon: Users },
  forecast: { label: "پیش‌بینی", icon: BarChart3 },
  menu: { label: "منو", icon: UtensilsCrossed },
  marketing: { label: "بازاریابی", icon: Megaphone },
  ops: { label: "عملیات", icon: Wrench },
};

const priorityMeta = {
  high: { label: "اولویت بالا", variant: "critical" as const },
  medium: { label: "متوسط", variant: "warning" as const },
  low: { label: "پایین", variant: "info" as const },
};

const FILTER_TABS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "price", label: "قیمت" },
  { id: "inventory", label: "موجودی" },
  { id: "staff", label: "پرسنل" },
  { id: "forecast", label: "پیش‌بینی" },
  { id: "menu", label: "منو" },
];

function confidenceBarColor(confidence: number) {
  if (confidence >= 85) return "bg-violet-600";
  if (confidence >= 75) return "bg-indigo-500";
  return "bg-slate-400";
}

function confidenceBadgeClass(confidence: number) {
  if (confidence >= 85) return "text-violet-700 bg-violet-50";
  if (confidence >= 75) return "text-indigo-700 bg-indigo-50";
  return "text-slate-600 bg-slate-100";
}

export function AIView({ onNavigate }: { onNavigate: (view: ViewId) => void }) {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [filter, setFilter] = useState<TypeFilter>("all");
  const { data, loading } = useAiInsights(period);

  const filtered = useMemo(() => {
    if (!data) return [];
    const list =
      filter === "all" ? data.insights : data.insights.filter((i) => i.type === filter);
    return [...list].sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
      return b.confidence - a.confidence;
    });
  }, [data, filter]);

  const highPriority = useMemo(
    () => filtered.filter((i) => i.priority === "high"),
    [filtered]
  );
  const rest = useMemo(
    () => filtered.filter((i) => i.priority !== "high"),
    [filtered]
  );

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-32 rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 rounded-xl bg-slate-200" />
            <div className="h-14 rounded-xl bg-slate-200" />
            <div className="h-14 rounded-xl bg-slate-200" />
          </div>
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary, dataSources } = data;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-4 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white border-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <p className="text-sm text-white/85 font-semibold">پیشنهادات هوشمند — دمو</p>
            </div>
            <p className="text-3xl font-extrabold mt-2 leading-none">
              {summary.totalInsights.toLocaleString("fa-IR")}
              <span className="text-base font-bold text-white/70 mr-1">پیشنهاد</span>
            </p>
            <p className="text-xs text-white/75 mt-2 leading-relaxed">{summary.headline}</p>
          </div>
          <Sparkline data={summary.sparkline} positive />
        </div>
        <p className="text-[11px] text-white/55 mt-3">
          میانگین اطمینان {summary.avgConfidence.toLocaleString("fa-IR")}٪ — به‌روز {summary.lastUpdated}
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Card className="p-2.5 text-center border-violet-100 bg-violet-50/50">
          <p className="text-lg font-extrabold text-violet-800">
            {summary.highPriorityCount.toLocaleString("fa-IR")}
          </p>
          <p className="text-[10px] text-slate-600">اولویت بالا</p>
        </Card>
        <Card className="p-2.5 text-center">
          <p className="text-lg font-extrabold text-brand-900">
            {summary.avgConfidence.toLocaleString("fa-IR")}٪
          </p>
          <p className="text-[10px] text-slate-600">اطمینان</p>
        </Card>
        <Card className="p-2.5 text-center border-emerald-100 bg-emerald-50/40">
          <p className="text-xs font-extrabold text-emerald-800 leading-tight py-0.5">
            {summary.potentialImpactLabel}
          </p>
          <p className="text-[10px] text-slate-600">تأثیر احتمالی</p>
        </Card>
      </div>

      <div
        className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-4 overflow-x-auto"
        role="tablist"
        aria-label="فیلتر نوع پیشنهاد"
      >
        {FILTER_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? data.insights.length
              : data.insights.filter((i) => i.type === tab.id).length;
          if (tab.id !== "all" && count === 0) return null;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 min-w-[3.25rem] py-2 rounded-lg text-xs font-semibold min-h-[40px] whitespace-nowrap ${
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

      {filtered.length === 0 ? (
        <Card className="p-6 text-center">
          <Brain className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="font-bold text-brand-900">پیشنهادی در این دسته نیست</p>
        </Card>
      ) : (
        <>
          {filter === "all" && highPriority.length > 0 && (
            <>
              <SectionTitle title="اولویت بالا" subtitle="اقدام در ۲۴ ساعت پیشنهاد می‌شود" />
              <InsightList items={highPriority} onNavigate={onNavigate} />
            </>
          )}
          {(filter !== "all" || rest.length > 0) && (
            <>
              <SectionTitle
                title={filter === "all" ? "سایر پیشنهادها" : typeMeta[filter as AiInsightType].label}
                className="mt-4"
              />
              <InsightList items={filter === "all" ? rest : filtered} onNavigate={onNavigate} />
            </>
          )}
        </>
      )}

      <SectionTitle title="منابع داده" subtitle="در نسخه واقعی به سیستم‌های شما متصل می‌شود" className="mt-6" />
      <div className="flex flex-wrap gap-2">
        {dataSources.map((src) => (
          <span
            key={src.label}
            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
          >
            {src.label}
            <span className="text-slate-400 mr-1">· دمو</span>
          </span>
        ))}
      </div>
    </PageShell>
  );
}

function InsightList({
  items,
  onNavigate,
}: {
  items: AiInsight[];
  onNavigate: (view: ViewId) => void;
}) {
  return (
    <div className="space-y-3 mb-1">
      {items.map((insight) => (
        <InsightCard key={insight.id} insight={insight} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function InsightCard({
  insight,
  onNavigate,
}: {
  insight: AiInsight;
  onNavigate: (view: ViewId) => void;
}) {
  const meta = typeMeta[insight.type];
  const Icon = meta.icon;
  const pri = priorityMeta[insight.priority];
  const barColor = confidenceBarColor(insight.confidence);

  return (
    <Card
      className={`p-4 ${
        insight.priority === "high" ? "border-violet-200 bg-violet-50/30" : ""
      }`}
    >
      <div className="flex gap-3 items-start">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 shrink-0">
          <Icon className="w-5 h-5 text-indigo-700" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <StatusPill label={meta.label} variant="info" />
            <StatusPill label={pri.label} variant={pri.variant} />
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full mr-auto ${confidenceBadgeClass(insight.confidence)}`}
            >
              {insight.confidence.toLocaleString("fa-IR")}٪ اطمینان
            </span>
          </div>
          <p className="font-bold text-sm text-brand-900 leading-snug">{insight.title}</p>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{insight.detail}</p>
          {insight.impact && (
            <p className="text-[11px] font-semibold text-emerald-700 mt-2">{insight.impact}</p>
          )}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>قدرت پیشنهاد</span>
              <span>{insight.confidence.toLocaleString("fa-IR")}٪</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${insight.confidence}%` }}
              />
            </div>
          </div>
          {insight.actionLabel && insight.actionTarget && (
            <button
              type="button"
              onClick={() => onNavigate(insight.actionTarget!)}
              className="mt-3 w-full flex items-center justify-center gap-1 text-sm font-semibold text-indigo-800 bg-white border border-indigo-200 px-4 py-2.5 rounded-xl min-h-[44px] active:scale-[0.98] transition-transform"
            >
              {insight.actionLabel}
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
