import { AlertTriangle, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { RecipeAnalysis } from "../types";
import { Sparkline } from "./Sparkline";
import { StatusPill } from "./ui";

const statusLabel: Record<RecipeAnalysis["status"], string> = {
  critical: "بحرانی",
  warning: "هشدار",
  ok: "خوب",
};

function CostTrendIcon({ trend }: { trend: RecipeAnalysis["costTrend"] }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-red-500" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

interface RecipeCardProps {
  recipe: RecipeAnalysis;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const barColor =
    recipe.status === "critical"
      ? "bg-red-500"
      : recipe.status === "warning"
        ? "bg-amber-500"
        : "bg-emerald-500";

  const border =
    recipe.status === "critical"
      ? "border-red-200 bg-red-50/40"
      : recipe.status === "warning"
        ? "border-amber-200 bg-amber-50/30"
        : "border-slate-100";

  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${border}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-brand-900">{recipe.name}</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {recipe.category}
            </span>
          </div>
          {recipe.alert && (
            <p className="text-xs text-red-700 mt-1.5 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {recipe.alert}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <CostTrendIcon trend={recipe.costTrend} />
            {recipe.compareText}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusPill label={statusLabel[recipe.status]} variant={recipe.status} />
          <Sparkline
            data={recipe.sparkline}
            positive={recipe.costTrend === "down"}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="col-span-2 flex items-baseline justify-between p-2.5 rounded-xl bg-white/80 border border-slate-100">
          <span className="text-slate-500 text-xs">Food Cost</span>
          <span className="text-xl font-extrabold text-brand-900">{recipe.foodCost}٪</span>
        </div>
        <div className="p-2 rounded-xl bg-white/60 text-center">
          <p className="text-[11px] text-slate-500">سود</p>
          <p
            className={`font-bold ${recipe.margin < 0 ? "text-red-600" : "text-emerald-600"}`}
          >
            {recipe.margin}٪
          </p>
        </div>
        <div className="p-2 rounded-xl bg-white/60 text-center">
          <p className="text-[11px] text-slate-500">پرت</p>
          <p className="font-bold text-brand-900">{recipe.waste}٪</p>
        </div>
        <div className="p-2 rounded-xl bg-white/60 text-center">
          <p className="text-[11px] text-slate-500">قیمت منو</p>
          <p className="font-bold text-brand-900">{recipe.menuPrice}M</p>
        </div>
        <div className="p-2 rounded-xl bg-white/60 text-center">
          <p className="text-[11px] text-slate-500">فروش هفته</p>
          <p className="font-bold text-brand-900">{recipe.salesWeek}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
          <span>هدف ۳۲٪</span>
          <span>تمام‌شده {recipe.plateCost}M</span>
        </div>
        <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${Math.min(recipe.foodCost, 100)}%` }}
          />
        </div>
      </div>
    </article>
  );
}
