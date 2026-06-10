import { ChevronLeft, TrendingUp } from "lucide-react";
import type { SalesSnapshot } from "../types";
import { formatMillionToman } from "../utils/format";
import { Sparkline } from "./Sparkline";

interface SalesHeroCardProps {
  sales: SalesSnapshot;
  onOpenSales: () => void;
}

export function SalesHeroCard({ sales, onOpenSales }: SalesHeroCardProps) {
  const {
    currentMillions,
    previousMillions,
    changePercent,
    label,
    previousPeriodLabel,
    sparkline,
  } = sales;
  const positive = changePercent >= 0;

  return (
    <button
      type="button"
      onClick={onOpenSales}
      className="w-full text-right rounded-2xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-5 text-white shadow-lg active:scale-[0.99] transition-transform mb-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-white/75 font-medium">{label}</p>
        <Sparkline data={sparkline} positive={positive} />
      </div>
      <div className="flex items-start justify-between gap-2 mt-1">
        <p className="text-4xl font-extrabold tracking-tight">
          {formatMillionToman(currentMillions)}
        </p>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 mt-2 ${
            positive ? "bg-emerald-500/25 text-emerald-100" : "bg-red-500/25 text-red-100"
          }`}
        >
          <TrendingUp
            className={`w-3.5 h-3.5 ${!positive ? "rotate-180" : ""}`}
            aria-hidden
          />
          {positive ? "+" : ""}
          {changePercent}٪
        </span>
      </div>
      <p className="text-sm text-white/70 mt-1">
        {previousPeriodLabel}: {formatMillionToman(previousMillions)}
      </p>
      <p className="text-xs text-accent-gold/90 mt-3 flex items-center justify-end gap-1 font-semibold">
        تحلیل کامل فروش
        <ChevronLeft className="w-4 h-4 rotate-180" aria-hidden />
      </p>
    </button>
  );
}
