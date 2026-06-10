import { useMemo, useState } from "react";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { PeriodFilter } from "../components/PeriodFilter";
import { Sparkline } from "../components/Sparkline";
import { useSalesAnalysis } from "../hooks/useSalesAnalysis";
import { formatCompactToman, formatMillionToman } from "../utils/format";
import { Card, PageShell, SectionTitle, TrendIcon } from "../components/ui";
import type { MenuSalesItem, SalesComparisonRow, TimePeriod, ZoneSalesRow } from "../types";

function formatHeroAmount(millions: number, period: TimePeriod) {
  if (period === "month" && millions >= 100) return formatCompactToman(millions);
  return formatMillionToman(millions);
}

export function SalesView() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const { data, loading } = useSalesAnalysis(period);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.chartPoints.map((p) => ({ name: p.label, sales: p.sales }));
  }, [data]);

  const peakIndex = useMemo(() => {
    if (chartData.length === 0) return 0;
    return chartData.reduce(
      (best, p, i) => (p.sales > chartData[best].sales ? i : best),
      0
    );
  }, [chartData]);

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-36 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary } = data;
  const positive = summary.changePercent >= 0;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-5 bg-gradient-to-br from-blue-600 via-cyan-600 to-sky-500 text-white border-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p className="text-xs text-white/80">{summary.label}</p>
            <p className="text-4xl font-extrabold mt-1 leading-none">
              {formatHeroAmount(summary.currentMillions, period)}
            </p>
            <p className="text-sm text-white/75 mt-1">تومان</p>
            <span
              className={`inline-flex items-center gap-1 mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                positive ? "bg-emerald-500/30" : "bg-red-500/30"
              }`}
            >
              {positive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {positive ? "+" : ""}
              {summary.changePercent.toLocaleString("fa-IR")}٪
            </span>
            <p className="text-[11px] text-white/65 mt-2">{summary.compareText}</p>
          </div>
          <Sparkline data={summary.sparkline} positive={positive} />
        </div>
        <p className="text-xs font-medium mt-3 px-2 py-1.5 rounded-lg bg-white/15 inline-block">
          {summary.headline}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="rounded-lg bg-white/10 px-2 py-1.5 text-center">
            <p className="text-[10px] text-white/70">سفارش</p>
            <p className="text-sm font-bold">{summary.ordersCount.toLocaleString("fa-IR")}</p>
          </div>
          <div className="rounded-lg bg-white/10 px-2 py-1.5 text-center">
            <p className="text-[10px] text-white/70">میانگین فاکتور</p>
            <p className="text-sm font-bold">
              {formatMillionToman(summary.avgCheckMillions, 2)}
            </p>
          </div>
        </div>
      </Card>

      <SectionTitle
        title="مقایسه با دوره‌های قبل"
        subtitle={`فروش فعلی: ${formatHeroAmount(summary.currentMillions, period)}`}
      />
      <div className="space-y-2 mb-5">
        {data.comparisons.map((c) => (
          <ComparisonCard key={c.label} row={c} period={period} />
        ))}
      </div>

      <SectionTitle title={data.chartTitle} subtitle={data.chartSubtitle} />
      <Card className="mb-5 h-52 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ fontFamily: "Vazirmatn", fontSize: 11, borderRadius: 8 }}
              formatter={(v: number) => [
                `${v.toLocaleString("fa-IR")}${period === "month" ? " میلیون" : "M"}`,
                "فروش",
              ]}
            />
            <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === peakIndex ? "#fbbf24" : "#3d6a9e"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <SectionTitle title="کانال‌های فروش" subtitle="سالن · تراس · تحویل" />
      <ChannelShareBar zones={data.zones} className="mb-3" />
      <div className="space-y-2 mb-5">
        {data.zones.map((z) => (
          <Card key={z.zone} className="p-3.5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-brand-900">{z.zone}</span>
                <TrendIcon trend={z.trend} />
              </div>
              <span className="text-sm font-extrabold text-brand-800">
                {z.total.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}M
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-brand-600 rounded-full"
                style={{ width: `${z.sharePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-2">
              <span>{z.sharePercent.toLocaleString("fa-IR")}٪ از کل</span>
            </div>
            <div className="flex gap-2 text-[10px]">
              <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                ناهار {z.lunch.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}M
              </span>
              <span className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                شام {z.dinner.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}M
              </span>
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle title="پرفروش‌ترین غذاها" />
      <div className="space-y-2 mb-5">
        {data.topItems.map((item, i) => (
          <MenuRow key={item.id} item={item} rank={i + 1} />
        ))}
      </div>

      <SectionTitle title="نیازمند توجه" subtitle="کم‌فروش / زیان‌ده / تخفیف زیاد" />
      <div className="space-y-2 mb-5">
        {data.attentionItems.map((item) => (
          <Card key={item.id} className="p-3.5 border-red-100 bg-red-50/40">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="font-bold text-sm text-brand-900">{item.name}</p>
                  {item.issue && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                      {item.issue}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-red-700 mt-1">
                  {item.sales.toLocaleString("fa-IR")} فروش — سود {item.margin.toLocaleString("fa-IR")}٪
                  {item.discountRate != null &&
                    ` — تخفیف ${item.discountRate.toLocaleString("fa-IR")}٪`}
                </p>
              </div>
              <TrendIcon trend={item.trend} />
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle title="رفتار مشتری" />
      <div className="grid grid-cols-2 gap-2 mb-5">
        {data.customerBehavior.map((m) => (
          <Card key={m.key} className="p-3">
            <p className="text-[10px] text-slate-500">{m.label}</p>
            <p className="font-extrabold text-brand-900 mt-0.5">{m.value}</p>
            {m.compare && (
              <p className="text-[10px] text-slate-400 mt-0.5">{m.compare}</p>
            )}
          </Card>
        ))}
      </div>

      {data.insights.length > 0 && (
        <>
          <SectionTitle title="نکات مدیر" />
          <div className="space-y-2">
            {data.insights.map((item, i) => (
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

function fmtMillions(v: number, period: TimePeriod) {
  if (period === "month" && v >= 100) return formatCompactToman(v);
  return `${v.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}M`;
}

function ComparisonCard({
  row,
  period,
}: {
  row: SalesComparisonRow;
  period: TimePeriod;
}) {
  const pos = row.changePercent >= 0;
  const diff = row.currentMillions - row.previousMillions;
  const diffLabel =
    period === "month" && Math.abs(diff) >= 10
      ? formatCompactToman(Math.abs(diff))
      : `${Math.abs(diff).toLocaleString("fa-IR", { maximumFractionDigits: 1 })}M`;

  return (
    <Card className="p-3.5">
      <div className="flex justify-between items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-brand-900">{row.label}</span>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            pos ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          {pos ? "+" : ""}
          {row.changePercent.toLocaleString("fa-IR")}٪
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-center flex-1 rounded-lg bg-slate-50 py-2 px-1">
          <p className="text-[10px] text-slate-500 mb-0.5">مرجع</p>
          <p className="text-sm font-bold text-slate-700">{fmtMillions(row.previousMillions, period)}</p>
        </div>
        <span className="text-slate-300 text-lg shrink-0" aria-hidden>
          ←
        </span>
        <div className="text-center flex-1 rounded-lg bg-brand-50 py-2 px-1">
          <p className="text-[10px] text-brand-600 mb-0.5">فعلی</p>
          <p className="text-sm font-extrabold text-brand-900">{fmtMillions(row.currentMillions, period)}</p>
        </div>
      </div>
      <p className={`text-[10px] mt-2 text-center font-medium ${pos ? "text-emerald-600" : "text-red-500"}`}>
        {pos ? "بیشتر" : "کمتر"} به اندازه {diffLabel}
      </p>
    </Card>
  );
}

function ChannelShareBar({
  zones,
  className = "",
}: {
  zones: ZoneSalesRow[];
  className?: string;
}) {
  const colors = ["bg-brand-600", "bg-cyan-500", "bg-amber-400"];
  return (
    <Card className={`p-3 ${className}`}>
      <p className="text-[10px] text-slate-500 mb-2">سهم فروش از کل</p>
      <div className="flex h-3 rounded-full overflow-hidden">
        {zones.map((z, i) => (
          <div
            key={z.zone}
            className={`${colors[i % colors.length]} transition-all`}
            style={{ width: `${z.sharePercent}%` }}
            title={`${z.zone} ${z.sharePercent}٪`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {zones.map((z, i) => (
          <span key={z.zone} className="text-[10px] text-slate-600 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
            {z.zone} ({z.sharePercent.toLocaleString("fa-IR")}٪)
          </span>
        ))}
      </div>
    </Card>
  );
}

function MenuRow({ item, rank }: { item: MenuSalesItem; rank: number }) {
  return (
    <Card className="p-3 flex items-center gap-3">
      <span className="w-8 h-8 rounded-full bg-amber-100 text-brand-900 font-bold text-sm flex items-center justify-center shrink-0">
        {rank.toLocaleString("fa-IR")}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-brand-900">{item.name}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {item.sales.toLocaleString("fa-IR")} فروش — سود {item.margin.toLocaleString("fa-IR")}٪
        </p>
      </div>
      <TrendIcon trend={item.trend} />
    </Card>
  );
}
