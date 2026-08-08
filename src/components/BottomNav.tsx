import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, PiggyBank, History, PieChart, Settings } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Trang chủ", icon: LayoutDashboard },
    { to: "/budgets", label: "Quỹ", icon: PiggyBank },
    // 🚀 Thêm Tab Lịch sử tại đây
    { to: "/history", label: "Lịch sử", icon: History },
    { to: "/categories", label: "Phân loại", icon: PieChart },
    { to: "/settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-[#E7E5DC] px-2 py-2">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-all ${
                isActive
                  ? "bg-[#16181D] text-white shadow-sm"
                  : "text-[#8A8D7A] hover:text-[#16181D]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}