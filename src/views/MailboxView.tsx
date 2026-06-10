import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Heart,
  Inbox,
  Lightbulb,
  MessageSquareReply,
  Send,
  Sparkles,
  ThumbsUp,
  Users,
  HelpCircle,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { PeriodFilter } from "../components/PeriodFilter";
import { useMailbox } from "../hooks/useMailbox";
import { Accordion, Card, PageShell, SectionTitle, StatusPill } from "../components/ui";
import type {
  MailboxCategory,
  MailboxChannel,
  MailboxMessage,
  MailboxStatus,
  TimePeriod,
} from "../types";

type ChannelFilter = "all" | MailboxChannel;
type CategoryFilter = "all" | MailboxCategory;
type StatusFilter = "all" | "active" | "resolved";

const categoryMeta: Record<
  MailboxCategory,
  { label: string; icon: LucideIcon; pill: "critical" | "warning" | "ok" | "info"; bar: string }
> = {
  complaint: { label: "انتقاد", icon: AlertCircle, pill: "critical", bar: "bg-red-500" },
  suggestion: { label: "پیشنهاد", icon: Lightbulb, pill: "info", bar: "bg-blue-500" },
  improvement: { label: "بهبود", icon: Sparkles, pill: "warning", bar: "bg-amber-500" },
  praise: { label: "تشکر", icon: ThumbsUp, pill: "ok", bar: "bg-emerald-500" },
  question: { label: "سوال", icon: HelpCircle, pill: "info", bar: "bg-slate-400" },
};

const statusLabel: Record<MailboxStatus, string> = {
  new: "جدید",
  read: "خوانده",
  in_progress: "در پیگیری",
  resolved: "بسته",
};

export function MailboxView() {
  const [period, setPeriod] = useState<TimePeriod>("today");
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, loading } = useMailbox(period);

  const stats = useMemo(() => {
    if (!data) return null;
    const msgs = data.messages;
    const active = msgs.filter((m) => m.status !== "resolved");
    return {
      active: active.length,
      resolved: msgs.length - active.length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.messages.filter((m) => {
      if (channel !== "all" && m.channel !== channel) return false;
      if (category !== "all" && m.category !== category) return false;
      if (statusFilter === "active" && m.status === "resolved") return false;
      if (statusFilter === "resolved" && m.status !== "resolved") return false;
      return true;
    });
  }, [data, channel, category, statusFilter]);

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (statusFilter === "active") parts.push("فعال");
    else if (statusFilter === "resolved") parts.push("بسته");
    if (channel === "customer") parts.push("مشتری");
    else if (channel === "staff") parts.push("پرسنل");
    if (category !== "all") parts.push(categoryMeta[category].label);
    return parts.length ? parts.join(" · ") : "همه پیام‌ها";
  }, [statusFilter, channel, category]);

  const selected = useMemo(
    () => data?.messages.find((m) => m.id === selectedId) ?? null,
    [data, selectedId]
  );

  if (loading || !data) {
    return (
      <PageShell>
        <PeriodFilter value={period} onChange={setPeriod} disabled />
        <div className="space-y-3 animate-pulse">
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-12 rounded-xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
        </div>
      </PageShell>
    );
  }

  if (selected) {
    return (
      <PageShell>
        <MessageDetail message={selected} onBack={() => setSelectedId(null)} />
      </PageShell>
    );
  }

  const { summary } = data;

  return (
    <PageShell>
      <PeriodFilter value={period} onChange={setPeriod} />

      <Card className="mb-3 p-4 bg-gradient-to-br from-slate-800 via-brand-900 to-indigo-900 text-white border-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-white/70">صندوق پستی</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-3xl font-extrabold leading-none">
                {summary.total.toLocaleString("fa-IR")}
              </p>
              <span className="text-sm text-white/75">پیام</span>
              {summary.unread > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500">
                  {summary.unread.toLocaleString("fa-IR")} جدید
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/65 mt-2 leading-relaxed line-clamp-2">
              {summary.headline}
            </p>
          </div>
          <Inbox className="w-8 h-8 text-white/40 shrink-0" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
          <span className="px-2 py-1 rounded-lg bg-white/10">
            <Heart className="w-3 h-3 inline ml-1 opacity-80" />
            مشتری {summary.customerCount.toLocaleString("fa-IR")}
          </span>
          <span className="px-2 py-1 rounded-lg bg-white/10">
            <Users className="w-3 h-3 inline ml-1 opacity-80" />
            پرسنل {summary.staffCount.toLocaleString("fa-IR")}
          </span>
          <span className="px-2 py-1 rounded-lg bg-amber-500/25 text-amber-100">
            بدون پاسخ {summary.pendingReply.toLocaleString("fa-IR")}
          </span>
        </div>
      </Card>

      <Accordion
        title="فیلترها"
        subtitle={filterSummary}
        defaultOpen={false}
        className="mb-3"
      >
        <div className="space-y-3 pt-1">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {(
              [
                { id: "active" as const, label: "فعال" },
                { id: "resolved" as const, label: "بسته" },
                { id: "all" as const, label: "همه" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold min-h-[40px] ${
                  statusFilter === tab.id
                    ? "bg-brand-800 text-white shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            <FilterChip
              active={channel === "all"}
              onClick={() => setChannel("all")}
              label="همه فرستنده"
            />
            <FilterChip
              active={channel === "customer"}
              onClick={() => setChannel("customer")}
              label="مشتری"
              icon={Heart}
            />
            <FilterChip
              active={channel === "staff"}
              onClick={() => setChannel("staff")}
              label="پرسنل"
              icon={Users}
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            <FilterChip
              active={category === "all"}
              onClick={() => setCategory("all")}
              label="همه موضوع"
            />
            {(Object.keys(categoryMeta) as MailboxCategory[]).map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
                label={categoryMeta[c].label}
              />
            ))}
          </div>
        </div>
      </Accordion>

      <SectionTitle
        title="پیام‌ها"
        subtitle={
          stats
            ? `${filtered.length.toLocaleString("fa-IR")} مورد نمایش — ${stats.active.toLocaleString("fa-IR")} فعال از ${summary.total.toLocaleString("fa-IR")} · ${summary.lastUpdated}`
            : undefined
        }
        action={
          (channel !== "all" || category !== "all" || statusFilter !== "active") && (
            <button
              type="button"
              onClick={() => {
                setChannel("all");
                setCategory("all");
                setStatusFilter("active");
              }}
              className="text-[11px] font-semibold text-brand-700 shrink-0"
            >
              پاک کردن فیلتر
            </button>
          )
        }
      />

      {filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <Filter className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-brand-900">پیامی با این فیلتر نیست</p>
          <p className="text-xs text-slate-500 mt-1">فیلترها را عوض کنید یا «پاک کردن فیلتر»</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <MessageRow key={msg.id} message={msg} onOpen={() => setSelectedId(msg.id)} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0 border transition-colors ${
        active
          ? "bg-brand-800 text-white border-brand-800"
          : "bg-white text-slate-600 border-slate-200"
      }`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </button>
  );
}

function MessageRow({
  message,
  onOpen,
}: {
  message: MailboxMessage;
  onOpen: () => void;
}) {
  const cat = categoryMeta[message.category];
  const CatIcon = cat.icon;
  const ChannelIcon = message.channel === "customer" ? Heart : Users;
  const needsReply = !message.managerReply && message.status !== "resolved";

  return (
    <button type="button" onClick={onOpen} className="w-full text-right group">
      <Card
        className={`p-0 overflow-hidden flex active:scale-[0.99] transition-transform ${
          message.status === "new"
            ? "ring-2 ring-violet-200 border-violet-100"
            : ""
        }`}
      >
        <div className={`w-1 shrink-0 ${cat.bar}`} />
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                message.channel === "customer" ? "bg-rose-50" : "bg-violet-50"
              }`}
            >
              <ChannelIcon
                className={`w-4 h-4 ${
                  message.channel === "customer" ? "text-rose-600" : "text-violet-700"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <StatusPill label={cat.label} variant={cat.pill} />
                {message.status === "new" && (
                  <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
                    جدید
                  </span>
                )}
                {message.priority === "high" && message.status !== "resolved" && (
                  <span className="text-[10px] font-bold text-red-600">فوری</span>
                )}
                <span className="text-[10px] text-slate-400 mr-auto">{message.time}</span>
              </div>
              <p className="font-bold text-sm text-brand-900 mt-1 leading-snug">{message.subject}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{message.body}</p>
              <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                {message.fromName}
                {message.fromMeta ? ` · ${message.fromMeta}` : ""}
              </p>
            </div>
            <ChevronLeft className="w-5 h-5 text-slate-300 shrink-0 mt-2 group-active:text-brand-700" />
          </div>

          <div className="flex gap-2 mt-2.5 pt-2 border-t border-slate-100">
            {needsReply ? (
              <span className="text-[10px] font-semibold text-amber-700 flex items-center gap-1">
                <MessageSquareReply className="w-3.5 h-3.5" />
                نیاز به پاسخ
              </span>
            ) : message.managerReply ? (
              <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                <MessageSquareReply className="w-3.5 h-3.5" />
                پاسخ داده شده
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">{statusLabel[message.status]}</span>
            )}
            <CatIcon className="w-3.5 h-3.5 text-slate-300 mr-auto" />
          </div>
        </div>
      </Card>
    </button>
  );
}

function MessageDetail({
  message,
  onBack,
}: {
  message: MailboxMessage;
  onBack: () => void;
}) {
  const cat = categoryMeta[message.category];

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-brand-800 mb-3 min-h-[44px]"
      >
        <ChevronRight className="w-5 h-5" />
        بازگشت به لیست
      </button>

      <Card className="p-4 mb-3 overflow-hidden">
        <div className={`h-1 -mx-4 -mt-4 mb-3 ${cat.bar}`} />
        <div className="flex flex-wrap gap-1.5 mb-2">
          <StatusPill
            label={message.channel === "customer" ? "مشتری" : "پرسنل"}
            variant="info"
          />
          <StatusPill label={cat.label} variant={cat.pill} />
          <StatusPill
            label={statusLabel[message.status]}
            variant={
              message.status === "new"
                ? "critical"
                : message.status === "in_progress"
                  ? "warning"
                  : message.status === "resolved"
                    ? "ok"
                    : "info"
            }
          />
        </div>
        <h2 className="text-lg font-bold text-brand-900 leading-snug">{message.subject}</h2>
        <p className="text-xs text-slate-500 mt-2">
          {message.fromName}
          {message.fromMeta && ` — ${message.fromMeta}`}
          {message.zone && ` · ${message.zone}`}
          <span className="text-slate-400"> · {message.time}</span>
        </p>
      </Card>

      <Card className="p-4 mb-3">
        <p className="text-sm text-slate-700 leading-relaxed">{message.body}</p>
        {message.tags && message.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {message.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </Card>

      {message.managerReply ? (
        <Card className="p-4 mb-3 border-l-4 border-l-brand-600 bg-brand-50/50">
          <p className="text-xs font-bold text-brand-800 mb-1.5">پاسخ مدیریت</p>
          <p className="text-sm text-slate-700 leading-relaxed">{message.managerReply}</p>
          {message.replyTime && (
            <p className="text-[10px] text-slate-400 mt-2">{message.replyTime}</p>
          )}
        </Card>
      ) : (
        <Card className="p-4 mb-3 border border-dashed border-slate-200 bg-slate-50/50">
          <label className="text-xs font-semibold text-slate-600 block mb-2">
            پاسخ به {message.channel === "customer" ? "مشتری" : "پرسنل"} (دمو)
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm min-h-[96px] resize-none focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="پاسخ خود را بنویسید…"
            readOnly
          />
          <button
            type="button"
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-800/50 text-white text-sm font-semibold min-h-[44px] cursor-not-allowed"
            disabled
          >
            <Send className="w-4 h-4" />
            ارسال در نسخه متصل به سرور
          </button>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-2 sticky bottom-2">
        <button
          type="button"
          className="py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 min-h-[48px] shadow-sm"
        >
          در حال پیگیری
        </button>
        <button
          type="button"
          className="py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold min-h-[48px] shadow-sm"
        >
          بستن پرونده
        </button>
      </div>
    </>
  );
}
