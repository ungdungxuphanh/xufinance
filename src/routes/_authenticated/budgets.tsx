import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/money";
import { useWallets } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/budgets")({
  head: () => ({
    meta: [
      { title: "Quỹ tiết kiệm — Xu" },
      { name: "description", content: "Quản lý các Quỹ riêng và phân bổ tiền từ Ví." },
    ],
  }),
  component: BudgetsPage,
});

interface Fund {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
  deadline?: string;
}

const PRESET_ICONS = ["🏖️", "💻", "🛡️", "🚗", "🏠", "✈️", "🎓", "💎", "🎯", "🎮"];
const PRESET_COLORS = ["#109C7C", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444"];

export function BudgetsPage() {
  const { data: wallets = [] } = useWallets();

  // Khởi tạo danh sách Quỹ từ localStorage (nếu có)
  const [funds, setFunds] = useState<Fund[]>(() => {
    const saved = localStorage.getItem("xu_funds");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi đọc dữ liệu quỹ từ localStorage", e);
      }
    }
    return [
      {
        id: "1",
        name: "Đi chơi cuối năm",
        targetAmount: 5000000,
        currentAmount: 1500000,
        icon: "🏖️",
        color: "#3B82F6",
        deadline: "2026-12-31",
      },
      {
        id: "2",
        name: "Quỹ dự phòng",
        targetAmount: 10000000,
        currentAmount: 3000000,
        icon: "🛡️",
        color: "#109C7C",
      },
    ];
  });

  // Tự động lưu vào localStorage mỗi khi danh sách funds thay đổi
  useEffect(() => {
    localStorage.setItem("xu_funds", JSON.stringify(funds));
  }, [funds]);

  // Modals state
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Selected fund for actions
  const [editingFund, setEditingFund] = useState<Fund | null>(null);
  const [selectedFundForTransfer, setSelectedFundForTransfer] = useState<Fund | null>(null);

  // Form Quỹ (Tạo / Sửa)
  const [formName, setFormName] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formIcon, setFormIcon] = useState("🎯");
  const [formColor, setFormColor] = useState("#109C7C");
  const [formDeadline, setFormDeadline] = useState("");

  // Form Chuyển tiền
  const [transferType, setTransferType] = useState<"in" | "out">("in");
  const [selectedWalletId, setSelectedWalletId] = useState("");
  const [amountInput, setAmountInput] = useState("");

  // Thống kê tính toán
  const totalInFunds = useMemo(() => {
    return funds.reduce((sum, f) => sum + f.currentAmount, 0);
  }, [funds]);

  const totalTarget = useMemo(() => {
    return funds.reduce((sum, f) => sum + f.targetAmount, 0);
  }, [funds]);

  const overallProgress = useMemo(() => {
    if (totalTarget === 0) return 0;
    return Math.min(100, Math.round((totalInFunds / totalTarget) * 100));
  }, [totalInFunds, totalTarget]);

  // Mở modal tạo quỹ mới
  const handleOpenCreateModal = () => {
    setEditingFund(null);
    setFormName("");
    setFormTarget("");
    setFormIcon("🎯");
    setFormColor("#109C7C");
    setFormDeadline("");
    setFundModalOpen(true);
  };

  // Mở modal chỉnh sửa quỹ
  const handleOpenEditModal = (fund: Fund) => {
    setEditingFund(fund);
    setFormName(fund.name);
    setFormTarget(fund.targetAmount ? fund.targetAmount.toString() : "");
    setFormIcon(fund.icon);
    setFormColor(fund.color || "#109C7C");
    setFormDeadline(fund.deadline || "");
    setFundModalOpen(true);
  };

  // Lưu thông tin Quỹ (Tạo / Sửa)
  const handleSaveFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingFund) {
      setFunds((prev) =>
        prev.map((f) => {
          if (f.id === editingFund.id) {
            const updated: Fund = {
              ...f,
              name: formName,
              targetAmount: Number(formTarget) || 0,
              icon: formIcon,
              color: formColor,
            };

            if (formDeadline) {
              updated.deadline = formDeadline;
            } else {
              delete updated.deadline;
            }

            return updated;
          }
          return f;
        })
      );
    } else {
      const newFund: Fund = {
        id: Date.now().toString(),
        name: formName,
        targetAmount: Number(formTarget) || 0,
        currentAmount: 0,
        icon: formIcon,
        color: formColor,
        ...(formDeadline ? { deadline: formDeadline } : {}),
      };
      setFunds((prev) => [...prev, newFund]);
    }

    setFundModalOpen(false);
  };

  // Xác nhận xoá Quỹ
  const handleConfirmDelete = () => {
    if (editingFund) {
      setFunds((prev) => prev.filter((f) => f.id !== editingFund.id));
      setDeleteConfirmOpen(false);
      setFundModalOpen(false);
      setEditingFund(null);
    }
  };

  // Xử lý Chuyển tiền
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFundForTransfer || !amountInput || !selectedWalletId) return;

    const amount = Number(amountInput);
    if (amount <= 0) return;

    setFunds((prev) =>
      prev.map((f) => {
        if (f.id === selectedFundForTransfer.id) {
          const updatedAmount =
            transferType === "in"
              ? f.currentAmount + amount
              : f.currentAmount - amount;
          return { ...f, currentAmount: Math.max(0, updatedAmount) };
        }
        return f;
      })
    );

    setTransferOpen(false);
    setAmountInput("");
    setSelectedFundForTransfer(null);
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      {/* 1. Header Trang Quỹ */}
      <section className="flex items-center justify-between pb-3 border-b border-[#E3E2DC]">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16181D]">
            Quỹ & Ngân sách
          </h1>
          <p className="text-xs font-medium text-[#8A8D7A]">
            Tích lũy mục tiêu và quản lý khoản tiết kiệm
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold text-xs sm:text-sm px-4 py-2 h-auto shadow-sm transition-all"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Tạo quỹ
        </Button>
      </section>

      {/* 2. Responsive Grid Bố cục chính */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT BÊN TRÁI: Thẻ tổng quát & Tiến độ mục tiêu */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Hero Card Tổng Tiền Quỹ */}
          <section className="relative rounded-[26px] bg-white border border-[#E7E5DC] shadow-sm pt-6 pb-5 px-6 overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8A8D7A]">
                  <PiggyBank className="h-4 w-4 text-[#D8A13B]" />
                  Tổng tiền cất trong Quỹ
                </span>
                <p className="mt-2 font-['JetBrains_Mono'] text-3xl sm:text-4xl font-bold leading-none tabular-nums text-[#16181D]">
                  {formatVND(totalInFunds)}
                </p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFD7] rotate-6 text-[#B4832B]">
                <PiggyBank className="h-6 w-6" />
              </span>
            </div>

            {totalTarget > 0 && (
              <div className="mt-6 pt-4 border-t border-[#EDECE6] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#8A8D7A] flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" /> Tổng mục tiêu
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[#16181D]">
                    {formatVND(totalTarget)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F3F4F1] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#109C7C] transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-right text-[#109C7C]">
                  Đã đạt {overallProgress}% kế hoạch
                </p>
              </div>
            )}
          </section>
        </div>

        {/* CỘT BÊN PHẢI: Danh sách Quỹ tiết kiệm */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-[#16181D]">
              Danh sách quỹ ({funds.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {funds.length === 0 ? (
              <div className="col-span-full rounded-[26px] border border-dashed border-[#D8D6CC] bg-white p-8 text-center text-xs sm:text-sm font-bold text-[#8A8D7A]">
                Chưa có quỹ nào — Bấm nút "Tạo quỹ" để bắt đầu tích lũy nhé
              </div>
            ) : (
              funds.map((fund) => {
                const percent =
                  fund.targetAmount > 0
                    ? Math.min(100, Math.round((fund.currentAmount / fund.targetAmount) * 100))
                    : 0;

                return (
                  <div
                    key={fund.id}
                    className="rounded-[22px] bg-white border border-[#E7E5DC] p-4 shadow-sm hover:border-[#D8D6CC] transition-all space-y-3 flex flex-col justify-between"
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
                            <h3 className="truncate text-xs sm:text-sm font-extrabold text-[#16181D]">
                              {fund.name}
                            </h3>
                            <button
                              onClick={() => handleOpenEditModal(fund)}
                              className="text-[#8A8D7A] hover:text-[#16181D] transition-colors p-0.5"
                              aria-label="Sửa quỹ"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] font-semibold text-[#8A8D7A] truncate">
                            Mục tiêu: {fund.targetAmount > 0 ? formatVND(fund.targetAmount) : "Không giới hạn"}
                          </p>

                          {fund.deadline && (
                            <p className="text-[10px] font-medium text-[#8A8D7A] flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" /> Hạn: {fund.deadline}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedFundForTransfer(fund);
                          setTransferOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[#E3E2DC] bg-[#F9F9F8] hover:bg-[#EAE9E3] text-[11px] sm:text-xs font-bold text-[#16181D] gap-1 shrink-0 h-8 px-2.5"
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5 text-[#8A8D7A]" /> Chuyển
                      </Button>
                    </div>

                    {/* Thanh tiến độ */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs font-['JetBrains_Mono'] font-bold">
                        <span style={{ color: fund.color }}>
                          {formatVND(fund.currentAmount)}
                        </span>
                        {fund.targetAmount > 0 && (
                          <span className="text-[#8A8D7A]">{percent}%</span>
                        )}
                      </div>
                      {fund.targetAmount > 0 && (
                        <div className="h-2 w-full rounded-full bg-[#F3F4F1] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: fund.color,
                            }}
                          />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveFund}
            className="w-full max-w-sm rounded-[26px] bg-white p-6 space-y-4 shadow-xl border border-[#E7E5DC] max-h-[90vh] overflow-y-auto font-['Be_Vietnam_Pro']"
          >
            <div className="flex items-center justify-between border-b pb-3 border-[#E3E2DC]">
              <h3 className="text-base font-extrabold text-[#16181D]">
                {editingFund ? "Chỉnh sửa Quỹ" : "Tạo Quỹ mới"}
              </h3>
              {editingFund && (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="text-xs font-bold text-[#EF4444] flex items-center gap-1 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Xoá
                </button>
              )}
            </div>

            {/* Chọn Emoji */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#16181D]">Biểu tượng (Icon)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-12 h-10 rounded-xl border border-[#EDECE6] text-center text-xl bg-[#F3F4F1] focus:outline-none"
                />
                <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-[220px]">
                  {PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormIcon(icon)}
                      className={`h-9 w-9 rounded-xl text-base flex items-center justify-center shrink-0 border transition-all ${
                        formIcon === icon ? "border-[#16181D] bg-[#F3F4F1]" : "border-transparent hover:bg-[#F3F4F1]/50"
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
              <label className="text-xs font-bold text-[#16181D]">Tên Quỹ</label>
              <input
                type="text"
                placeholder="Ví dụ: Đi chơi, Mua iPad..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full rounded-xl border border-[#EDECE6] p-2.5 text-xs sm:text-sm font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
              />
            </div>

            {/* Số tiền mục tiêu */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16181D]">Mục tiêu (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                className="w-full rounded-xl border border-[#EDECE6] p-2.5 font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
              />
            </div>

            {/* Thời hạn Quỹ */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16181D]">Thời hạn hoàn thành (Không bắt buộc)</label>
              <input
                type="date"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full rounded-xl border border-[#EDECE6] p-2.5 text-xs font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
              />
            </div>

            {/* Màu sắc chủ đạo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#16181D]">Màu sắc chủ đạo</label>
              <div className="flex gap-2.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormColor(color)}
                    className={`h-7 w-7 rounded-full border-2 transition-transform active:scale-90 ${
                      formColor === color ? "scale-110 border-[#16181D]" : "border-transparent"
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
                className="flex-1 rounded-full text-xs font-bold text-[#8A8D7A] hover:bg-[#F3F4F1]"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-full bg-[#16181D] text-xs font-bold text-white hover:bg-[#2A2E37]"
              >
                {editingFund ? "Cập nhật" : "Tạo quỹ"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Bảng hỏi xác nhận xoá Quỹ */}
      {deleteConfirmOpen && editingFund && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-[26px] bg-white p-5 text-center space-y-4 shadow-2xl border border-[#E7E5DC] font-['Be_Vietnam_Pro']">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FCE4E0] text-[#EF5B45]">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-[#16181D]">
                Xoá quỹ "{editingFund.name}"?
              </h4>
              <p className="text-xs font-medium text-[#8A8D7A]">
                Thao tác này không thể hoàn tác. Bạn có chắc chắn muốn xoá?
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 rounded-full text-xs font-bold text-[#8A8D7A] bg-[#F3F4F1] hover:bg-[#EAE9E3]"
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

      {/* Modal 3: Chuyển tiền Ví <-> Quỹ */}
      {transferOpen && selectedFundForTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleTransfer}
            className="w-full max-w-sm rounded-[26px] bg-white p-6 space-y-4 shadow-xl border border-[#E7E5DC] font-['Be_Vietnam_Pro']"
          >
            <div className="flex items-center justify-between border-b pb-3 border-[#E3E2DC]">
              <h3 className="text-base font-extrabold text-[#16181D]">
                Chuyển tiền — {selectedFundForTransfer.name}
              </h3>
            </div>

            {/* Hướng chuyển */}
            <div className="flex rounded-full bg-[#F3F4F1] p-1">
              <button
                type="button"
                onClick={() => setTransferType("in")}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                  transferType === "in"
                    ? "bg-[#16181D] text-white shadow-sm"
                    : "text-[#8A8D7A]"
                }`}
              >
                <ArrowDownRight className="h-3.5 w-3.5 text-[#109C7C]" /> Cất vào Quỹ
              </button>
              <button
                type="button"
                onClick={() => setTransferType("out")}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                  transferType === "out"
                    ? "bg-[#16181D] text-white shadow-sm"
                    : "text-[#8A8D7A]"
                }`}
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-[#EF5B45]" /> Rút về Ví
              </button>
            </div>

            {/* Chọn Ví liên kết */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16181D] flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5 text-[#109C7C]" /> Chọn Ví giao dịch
              </label>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                required
                className="w-full rounded-xl border border-[#EDECE6] p-2.5 text-xs sm:text-sm font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
              >
                <option value="">-- Chọn Ví --</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({formatVND(w.initial_balance ?? 0)})
                  </option>
                ))}
              </select>
            </div>

            {/* Nhập số tiền */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16181D]">Số tiền (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                required
                className="w-full rounded-xl border border-[#EDECE6] p-2.5 font-['JetBrains_Mono'] text-base font-bold text-[#16181D] bg-[#F3F4F1] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setTransferOpen(false)}
                className="flex-1 rounded-full text-xs font-bold text-[#8A8D7A] hover:bg-[#F3F4F1]"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-full bg-[#109C7C] text-xs font-bold text-white hover:bg-[#0E8569]"
              >
                Xác nhận
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}