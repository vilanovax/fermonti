import { Target, AlertCircle, CheckCircle2 } from "lucide-react";
import { verdictByLayer } from "../data/layerHomeData";
import type { DashboardLayer } from "../types";

export function VerdictBanner({ layer }: { layer: DashboardLayer }) {
  const verdict = verdictByLayer[layer];
  const icons = {
    good: CheckCircle2,
    caution: AlertCircle,
    bad: AlertCircle,
  };
  const Icon = icons[verdict.status] ?? AlertCircle;
  const bg =
    verdict.status === "good"
      ? "from-emerald-500 to-teal-500"
      : verdict.status === "caution"
        ? "from-amber-500 to-orange-500"
        : "from-red-500 to-rose-500";

  return (
    <section
      aria-label="خلاصه روز"
      className={`rounded-2xl bg-gradient-to-l ${bg} p-4 text-white shadow-md border border-white/20`}
    >
      <div className="flex gap-3 items-start">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-white/85 tracking-wide">
            خلاصه ۳۰ ثانیه‌ای — {layer === "owner" ? "مالک" : layer === "operations" ? "عملیات" : "مالی"}
          </p>
          <p className="font-bold text-[15px] leading-snug mt-1">{verdict.headline}</p>
          <div className="flex items-start gap-1.5 mt-2.5 text-xs text-white/95 leading-relaxed">
            <Target className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden />
            <span>
              <span className="font-semibold">تمرکز: </span>
              {verdict.focus}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
