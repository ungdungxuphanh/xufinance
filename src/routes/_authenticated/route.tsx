import { useEffect } from "react";
import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { App as CapApp } from "@capacitor/app"; // 👈 Thêm dòng này

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
  const navigate = useNavigate(); // 👈 Khởi tạo điều hướng

  useEffect(() => {
    void supabase.rpc("bootstrap_user", {});

    // 👇 Lắng nghe sự kiện người dùng bấm quay lại app từ Safari (OAuth Deep Link)
    const handleDeepLink = async () => {
      CapApp.addListener("appUrlOpen", async (event) => {
        // Kiểm tra nếu URL trả về chứa scheme của app (xufinance)
        if (event.url && event.url.includes("xufinance")) {
          // Xử lý đổi dấu # thành ? để dễ dàng đọc params bằng URLSearchParams
          const formattedUrl = event.url.replace("#", "?");
          const urlObj = new URL(formattedUrl);
          
          const accessToken = urlObj.searchParams.get("access_token");
          const refreshToken = urlObj.searchParams.get("refresh_token");

          if (accessToken && refreshToken) {
            // Thiết lập session trực tiếp cho Supabase client trên App
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error) {
              // Điều hướng thẳng về trang chủ/dashboard của app
              navigate({ to: "/dashboard", replace: true });
            }
          }
        }
      });
    };

    handleDeepLink();

    // Cleanup listener khi component unmount
    return () => {
      CapApp.removeAllListeners();
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full bg-background pb-28">
      {/* Header gọn nhẹ hơn (chỉ giữ hiệu ứng mờ nếu cần) */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md">
        <span className="font-display text-lg font-black tracking-tight text-foreground">
          Xu
        </span>
      </header>

      {/* Nội dung các trang */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      {/* Thanh Bottom Navigation iOS dạng nổi */}
      <BottomNav />
    </div>
  );
}