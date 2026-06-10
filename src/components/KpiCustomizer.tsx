import { Settings2 } from "lucide-react";
import type { ExecutiveKpi } from "../types";

interface KpiCustomizerProps {
  allKpis: ExecutiveKpi[];
  pinnedIds: string[];
  onToggle: (id: string) => void;
  onReset: () => void;
}

export function KpiCustomizer({
  allKpis,
  pinnedIds,
  onToggle,
  onReset,
}: KpiCustomizerProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="w-4 h-4 text-brand-700" />
        <p className="text-sm font-bold text-brand-900">شخصی‌سازی کارت‌ها</p>
        <button
          type="button"
          onClick={onReset}
          className="mr-auto text-xs text-brand-600 font-medium"
        >
          بازنشانی
        </button>
      </div>
      <p className="text-xs text-slate-500 mb-2">حداقل ۴ کارت — انتخاب شما ذخیره می‌شود</p>
      <div className="flex flex-wrap gap-2">
        {allKpis.map((kpi) => {
          const on = pinnedIds.includes(kpi.id);
          return (
            <button
              key={kpi.id}
              type="button"
              onClick={() => onToggle(kpi.id)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                on
                  ? "bg-brand-800 text-white border-brand-800"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {kpi.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
