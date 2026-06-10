import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronLeft, ChevronDown, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Sparkline } from "./Sparkline";

export function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-4 pb-2 ${className}`}>{children}</div>;
}

export function SectionTitle({
  title,
  subtitle,
  className = "",
  action,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`mb-3 flex items-start justify-between gap-2 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-brand-900">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`bg-card rounded-2xl shadow-sm border border-slate-100/80 p-4 text-right w-full ${
        onClick ? "active:scale-[0.98] transition-transform text-right" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

export function TrendBadge({
  value,
  positive,
}: {
  value: string;
  positive?: boolean;
}) {
  const isNeg =
    value.includes("-") || value.includes("بحرانی") || value.includes("بالا");
  const good = positive ?? !isNeg;
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        good ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      {value}
    </span>
  );
}

export function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

export function BackBar({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        type="button"
        onClick={onBack}
        className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center active:scale-95"
        aria-label="بازگشت"
      >
        <ChevronLeft className="w-5 h-5 text-brand-800 rotate-180" />
      </button>
      <h1 className="text-lg font-bold text-brand-900">{title}</h1>
    </div>
  );
}

export function StatusPill({
  label,
  variant,
}: {
  label: string;
  variant: "critical" | "warning" | "ok" | "info";
}) {
  const styles = {
    critical: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-800",
    ok: "bg-emerald-100 text-emerald-700",
    info: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[variant]}`}>
      {label}
    </span>
  );
}

export function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`mb-4 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 py-2 text-right"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-base font-bold text-brand-900">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

export function HorizontalScrollHint({ children }: { children: ReactNode }) {
  return (
    <div className="relative -mx-1">
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 px-1 snap-x snap-mandatory">
        {children}
      </div>
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-2 w-6 bg-gradient-to-r from-surface to-transparent"
        aria-hidden
      />
      <p className="text-[11px] text-slate-400 text-center mt-0.5">← برای دیدن همه، بکشید</p>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  unit,
  change,
  positive,
  highlight,
  compareText,
  sparkline,
  icon,
  onClick,
}: {
  label: string;
  value: string;
  unit: string;
  change: string;
  positive: boolean;
  highlight?: boolean;
  compareText: string;
  sparkline: number[];
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`p-3.5 text-right ${
        highlight
          ? "border-red-200 ring-1 ring-red-100 bg-red-50/30"
          : "hover:border-brand-200"
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="w-9 h-9 rounded-lg bg-brand-800/5 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <TrendBadge value={change} positive={positive} />
          <Sparkline data={sparkline} positive={positive} />
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2 font-medium">{label}</p>
      <p className="text-lg font-extrabold text-brand-900 leading-tight mt-0.5">
        {value}
        {unit && (
          <span className="text-xs font-normal text-slate-400 mr-1">{unit}</span>
        )}
      </p>
      <p className="text-xs text-slate-500 mt-1.5 leading-snug">{compareText}</p>
      <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-end gap-0.5">
        <span>جزئیات</span>
        <ChevronLeft className="w-3.5 h-3.5 rotate-180" aria-hidden />
      </p>
    </Card>
  );
}
