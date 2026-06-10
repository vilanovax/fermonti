import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Box,
  Droplets,
  Package,
  Trash2,
  Wheat,
  Wine,
  Beef,
  type LucideIcon,
} from "lucide-react";
import { PeriodFilter } from "../components/PeriodFilter";
import { Sparkline } from "../components/Sparkline";
import { useInventory } from "../hooks/useInventory";
import { formatMillionToman } from "../utils/format";
import { Card, PageShell, SectionTitle, StatusPill } from "../components/ui";
import type {
  InventoryCategory,
  InventoryItemStatus,
  InventoryStockItem,
  TimePeriod,
} from "../types";

type StatusFilter = "all" | InventoryItemStatus;

const statusLabel: Record<InventoryItemStatus, string> = {
  critical: "بحرانی",
  low: "کم",
  ok: "عادی",
};

const statusVariant: Record<
  InventoryItemStatus,
  "critical" | "warning" | "ok"
> = {
  critical: "critical",
  low: "warning",
  ok: "ok",
};

const categoryMeta: Record<InventoryCategory, { icon: LucideIcon; label: string }> = {
  dairy: { icon: Droplets, label: "لبنیات" },
  meat: { icon: Beef, label: "گوشت" },
  spice: { icon: Wheat, label: "ادویه" },
  beverage: { icon: Wine, label: "نوشیدنی" },
  oil: { icon: Droplets, label: "روغن" },
  produce: { icon: Wheat, label: "تازه" },
  dry: { icon: Package, label: "خشکبار" },
};

const FILTER_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "critical", label: "بحرانی" },
  { id: "low", label: "کم" },
  { id: "ok", label: "عادی" },
];

export function InventoryView() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const { data, loading } = useInventory(period);

  const filtered = useMemo(() => {
    if (!data) return [];
    const list =
      filter === "all" ? data.items : data.items.filter((i) => i.status === filter);
    const order = { critical: 0, low: 1, ok: 2 };
    return [...list].sort((a, b) => order[a.status] - order[b.status] || a.daysLeft - b.daysLeft);
  }, [data, filter]);

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-32 rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-200" />
            ))}
          </div>
          <div className="h-24 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  const { summary, insights } = data;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-4 p-4 bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600 text-white border-0">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-white/85 shrink-0" />
              <p className="text-sm text-white/80">ارزش کل انبار</p>
            </div>
            <p className="text-4xl font-extrabold mt-1 leading-none">
              {formatMillionToman(summary.totalValueMillions, 0)}
            </p>
            <p className="text-[11px] text-white/65 mt-2">{summary.compareText}</p>
          </div>
          <Sparkline data={summary.sparkline} positive />
        </div>
        <p className="text-xs font-medium mt-3 px-2 py-1.5 rounded-lg bg-white/15 inline-block">
          {summary.headline}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Card className="p-3 border-red-100 bg-red-50/40">
          <p className="text-[10px] text-slate-600">بحرانی</p>
          <p className="text-2xl font-extrabold text-red-700">
            {summary.criticalCount.toLocaleString("fa-IR")}
          </p>
        </Card>
        <Card className="p-3 border-amber-100 bg-amber-50/40">
          <p className="text-[10px] text-slate-600">کسری</p>
          <p className="text-2xl font-extrabold text-amber-800">
            {summary.shortageCount.toLocaleString("fa-IR")}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-[10px] text-slate-600 flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> پرت روزانه
          </p>
          <p className="text-lg font-extrabold text-brand-900">
            {summary.dailyWasteMillions.toLocaleString("fa-IR")}M
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-[10px] text-slate-600">گردش موجودی</p>
          <p className="text-lg font-extrabold text-brand-900">
            {summary.turnoverDays.toLocaleString("fa-IR")} روز
          </p>
        </Card>
      </div>

      <Card className="mb-4 p-3 grid grid-cols-3 gap-2 text-center text-[11px]">
        <div>
          <p className="text-slate-500">مغایرت</p>
          <p className="font-bold text-brand-900">
            {summary.discrepancyThousands.toLocaleString("fa-IR")}K
          </p>
        </div>
        <div>
          <p className="text-slate-500">نزدیک انقضا</p>
          <p className="font-bold text-amber-800">
            {summary.expiringSoonCount.toLocaleString("fa-IR")} قلم
          </p>
        </div>
        <div>
          <p className="text-slate-500">قلم فعال</p>
          <p className="font-bold text-brand-900">
            {data.items.length.toLocaleString("fa-IR")}
          </p>
        </div>
      </Card>

      <div
        className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-3 overflow-x-auto"
        role="tablist"
        aria-label="فیلتر وضعیت"
      >
        {FILTER_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? data.items.length
              : data.items.filter((i) => i.status === tab.id).length;
          if (tab.id !== "all" && count === 0) return null;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 min-w-[3.5rem] py-2 rounded-lg text-xs font-semibold min-h-[40px] ${
                filter === tab.id
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              {tab.label}
              <span className="mr-1 opacity-70">({count.toLocaleString("fa-IR")})</span>
            </button>
          );
        })}
      </div>

      <SectionTitle title="هشدارهای هوشمند" subtitle={`${filtered.length.toLocaleString("fa-IR")} قلم`} />
      <div className="space-y-2 mb-5">
        {filtered.length === 0 ? (
          <Card className="p-5 text-center text-sm text-slate-500">
            قلمی در این فیلتر نیست
          </Card>
        ) : (
          filtered.map((item) => <StockCard key={item.id} item={item} />)
        )}
      </div>

      {insights.length > 0 && (
        <>
          <SectionTitle title="پیشنهاد انبار" />
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

function StockCard({ item }: { item: InventoryStockItem }) {
  const meta = categoryMeta[item.category];
  const Icon = meta.icon;
  const stockRatio =
    item.parDays > 0 ? Math.min(100, Math.round((item.daysLeft / item.parDays) * 100)) : 0;
  const barColor =
    item.status === "critical"
      ? "bg-red-500"
      : item.status === "low"
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <Card
      className={`p-4 ${
        item.status === "critical"
          ? "border-red-200 bg-red-50/40"
          : item.status === "low"
            ? "border-amber-100 bg-amber-50/25"
            : ""
      }`}
    >
      <div className="flex gap-3 items-start">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm shrink-0">
          <Icon className="w-5 h-5 text-brand-800" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="font-bold text-sm text-brand-900">{item.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{meta.label}</p>
            </div>
            <StatusPill
              label={statusLabel[item.status]}
              variant={statusVariant[item.status]}
            />
          </div>
          {item.note && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {item.note}
            </p>
          )}
          {item.parDays > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                <span>
                  موجودی: <strong>{item.daysLeft.toLocaleString("fa-IR")} روز</strong>
                </span>
                <span>هدف: {item.parDays.toLocaleString("fa-IR")} روز</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${stockRatio}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mt-2 text-xs">
            {item.dailyUsageLabel && (
              <span className="text-slate-500">{item.dailyUsageLabel}</span>
            )}
            <span className="font-semibold text-brand-800 mr-auto">
              {item.valueMillions.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}M تومان
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
