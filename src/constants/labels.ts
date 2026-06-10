import type { DashboardLayer, ViewId } from "../types";

export const VIEW_TITLES: Record<Exclude<ViewId, "home">, string> = {
  sales: "تحلیل فروش",
  foodcost: "هزینه غذا و رسپی",
  inventory: "انبار و موجودی",
  finance: "کنترل مالی",
  hr: "پرسنل",
  customer: "تجربه مشتری",
  alerts: "هشدارها",
  timeline: "تایم‌لاین رویدادها",
  ai: "پیش‌بینی و هوش مصنوعی",
  mailbox: "صندوق پستی",
};

export const LAYER_LABELS: Record<DashboardLayer, string> = {
  owner: "مالک",
  operations: "عملیات",
  finance: "مالی",
};

export function kpiSectionSubtitle(layer: DashboardLayer, count: number): string {
  const layerName = LAYER_LABELS[layer];
  return `${count} شاخص — لایه ${layerName}`;
}
