import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Calculator, PieChart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Xu — Quản lí tiền bạc đơn giản, nhiều màu sắc" },
      {
        name: "description",
        content:
          "Xu giúp bạn ghi thu nhập, chi tiêu, quản lí nhiều ví và xem báo cáo theo ngày, tháng, năm — giao diện tối giản, trẻ trung.",
      },
      { property: "og:title", content: "Xu — Quản lí tiền bạc đơn giản" },
      {
        property: "og:description",
        content: "Ghi thu chi kèm máy tính, tự tạo phân loại và ví, xem lịch chi tiêu theo tháng.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Calculator, title: "Máy tính tích hợp", desc: "Cộng trừ nhanh ngay khi nhập tiền." },
  { icon: CalendarDays, title: "Lịch thu chi", desc: "Xem theo ngày hoặc cả tháng trên mọi thiết bị." },
  { icon: Wallet, title: "Nhiều ví", desc: "Tiền mặt, Momo, ngân hàng — tách bạch rõ ràng." },
  { icon: PieChart, title: "Tóm tắt", desc: "Biết tiền đi đâu chỉ trong một cái nhìn." },
];

function Landing() {
  return (
    <main className="mesh-bg min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-20">
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Quản lí tiền bạc cá nhân
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] sm:text-7xl">
            Tiền của bạn,
            <br />
            <span className="text-primary">gọn gàng mỗi ngày.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Ghi thu nhập và chi tiêu trong vài giây. Tự tạo phân loại với icon và màu riêng, quản lí
            nhiều ví, xem lại theo ngày · tháng · năm.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg" className="font-display">
              <Link to="/auth">
                Bắt đầu miễn phí <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="surface p-5">
              <f.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-base font-semibold">{f.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
