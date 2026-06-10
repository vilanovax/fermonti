import { Bell, ChevronRight, Inbox, Menu } from "lucide-react";
import { RESTAURANT } from "../data/sampleData";
import type { DashboardLayer } from "../types";
import { LAYER_LABELS } from "../constants/labels";
import { Logo } from "./Logo";

interface HeaderProps {
  layer: DashboardLayer;
  onLayerChange: (l: DashboardLayer) => void;
  onMenuOpen: () => void;
  alertCount: number;
  onAlerts: () => void;
  mailboxUnreadCount: number;
  onMailbox: () => void;
  layerHints?: Record<DashboardLayer, number>;
  isHome: boolean;
  pageTitle?: string;
  onBack?: () => void;
}

export function Header({
  layer,
  onLayerChange,
  onMenuOpen,
  alertCount,
  onAlerts,
  mailboxUnreadCount,
  onMailbox,
  layerHints,
  isHome,
  pageTitle,
  onBack,
}: HeaderProps) {
  const headerActions = (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        onClick={onMailbox}
        className="relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20"
        aria-label="صندوق پستی"
      >
        <Inbox className="w-5 h-5" />
        {mailboxUnreadCount > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 bg-violet-500 rounded-full text-[10px] font-bold flex items-center justify-center">
            {mailboxUnreadCount}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={onAlerts}
        className="relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20"
        aria-label="هشدارها"
      >
        <Bell className="w-5 h-5" />
        {alertCount > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
            {alertCount}
          </span>
        )}
      </button>
    </div>
  );

  if (!isHome && pageTitle) {
    return (
      <header className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white safe-top shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20 shrink-0"
            aria-label="بازگشت به خانه"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-lg font-bold truncate">{pageTitle}</h1>
          {headerActions}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white safe-top shadow-lg relative overflow-hidden z-0">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent-gold blur-2xl" />
      </div>

      <div className="relative px-4 pt-3 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={onMenuOpen}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20 shrink-0"
            aria-label="منو"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 flex items-center gap-2.5">
            <Logo size="sm" className="ring-1 ring-white/20" />
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold leading-tight truncate">
                {RESTAURANT.name}
              </h1>
              <p className="text-[11px] text-white/60 truncate">{RESTAURANT.location}</p>
            </div>
          </div>

          {headerActions}
        </div>

        <p className="text-[11px] text-white/45 text-center mb-3">{RESTAURANT.lastUpdate}</p>

        <div className="flex gap-1 p-1 bg-white/10 rounded-xl">
          {(Object.keys(LAYER_LABELS) as DashboardLayer[]).map((l) => {
            const hint = layerHints?.[l] ?? 0;
            return (
              <button
                key={l}
                type="button"
                onClick={() => onLayerChange(l)}
                className={`relative flex-1 py-2 rounded-lg text-xs font-semibold transition-all min-h-[40px] ${
                  layer === l ? "bg-white text-brand-900 shadow" : "text-white/70"
                }`}
              >
                {LAYER_LABELS[l]}
                {hint > 0 && l !== layer && (
                  <span className="absolute top-1 left-1.5 min-w-[14px] h-[14px] px-0.5 bg-amber-500 text-[9px] font-bold rounded-full flex items-center justify-center text-white">
                    {hint > 9 ? "۹+" : hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
