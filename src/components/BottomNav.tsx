import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, Clock, PiggyBank, FolderTree, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Trang chủ", icon: LayoutGrid },
  { to: "/summary", label: "Tóm tắt", icon: Clock },
  { to: "/budgets", label: "Quỹ", icon: PiggyBank }, // Tab Quỹ ở vị trí giữa
  { to: "/categories", label: "Phân loại", icon: FolderTree },
  { to: "/settings", label: "Cài đặt", icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/90 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md border border-[#E7E5DC]">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-1 rounded-full px-3.5 py-2 text-[11px] font-bold transition-all",
              isActive
                ? "bg-[#EAE9E3] text-[#16181D]"
                : "text-[#8A8D7A] hover:text-[#16181D]"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}