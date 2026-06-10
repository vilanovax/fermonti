import { useEffect } from "react";
import { ChevronLeft, X } from "lucide-react";
import { MENU_SECTIONS } from "../constants/menu";
import { RESTAURANT } from "../data/sampleData";
import type { ViewId } from "../types";
import { Logo } from "./Logo";

interface DashboardMenuProps {
  open: boolean;
  activeView: ViewId;
  alertCount: number;
  mailboxUnreadCount: number;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
}

export function DashboardMenu({
  open,
  activeView,
  alertCount,
  mailboxUnreadCount,
  onClose,
  onNavigate,
}: DashboardMenuProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const badgeFor = (kind: "alerts" | "mailbox") => {
    if (kind === "alerts") return alertCount > 0 ? alertCount : null;
    return mailboxUnreadCount > 0 ? mailboxUnreadCount : null;
  };

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-950/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="بستن منو"
        tabIndex={open ? 0 : -1}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="منوی داشبورد"
        className={`absolute top-0 bottom-0 right-0 w-[min(300px,88vw)] bg-white shadow-2xl flex flex-col safe-top safe-bottom transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="shrink-0 px-4 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Logo size="sm" className="ring-1 ring-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-brand-900 text-[15px] leading-tight">
                {RESTAURANT.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{RESTAURANT.location}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center active:scale-95 shrink-0"
              aria-label="بستن منو"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              <p className="text-[10px] font-bold text-slate-400 tracking-wide px-2 mb-1.5">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  const badge = item.badge ? badgeFor(item.badge) : null;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(item.id);
                          onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-right min-h-[48px] transition-colors active:scale-[0.99] ${
                          isActive
                            ? "bg-brand-800 text-white shadow-md"
                            : "text-brand-900 hover:bg-slate-50"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive ? "bg-white/15" : "bg-slate-100 text-brand-800"
                          }`}
                        >
                          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                        </span>
                        <span className="flex-1 text-sm font-semibold leading-tight">
                          {item.label}
                        </span>
                        {badge != null && (
                          <span
                            className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-white text-brand-800"
                                : item.badge === "alerts"
                                  ? "bg-red-500 text-white"
                                  : "bg-violet-500 text-white"
                            }`}
                          >
                            {badge > 9 ? "۹+" : badge.toLocaleString("fa-IR")}
                          </span>
                        )}
                        <ChevronLeft
                          className={`w-4 h-4 shrink-0 opacity-40 ${isActive ? "text-white" : "text-slate-400"}`}
                          aria-hidden
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <footer className="shrink-0 px-4 py-3 border-t border-slate-100 bg-slate-50/80">
          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            حالت دمو — داده شبیه‌سازی‌شده
          </p>
          <p className="text-[10px] text-slate-400 text-center mt-1">
            {RESTAURANT.tagline} · © ۱۴۰۵
          </p>
        </footer>
      </aside>
    </div>
  );
}
