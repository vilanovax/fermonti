import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronLeft,
  Package,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
  Heart,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PeriodFilter } from "../components/PeriodFilter";
import { Sparkline } from "../components/Sparkline";
import { useAlerts } from "../hooks/useAlerts";
import { alertCategoryMatchesLayer } from "../data/layerHomeData";
import { LAYER_LABELS } from "../constants/labels";
import {
  Accordion,
  Card,
  HorizontalScrollHint,
  PageShell,
  SectionTitle,
  StatusPill,
} from "../components/ui";
import type {
  Alert,
  AlertCategory,
  AlertSeverity,
  DashboardLayer,
  TimePeriod,
  ViewId,
} from "../types";

type SeverityFilter = "all" | AlertSeverity;
type LayerFilter = "all" | DashboardLayer;
type CategoryFilter = "all" | AlertCategory;

const categoryMeta: Record<AlertCategory, { label: string; icon: LucideIcon }> = {
  sales: { label: "فروش", icon: TrendingUp },
  inventory: { label: "انبار", icon: Package },
  foodcost: { label: "هزینه غذا", icon: UtensilsCrossed },
  customer: { label: "مشتری", icon: Heart },
  hr: { label: "پرسنل", icon: Users },
  finance: { label: "مالی", icon: Wallet },
  ops: { label: "عملیات", icon: Zap },
};

const severityStyle: Record<
  AlertSeverity,
  {
    border: string;
    bg: string;
    dot: string;
    accent: string;
    pill: "critical" | "warning" | "info";
  }
> = {
  critical: {
    border: "border-red-200",
    bg: "bg-red-50/90",
    dot: "bg-red-500",
    accent: "border-t-4 border-t-red-500",
    pill: "critical",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50/80",
    dot: "bg-amber-500",
    accent: "border-s-4 border-s-amber-500",
    pill: "warning",
  },
  info: {
    border: "border-slate-200",
    bg: "bg-white",
    dot: "bg-blue-500",
    accent: "",
    pill: "info",
  },
};

const severityLabel: Record<AlertSeverity, string> = {
  critical: "بحرانی",
  warning: "هشدار",
  info: "اطلاع",
};

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

const FILTER_TABS: { id: SeverityFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "critical", label: "بحرانی" },
  { id: "warning", label: "هشدار" },
  { id: "info", label: "اطلاع" },
];

const LAYER_TABS: { id: LayerFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "operations", label: LAYER_LABELS.operations },
  { id: "finance", label: LAYER_LABELS.finance },
];

function sortAlerts(list: Alert[]): Alert[] {
  return [...list].sort((a, b) => {
    const sev = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (sev !== 0) return sev;
    if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
    return 0;
  });
}

export function AlertsView({ onNavigate }: { onNavigate: (view: ViewId) => void }) {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [filter, setFilter] = useState<SeverityFilter>("all");
  const [layerFilter, setLayerFilter] = useState<LayerFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const { data, loading } = useAlerts(period);

  const categoryCounts = useMemo(() => {
    if (!data) return new Map<AlertCategory, number>();
    const m = new Map<AlertCategory, number>();
    for (const a of data.alerts) {
      m.set(a.category, (m.get(a.category) ?? 0) + 1);
    }
    return m;
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.alerts;
    if (layerFilter !== "all") {
      list = list.filter((a) => alertCategoryMatchesLayer(layerFilter, a.category));
    }
    if (categoryFilter !== "all") {
      list = list.filter((a) => a.category === categoryFilter);
    }
    if (filter !== "all") {
      list = list.filter((a) => a.severity === filter);
    }
    return sortAlerts(list);
  }, [data, filter, layerFilter, categoryFilter]);

  const critical = useMemo(
    () => filtered.filter((a) => a.severity === "critical"),
    [filtered]
  );
  const rest = useMemo(
    () => filtered.filter((a) => a.severity !== "critical"),
    [filtered]
  );

  const filterSummary = useMemo(() => {
    if (!data) return "";
    const parts: string[] = [];
    if (layerFilter !== "all") parts.push(LAYER_LABELS[layerFilter]);
    if (categoryFilter !== "all") parts.push(categoryMeta[categoryFilter].label);
    if (filter !== "all") parts.push(severityLabel[filter]);
    if (parts.length === 0) return `نمایش ${filtered.length.toLocaleString("fa-IR")} از ${data.alerts.length.toLocaleString("fa-IR")} هشدار`;
    return `نمایش ${filtered.length.toLocaleString("fa-IR")} هشدار — ${parts.join(" · ")}`;
  }, [data, filtered.length, layerFilter, categoryFilter, filter]);

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-200" />
            ))}
          </div>
          <div className="h-10 rounded-xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary, insights } = data;

  const severityCount = (tab: SeverityFilter) =>
    tab === "all"
      ? data.alerts.length
      : tab === "critical"
        ? summary.criticalCount
        : tab === "warning"
          ? summary.warningCount
          : summary.infoCount;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-4 bg-gradient-to-br from-rose-700 via-red-600 to-orange-600 text-white border-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-white/90 shrink-0" />
              <p className="text-sm text-white/85">هشدارهای فعال</p>
            </div>
            <p className="text-4xl font-extrabold mt-1 leading-none">
              {summary.totalActive.toLocaleString("fa-IR")}
            </p>
            <p className="text-xs text-white/75 mt-2 leading-relaxed">{summary.headline}</p>
          </div>
          <Sparkline data={summary.sparkline} positive={false} />
        </div>
        <p className="text-[11px] text-white/60 mt-3">
          آخرین به‌روزرسانی: {summary.lastUpdated}
        </p>
      </Card>

      <div className="mb-4">
      <HorizontalScrollHint>
        <div className="flex gap-2 pb-1">
          <StatChip
            label="بحرانی"
            value={summary.criticalCount}
            accent="text-red-700 bg-red-50 border-red-100"
            active={filter === "critical"}
            onClick={() => setFilter(filter === "critical" ? "all" : "critical")}
          />
          <StatChip
            label="هشدار"
            value={summary.warningCount}
            accent="text-amber-800 bg-amber-50 border-amber-100"
            active={filter === "warning"}
            onClick={() => setFilter(filter === "warning" ? "all" : "warning")}
          />
          <StatChip
            label="اطلاع"
            value={summary.infoCount}
            accent="text-blue-800 bg-blue-50 border-blue-100"
            active={filter === "info"}
            onClick={() => setFilter(filter === "info" ? "all" : "info")}
          />
          <StatChip
            label="حل‌شده"
            value={summary.resolvedInPeriod}
            accent="text-emerald-800 bg-emerald-50 border-emerald-100"
            icon={CheckCircle2}
          />
        </div>
      </HorizontalScrollHint>
      </div>

      <div
        className="flex gap-1 p-1 bg-brand-50 rounded-xl mb-3"
        role="tablist"
        aria-label="دیدگاه لایه"
      >
        {LAYER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={layerFilter === tab.id}
            onClick={() => {
              setLayerFilter(tab.id);
              setCategoryFilter("all");
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold min-h-[40px] transition-all ${
              layerFilter === tab.id
                ? "bg-white text-brand-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-2 overflow-x-auto"
        role="tablist"
        aria-label="فیلتر شدت"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 min-w-[4.5rem] py-2 rounded-lg text-xs font-semibold transition-all min-h-[40px] whitespace-nowrap ${
              filter === tab.id
                ? "bg-white text-brand-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            {tab.label}
            <span className="mr-1 opacity-70">
              ({severityCount(tab.id).toLocaleString("fa-IR")})
            </span>
          </button>
        ))}
      </div>

      <div className="mb-3">
      <HorizontalScrollHint>
        <div className="flex gap-2 pb-1">
          <CategoryChip
            label="همه دسته‌ها"
            active={categoryFilter === "all"}
            onClick={() => setCategoryFilter("all")}
          />
          {(Object.keys(categoryMeta) as AlertCategory[])
            .filter((c) => (categoryCounts.get(c) ?? 0) > 0)
            .map((c) => (
              <CategoryChip
                key={c}
                label={categoryMeta[c].label}
                count={categoryCounts.get(c)}
                active={categoryFilter === c}
                onClick={() => setCategoryFilter(categoryFilter === c ? "all" : c)}
              />
            ))}
        </div>
      </HorizontalScrollHint>
      </div>

      <p className="text-[11px] text-slate-500 mb-4 text-center">{filterSummary}</p>

      {filtered.length === 0 ? (
        <Card className="p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="font-bold text-brand-900">هشداری در این فیلتر نیست</p>
          <p className="text-sm text-slate-500 mt-1">لایه یا دسته دیگری انتخاب کنید</p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setLayerFilter("all");
              setCategoryFilter("all");
            }}
            className="mt-3 text-sm font-semibold text-brand-700"
          >
            پاک کردن فیلترها
          </button>
        </Card>
      ) : (
        <>
          {filter === "all" && critical.length > 0 && (
            <>
              <SectionTitle
                title={`بحرانی (${critical.length.toLocaleString("fa-IR")})`}
                subtitle="نیاز به اقدام در ۳۰ دقیقه"
              />
              <AlertList items={critical} onNavigate={onNavigate} />
            </>
          )}

          {(filter !== "all" || rest.length > 0) && (
            <>
              {filter === "all" && rest.length > 0 && (
                <SectionTitle title="سایر هشدارها" className="mt-4" />
              )}
              {filter !== "all" && filter !== "critical" && (
                <SectionTitle
                  title={`${severityLabel[filter]} (${filtered.length.toLocaleString("fa-IR")})`}
                  className="mt-2"
                />
              )}
              <AlertList
                items={filter === "all" ? rest : filtered}
                onNavigate={onNavigate}
              />
            </>
          )}
        </>
      )}

      {insights.length > 0 && (
        <Accordion
          title="پیشنهاد مدیر"
          subtitle={`${insights.length.toLocaleString("fa-IR")} نکته`}
          defaultOpen={false}
          className="mt-6"
        >
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
                  <AlertTriangle
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
        </Accordion>
      )}
    </PageShell>
  );
}

function StatChip({
  label,
  value,
  accent,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  value: number;
  accent: string;
  icon?: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <>
      {Icon && <Icon className="w-4 h-4 mx-auto mb-0.5 opacity-80" />}
      <p className="text-lg font-extrabold leading-none">{value.toLocaleString("fa-IR")}</p>
      <p className="text-[10px] text-slate-600 mt-0.5">{label}</p>
    </>
  );

  if (!onClick) {
    return (
      <Card className={`min-w-[4.5rem] shrink-0 p-2.5 text-center border ${accent}`}>
        {inner}
      </Card>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[4.5rem] shrink-0 p-2.5 rounded-2xl text-center border shadow-sm transition-all active:scale-[0.98] ${accent} ${
        active ? "ring-2 ring-brand-700 ring-offset-1" : ""
      }`}
    >
      {inner}
    </button>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all min-h-[36px] ${
        active
          ? "bg-brand-800 text-white border-brand-800"
          : "bg-white text-slate-700 border-slate-200"
      }`}
    >
      {label}
      {count != null && (
        <span className={`mr-1 ${active ? "text-white/80" : "text-slate-400"}`}>
          ({count.toLocaleString("fa-IR")})
        </span>
      )}
    </button>
  );
}

function AlertList({
  items,
  onNavigate,
}: {
  items: Alert[];
  onNavigate: (view: ViewId) => void;
}) {
  return (
    <div className="space-y-3 mb-1">
      {items.map((alert) => (
        <AlertCard key={alert.id} alert={alert} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function AlertCard({
  alert,
  onNavigate,
}: {
  alert: Alert;
  onNavigate: (view: ViewId) => void;
}) {
  const s = severityStyle[alert.severity];
  const meta = categoryMeta[alert.category];
  const Icon = meta.icon;

  return (
    <Card
      className={`p-0 overflow-hidden ${s.border} ${s.bg} ${s.accent}`}
      onClick={() => alert.action && onNavigate(alert.actionTarget ?? "alerts")}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/90 shrink-0 shadow-sm">
              <Icon className="w-4 h-4 text-brand-800" />
            </span>
            <span className="text-[11px] font-medium text-slate-500">{meta.label}</span>
            {alert.isNew && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">
                جدید
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusPill label={severityLabel[alert.severity]} variant={s.pill} />
            <span className="text-xs text-slate-400 tabular-nums">{alert.time}</span>
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${s.dot}`} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-brand-900 leading-snug">{alert.title}</p>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{alert.detail}</p>
            {alert.impact && (
              <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-md bg-white/90 text-slate-700 border border-slate-200/80">
                تأثیر: {alert.impact}
              </span>
            )}
            {alert.action && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(alert.actionTarget ?? "alerts");
                }}
                className="mt-3 w-full flex items-center justify-center gap-1 text-sm font-semibold text-brand-800 bg-white border border-brand-200 px-4 py-2.5 rounded-xl shadow-sm min-h-[44px] active:scale-[0.98] transition-transform"
              >
                {alert.action}
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
