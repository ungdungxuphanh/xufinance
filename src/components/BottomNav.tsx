import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  History,
  PieChart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Trang chủ", icon: LayoutDashboard },
  { to: "/wallets", label: "Ví", icon: Wallet },
  { to: "/budgets", label: "Quỹ", icon: PiggyBank },
  { to: "/history", label: "Lịch sử", icon: History },
  { to: "/categories", label: "Phân loại", icon: PieChart },
  { to: "/settings", label: "Cài đặt", icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-6 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-md md:max-w-xl rounded-full border border-slate-200/80 bg-white/90 p-2 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-full transition-all duration-200 active:scale-95",
                  isActive
                    ? "bg-primary text-primary-foreground px-3.5 py-2 shadow-sm"
                    : "px-2.5 py-1.5 text-slate-500 hover:text-slate-900"
                )}
              >
                <Icon className={cn("transition-transform", isActive ? "h-5 w-5 stroke-[2.5]" : "h-5 w-5 stroke-[1.8]")} />
                <span className={cn("text-[11px] font-bold mt-0.5 tracking-tight", isActive ? "block" : "hidden sm:block")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}