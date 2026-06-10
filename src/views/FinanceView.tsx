import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Calendar,
  FileText,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PeriodFilter } from "../components/PeriodFilter";
import { Sparkline } from "../components/Sparkline";
import { useFinance } from "../hooks/useFinance";
import { formatMillionToman } from "../utils/format";
import { Card, PageShell, SectionTitle, StatusPill } from "../components/ui";
import type {
  FinanceCommitment,
  FinanceCommitmentCategory,
  FinanceCommitmentStatus,
  TimePeriod,
} from "../types";

type CommitmentFilter = "all" | "urgent";

const categoryIcon: Record<FinanceCommitmentCategory, LucideIcon> = {
  checks: FileText,
  suppliers: Banknote,
  payroll: Wallet,
  rent: Calendar,
  tax: FileText,
  opex: ArrowDownLeft,
  other: FileText,
};

const statusPill: Record<
  FinanceCommitmentStatus,
  { label: string; variant: "critical" | "warning" | "ok" }
> = {
  critical: { label: "بحرانی", variant: "critical" },
  warning: { label: "توجه", variant: "warning" },
  ok: { label: "عادی", variant: "ok" },
};

export function FinanceView() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [filter, setFilter] = useState<CommitmentFilter>("all");
  const { data, loading } = useFinance(period);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.cashFlow.map((d) => ({
      name: d.label,
      ورودی: d.inflow,
      خروجی: d.outflow,
    }));
  }, [data]);

  const filteredCommitments = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.commitments;
    return data.commitments.filter(
      (c) => c.status === "warning" || c.status === "critical"
    );
  }, [data, filter]);

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
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-52 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary, alert, insights } = data;
  const urgentCount = data.commitments.filter(
    (c) => c.status !== "ok"
  ).length;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-4 bg-gradient-to-br from-violet-800 via-purple-700 to-indigo-800 text-white border-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-white/85 shrink-0" />
              <p className="text-sm text-white/80">موجودی نقد</p>
            </div>
            <p className="text-4xl font-extrabold mt-1 leading-none">
              {formatMillionToman(summary.cashOnHandMillions, 0)}
            </p>
            <p className="text-[11px] text-white/65 mt-2">{summary.cashCompare}</p>
          </div>
          <Sparkline
            data={summary.sparkline}
            positive={summary.cashOnHandMillions >= 85}
          />
        </div>
        <p className="text-xs font-medium mt-3 px-2 py-1.5 rounded-lg bg-white/15 inline-block">
          {summary.headline}
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-1.5 mb-4">
        <Card className="p-2.5 text-center border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center justify-center gap-0.5 text-emerald-700">
            {summary.netCashflowPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <p className="text-base font-extrabold leading-none">
              {summary.netCashflowPositive ? "+" : ""}
              {summary.netCashflowMillions.toLocaleString("fa-IR")}M
            </p>
          </div>
          <p className="text-[10px] text-slate-600 mt-0.5">جریان خالص</p>
        </Card>
        <Card className="p-2.5 text-center">
          <p className="text-base font-extrabold text-brand-900 leading-none">
            {summary.commitmentsTotalMillions.toLocaleString("fa-IR", {
              maximumFractionDigits: 0,
            })}
            M
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">تعهدات</p>
        </Card>
        <Card className="p-2.5 text-center border-violet-100 bg-violet-50/40">
          <p className="text-base font-extrabold text-violet-900 leading-none">
            {summary.runwayDays.toLocaleString("fa-IR")} روز
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">پوشش نقد</p>
        </Card>
      </div>

      {alert && (
        <Card
          className={`mb-4 p-4 ${
            alert.severity === "critical"
              ? "border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex gap-2 items-start">
            <AlertTriangle
              className={`w-5 h-5 shrink-0 ${
                alert.severity === "critical" ? "text-red-600" : "text-amber-600"
              }`}
            />
            <div>
              <p
                className={`text-sm font-bold ${
                  alert.severity === "critical" ? "text-red-800" : "text-amber-800"
                }`}
              >
                {alert.title}
              </p>
              <p
                className={`text-sm mt-1 leading-relaxed ${
                  alert.severity === "critical" ? "text-red-900" : "text-amber-900"
                }`}
              >
                {alert.detail}
                {alert.shortageMillions != null && (
                  <span className="font-bold">
                    {" "}
                    — کمبود ~
                    {alert.shortageMillions.toLocaleString("fa-IR")}M
                  </span>
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-3">
        {(
          [
            { id: "all" as const, label: "همه تعهدات" },
            { id: "urgent" as const, label: "نیاز توجه" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold min-h-[40px] ${
              filter === tab.id
                ? "bg-white text-brand-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            {tab.label}
            {tab.id === "urgent" && (
              <span className="mr-1 opacity-70">
                ({urgentCount.toLocaleString("fa-IR")})
              </span>
            )}
          </button>
        ))}
      </div>

      <SectionTitle title="تعهدات و هزینه‌ها" subtitle={`${filteredCommitments.length.toLocaleString("fa-IR")} مورد`} />
      <div className="space-y-2 mb-5">
        {filteredCommitments.length === 0 ? (
          <Card className="p-4 text-center text-sm text-slate-500">
            تعهد فوری ثبت نشده
          </Card>
        ) : (
          filteredCommitments.map((item) => (
            <CommitmentRow key={item.id} item={item} />
          ))
        )}
      </div>

      <SectionTitle title={data.cashFlowTitle} subtitle={data.cashFlowSubtitle} />
      <Card className="h-56 mb-5 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ fontFamily: "Vazirmatn", fontSize: 11, borderRadius: 8 }}
              formatter={(v: number, name: string) => [
                `${v.toLocaleString("fa-IR")}M`,
                name,
              ]}
            />
            <Legend wrapperStyle={{ fontSize: 10, fontFamily: "Vazirmatn" }} />
            <Bar dataKey="ورودی" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="خروجی" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <Card className="p-3 flex items-center gap-2 border-emerald-100 bg-emerald-50/30">
          <ArrowUpRight className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500">مجموع ورودی</p>
            <p className="font-bold text-emerald-800">
              {chartData
                .reduce((s, d) => s + d.ورودی, 0)
                .toLocaleString("fa-IR")}
              M
            </p>
          </div>
        </Card>
        <Card className="p-3 flex items-center gap-2 border-red-100 bg-red-50/30">
          <ArrowDownLeft className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500">مجموع خروجی</p>
            <p className="font-bold text-red-700">
              {chartData
                .reduce((s, d) => s + d.خروجی, 0)
                .toLocaleString("fa-IR")}
              M
            </p>
          </div>
        </Card>
      </div>

      {insights.length > 0 && (
        <>
          <SectionTitle title="پیشنهاد مالی" />
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
                <p className="text-sm font-bold text-brand-900">{item.title}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

function CommitmentRow({ item }: { item: FinanceCommitment }) {
  const Icon = categoryIcon[item.category];
  const pill = statusPill[item.status];

  return (
    <Card
      className={`p-3.5 ${
        item.status === "critical"
          ? "border-red-200 bg-red-50/40"
          : item.status === "warning"
            ? "border-amber-100 bg-amber-50/30"
            : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm shrink-0">
          <Icon className="w-4 h-4 text-brand-800" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-700 leading-snug">{item.label}</p>
          {item.dueLabel && (
            <p className="text-[10px] text-slate-400 mt-0.5">سررسید: {item.dueLabel}</p>
          )}
        </div>
        <div className="text-left shrink-0 flex flex-col items-end gap-1">
          <span className="font-extrabold text-sm text-brand-900">
            {item.amountMillions.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}M
          </span>
          <StatusPill label={pill.label} variant={pill.variant} />
        </div>
      </div>
    </Card>
  );
}
