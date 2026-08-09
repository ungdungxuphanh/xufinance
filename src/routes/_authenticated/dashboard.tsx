import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  addMonths,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  addDays,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Coins,
  TrendingDown,
  Scale,
  Plus,
  Wallet,
  PiggyBank,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@/lib/icons";
import { formatVND, VI_WEEKDAYS, ymd } from "@/lib/money";
import { TransactionDialog } from "@/components/TransactionDialog";
import { supabase } from "@/integrations/supabase/client";
import {
  useCategories,
  useDeleteTransaction,
  useTransactions,
  useAllTransactions,
  useWallets,
  type Transaction,
} from "@/lib/db";

interface Fund {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Trang chủ — Xu" },
      { name: "description", content: "Xem thu chi theo ngày hoặc theo lịch tháng." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState<"day" | "month">("month");
  const [cursor, setCursor] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const [funds, setFunds] = useState<Fund[]>([]);

  const fetchFunds = async () => {
    try {
const { data, error } = await supabase.from("budgets" as any).select("*");      if (!error && data && data.length > 0) {
        const mapped = data.map((b: any) => ({
          id: b.id,
          name: b.name || b.title || "Quỹ",
          targetAmount: Number(b.target_amount || b.targetAmount || 0),
          currentAmount: Number(b.current_amount || b.currentAmount || 0),
          icon: b.icon || "🎯",
          color: b.color || "#109C7C",
        }));
        setFunds(mapped);
        return;
      }
    } catch (e) {
      console.log("Checking localStorage...");
    }

    const saved = localStorage.getItem("xu_funds") || localStorage.getItem("xu_budgets");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFunds(
          parsed.map((f: any) => ({
            id: f.id,
            name: f.name || f.title,
            targetAmount: Number(f.targetAmount || f.target_amount || 0),
            currentAmount: Number(f.currentAmount || f.current_amount || 0),
            icon: f.icon || "🎯",
            color: f.color || "#109C7C",
          }))
        );
      } catch (e) {
        setFunds([]);
      }
    } else {
      setFunds([]);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const range =
    view === "month"
      ? { from: ymd(monthStart), to: ymd(monthEnd) }
      : { from: ymd(cursor), to: ymd(cursor) };

  const { data: txs = [] } = useTransactions(range.from, range.to);
  const { data: allTxs = [] } = useAllTransactions();
  const { data: categories = [] } = useCategories();
  const { data: wallets = [] } = useWallets();
  const del = useDeleteTransaction();

  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const walletMap = useMemo(() => new Map(wallets.map((w) => [w.id, w])), [wallets]);

  const totalWalletBalance = useMemo(() => {
    const initialTotal = wallets.reduce((sum: number, w) => sum + (w.initial_balance ?? 0), 0);
    const txTotal = allTxs.reduce((sum: number, t: Transaction) => {
      if (!t.wallet_id) return sum;
      return sum + (t.type === "income" ? t.amount : -t.amount);
    }, 0);
    return initialTotal + txTotal;
  }, [wallets, allTxs]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of txs) t.type === "income" ? (income += t.amount) : (expense += t.amount);
    return {
      income: totalWalletBalance,
      expense,
      net: totalWalletBalance - expense,
    };
  }, [txs, totalWalletBalance]);

  const byDay = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    for (const t of txs) {
      const entry = map.get(t.occurred_on) ?? { income: 0, expense: 0 };
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
      map.set(t.occurred_on, entry);
    }
    return map;
  }, [txs]);

  const cells = useMemo(() => {
    const lead = (getDay(monthStart) + 6) % 7;
    const total = lead + monthEnd.getDate();
    const rows = Math.ceil(total / 7) * 7;
    return Array.from({ length: rows }, (_, i) => {
      const dayNum = i - lead + 1;
      if (dayNum < 1 || dayNum > monthEnd.getDate()) return null;
      return addDays(monthStart, dayNum - 1);
    });
  }, [monthStart, monthEnd]);

  const step = (dir: number) =>
    setCursor((c) => (view === "month" ? addMonths(c, dir) : addDays(c, dir)));

  return (
    /* Đổi màu nền chính sang #F8F9FA */
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F8F9FA] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      {/* 1. Header Chọn Thời Gian */}
      <section className="flex items-center justify-between gap-2 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => step(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200 active:scale-90 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5 px-2 min-w-[140px] justify-center">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
              {view === "month"
                ? format(cursor, "'Tháng' M, yyyy", { locale: vi })
                : format(cursor, "dd/MM/yyyy", { locale: vi })}
            </h1>
          </div>
          <button
            onClick={() => step(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200 active:scale-90 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Nút chuyển Ngày/Tháng -> Màu chủ đạo Xanh #109C7C */}
        <div className="inline-flex rounded-full bg-slate-200/80 p-1">
          {(["day", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold transition-all",
                view === v
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900",
              )}
            >
              {v === "day" ? "Ngày" : "Tháng"}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Grid Bố cục chính */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT BÊN TRÁI - Tổng tài sản & Lịch/Giao dịch */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Hero Card */}
          <section className="relative rounded-[26px] bg-white border border-slate-200/80 shadow-sm pt-6 pb-5 px-6 overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Coins className="h-4 w-4 text-[#D8A13B]" />
                  Tổng tài sản
                </span>
                <p className="mt-2 font-['JetBrains_Mono'] text-2xl sm:text-3xl font-bold leading-none tabular-nums text-slate-900">
                  {formatVND(totals.income)}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBEFD7] rotate-6">
                <Coins className="h-5 w-5 text-[#B4832B]" />
              </span>
            </div>

            <div className="relative my-4 h-px bg-[repeating-linear-gradient(90deg,#E2E8F0_0_6px,transparent_6px_12px)]">
              <span className="absolute -left-9 -top-2.5 h-5 w-5 rounded-full bg-[#F8F9FA]" />
              <span className="absolute -right-9 -top-2.5 h-5 w-5 rounded-full bg-[#F8F9FA]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <TrendingDown className="h-3.5 w-3.5 text-[#EF5B45]" />
                  Chi tiêu
                </span>
                <p className="mt-1 font-['JetBrains_Mono'] text-base sm:text-lg font-bold tabular-nums text-[#EF5B45]">
                  {formatVND(totals.expense)}
                </p>
              </div>
              <div>
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Scale className="h-3.5 w-3.5 text-primary" />
                  Còn lại
                </span>
                <p
                  className={cn(
                    "mt-1 font-['JetBrains_Mono'] text-base sm:text-lg font-bold tabular-nums",
                    totals.net >= 0 ? "text-primary" : "text-[#EF5B45]",
                  )}
                >
                  {formatVND(totals.net)}
                </p>
              </div>
            </div>
          </section>

          {/* Lịch / Giao dịch */}
          {view === "month" ? (
            <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-7 gap-1 pb-3 border-b border-slate-100 text-center">
                {VI_WEEKDAYS.map((d) => (
                  <span key={d} className="text-xs font-bold text-slate-400">
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-2 pt-3">
                {cells.map((d, i) => {
                  if (!d) return <div key={i} className="h-12 sm:h-14" />;
                  const key = ymd(d);
                  const entry = byDay.get(key);
                  const net = entry ? entry.income - entry.expense : 0;
                  const isToday = key === ymd(new Date());

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setCursor(d);
                        setEditing(null);
                        setDialogOpen(true);
                      }}
                      className="flex h-12 sm:h-14 flex-col items-center justify-start gap-1 rounded-xl hover:bg-slate-100 transition-all active:scale-95 p-1"
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs font-extrabold",
                          isToday
                            ? "bg-[#D8A13B] text-white"
                            : "text-slate-800",
                        )}
                      >
                        {d.getDate()}
                      </span>

                      {entry ? (
                        <span
                          className={cn(
                            "font-['JetBrains_Mono'] text-[9px] sm:text-[10px] font-bold tabular-nums leading-none",
                            net >= 0 ? "text-primary" : "text-[#EF5B45]",
                          )}
                        >
                          {net >= 0 ? "+" : "-"}
                          {formatVND(Math.abs(net))}
                        </span>
                      ) : (
                        <span className="h-[9px]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="space-y-2.5">
              {txs.length === 0 && (
                <div className="rounded-[26px] border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-bold text-slate-500">
                  Chưa có giao dịch nào — bấm nút + để thêm nhé
                </div>
              )}
              {txs.map((t) => {
                const c = t.category_id ? catMap.get(t.category_id) : undefined;
                const w = t.wallet_id ? walletMap.get(t.wallet_id) : undefined;
                const tint = c?.color ?? "#94a3b8";
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-2xl bg-white border border-slate-200/80 px-4 py-3 shadow-sm hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${tint}1F`, color: tint }}
                      >
                        <Icon name={c?.icon ?? "Tag"} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {c?.name ?? "Khác"}
                        </p>
                        <p className="truncate text-xs font-medium text-slate-500">
                          {[t.note, w?.name].filter(Boolean).join(" · ") || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          "font-['JetBrains_Mono'] text-sm font-bold tabular-nums",
                          t.type === "income" ? "text-primary" : "text-[#EF5B45]",
                        )}
                      >
                        {t.type === "income" ? "+" : "-"}
                        {formatVND(t.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(t);
                          setDialogOpen(true);
                        }}
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => del.mutate(t.id)}
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-[#EF5B45] hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>

        {/* CỘT BÊN PHẢI - Ví & Quỹ tiết kiệm */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Section: Ví của bạn */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                Ví của bạn
              </h2>
              <Link
                to="/summary"
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
              >
                Chi tiết <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {wallets.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-white p-5 text-center text-xs font-bold text-slate-500">
                  Chưa có ví nào trong tài khoản
                </div>
              ) : (
                wallets.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => navigate({ to: "/summary" })}
                    className="flex items-center justify-between rounded-[20px] bg-white border border-slate-200/80 p-3.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer hover:border-primary/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Wallet className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">{w.name}</p>
                        <p className="text-[10.5px] font-medium text-slate-500">
                          {(w as any).currency || "VND"}
                        </p>
                      </div>
                    </div>
                    <p className="font-['JetBrains_Mono'] text-xs font-bold text-slate-900">
                      {formatVND(w.initial_balance ?? 0)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Section: Quỹ tiết kiệm */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-[#D8A13B]" />
                Quỹ tiết kiệm
              </h2>
              <Link
                to="/budgets"
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
              >
                Quản lý <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {funds.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-white p-5 text-center text-xs font-bold text-slate-500">
                  Chưa tạo quỹ tiết kiệm nào
                </div>
              ) : (
                funds.map((f) => {
                  const percent =
                    f.targetAmount > 0
                      ? Math.min(100, Math.round((f.currentAmount / f.targetAmount) * 100))
                      : 0;

                  return (
                    <div
                      key={f.id}
                      onClick={() => navigate({ to: "/budgets" })}
                      className="rounded-[20px] bg-white border border-slate-200/80 p-3.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer hover:border-[#D8A13B]/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                            style={{ backgroundColor: `${f.color}15` }}
                          >
                            {f.icon}
                          </span>
                          <div>
                            <p className="text-xs font-extrabold text-slate-900">{f.name}</p>
                            <p className="text-[10.5px] font-medium text-slate-500">
                              Mục tiêu: {f.targetAmount > 0 ? formatVND(f.targetAmount) : "Không có"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-['JetBrains_Mono'] text-xs font-bold text-slate-900">
                            {formatVND(f.currentAmount)}
                          </p>
                          {f.targetAmount > 0 && (
                            <p className="text-[10px] font-bold text-slate-500">{percent}%</p>
                          )}
                        </div>
                      </div>

                      {f.targetAmount > 0 && (
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${percent}%`, backgroundColor: f.color }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

      </div>

      {/* Nút Thêm Nhanh -> Màu xanh Emerald tươi sáng #109C7C */}
      <button
        onClick={() => {
          setCursor(new Date());
          setEditing(null);
          setDialogOpen(true);
        }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_24px_rgba(16,156,124,0.35)] hover:bg-[#0E8A6E] hover:scale-105 active:scale-90 transition-all"
        aria-label="Thêm giao dịch"
      >
        <Plus className="h-6 w-6" />
      </button>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        date={cursor}
        editing={editing}
      />
    </div>
  );
}