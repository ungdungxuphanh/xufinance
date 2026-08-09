import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
  Calendar,
  FilterX,
  Wallet as WalletIcon,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { formatVND } from "@/lib/money";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Lịch sử giao dịch — Xu" },
      { name: "description", content: "Xem và quản lý chi tiết lịch sử thu chi." },
    ],
  }),
  component: HistoryPage,
});

const ITEMS_PER_PAGE = 15;

export function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bộ lọc
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [editingTx, setEditingTx] = useState<any | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);

  // Form Chỉnh sửa
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tải giao dịch từ DB
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
     const { data, error } = await supabase
  .from("transactions")
  .select("*, categories(name, icon, color), wallets:wallet_id(name)")
  .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      toast.error((err as Error).message || "Không thể tải lịch sử giao dịch");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Lọc dữ liệu
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchType = filterType === "all" ? true : tx.type === filterType;
      const noteStr = String(
        tx.note || tx.description || tx.categories?.name || ""
      ).toLowerCase();
      const queryStr = searchQuery.toLowerCase().trim();

      return matchType && noteStr.includes(queryStr);
    });
  }, [transactions, filterType, searchQuery]);

  // Tổng số dư / thu / chi trong kết quả lọc
  const summaryMetrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filteredTransactions) {
      if (t.type === "income") income += Number(t.amount || 0);
      if (t.type === "expense") expense += Number(t.amount || 0);
    }
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  // Phân trang
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  // Nhóm giao dịch theo ngày (Group by Date)
  const groupedTransactions = useMemo(() => {
    const groups: { [date: string]: any[] } = {};
    for (const tx of paginatedTransactions) {
      const rawDate = tx.created_at || tx.date;
      const dateStr = rawDate
        ? new Date(rawDate).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Khác";

      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(tx);
    }
    return groups;
  }, [paginatedTransactions]);

  // Xóa giao dịch
  const handleConfirmDelete = async () => {
    if (!deletingTxId) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", deletingTxId);
      if (error) throw error;

      toast.success("Đã xoá giao dịch thành công!");
      setTransactions((prev) => prev.filter((item) => item.id !== deletingTxId));
      setDeletingTxId(null);
    } catch (err) {
      toast.error((err as Error).message || "Không thể xoá giao dịch");
    } finally {
      setIsDeleting(false);
    }
  };

  // Mở modal sửa
  const handleOpenEdit = (tx: any) => {
    setEditingTx(tx);
    setEditAmount(String(tx.amount || 0));
    setEditNote(tx.note || tx.description || "");
  };

  // Lưu sửa
  const handleSaveEdit = async () => {
    if (!editingTx) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          amount: Number(editAmount),
          note: editNote,
        })
        .eq("id", editingTx.id);

      if (error) throw error;

      toast.success("Đã cập nhật giao dịch!");
      setEditingTx(null);
      fetchTransactions();
    } catch (err) {
      toast.error((err as Error).message || "Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl space-y-5 bg-[#F8F9FA] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      {/* 1. Header Trang */}
      <section className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Lịch sử giao dịch
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Quản lý và tra cứu thông tin chi tiêu của bạn
          </p>
        </div>
      </section>

      {/* 2. Thẻ Tóm Tắt Dòng Tiền (Nhanh) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-[20px] bg-white border border-slate-200/80 p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <TrendingDown className="h-3.5 w-3.5 text-primary" /> Tổng nhận
          </div>
          <p className="mt-1 font-['JetBrains_Mono'] text-base sm:text-lg font-bold text-primary tabular-nums">
            +{formatVND(summaryMetrics.income)}
          </p>
        </div>

        <div className="rounded-[20px] bg-white border border-slate-200/80 p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5 text-[#EF5B45]" /> Tổng chi
          </div>
          <p className="mt-1 font-['JetBrains_Mono'] text-base sm:text-lg font-bold text-slate-900 tabular-nums">
            -{formatVND(summaryMetrics.expense)}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-[20px] bg-white border border-slate-200/80 p-3.5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Chênh lệch
          </div>
          <p
            className={cn(
              "mt-1 font-['JetBrains_Mono'] text-base sm:text-lg font-bold tabular-nums",
              summaryMetrics.net >= 0 ? "text-primary" : "text-[#EF5B45]"
            )}
          >
            {summaryMetrics.net >= 0 ? "+" : ""}
            {formatVND(summaryMetrics.net)}
          </p>
        </div>
      </div>

      {/* 3. Tìm kiếm & Bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="relative sm:col-span-7">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo ghi chú, danh mục..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-slate-900 shadow-sm focus-visible:ring-[#109C7C]"
          />
        </div>

        <div className="sm:col-span-5 flex rounded-2xl bg-slate-200/70 p-1 gap-1">
          {(
            [
              { key: "all", label: "Tất cả" },
              { key: "expense", label: "Khoản chi" },
              { key: "income", label: "Khoản thu" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilterType(tab.key);
                setCurrentPage(1);
              }}
              className={cn(
                "flex-1 py-1.5 rounded-xl text-xs font-bold transition-all",
                filterType === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Danh sách giao dịch (Grouped by Date) */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-16 text-xs font-bold text-slate-400 space-y-2">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p>Đang tải dữ liệu giao dịch...</p>
          </div>
        ) : Object.keys(groupedTransactions).length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white p-12 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FilterX className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">Không tìm thấy giao dịch nào</p>
            <p className="text-[11px] font-medium text-slate-400">
              Thử thay đổi từ khóa tìm kiếm hoặc đổi bộ lọc xem sao.
            </p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([dateLabel, txGroup]) => (
            <div key={dateLabel} className="space-y-2">
              {/* Header Ngày */}
              <div className="flex items-center gap-2 px-1 pt-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-extrabold capitalize text-slate-500">
                  {dateLabel}
                </span>
              </div>

              {/* Thẻ Card chứa các item trong ngày */}
              <div className="rounded-[22px] bg-white border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {txGroup.map((tx) => {
                  const isIncome = tx.type === "income";
                  const displayTitle =
                    tx.note || tx.description || tx.categories?.name || "Giao dịch không tên";
                  const walletName = tx.wallets?.name;

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 sm:p-3.5 hover:bg-slate-50/80 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon đại diện thu/chi */}
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base shadow-sm",
                            isIncome
                              ? "bg-emerald-50 text-primary"
                              : "bg-rose-50 text-[#EF5B45]"
                          )}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </span>

                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                            {displayTitle}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                            {walletName && (
                              <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-semibold">
                                <WalletIcon className="h-3 w-3" />
                                {walletName}
                              </span>
                            )}
                            {tx.categories?.name && (
                              <span>• {tx.categories.name}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span
                          className={cn(
                            "font-['JetBrains_Mono'] text-xs sm:text-sm font-bold tabular-nums",
                            isIncome ? "text-primary" : "text-slate-900"
                          )}
                        >
                          {isIncome ? "+" : "-"}{formatVND(Number(tx.amount || 0))}
                        </span>

                        {/* Nút tác vụ (Hiện trên Hover ở màn rộng) */}
                        <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(tx)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-lg"
                            title="Sửa"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingTxId(tx.id)}
                            className="p-1.5 text-slate-400 hover:text-[#EF5B45] hover:bg-rose-50 transition-colors rounded-lg"
                            title="Xoá"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Phân Trang (Pagination Controls) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs font-semibold text-slate-500">
            Trang <span className="text-slate-900 font-bold">{currentPage}</span> / {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8 rounded-xl border-slate-200 bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 w-8 rounded-xl border-slate-200 bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 6. Modal Xoá (Shadcn Dialog Chuẩn) */}
      <Dialog open={!!deletingTxId} onOpenChange={(v) => !v && setDeletingTxId(null)}>
        <DialogContent className="sm:max-w-sm rounded-[26px] bg-white p-6 font-['Be_Vietnam_Pro'] border-slate-200">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-[#EF5B45]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-slate-900">
                Xác nhận xoá giao dịch?
              </DialogTitle>
            </DialogHeader>
            <p className="text-xs font-medium text-slate-500">
              Hành động này không thể hoàn tác. Số dư ví liên quan sẽ được tự động cập nhật lại.
            </p>
          </div>

          <div className="flex items-center gap-2.5 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-slate-200 font-bold text-xs py-2.5 h-auto text-slate-900 hover:bg-slate-100"
              onClick={() => setDeletingTxId(null)}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 rounded-full bg-[#EF5B45] hover:bg-[#DC4C37] text-white font-bold text-xs py-2.5 h-auto transition-all"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xoá..." : "Xoá ngay"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 7. Modal Sửa (Shadcn Dialog Chuẩn) */}
      <Dialog open={!!editingTx} onOpenChange={(v) => !v && setEditingTx(null)}>
        <DialogContent className="sm:max-w-sm rounded-[26px] bg-white p-6 font-['Be_Vietnam_Pro'] border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900">
              Chỉnh sửa giao dịch
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Số tiền (VNĐ)</label>
              <Input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="rounded-xl border-slate-200 bg-[#F8F9FA] focus-visible:ring-[#109C7C] font-['JetBrains_Mono'] font-bold text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Ghi chú / Mô tả</label>
              <Input
                type="text"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="rounded-xl border-slate-200 bg-[#F8F9FA] focus-visible:ring-[#109C7C] font-medium text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              variant="outline"
              onClick={() => setEditingTx(null)}
              className="flex-1 rounded-full border-slate-200 font-bold text-xs py-2.5 h-auto text-slate-900 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              disabled={isSaving}
              onClick={handleSaveEdit}
              className="flex-1 rounded-full bg-primary hover:bg-[#0E8A6E] text-white font-bold text-xs py-2.5 h-auto transition-all"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}