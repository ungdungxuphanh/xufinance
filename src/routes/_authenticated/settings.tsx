import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  LogOut,
  User,
  KeyRound,
  ShieldAlert,
  Check,
  Settings,
  Mail,
  Loader2,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useSaveProfile } from "@/lib/db";

// Bảng màu chủ đạo tùy chọn cho giao diện
const THEME_COLORS = [
  { name: "Xanh Mint", value: "#109C7C" },
  { name: "Hồng ngọt", value: "#EC4899" },
  { name: "Đỏ Coral", value: "#EF5B45" },
  { name: "Xanh biển", value: "#3B82F6" },
  { name: "Tím mộng mơ", value: "#8B5CF6" },
  { name: "Cam hổ phách", value: "#F59E0B" },
];

// Hàm bổ trợ áp dụng biến CSS cho toàn bộ ứng dụng
function applyAppTheme(color: string) {
  const root = document.documentElement;
  root.style.setProperty("--primary", color);
  root.style.setProperty("--ring", color);
  root.style.setProperty("--sidebar-primary", color);
  root.style.setProperty("--chart-1", color);
}

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Cài đặt — Xu" },
      { name: "description", content: "Đổi tên hiển thị, tên đăng nhập, màu giao diện, mật khẩu và đăng xuất." },
      { property: "og:title", content: "Cài đặt — Xu" },
      { property: "og:description", content: "Đổi tên hiển thị, tên đăng nhập, màu giao diện, mật khẩu và đăng xuất." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const saveProfile = useSaveProfile();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // State quản lý màu chủ đạo giao diện
  const [themeColor, setThemeColor] = useState("#109C7C");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setUsername(profile.username || "");
    }

    // Đọc màu giao diện đã lưu từ localStorage và áp dụng toàn hệ thống
    const savedTheme = localStorage.getItem("app_theme_color");
    if (savedTheme) {
      setThemeColor(savedTheme);
      applyAppTheme(savedTheme);
    }
  }, [profile]);

  // Hàm chọn & lưu màu giao diện cho toàn bộ hệ thống
  const handleSelectThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem("app_theme_color", color);
    
    // Cập nhật ngay lập tức các biến CSS toàn cục
    applyAppTheme(color);
    
    toast.success("Đã thay đổi màu giao diện toàn ứng dụng!");
  };

  async function handleSignOut() {
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      navigate({ to: "/auth", replace: true });
    } catch (err) {
      toast.error((err as Error).message);
    }
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

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsUpdatingPassword(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Đã đổi mật khẩu thành công");
  }

  // Tên viết tắt hiển thị ở Avatar
  const avatarInitial = (displayName || profile?.email || "U").slice(0, 1).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F8F9FA] px-3.5 sm:px-6 py-5 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      
      {/* 1. Header Trang Cài Đặt */}
      <section className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
        <div>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <Settings className="h-5 w-5" />
            </div>
            Cài đặt tài khoản
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            Quản lý thông tin cá nhân, màu sắc giao diện và bảo mật
          </p>
        </div>
      </section>

      {/* 2. Responsive Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Khối 1: Thông tin cá nhân */}
        <section className="rounded-[22px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div 
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white text-lg font-black shadow-sm transition-all bg-primary"
            >
              {avatarInitial}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-slate-900">Hồ sơ cá nhân</h2>
              <div className="inline-flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-full max-w-full">
                <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate font-['JetBrains_Mono']">{profile?.email || "Đang tải..."}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="dn" className="text-xs font-bold text-slate-900">
                Tên hiển thị
              </Label>
              <Input
                id="dn"
                value={displayName}
                maxLength={60}
                placeholder="Nhập tên người dùng"
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-xl border-slate-200 bg-[#F8F9FA] focus-visible:ring-primary text-xs sm:text-sm font-medium h-10 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="un" className="text-xs font-bold text-slate-900">
                Tên đăng nhập (Username)
              </Label>
              <Input
                id="un"
                value={username}
                maxLength={30}
                placeholder="vd: phuneng"
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl border-slate-200 bg-[#F8F9FA] focus-visible:ring-primary font-['JetBrains_Mono'] text-xs sm:text-sm font-medium h-10 text-slate-900"
              />
            </div>

            <Button
              disabled={saveProfile.isPending || isLoadingProfile}
              onClick={async () => {
                try {
                  await saveProfile.mutateAsync({
                    display_name: displayName.trim(),
                    username: username.trim(),
                  });
                  toast.success("Đã lưu thông tin cá nhân");
                } catch (e) {
                  toast.error((e as Error).message);
                }
              }}
              className="w-full rounded-full bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs sm:text-sm py-2.5 h-auto transition-all gap-2 shadow-sm mt-2"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Khối 2: Tùy chỉnh màu sắc giao diện */}
        <section className="rounded-[22px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <span 
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-all"
            >
              <Palette className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Màu sắc giao diện</h2>
              <p className="text-xs font-medium text-slate-500">
                Chọn màu chủ đạo hiển thị cho toàn hệ thống
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-900">Tông màu gợi ý</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEME_COLORS.map((item) => {
                const isSelected = themeColor === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleSelectThemeColor(item.value)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 shadow-sm"
                        : "border-slate-200/80 bg-[#F8F9FA] text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-lg flex items-center justify-center shrink-0 shadow-xs text-white"
                      style={{ backgroundColor: item.value }}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chọn màu tùy chọn bất kỳ với HTML5 Color Input */}
          <div className="pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] border border-slate-200/80">
              <span className="text-xs font-bold text-slate-700">Tự chọn màu tùy ý khác:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">{themeColor}</span>
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => handleSelectThemeColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent"
                  title="Chọn màu khác"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Khối 3: Đổi mật khẩu */}
        <section className="rounded-[22px] bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Bảo mật & Mật khẩu</h2>
              <p className="text-xs font-medium text-slate-500">
                Cập nhật mật khẩu đăng nhập tài khoản
              </p>
            </div>
          </div>

          <form onSubmit={changePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pw" className="text-xs font-bold text-slate-900">
                Mật khẩu mới
              </Label>
              <Input
                id="pw"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-slate-200 bg-[#F8F9FA] focus-visible:ring-primary text-xs sm:text-sm font-medium h-10 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pw2" className="text-xs font-bold text-slate-900">
                Xác nhận mật khẩu mới
              </Label>
              <Input
                id="pw2"
                type="password"
                placeholder="Nhập lại mật khẩu vừa gõ"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-xl border-slate-200 bg-[#F8F9FA] focus-visible:ring-primary text-xs sm:text-sm font-medium h-10 text-slate-900"
              />
            </div>

            <Button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 h-auto transition-all mt-2"
            >
              {isUpdatingPassword ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang cập nhật...
                </span>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </form>

          <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 p-3 text-xs font-medium text-amber-900/80">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Nếu bạn đăng nhập bằng Google, việc tạo mật khẩu tại đây sẽ giúp bạn đăng nhập bổ sung qua Email + Mật khẩu khi cần.
            </span>
          </div>
        </section>

      </div>

      {/* 3. Nút Đăng xuất ở cuối trang */}
      <section className="pt-2">
        <div className="rounded-[22px] bg-white border border-slate-200/80 p-4 shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Đăng xuất khỏi thiết bị này</p>
            <p className="text-xs font-medium text-slate-500">Xóa phiên làm việc hiện tại và quay về màn hình đăng nhập</p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="shrink-0 rounded-full border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-[#EF5B45] font-bold text-xs sm:text-sm px-5 py-2.5 h-auto shadow-none transition-all"
          >
            <LogOut className="mr-1.5 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </section>

    </div>
  );
}