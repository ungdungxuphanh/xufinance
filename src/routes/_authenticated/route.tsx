import { useEffect } from "react";
import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { App as CapApp } from "@capacitor/app";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🎨 1. Tải màu đã lưu trong localStorage và áp dụng cho toàn bộ App khi truy cập
    const savedTheme = localStorage.getItem("app_theme_color");
    if (savedTheme) {
      document.documentElement.style.setProperty("--primary", savedTheme);
      document.documentElement.style.setProperty("--ring", savedTheme);
      document.documentElement.style.setProperty("--sidebar-primary", savedTheme);
      document.documentElement.style.setProperty("--chart-1", savedTheme);
    }

    void supabase.rpc("bootstrap_user", {});

    // 🔗 2. Lắng nghe sự kiện quay lại app từ Safari (OAuth Deep Link)
    const handleDeepLink = async () => {
      CapApp.addListener("appUrlOpen", async (event) => {
        if (event.url && event.url.includes("xufinance")) {
          const formattedUrl = event.url.replace("#", "?");
          const urlObj = new URL(formattedUrl);
          
          const accessToken = urlObj.searchParams.get("access_token");
          const refreshToken = urlObj.searchParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error) {
              navigate({ to: "/dashboard", replace: true });
            }
          }
        }
      });
    };

    handleDeepLink();

    return () => {
      CapApp.removeAllListeners();
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md">
        <span className="font-display text-lg font-black tracking-tight text-foreground">
          Xu
        </span>
      </header>

      {/* Nội dung các trang */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      {/* Thanh Bottom Navigation */}
      <BottomNav />
    </div>
  );
}