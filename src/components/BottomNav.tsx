import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BarChart3,
  PiggyBank,
  History,
  PieChart,
  Settings,
} from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Trang chủ", icon: LayoutDashboard },
    { to: "/summary", label: "Ví", icon: BarChart3 },
    { to: "/budgets", label: "Quỹ", icon: PiggyBank },
    { to: "/history", label: "Lịch sử", icon: History },
    { to: "/categories", label: "Phân loại", icon: PieChart },
    { to: "/settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/90 backdrop-blur-md px-1.5 py-1.5">
      <div className="mx-auto flex max-w-md md:max-w-xl items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9.5px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}