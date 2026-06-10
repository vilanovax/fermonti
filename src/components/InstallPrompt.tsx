import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("fermenuti-install-dismissed") === "1"
  );
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone || dismissed || !deferred) return null;

  const install = async () => {
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDeferred(null);
  };

  const dismiss = () => {
    localStorage.setItem("fermenuti-install-dismissed", "1");
    setDismissed(true);
    setDeferred(null);
  };

  return (
    <div className="fixed bottom-[calc(var(--nav-total-height)+0.75rem)] inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-lg bg-brand-900 text-white rounded-2xl shadow-xl border border-white/10 p-4 flex gap-3 items-start">
        <div className="w-10 h-10 rounded-xl bg-accent-gold/20 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-accent-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">نصب اپ فرمنوتی</p>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            برای دسترسی سریع‌تر، داشبورد را به صفحه اصلی موبایل اضافه کنید.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={install}
              className="flex-1 py-2.5 rounded-xl bg-accent-gold text-brand-900 text-xs font-bold min-h-[44px]"
            >
              نصب
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-medium min-h-[44px]"
            >
              بعداً
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="text-white/50 p-1"
          aria-label="بستن"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
