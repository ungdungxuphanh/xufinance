import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  PiggyBank,
  ArrowRightLeft,
  Plus,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Pencil,
  Trash2,
  Calendar,
  AlertTriangle,
  Target,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/money";
import {
  useWallets,
  useBudgets,
  useSaveBudget,
  useDeleteBudget,
  useUpdateBudgetAmount,
  type Budget,
} from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/budgets")({
  head: () => ({
    meta: [
      { title: "Quỹ tiết kiệm — Xu" },
      { name: "description", content: "Quản lý các Quỹ riêng và phân bổ tiền từ Ví." },
    ],
  }),
  component: BudgetsPage,
});

const PRESET_ICONS = ["🏖️", "💻", "🛡️", "🚗", "🏠", "✈️", "🎓", "💎", "🎯", "🎮"];
const PRESET_COLORS = ["#109C7C", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444"];

export function BudgetsPage() {
  const { data: wallets = [] } = useWallets();
  const { data: funds = [], isLoading } = useBudgets();

  // React Query Mutation Hooks
  const saveBudget = useSaveBudget();
  const deleteBudget = useDeleteBudget();
  const updateBudgetAmount = useUpdateBudgetAmount();

  // Modals state
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Selected fund for actions
  const [editingFund, setEditingFund] = useState<Budget | null>(null);
  const [selectedFundForTransfer, setSelectedFundForTransfer] = useState<Budget | null>(null);

  // Form Quỹ (Tạo / Sửa)
  const [formName, setFormName] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formCurrent, setFormCurrent] = useState("");
  const [formIcon, setFormIcon] = useState("🎯");
  const [formColor, setFormColor] = useState("#109C7C");
  const [formDeadline, setFormDeadline] = useState("");

  // Form Chuyển tiền
  const [transferType, setTransferType] = useState<"in" | "out">("in");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Thống kê tính toán
  const totalInFunds = useMemo(() => {
    return funds.reduce((sum, f) => sum + Number(f.current_amount || 0), 0);
  }, [funds]);

  const totalTarget = useMemo(() => {
    return funds.reduce((sum, f) => sum + Number(f.target_amount || 0), 0);
  }, [funds]);

  // Tổng số tiền còn thiếu cho tất cả các quỹ
  const totalRemaining = useMemo(() => {
    return Math.max(0, totalTarget - totalInFunds);
  }, [totalTarget, totalInFunds]);

  const overallProgress = useMemo(() => {
    if (totalTarget === 0) return 0;
    return Math.min(100, Math.round((totalInFunds / totalTarget) * 100));
  }, [totalInFunds, totalTarget]);

  // Mở modal tạo quỹ mới
  const handleOpenCreateModal = () => {
    setEditingFund(null);
    setFormName("");
    setFormTarget("");
    setFormCurrent("");
    setFormIcon("🎯");
    setFormColor("#109C7C");
    setFormDeadline("");
    setFundModalOpen(true);
  };

  // Mở modal chỉnh sửa quỹ
  const handleOpenEditModal = (fund: Budget) => {
    setEditingFund(fund);
    setFormName(fund.name);
    setFormTarget(fund.target_amount ? fund.target_amount.toString() : "");
    setFormCurrent(fund.current_amount ? fund.current_amount.toString() : "0");
    setFormIcon(fund.icon);
    setFormColor(fund.color || "#109C7C");
    setFormDeadline(fund.deadline || "");
    setFundModalOpen(true);
  };

  // Mở modal chuyển tiền (Reset form sạch sẽ)
  const handleOpenTransferModal = (fund: Budget) => {
    setSelectedFundForTransfer(fund);
    setSelectedWalletId("");
    setAmountInput("");
    setTransferType("in");
    setTransferOpen(true);
  };

  // Lưu thông tin Quỹ (Tạo / Sửa)
  const handleSaveFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Vui lòng nhập tên Quỹ");
      return;
    }
    setLoadingSubmit(true);

    try {
      await saveBudget.mutateAsync({
        ...(editingFund ? { id: editingFund.id } : {}),
        name: formName.trim(),
        target_amount: Number(formTarget) || 0,
        current_amount: Number(formCurrent) || 0,
        icon: formIcon,
        color: formColor,
        deadline: formDeadline || null,
      });

      toast.success(editingFund ? "Cập nhật Quỹ thành công" : "Tạo Quỹ mới thành công");
      setFundModalOpen(false);
    } catch (err) {
      toast.error((err as Error).message || "Có lỗi xảy ra");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Xác nhận xoá Quỹ
  const handleConfirmDelete = async () => {
    if (!editingFund) return;
    try {
      await deleteBudget.mutateAsync(editingFund.id);
      toast.success("Đã xoá Quỹ thành công");
      setDeleteConfirmOpen(false);
      setFundModalOpen(false);
      setEditingFund(null);
    } catch (err) {
      toast.error((err as Error).message || "Không thể xoá Quỹ");
    }
  };

  // Xử lý Chuyển tiền vào/rút khỏi Quỹ
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFundForTransfer) return;

    if (!selectedWalletId) {
      toast.error("Vui lòng chọn ví giao dịch");
      return;
    }

    const amount = Number(amountInput);
    if (!amount || amount <= 0 || isNaN(amount)) {
      toast.error("Số tiền không hợp lệ");
      return;
    }

    setLoadingSubmit(true);
    try {
      const current = Number(selectedFundForTransfer.current_amount || 0);
      const updatedAmount =
        transferType === "in"
          ? current + amount
          : Math.max(0, current - amount);

    await updateBudgetAmount.mutateAsync({
  id: selectedFundForTransfer.id,
  current_amount: updatedAmount,
});

      toast.success(
        transferType === "in" ? "Đã cất tiền vào Quỹ" : "Đã rút tiền về Ví"
      );

      setTransferOpen(false);
      setAmountInput("");
      setSelectedWalletId("");
      setSelectedFundForTransfer(null);
    } catch (err) {
      toast.error((err as Error).message || "Chuyển tiền thất bại");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F8F9FA] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      {/* 1. Header Trang Quỹ */}
      <section className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
            Quỹ & Ngân sách
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Tích lũy mục tiêu và quản lý khoản tiết kiệm
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="rounded-full bg-primary hover:bg-[#0E8A6E] text-white font-bold text-xs sm:text-sm px-4 py-2 h-auto shadow-sm transition-all"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Tạo quỹ
        </Button>
      </section>

      {/* 2. Bố cục chính */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI: Thẻ tổng quát */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <section className="relative rounded-[26px] bg-white border border-slate-200/80 shadow-sm pt-6 pb-5 px-6 overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <PiggyBank className="h-4 w-4 text-[#D8A13B]" />
                  Tổng tiền cất trong Quỹ
                </span>
                <p className="mt-2 font-['JetBrains_Mono'] text-3xl sm:text-4xl font-bold leading-none tabular-nums text-slate-900">
                  {formatVND(totalInFunds)}
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFD7] rotate-6 text-[#B4832B]">
                <PiggyBank className="h-6 w-6" />
              </span>
            </div>

            {totalTarget > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" /> Tổng mục tiêu:
                  </span>
                  <span className="font-['JetBrains_Mono'] text-slate-900">
                    {formatVND(totalTarget)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="text-amber-800 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Cần nộp thêm:
                  </span>
                  <span className="font-['JetBrains_Mono'] text-amber-900 font-extrabold">
                    {formatVND(totalRemaining)}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-right text-primary">
                    Đã đạt {overallProgress}% kế hoạch
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* CỘT PHẢI: Danh sách Quỹ */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              Danh sách quỹ ({funds.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {isLoading ? (
              <div className="col-span-full text-center py-8 text-xs font-bold text-slate-500">
                Đang tải danh sách quỹ...
              </div>
            ) : funds.length === 0 ? (
              <div className="col-span-full rounded-[26px] border border-dashed border-slate-300 bg-white p-8 text-center text-xs sm:text-sm font-bold text-slate-500">
                Chưa có quỹ nào — Bấm nút "Tạo quỹ" để bắt đầu tích lũy nhé
              </div>
            ) : (
              funds.map((fund: Budget) => {
                const target = Number(fund.target_amount || 0);
                const current = Number(fund.current_amount || 0);
                const remaining = Math.max(0, target - current);
                const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
                const isCompleted = target > 0 && current >= target;

                return (
                  <div
                    key={fund.id}
                    className="rounded-[22px] bg-white border border-slate-200/80 p-4 shadow-sm hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm"
                          style={{ backgroundColor: `${fund.color}15` }}
                        >
                          {fund.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-xs sm:text-sm font-extrabold text-slate-900">
                              {fund.name}
                            </h3>
                            <button
                              onClick={() => handleOpenEditModal(fund)}
                              className="text-slate-400 hover:text-slate-800 transition-colors p-0.5"
                              title="Sửa thông tin"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] font-semibold text-slate-500 truncate">
                            Mục tiêu: {target > 0 ? formatVND(target) : "Không giới hạn"}
                          </p>

                          {fund.deadline && (
                            <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" /> Hạn: {fund.deadline}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleOpenTransferModal(fund)}
                        variant="outline"
                        size="sm"
                        className="rounded-full border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] sm:text-xs font-bold text-slate-800 gap-1 shrink-0 h-8 px-2.5"
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5 text-slate-500" /> Chuyển
                      </Button>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-slate-100/80">
                      <div className="flex justify-between items-center text-xs font-['JetBrains_Mono']">
                        <div>
                          <span className="text-[10px] text-slate-400 font-medium block">Đã nộp</span>
                          <span className="font-bold" style={{ color: fund.color }}>
                            {formatVND(current)}
                          </span>
                        </div>

                        {target > 0 && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-medium block">Còn lại cần nộp</span>
                            <span className={`font-bold ${isCompleted ? "text-primary" : "text-amber-600"}`}>
                              {isCompleted ? "Đã đủ 🎉" : formatVND(remaining)}
                            </span>
                          </div>
                        )}
                      </div>

                      {target > 0 && (
                        <div className="pt-1">
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${percent}%`,
                                backgroundColor: fund.color,
                              }}
                            />
                          </div>
                          <p className="text-[10px] font-bold text-right text-slate-400 mt-1">
                            {percent}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Tạo mới / Chỉnh sửa Quỹ */}
      {fundModalOpen && (
        <div
          onClick={() => setFundModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveFund}
            className="w-full max-w-sm rounded-[26px] bg-white p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto font-['Be_Vietnam_Pro']"
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingFund ? "Chỉnh sửa Quỹ" : "Tạo Quỹ mới"}
              </h3>
              <div className="flex items-center gap-2">
                {editingFund && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="text-xs font-bold text-[#EF5B45] flex items-center gap-1 hover:underline mr-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Xoá
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFundModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chọn Emoji */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Biểu tượng (Icon)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-12 h-10 rounded-xl border border-slate-200 text-center text-xl bg-[#F8F9FA] focus:outline-none focus:border-primary"
                />
                <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-[220px]">
                  {PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormIcon(icon)}
                      className={`h-9 w-9 rounded-xl text-base flex items-center justify-center shrink-0 border transition-all ${
                        formIcon === icon ? "border-primary bg-slate-100" : "border-transparent hover:bg-slate-100/60"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tên Quỹ */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Tên Quỹ</label>
              <input
                type="text"
                placeholder="Ví dụ: Đi chơi, Mua iPad..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            {/* Số tiền đã nộp vào quỹ */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">
                Số tiền đã nộp vào quỹ (VNĐ)
              </label>
              <input
                type="number"
                placeholder="0"
                value={formCurrent}
                onChange={(e) => setFormCurrent(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            {/* Số tiền mục tiêu */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Mục tiêu (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            {/* Thời hạn Quỹ */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Thời hạn hoàn thành</label>
              <input
                type="date"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            {/* Màu sắc chủ đạo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Màu sắc chủ đạo</label>
              <div className="flex gap-2.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormColor(color)}
                    className={`h-7 w-7 rounded-full border-2 transition-transform active:scale-90 ${
                      formColor === color ? "scale-110 border-slate-800" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setFundModalOpen(false)}
                className="flex-1 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loadingSubmit}
                className="flex-1 rounded-full bg-primary text-xs font-bold text-white hover:bg-[#0E8A6E]"
              >
                {loadingSubmit ? "Đang lưu..." : editingFund ? "Cập nhật" : "Tạo quỹ"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Xác nhận xóa Quỹ */}
      {deleteConfirmOpen && editingFund && (
        <div
          onClick={() => setDeleteConfirmOpen(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-[26px] bg-white p-5 text-center space-y-4 shadow-2xl border border-slate-200 font-['Be_Vietnam_Pro']"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-[#EF5B45]">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">
                Xoá quỹ "{editingFund.name}"?
              </h4>
              <p className="text-xs font-medium text-slate-500">
                Thao tác này không thể hoàn tác. Bạn có chắc chắn muốn xoá?
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 rounded-full text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200"
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-full bg-[#EF5B45] text-xs font-bold text-white hover:bg-[#DC4C37]"
              >
                Xác nhận xoá
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Chuyển tiền */}
      {transferOpen && selectedFundForTransfer && (
        <div
          onClick={() => setTransferOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleTransfer}
            className="w-full max-w-sm rounded-[26px] bg-white p-6 space-y-4 shadow-xl border border-slate-200 font-['Be_Vietnam_Pro']"
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900">
                Chuyển tiền — {selectedFundForTransfer.name}
              </h3>
              <button
                type="button"
                onClick={() => setTransferOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setTransferType("in")}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                  transferType === "in"
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <ArrowDownRight className="h-3.5 w-3.5" /> Cất vào Quỹ
              </button>
              <button
                type="button"
                onClick={() => setTransferType("out")}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                  transferType === "out"
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <ArrowUpRight className="h-3.5 w-3.5" /> Rút về Ví
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5 text-primary" /> Chọn Ví giao dịch
              </label>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              >
                <option value="">-- Chọn Ví --</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatVND(w.initial_balance ?? 0)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Số tiền (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                required
                min="1"
                className="w-full rounded-xl border border-slate-200 p-2.5 font-['JetBrains_Mono'] text-base font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setTransferOpen(false)}
                className="flex-1 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loadingSubmit}
                className="flex-1 rounded-full bg-primary text-xs font-bold text-white hover:bg-[#0E8A6E]"
              >
                {loadingSubmit ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}