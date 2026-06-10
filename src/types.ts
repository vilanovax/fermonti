export type DashboardLayer = "owner" | "operations" | "finance";

export type TimePeriod = "today" | "week" | "month";

export type ViewId =
  | "home"
  | "sales"
  | "foodcost"
  | "inventory"
  | "finance"
  | "hr"
  | "customer"
  | "alerts"
  | "timeline"
  | "ai"
  | "mailbox";

export type AlertSeverity = "critical" | "warning" | "info";

export type AlertCategory =
  | "sales"
  | "inventory"
  | "foodcost"
  | "customer"
  | "hr"
  | "finance"
  | "ops";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  detail: string;
  time: string;
  /** برچسب تأثیر، مثلاً «۳۲٪ زیر میانگین» */
  impact?: string;
  action?: string;
  actionTarget?: ViewId;
  isNew?: boolean;
}

export interface AlertsSummary {
  totalActive: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  resolvedInPeriod: number;
  headline: string;
  lastUpdated: string;
  sparkline: number[];
}

export interface AlertsBundle {
  period: TimePeriod;
  summary: AlertsSummary;
  alerts: Alert[];
  insights: { title: string; detail: string; severity: AlertSeverity }[];
}

export interface ExecutiveKpi {
  id: string;
  label: string;
  value: string;
  unit: string;
  change: string;
  positive: boolean;
  icon: string;
  navigateTo: ViewId;
  highlight?: boolean;
  /** مقایسه با دوره قبل، مثلاً «دیروز: ۴۵.۵ میلیون» */
  compareText: string;
  /** نقاط روند برای اسپارک‌لاین (۷ نقطه) */
  sparkline: number[];
}

export interface SalesSnapshot {
  currentMillions: number;
  previousMillions: number;
  changePercent: number;
  label: string;
  previousPeriodLabel: string;
  sparkline: number[];
}

export interface CriticalMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
  target: string;
  navigateTo: ViewId;
  compareText: string;
}

export interface DashboardPeriodData {
  period: TimePeriod;
  sales: SalesSnapshot;
  kpis: ExecutiveKpi[];
  criticalFive: CriticalMetric[];
}

export interface MenuItem {
  name: string;
  sales: number;
  margin: number;
  trend: "up" | "down" | "flat";
  discountRate?: number;
}

export interface SalesComparisonRow {
  label: string;
  previousMillions: number;
  currentMillions: number;
  changePercent: number;
}

export interface SalesChartPoint {
  label: string;
  sales: number;
}

export interface ZoneSalesRow {
  zone: string;
  lunch: number;
  dinner: number;
  total: number;
  sharePercent: number;
  trend: "up" | "down" | "flat";
}

export interface MenuSalesItem {
  id: string;
  name: string;
  sales: number;
  margin: number;
  trend: "up" | "down" | "flat";
  discountRate?: number;
  issue?: string;
}

export interface CustomerBehaviorMetric {
  key: string;
  label: string;
  value: string;
  compare?: string;
}

export interface SalesAnalysisSummary {
  currentMillions: number;
  changePercent: number;
  label: string;
  compareText: string;
  sparkline: number[];
  headline: string;
  busiestLabel: string;
  ordersCount: number;
  avgCheckMillions: number;
}

export interface SalesAnalysisBundle {
  period: TimePeriod;
  summary: SalesAnalysisSummary;
  comparisons: SalesComparisonRow[];
  chartPoints: SalesChartPoint[];
  chartTitle: string;
  chartSubtitle: string;
  zones: ZoneSalesRow[];
  topItems: MenuSalesItem[];
  attentionItems: MenuSalesItem[];
  customerBehavior: CustomerBehaviorMetric[];
  insights: { title: string; detail: string; severity: AlertSeverity }[];
}

export type StaffRoleType = "waiter" | "host" | "chef";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  roleType: StaffRoleType;
  hireDateShamsi: string;
  avatar: string;
  salesScore: number;
  satisfaction: number;
  delays: number;
  complaints: number;
  upsell: number;
  rating: number;
  ratingTrend?: "up" | "down" | "flat";
}

export interface HRHighlight {
  key: string;
  label: string;
  value: string;
}

export interface HRPerformanceSummary {
  activeStaff: number;
  avgRating: number;
  avgSatisfaction: number;
  laborCostRatio: string;
  laborCostCompare: string;
  totalComplaints: number;
  headline: string;
  lastUpdated: string;
  sparkline: number[];
}

export interface HRBundle {
  period: TimePeriod;
  summary: HRPerformanceSummary;
  highlights: HRHighlight[];
  staff: StaffMember[];
  insights: { title: string; detail: string; severity: AlertSeverity }[];
}

export type InventoryItemStatus = "critical" | "low" | "ok";

/** @deprecated از InventoryStockItem در inventoryData استفاده کنید */
export interface InventoryItem {
  name: string;
  daysLeft: number;
  status: InventoryItemStatus;
  value: number;
  note?: string;
}

export type InventoryCategory =
  | "dairy"
  | "meat"
  | "spice"
  | "beverage"
  | "oil"
  | "produce"
  | "dry";

export interface InventoryStockItem {
  id: string;
  name: string;
  category: InventoryCategory;
  daysLeft: number;
  parDays: number;
  status: InventoryItemStatus;
  valueMillions: number;
  note?: string;
  dailyUsageLabel?: string;
  consumptionTrend?: "up" | "down" | "flat";
}

export interface InventorySummary {
  criticalCount: number;
  shortageCount: number;
  dailyWasteMillions: number;
  totalValueMillions: number;
  turnoverDays: number;
  discrepancyThousands: number;
  expiringSoonCount: number;
  headline: string;
  lastUpdated: string;
  sparkline: number[];
  compareText: string;
}

export interface InventoryBundle {
  period: TimePeriod;
  summary: InventorySummary;
  items: InventoryStockItem[];
  insights: { title: string; detail: string; severity: AlertSeverity }[];
}

export type RecipeStatus = "critical" | "warning" | "ok";

export interface RecipeAnalysis {
  id: string;
  name: string;
  category: string;
  foodCost: number;
  margin: number;
  waste: number;
  menuPrice: number;
  plateCost: number;
  salesWeek: number;
  status: RecipeStatus;
  alert?: string;
  compareText: string;
  sparkline: number[];
  costTrend: "up" | "down" | "flat";
}

export interface FoodCostSummary {
  avgFoodCost: number;
  bevCost: number;
  target: number;
  wasteMillions: number;
  itemsAtRisk: number;
  compareText: string;
  changePercent: number;
  costIncreased: boolean;
  sparkline: number[];
  headline: string;
}

export interface FoodCostBundle {
  period: TimePeriod;
  summary: FoodCostSummary;
  recipes: RecipeAnalysis[];
  insights: { title: string; detail: string; severity: "critical" | "warning" | "info" }[];
}

/** @deprecated use RecipeAnalysis */
export interface RecipeItem {
  name: string;
  foodCost: number;
  margin: number;
  alert?: string;
  waste: number;
}

export interface ComplaintTopic {
  id: string;
  label: string;
  count: number;
  sharePercent: number;
  trend: "up" | "down" | "flat";
}

export interface RecentComplaint {
  id: string;
  time: string;
  topic: string;
  zone: string;
  severity: "high" | "medium" | "low";
  excerpt: string;
}

export interface ZoneRating {
  zone: string;
  satisfaction: number;
  compareText: string;
  reviews: number;
}

export interface CustomerExperienceSummary {
  satisfaction: number;
  satisfactionCompare: string;
  satisfactionTrend: "up" | "down" | "flat";
  nps: number;
  npsCompare: string;
  complaints: number;
  complaintsCompare: string;
  returnRate: string;
  returnCompare: string;
  foodServeMinutes: number;
  foodServeCompare: string;
  tableWaitMinutes: number;
  tableWaitCompare: string;
  targetServeMin: number;
  targetWaitMin: number;
  serveStatus: "good" | "warning" | "critical";
  waitStatus: "good" | "warning" | "critical";
  sparkline: number[];
  headline: string;
  vipToday: number;
  reservedShare: number;
}

export interface CustomerExperienceBundle {
  period: TimePeriod;
  summary: CustomerExperienceSummary;
  complaintTopics: ComplaintTopic[];
  recentComplaints: RecentComplaint[];
  zoneRatings: ZoneRating[];
  insights: { title: string; detail: string; severity: AlertSeverity }[];
}

export type TimelineEventType =
  | "incident"
  | "vip"
  | "ops"
  | "positive"
  | "staff"
  | "marketing";

export interface TimelineEvent {
  id: string;
  time: string;
  type: TimelineEventType;
  title: string;
  detail: string;
  zone?: string;
  durationMinutes?: number;
  impact?: string;
  /** برای نمایش گروه‌بندی در هفته/ماه */
  dayLabel?: string;
}

export interface TimelineSummary {
  totalEvents: number;
  incidentCount: number;
  vipCount: number;
  opsCount: number;
  positiveCount: number;
  downtimeMinutes: number;
  headline: string;
  lastUpdated: string;
  sparkline: number[];
}

export interface TimelineBundle {
  period: TimePeriod;
  summary: TimelineSummary;
  events: TimelineEvent[];
  insights: { title: string; detail: string; severity: AlertSeverity }[];
}

export type AiInsightType =
  | "price"
  | "inventory"
  | "staff"
  | "forecast"
  | "menu"
  | "marketing"
  | "ops";

export type AiInsightPriority = "high" | "medium" | "low";

export interface AiInsight {
  id: string;
  type: AiInsightType;
  title: string;
  detail: string;
  confidence: number;
  priority: AiInsightPriority;
  impact?: string;
  actionLabel?: string;
  actionTarget?: ViewId;
}

export interface AiInsightsSummary {
  totalInsights: number;
  highPriorityCount: number;
  avgConfidence: number;
  potentialImpactLabel: string;
  headline: string;
  lastUpdated: string;
  sparkline: number[];
}

export interface AiInsightsBundle {
  period: TimePeriod;
  summary: AiInsightsSummary;
  insights: AiInsight[];
  dataSources: { label: string; status: "live" | "demo" }[];
}

export type FinanceCommitmentStatus = "ok" | "warning" | "critical";

export type FinanceCommitmentCategory =
  | "checks"
  | "suppliers"
  | "payroll"
  | "rent"
  | "tax"
  | "opex"
  | "other";

export interface FinanceCommitment {
  id: string;
  label: string;
  amountMillions: number;
  status: FinanceCommitmentStatus;
  dueLabel?: string;
  category: FinanceCommitmentCategory;
}

export interface CashFlowPoint {
  label: string;
  inflow: number;
  outflow: number;
}

export interface FinanceAlert {
  severity: AlertSeverity;
  title: string;
  detail: string;
  shortageMillions?: number;
}

export interface FinanceSummary {
  cashOnHandMillions: number;
  cashCompare: string;
  netCashflowMillions: number;
  netCashflowPositive: boolean;
  commitmentsTotalMillions: number;
  runwayDays: number;
  headline: string;
  lastUpdated: string;
  sparkline: number[];
}

export interface FinanceBundle {
  period: TimePeriod;
  summary: FinanceSummary;
  alert: FinanceAlert | null;
  commitments: FinanceCommitment[];
  cashFlow: CashFlowPoint[];
  cashFlowTitle: string;
  cashFlowSubtitle: string;
  insights: { title: string; detail: string; severity: AlertSeverity }[];
}

export type MailboxChannel = "customer" | "staff";

export type MailboxCategory =
  | "complaint"
  | "suggestion"
  | "improvement"
  | "praise"
  | "question";

export type MailboxStatus = "new" | "read" | "in_progress" | "resolved";

export interface MailboxMessage {
  id: string;
  channel: MailboxChannel;
  category: MailboxCategory;
  status: MailboxStatus;
  priority: "high" | "normal" | "low";
  fromName: string;
  fromMeta?: string;
  subject: string;
  body: string;
  time: string;
  zone?: string;
  managerReply?: string;
  replyTime?: string;
  tags?: string[];
}

export interface MailboxSummary {
  total: number;
  unread: number;
  customerCount: number;
  staffCount: number;
  pendingReply: number;
  headline: string;
  lastUpdated: string;
}

export interface MailboxBundle {
  period: TimePeriod;
  summary: MailboxSummary;
  messages: MailboxMessage[];
}
