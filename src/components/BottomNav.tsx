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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-7 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <nav className="pointer-events-auto mx-auto max-w-lg rounded-full border border-slate-200/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-lg">
        <div className="grid grid-cols-6 items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 active:scale-90 min-w-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
                )}
              >
                <Icon
                  className={cn(
                    "transition-all duration-200 shrink-0",
                    isActive ? "h-5 w-5 stroke-[2.5]" : "h-5 w-5 stroke-[1.8]"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-extrabold mt-0.5 truncate max-w-full text-center leading-none tracking-tight",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
                >
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