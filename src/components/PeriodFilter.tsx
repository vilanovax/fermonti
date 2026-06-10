import type { TimePeriod } from "../types";
import { PERIOD_LABELS } from "../data/periodData";

const PERIODS: TimePeriod[] = ["today", "week", "month"];

interface PeriodFilterProps {
  value: TimePeriod;
  onChange: (p: TimePeriod) => void;
  disabled?: boolean;
}

export function PeriodFilter({ value, onChange, disabled }: PeriodFilterProps) {
  return (
    <div
      className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-4"
      role="tablist"
      aria-label="بازه زمانی"
    >
      {PERIODS.map((p) => (
        <button
          key={p}
          type="button"
          role="tab"
          aria-selected={value === p}
          disabled={disabled}
          onClick={() => onChange(p)}
          className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all min-h-[44px] disabled:opacity-50 ${
            value === p
              ? "bg-brand-800 text-white shadow-sm"
              : "text-slate-600"
          }`}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}
