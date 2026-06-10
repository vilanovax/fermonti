import type { LucideIcon } from "lucide-react";
import {
  Home,
  BarChart3,
  UtensilsCrossed,
  Package,
  Wallet,
  Users,
  Heart,
  AlertTriangle,
  Clock,
  Sparkles,
  Mail,
} from "lucide-react";
import type { ViewId } from "../types";
import { VIEW_TITLES } from "./labels";

export interface MenuItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  badge?: "alerts" | "mailbox";
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const MENU_SECTIONS: MenuSection[] = [
  {
    title: "اصلی",
    items: [
      { id: "home", label: "خانه", icon: Home },
      { id: "sales", label: VIEW_TITLES.sales, icon: BarChart3 },
      { id: "finance", label: VIEW_TITLES.finance, icon: Wallet },
    ],
  },
  {
    title: "عملیات روزانه",
    items: [
      { id: "foodcost", label: VIEW_TITLES.foodcost, icon: UtensilsCrossed },
      { id: "inventory", label: VIEW_TITLES.inventory, icon: Package },
      { id: "hr", label: VIEW_TITLES.hr, icon: Users },
      { id: "customer", label: VIEW_TITLES.customer, icon: Heart },
    ],
  },
  {
    title: "پیگیری و هوش",
    items: [
      { id: "alerts", label: VIEW_TITLES.alerts, icon: AlertTriangle, badge: "alerts" },
      { id: "timeline", label: VIEW_TITLES.timeline, icon: Clock },
      { id: "ai", label: VIEW_TITLES.ai, icon: Sparkles },
      { id: "mailbox", label: VIEW_TITLES.mailbox, icon: Mail, badge: "mailbox" },
    ],
  },
];
