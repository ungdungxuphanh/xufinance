import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { History, ArrowDownLeft, ArrowUpRight, Search, Pencil, Trash2 } from "lucide-react";
import { formatVND } from "@/lib/money";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Lịch sử giao dịch — Xu" },
      { name: "description", content: "Xem và quản lý chi tiết lịch sử thu chi." },
    ],
  }),
  component: HistoryPage,
});

export function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTx, setEditingTx] = useState<any | null>(null);

  // Form Chỉnh sửa
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 🚀 Hàm lấy danh sách giao dịch trực tiếp từ Supabase
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
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

  // Lọc danh sách giao dịch theo Tìm kiếm & Loại
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchType = filterType === "all" ? true : tx.type === filterType;
      const noteStr = String(tx.note || tx.description || tx.category || "").toLowerCase();
      const queryStr = searchQuery.toLowerCase();

      return matchType && noteStr.includes(queryStr);
    });
  }, [transactions, filterType, searchQuery]);

  // 🚀 Xoá giao dịch
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá giao dịch này?")) return;
    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Đã xoá giao dịch thành công!");
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error((err as Error).message || "Không thể xoá giao dịch");
    }
  };

  // Mở modal sửa
  const handleOpenEdit = (tx: any) => {
    setEditingTx(tx);
    setEditAmount(String(tx.amount || 0));
    setEditNote(tx.note || tx.description || "");
  };

  // 🚀 Lưu thông tin sửa
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
      fetchTransactions(); // Tải lại dữ liệu mới nhất
    } catch (err) {
      toast.error((err as Error).message || "Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl space-y-5 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 font-['Be_Vietnam_Pro'] min-h-screen">
      {/* Header */}
      <section className="flex items-center justify-between pb-3 border-b border-[#E3E2DC]">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#16181D] flex items-center gap-2">
            <History className="h-5 w-5 text-[#109C7C]" /> Lịch sử giao dịch
          </h1>
          <p className="text-xs font-medium text-[#8A8D7A]">
            Quản lý và chỉnh sửa các khoản thu chi của bạn
          </p>
        </div>
      </section>

      {/* Tìm kiếm & Bộ lọc */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8D7A]" />
          <input
            type="text"
            placeholder="Tìm theo ghi chú hoặc danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-[#E7E5DC] bg-white pl-9 pr-4 py-2.5 text-xs font-bold text-[#16181D] focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex rounded-full bg-[#E7E5DC]/60 p-1 gap-1">
          {(
            [
              { key: "all", label: "Tất cả" },
              { key: "expense", label: "Tiền chi" },
              { key: "income", label: "Tiền nhận" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                filterType === tab.key
                  ? "bg-[#16181D] text-white shadow-sm"
                  : "text-[#8A8D7A] hover:text-[#16181D]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách giao dịch */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-10 text-xs font-bold text-[#8A8D7A]">
            Đang tải lịch sử...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#D8D6CC] bg-white p-8 text-center text-xs font-bold text-[#8A8D7A]">
            Chưa có giao dịch nào
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === "income";
            const rawDate = tx.created_at || tx.date;
            const displayDate = rawDate ? new Date(rawDate).toLocaleDateString("vi-VN") : "";
            const displayTitle = tx.note || tx.description || tx.category || "Giao dịch";

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-2xl bg-white border border-[#E7E5DC] p-3.5 shadow-sm hover:border-[#D8D6CC] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base ${
                      isIncome ? "bg-[#E6F4EA] text-[#109C7C]" : "bg-[#FCE4E0] text-[#EF5B45]"
                    }`}
                  >
                    {isIncome ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold text-[#16181D] truncate">
                      {displayTitle}
                    </p>
                    <p className="text-[10px] font-medium text-[#8A8D7A]">
                      {displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-['JetBrains_Mono'] text-xs sm:text-sm font-bold ${
                      isIncome ? "text-[#109C7C]" : "text-[#16181D]"
                    }`}
                  >
                    {isIncome ? "+" : "-"}{formatVND(Number(tx.amount || 0))}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(tx)}
                      className="p-1.5 text-[#8A8D7A] hover:text-[#16181D] transition-colors rounded-lg hover:bg-[#F3F4F1]"
                      title="Sửa"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-1.5 text-[#8A8D7A] hover:text-[#EF5B45] transition-colors rounded-lg hover:bg-[#FCE4E0]"
                      title="Xoá"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Chỉnh sửa Giao dịch */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[26px] bg-white p-6 space-y-4 shadow-xl border border-[#E7E5DC] font-['Be_Vietnam_Pro']">
            <h3 className="text-base font-extrabold text-[#16181D] border-b pb-3 border-[#E3E2DC]">
              Chỉnh sửa giao dịch
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16181D]">Số tiền (VNĐ)</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full rounded-xl border border-[#EDECE6] p-2.5 font-['JetBrains_Mono'] text-sm font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16181D]">Ghi chú / Mô tả</label>
              <input
                type="text"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="w-full rounded-xl border border-[#EDECE6] p-2.5 text-xs font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingTx(null)}
                className="flex-1 rounded-full text-xs font-bold text-[#8A8D7A]"
              >
                Hủy
              </Button>
              <Button
                type="button"
                disabled={isSaving}
                onClick={handleSaveEdit}
                className="flex-1 rounded-full bg-[#16181D] text-xs font-bold text-white"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}