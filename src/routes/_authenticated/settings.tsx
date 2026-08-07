import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, User, KeyRound, ShieldAlert, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useSaveProfile } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Cài đặt — Xu" },
      { name: "description", content: "Đổi tên hiển thị, tên đăng nhập, mật khẩu và đăng xuất." },
      { property: "og:title", content: "Cài đặt — Xu" },
      { property: "og:description", content: "Đổi tên hiển thị, tên đăng nhập, mật khẩu và đăng xuất." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const saveProfile = useSaveProfile();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setUsername(profile.username || "");
    }
  }, [profile]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Mật khẩu tối thiểu 6 kí tự");
      return;
    }
    if (password !== confirm) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Đã đổi mật khẩu thành công");
  }

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      
      {/* 1. Header Trang Cài Đặt */}
      <section className="flex items-center justify-between pb-3 border-b border-[#E3E2DC]">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16181D]">
            Cài đặt tài khoản
          </h1>
          <p className="text-xs font-medium text-[#8A8D7A]">
            Quản lý thông tin cá nhân và bảo mật
          </p>
        </div>
      </section>

      {/* 2. Responsive Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Khối 1: Thông tin cá nhân */}
        <section className="rounded-[26px] bg-white border border-[#E7E5DC] p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F3F4F1]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EAE8E0] text-[#16181D]">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#16181D]">Hồ sơ cá nhân</h2>
              <p className="text-xs font-semibold text-[#8A8D7A] font-['JetBrains_Mono'] truncate max-w-[200px] sm:max-w-xs">
                {profile?.email || "Đang tải..."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="dn" className="text-xs font-bold text-[#16181D]">
                Tên hiển thị
              </Label>
              <Input
                id="dn"
                value={displayName}
                maxLength={60}
                placeholder="Nhập tên người dùng"
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] text-xs sm:text-sm font-medium h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="un" className="text-xs font-bold text-[#16181D]">
                Tên đăng nhập (Username)
              </Label>
              <Input
                id="un"
                value={username}
                maxLength={30}
                placeholder="vd: phuneng"
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] font-['JetBrains_Mono'] text-xs sm:text-sm font-medium h-10"
              />
            </div>

            <Button
              onClick={async () => {
                await saveProfile.mutateAsync({
                  display_name: displayName.trim(),
                  username: username.trim(),
                });
                toast.success("Đã lưu thông tin cá nhân");
              }}
              className="w-full rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold text-xs sm:text-sm py-2.5 h-auto transition-all gap-1.5 shadow-sm mt-2"
            >
              <Check className="h-4 w-4" /> Lưu thay đổi
            </Button>
          </div>
        </section>

        {/* Khối 2: Đổi mật khẩu */}
        <section className="rounded-[26px] bg-white border border-[#E7E5DC] p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F3F4F1]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFD7] text-[#B4832B]">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#16181D]">Bảo mật & Mật khẩu</h2>
              <p className="text-xs font-medium text-[#8A8D7A]">
                Cập nhật mật khẩu đăng nhập tài khoản
              </p>
            </div>
          </div>

          <form onSubmit={changePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pw" className="text-xs font-bold text-[#16181D]">
                Mật khẩu mới
              </Label>
              <Input
                id="pw"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] text-xs sm:text-sm font-medium h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pw2" className="text-xs font-bold text-[#16181D]">
                Xác nhận mật khẩu mới
              </Label>
              <Input
                id="pw2"
                type="password"
                placeholder="Nhập lại mật khẩu vừa gõ"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] text-xs sm:text-sm font-medium h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-[#EAE8E0] hover:bg-[#E3E2DC] text-[#16181D] font-bold text-xs sm:text-sm py-2.5 h-auto transition-all mt-2"
            >
              Cập nhật mật khẩu
            </Button>
          </form>

          <div className="flex items-start gap-2 rounded-2xl bg-[#F9F9F8] border border-[#EDECE6] p-3 text-[11px] font-medium text-[#8A8D7A]">
            <ShieldAlert className="h-4 w-4 text-[#D8A13B] shrink-0 mt-0.5" />
            <span>
              Nếu bạn đăng nhập bằng Google, đặt mật khẩu tại đây sẽ giúp bạn đăng nhập bổ sung qua Email + Mật khẩu.
            </span>
          </div>
        </section>

      </div>

      {/* 3. Nút Đăng xuất ở cuối trang */}
      <section className="pt-2">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full rounded-full border-[#FCE4E0] bg-white hover:bg-[#FCE4E0]/50 text-[#EF5B45] font-bold text-xs sm:text-sm py-3 h-auto shadow-sm transition-all justify-center"
        >
          <LogOut className="mr-2 h-4 w-4" /> Đăng xuất khỏi tài khoản
        </Button>
      </section>

    </div>
  );
}