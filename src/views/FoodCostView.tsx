import { useMemo, useState } from "react";
import { Beef, Droplets, Trash2, AlertTriangle } from "lucide-react";
import { PeriodFilter } from "../components/PeriodFilter";
import { RecipeCard } from "../components/RecipeCard";
import { Sparkline } from "../components/Sparkline";
import { useFoodCost } from "../hooks/useFoodCost";
import { Card, PageShell, SectionTitle } from "../components/ui";
import type { RecipeStatus, TimePeriod } from "../types";

type FilterTab = "all" | RecipeStatus;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "critical", label: "بحرانی" },
  { id: "warning", label: "هشدار" },
  { id: "ok", label: "سالم" },
];

export function FoodCostView() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [filter, setFilter] = useState<FilterTab>("all");
  const { data, loading } = useFoodCost(period);

  const recipes = useMemo(() => {
    if (!data) return [];
    const list =
      filter === "all" ? data.recipes : data.recipes.filter((r) => r.status === filter);
    return [...list].sort((a, b) => b.foodCost - a.foodCost);
  }, [data, filter]);

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-32 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-40 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary } = data;
  const overTarget = summary.avgFoodCost > summary.target;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-5 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white border-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="text-sm text-white/85">میانگین هزینه غذا</p>
            <p className="text-4xl font-extrabold mt-1">{summary.avgFoodCost}٪</p>
          </div>
          <Sparkline
            data={summary.sparkline}
            positive={!summary.costIncreased}
            className="opacity-90"
          />
        </div>
        <p className="text-sm text-white/80 mt-2">{summary.compareText}</p>
        <p
          className={`text-xs font-bold mt-2 inline-flex px-2 py-1 rounded-full ${
            overTarget ? "bg-red-500/30" : "bg-emerald-500/30"
          }`}
        >
          هدف: زیر {summary.target}٪ — {summary.headline}
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <Card className="p-3 text-center">
          <Droplets className="w-5 h-5 text-sky-600 mx-auto mb-1" />
          <p className="text-[11px] text-slate-500">نوشیدنی</p>
          <p className="font-extrabold text-brand-900">{summary.bevCost}٪</p>
        </Card>
        <Card className="p-3 text-center">
          <Trash2 className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-[11px] text-slate-500">پرت</p>
          <p className="font-extrabold text-brand-900">{summary.wasteMillions}M</p>
        </Card>
        <Card className="p-3 text-center border-red-100 bg-red-50/50">
          <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
          <p className="text-[11px] text-slate-500">نیاز اقدام</p>
          <p className="font-extrabold text-red-700">{summary.itemsAtRisk} غذا</p>
        </Card>
      </div>

      {data.insights.length > 0 && (
        <>
          <SectionTitle title="توصیه مدیریتی" />
          <div className="space-y-2 mb-5">
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
                <p className="font-bold text-sm text-brand-900">{ins.title}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ins.detail}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      <SectionTitle
        title="تحلیل غذا به غذا"
        subtitle={`${recipes.length} قلم — قیمت تمام‌شده و سود`}
      />

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-3 mb-3">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold min-h-[40px] ${
              filter === tab.id
                ? "bg-brand-800 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {tab.label}
            {tab.id !== "all" && (
              <span className="mr-1 opacity-80">
                ({data.recipes.filter((r) => r.status === tab.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {recipes.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-500">
            غذایی در این فیلتر نیست
          </Card>
        ) : (
          recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
        )}
      </div>

      <Card className="mt-6 p-4 flex gap-3 items-start bg-brand-50 border-brand-100">
        <Beef className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          داده دمو — در نسخه متصل به آشپزخانه، قیمت مواد از انبار و فاکتور خرید به‌صورت خودکار
          در رسپی به‌روز می‌شود.
        </p>
      </Card>
    </PageShell>
  );
}
