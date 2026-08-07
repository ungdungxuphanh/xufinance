import { useEffect } from "react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";

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
  useEffect(() => {
    void supabase.rpc("bootstrap_user", {});
  }, []);

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