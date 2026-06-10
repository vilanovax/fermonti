import { lazy, Suspense, useState, useCallback } from "react";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { InstallPrompt } from "./components/InstallPrompt";
import { VerdictBanner } from "./components/VerdictBanner";
import { HomeView } from "./views/HomeView";
import { alerts } from "./data/sampleData";
import { getMailboxUnreadCount } from "./data/mailboxData";
import { getLayerHintCounts } from "./data/layerHomeData";
import type { DashboardLayer, ViewId } from "./types";
import { VIEW_TITLES } from "./constants/labels";
import { DashboardMenu } from "./components/DashboardMenu";

const SalesView = lazy(() =>
  import("./views/SalesView").then((m) => ({ default: m.SalesView }))
);
const FoodCostView = lazy(() =>
  import("./views/FoodCostView").then((m) => ({ default: m.FoodCostView }))
);
const InventoryView = lazy(() =>
  import("./views/InventoryView").then((m) => ({ default: m.InventoryView }))
);
const FinanceView = lazy(() =>
  import("./views/FinanceView").then((m) => ({ default: m.FinanceView }))
);
const HRView = lazy(() => import("./views/HRView").then((m) => ({ default: m.HRView })));
const CustomerView = lazy(() =>
  import("./views/CustomerView").then((m) => ({ default: m.CustomerView }))
);
const AlertsView = lazy(() =>
  import("./views/AlertsView").then((m) => ({ default: m.AlertsView }))
);
const TimelineView = lazy(() =>
  import("./views/TimelineView").then((m) => ({ default: m.TimelineView }))
);
const AIView = lazy(() => import("./views/AIView").then((m) => ({ default: m.AIView })));
const MailboxView = lazy(() =>
  import("./views/MailboxView").then((m) => ({ default: m.MailboxView }))
);

function PageLoader() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-2 border-brand-800 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [layer, setLayer] = useState<DashboardLayer>("owner");
  const [view, setView] = useState<ViewId>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const alertCount = alerts.filter(
    (a) => a.severity === "critical" || a.severity === "warning"
  ).length;
  const mailboxUnreadCount = getMailboxUnreadCount("today");
  const layerHints = getLayerHintCounts("today");

  const goHome = useCallback(() => setView("home"), []);
  const navigate = useCallback((v: ViewId) => setView(v), []);

  const isHome = view === "home";
  const pageTitle = view !== "home" ? VIEW_TITLES[view] : undefined;

  const renderView = () => {
    const loader = (
      <Suspense fallback={<PageLoader />}>
        {view === "sales" && <SalesView />}
        {view === "foodcost" && <FoodCostView />}
        {view === "inventory" && <InventoryView />}
        {view === "finance" && <FinanceView />}
        {view === "hr" && <HRView />}
        {view === "customer" && <CustomerView />}
        {view === "alerts" && <AlertsView onNavigate={navigate} />}
        {view === "timeline" && <TimelineView />}
        {view === "ai" && <AIView onNavigate={navigate} />}
        {view === "mailbox" && <MailboxView />}
      </Suspense>
    );

    if (view === "home") {
      return (
        <HomeView
          layer={layer}
          onNavigate={navigate}
          onOpenMenu={() => setMenuOpen(true)}
        />
      );
    }
    return loader;
  };

  return (
    <div className="min-h-dvh flex flex-col bg-surface max-w-lg mx-auto relative shadow-2xl">
      <Header
        layer={layer}
        onLayerChange={setLayer}
        onMenuOpen={() => setMenuOpen(true)}
        alertCount={alertCount}
        onAlerts={() => navigate("alerts")}
        mailboxUnreadCount={mailboxUnreadCount}
        onMailbox={() => navigate("mailbox")}
        layerHints={isHome ? layerHints : undefined}
        isHome={isHome}
        pageTitle={pageTitle}
        onBack={goHome}
      />

      <div className="content-sheet flex flex-col flex-1">
        {isHome && (
          <div className="px-4 pt-5 pb-4">
            <VerdictBanner layer={layer} />
          </div>
        )}

        <main
          className={`flex-1 ${isHome ? "pb-nav-content" : "pb-6 pt-2"}`}
        >
          {renderView()}
        </main>
      </div>

      {isHome && (
        <>
          <InstallPrompt />
          <BottomNav active={view} onNavigate={navigate} alertCount={alertCount} />
        </>
      )}

      <DashboardMenu
        open={menuOpen}
        activeView={view}
        alertCount={alertCount}
        mailboxUnreadCount={mailboxUnreadCount}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}
