import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App as CapApp } from '@capacitor/app';

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Đăng nhập — Xu" },
      { name: "description", content: "Đăng nhập hoặc tạo tài khoản Xu để quản lí thu chi của bạn." },
      { property: "og:title", content: "Đăng nhập — Xu" },
      { property: "og:description", content: "Đăng nhập bằng Google hoặc email/username để bắt đầu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  
  // 💡 State lưu Username hoặc Email
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra session hiện tại và lắng nghe Deep Link trả về từ Safari
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });

    // Lắng nghe sự kiện mở app từ Deep Link (xufinance://google-auth)
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
              await Browser.close(); // Đóng cửa sổ Safari ngay lập tức
              navigate({ to: "/dashboard", replace: true }); // Chuyển vào Dashboard
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: identifier,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Kiểm tra email để xác nhận tài khoản nhé!");
          return;
        }
        navigate({ to: "/dashboard", replace: true });
      } else {
        // 🚀 Xử lý Đăng nhập bằng Email HOẶC Username
        let loginEmail = identifier.trim();

        // Nếu người dùng nhập vào KHÔNG có '@' -> Xem như Username và tra cứu Email
       // Nếu người dùng nhập vào KHÔNG có '@' -> Xem như Username và tra cứu Email
        if (!loginEmail.includes("@")) {
          const { data: profileData, error: profileErr } = await supabase
            .from("profiles")
            .select("*") // 👈 Sửa .select("email") thành .select("*") hoặc cast type bên dưới
            .eq("username", loginEmail.toLowerCase())
            .maybeSingle();

          // Ép kiểu (profileData as any) để TypeScript không báo lỗi
          const userEmail = (profileData as any)?.email;

          if (profileErr || !userEmail) {
            throw new Error("Không tìm thấy Tên đăng nhập (Username) này!");
          }
          loginEmail = userEmail;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error((err as Error).message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    try {
      const isNative = Capacitor.isNativePlatform();
      
      const redirectUrl = isNative 
        ? "xufinance://google-auth" 
        : `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: isNative, 
        },
      });

      if (error) throw error;

      if (isNative && data?.url) {
        await Browser.open({ url: data.url });
      }
    } catch (err) {
      toast.error((err as Error).message || "Không đăng nhập được bằng Google");
    }
  }

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl font-bold">Xu</span>
        </Link>

        <div className="surface p-6">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-xl py-2 font-display text-sm font-semibold transition-all",
                  mode === m ? "bg-card shadow-sm" : "text-muted-foreground",
                )}
              >
                {m === "signin" ? "Đăng nhập" : "Đăng kí"}
              </button>
            ))}
          </div>

          <Button variant="outline" className="w-full" onClick={google} type="button">
            <GoogleMark />
            Tiếp tục với Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> hoặc <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Tên hiển thị</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="identifier">
                {mode === "signin" ? "Email hoặc Username" : "Email"}
              </Label>
              <Input
                id="identifier"
                type={mode === "signin" ? "text" : "email"}
                required
                placeholder={mode === "signin" ? "vdu: phuneng hoặc email@gmail.com" : "email@gmail.com"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full font-display" disabled={loading}>
              {loading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="mr-1 h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.6c-.1 1.1-.9 2.8-2.5 3.9l3.8 3c2.3-2.1 3.6-5.2 3.6-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5l-4 3.1C3.2 21.3 7.3 24 12 24Z" />
      <path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-4-3.1C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4 3.1C6.1 6.8 8.8 4.8 12 4.8Z" />
    </svg>
  );
}