import {
  ArrowLeftRight,
  CalendarCheck,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";
import { APP_ROUTES } from "@/lib/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Matches every route below this path (e.g. /users/12). */
  exact?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: APP_ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "Users",
        href: APP_ROUTES.USERS,
        icon: Users,
      },
      {
        label: "Transactions",
        href: APP_ROUTES.TRANSACTIONS,
        icon: ArrowLeftRight,
      },
      {
        label: "Bookings",
        href: APP_ROUTES.BOOKINGS,
        icon: CalendarCheck,
      },
    ],
  },
];
