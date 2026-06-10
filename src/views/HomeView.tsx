import { useMemo, useState } from "react";
import {
  TrendingUp,
  Receipt,
  Users,
  LayoutGrid,
  Wallet,
  UtensilsCrossed,
  Wine,
  Banknote,
  PiggyBank,
  AlertTriangle,
  BarChart3,
  Calendar,
  Package,
  Heart,
  Clock,
  Sparkles,
  Grid3X3,
  Mail,
} from "lucide-react";
import { getAlertsForPeriod } from "../data/alertsData";
import { homeMoreModules, refreshRates } from "../data/sampleData";
import { PERIOD_LABELS } from "../data/periodData";
import {
  alertMatchesLayer,
  getCriticalForLayer,
  pulseByLayer,
  quickShortcutsByLayer,
} from "../data/layerHomeData";
import { SalesHeroCard } from "../components/SalesHeroCard";
import { PeriodFilter } from "../components/PeriodFilter";
import { KpiCustomizer } from "../components/KpiCustomizer";
import { useDashboard } from "../hooks/useDashboard";
import { usePinnedKpis } from "../hooks/usePinnedKpis";
import { isApiDemoMode } from "../services/dashboardApi";
import {
  Accordion,
  Card,
  HorizontalScrollHint,
  KpiCard,
  PageShell,
  SectionTitle,
  TrendIcon,
} from "../components/ui";
import { kpiSectionSubtitle } from "../constants/labels";
import type { DashboardLayer, TimePeriod, ViewId } from "../types";

const kpiIcons: Record<string, typeof TrendingUp> = {
  sales: TrendingUp,
  chart: BarChart3,
  calendar: Calendar,
  receipt: Receipt,
  users: Users,
  table: LayoutGrid,
  profit: PiggyBank,
  food: UtensilsCrossed,
  drink: Wine,
  cash: Banknote,
  wallet: Wallet,
  alert: AlertTriangle,
};

const shortcutIcons: Record<string, typeof BarChart3> = {
  chart: BarChart3,
  package: Package,
  users: Users,
  wallet: Wallet,
  utensils: UtensilsCrossed,
  heart: Heart,
  alert: AlertTriangle,
  clock: Clock,
  sparkles: Sparkles,
  mail: Mail,
};

interface HomeViewProps {
  layer: DashboardLayer;
  onNavigate: (view: ViewId) => void;
  onOpenMenu: () => void;
}

function HomeSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-36 rounded-2xl bg-slate-200" />
      <div className="h-24 rounded-2xl bg-slate-200" />
      <div className="h-20 rounded-2xl bg-slate-200" />
    </div>
  );
}

export function HomeView({ layer, onNavigate, onOpenMenu }: HomeViewProps) {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { data, loading, error } = useDashboard(period);
  const { pinnedIds, toggle, reset } = usePinnedKpis();

  const showKpis = true;
  const kpiDefaultOpen = layer !== "operations";
  const criticalFive = useMemo(
    () => getCriticalForLayer(layer, period),
    [layer, period]
  );
  const quickShortcuts = quickShortcutsByLayer[layer];
  const pulseStats = pulseByLayer[layer];

  const filteredKpis = useMemo(() => {
    if (!data) return [];
    let list = data.kpis;
    if (layer === "finance") {
      list = data.kpis.filter(
        (k) =>
          k.id.startsWith("sales-") ||
          ["gross-profit", "food-cost", "bev-cost", "cashflow", "cash-stock", "alerts"].includes(k.id)
      );
    } else if (layer === "operations") {
      list = data.kpis.filter((k) => k.id !== "cash-stock");
    }
    const pinned = list.filter((k) => pinnedIds.includes(k.id));
    return pinned.length >= 4 ? pinned : list;
  }, [data, layer, pinnedIds]);

  const periodAlerts = useMemo(() => getAlertsForPeriod(period).alerts, [period]);
  const topAlerts = useMemo(
    () =>
      periodAlerts
        .filter(
          (a) =>
            (a.severity === "critical" || a.severity === "warning") &&
            alertMatchesLayer(layer, a.actionTarget)
        )
        .slice(0, 3),
    [periodAlerts, layer]
  );

  const layerAlertTotal = useMemo(
    () =>
      periodAlerts.filter(
        (a) =>
          (a.severity === "critical" || a.severity === "warning") &&
          alertMatchesLayer(layer, a.actionTarget)
      ).length,
    [periodAlerts, layer]
  );

  if (error) {
    return (
      <PageShell>
        <Card className="p-4 text-center text-red-600 text-sm">{error}</Card>
      </PageShell>
    );
  }

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <HomeSkeleton />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      {isApiDemoMode() && (
        <p className="text-[11px] text-slate-400 text-center -mt-2 mb-3">
          حالت دمو — داده از API شبیه‌سازی شده
        </p>
      )}

      {pulseStats.length > 0 && (
        <>
          <SectionTitle
            title={layer === "operations" ? "وضعیت لحظه‌ای عملیات" : "وضعیت مالی امروز"}
            subtitle="ضربه بزنید برای جزئیات"
          />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {pulseStats.map((p) => (
              <Card
                key={p.label}
                onClick={() => onNavigate(p.navigateTo)}
                className={`p-3 text-center ${
                  p.tone === "bad"
                    ? "border-red-200 bg-red-50"
                    : p.tone === "warn"
                      ? "border-amber-200 bg-amber-50"
                      : ""
                }`}
              >
                <p className="text-[10px] text-slate-500 font-medium leading-tight">{p.label}</p>
                <p className="text-lg font-extrabold text-brand-900 mt-1">{p.value}</p>
                {p.sub && <p className="text-[10px] text-slate-500">{p.sub}</p>}
              </Card>
            ))}
          </div>
        </>
      )}

      {layer !== "operations" && (
        <SalesHeroCard sales={data.sales} onOpenSales={() => onNavigate("sales")} />
      )}

      {topAlerts.length > 0 && (
        <>
          <SectionTitle
            title={
              layer === "operations"
                ? "اقدام فوری — عملیات"
                : layer === "finance"
                  ? "اقدام فوری — مالی"
                  : "نیاز به اقدام فوری"
            }
            action={
              <button
                type="button"
                onClick={() => onNavigate("alerts")}
                className="text-xs font-semibold text-brand-700 shrink-0 min-h-[44px] px-1"
              >
                همه ({layerAlertTotal})
              </button>
            }
          />
          <div className="space-y-2 mb-5">
            {topAlerts.map((alert) => (
              <Card
                key={alert.id}
                onClick={() => onNavigate(alert.actionTarget ?? "alerts")}
                className={`p-3.5 text-right ${
                  alert.severity === "critical"
                    ? "border-red-200 bg-red-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p className="text-sm font-bold text-brand-900">{alert.title}</p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{alert.detail}</p>
                {alert.action && (
                  <p className="text-xs text-brand-700 font-semibold mt-2">{alert.action} ←</p>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      <SectionTitle
        title={
          layer === "operations"
            ? "۵ شاخص عملیات"
            : layer === "finance"
              ? "۵ شاخص مالی"
              : "۵ شاخص حیاتی"
        }
        subtitle={`بازه: ${PERIOD_LABELS[period]}`}
      />
      <HorizontalScrollHint>
        {criticalFive.map((c) => (
          <Card
            key={c.label}
            onClick={() => onNavigate(c.navigateTo)}
            className="min-w-[10.5rem] shrink-0 p-3.5 snap-start hover:border-brand-200"
          >
            <p className="text-xs text-slate-500 font-medium">{c.label}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-xl font-extrabold text-brand-900">{c.value}</p>
              <TrendIcon trend={c.trend} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{c.target}</p>
            <p className="text-[11px] text-slate-500 mt-1.5">{c.compareText}</p>
          </Card>
        ))}
      </HorizontalScrollHint>

      <SectionTitle
        title="دسترسی سریع"
        subtitle={
          layer === "operations"
            ? "انبار، مشتری، پرسنل"
            : layer === "finance"
              ? "نقد، هزینه، فروش"
              : "پرکاربردترین بخش‌ها"
        }
        className="mt-6"
      />
      <div className="grid grid-cols-2 gap-2.5 mb-2">
        {quickShortcuts.map((item) => {
          const Icon = shortcutIcons[item.icon] ?? BarChart3;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-l ${item.color} text-white shadow-md active:scale-[0.98] min-h-[4.5rem]`}
            >
              <Icon className="w-6 h-6 shrink-0 opacity-95" strokeWidth={2} />
              <span className="text-sm font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {layer === "finance" && (
        <Card className="mb-4 p-3.5 bg-violet-50 border-violet-100">
          <p className="text-sm font-semibold text-brand-900">چک ۵ روز آینده · بدهی تامین‌کننده</p>
          <p className="text-xs text-slate-600 mt-1">کمبود نقد ~۱۲M — FC امروز ۳۴٪</p>
          <button
            type="button"
            onClick={() => onNavigate("finance")}
            className="mt-2.5 w-full py-2.5 rounded-xl bg-brand-800 text-white text-sm font-semibold min-h-[44px]"
          >
            کنترل مالی کامل
          </button>
        </Card>
      )}

      {layer === "operations" && (
        <Card className="mb-4 p-3.5 bg-emerald-50 border-emerald-100">
          <p className="text-sm font-semibold text-brand-900">خلاصه شیفت و سرویس</p>
          <p className="text-xs text-slate-600 mt-1">۳ قلم انبار بحرانی · سرو ناهار ۱۸ دقیقه</p>
          <button
            type="button"
            onClick={() => onNavigate("inventory")}
            className="mt-2.5 w-full py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold min-h-[44px]"
          >
            مدیریت انبار و سفارش
          </button>
        </Card>
      )}

      {showKpis && (
        <Accordion
          key={`kpi-${layer}-${period}`}
          title="شاخص‌های تفصیلی"
          subtitle={kpiSectionSubtitle(layer, filteredKpis.length)}
          defaultOpen={kpiDefaultOpen}
          className="mt-4"
        >
          <button
            type="button"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="text-xs font-semibold text-brand-700 mb-2"
          >
            {showCustomizer ? "بستن شخصی‌سازی" : "شخصی‌سازی کارت‌ها"}
          </button>
          {showCustomizer && (
            <KpiCustomizer
              allKpis={data.kpis}
              pinnedIds={pinnedIds}
              onToggle={toggle}
              onReset={reset}
            />
          )}
          <div className="grid grid-cols-2 gap-3">
            {filteredKpis.map((kpi) => {
              const Icon = kpiIcons[kpi.icon] ?? TrendingUp;
              return (
                <KpiCard
                  key={kpi.id}
                  label={kpi.label}
                  value={kpi.value}
                  unit={kpi.unit}
                  change={kpi.change}
                  positive={kpi.positive}
                  highlight={kpi.highlight}
                  compareText={kpi.compareText}
                  sparkline={kpi.sparkline}
                  icon={<Icon className="w-4 h-4 text-brand-700" />}
                  onClick={() => onNavigate(kpi.navigateTo)}
                />
              );
            })}
          </div>
        </Accordion>
      )}

      <Accordion
        title="سایر بخش‌ها"
        subtitle="هزینه غذا، مشتری، تایم‌لاین و…"
        defaultOpen={false}
        className="mt-4"
      >
        <div className="grid grid-cols-3 gap-2 mb-3">
          {homeMoreModules.map((mod) => {
            const Icon = shortcutIcons[mod.icon] ?? BarChart3;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.id)}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white border border-slate-100 shadow-sm active:scale-95 min-h-[4.5rem]"
              >
                <Icon className="w-5 h-5 text-brand-700" />
                <span className="text-[11px] font-semibold text-brand-900 text-center leading-tight">
                  {mod.label}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onOpenMenu}
          className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-sm font-semibold text-brand-800 flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Grid3X3 className="w-4 h-4" />
          منوی کامل داشبورد
        </button>
      </Accordion>

      <Accordion
        title="نرخ به‌روزرسانی"
        subtitle="نیمه بلادرنگ"
        defaultOpen={false}
        className="mt-2"
      >
        <Card className="p-3 space-y-3">
          {refreshRates.map((r) => (
            <div key={r.section} className="flex justify-between text-sm gap-4">
              <span className="text-slate-500">{r.section}</span>
              <span className="font-semibold text-brand-800">{r.rate}</span>
            </div>
          ))}
        </Card>
      </Accordion>
    </PageShell>
  );
}
