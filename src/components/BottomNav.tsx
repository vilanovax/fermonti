import { Home, AlertTriangle, BarChart3, Wallet } from "lucide-react";
import type { ViewId } from "../types";

interface BottomNavProps {
  active: ViewId;
  onNavigate: (view: ViewId) => void;
  alertCount: number;
}

const tabs: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "خانه", icon: Home },
  { id: "sales", label: "فروش", icon: BarChart3 },
  { id: "alerts", label: "هشدار", icon: AlertTriangle },
  { id: "finance", label: "مالی", icon: Wallet },
];

export function BottomNav({ active, onNavigate, alertCount }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none"
      aria-label="ناوبری اصلی"
    >
      <div className="w-full max-w-lg pointer-events-auto bg-brand-900 border-t border-white/10 shadow-[0_-4px_24px_rgba(15,39,68,0.2)] pb-nav-safe pt-1.5">
        <div className="flex items-stretch justify-around px-2 min-h-[3.25rem]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            const isAlerts = tab.id === "alerts";

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-1 max-w-[5.5rem] flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors active:scale-95 ${
                  isActive ? "text-accent-gold" : "text-white/55"
                }`}
              >
                <span
                  className={`relative flex items-center justify-center ${
                    isAlerts
                      ? `w-10 h-10 rounded-full ${
                          isActive
                            ? "bg-accent-gold text-brand-900 shadow-md"
                            : "bg-white/15 text-white"
                        }`
                      : "w-6 h-6"
                  }`}
                >
                  <Icon className={isAlerts ? "w-5 h-5" : "w-[22px] h-[22px]"} strokeWidth={isActive ? 2.5 : 2} />
                  {isAlerts && alertCount > 0 && (
                    <span className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-brand-900">
                      {alertCount}
                    </span>
                  )}
                </span>
                <span className={`text-[11px] font-medium leading-none ${isActive ? "font-bold" : ""}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
