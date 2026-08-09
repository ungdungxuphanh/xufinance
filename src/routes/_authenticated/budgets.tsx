import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  PiggyBank,
  ArrowRightLeft,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Pencil,
  Trash2,
  Calendar,
  Target,
  Sparkles,
  X,
  History,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/money";
import {
  useWallets,
  useBudgets,
  useSaveBudget,
  useDeleteBudget,
  useUpdateBudgetAmount,
  useTransactions,
  useSaveTransaction,
  useDeleteTransaction,
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

type DateFilterType = "this_week" | "this_month" | "this_year" | "custom";

export function BudgetsPage() {
  const { data: wallets = [] } = useWallets();
  const { data: funds = [], isLoading } = useBudgets();

  // Fetch toàn bộ giao dịch
  const { data: transactions = [] } = useTransactions("2000-01-01", "2099-12-31");

  // React Query Mutation Hooks
  const saveBudget = useSaveBudget();
  const deleteBudget = useDeleteBudget();
  const updateBudgetAmount = useUpdateBudgetAmount();
  const saveTransaction = useSaveTransaction();
  const deleteTransaction = useDeleteTransaction();

  // Modals state
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Modal Sửa giao dịch
  const [editTxModalOpen, setEditTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [editTxNote, setEditTxNote] = useState("");
  const [editTxAmount, setEditTxAmount] = useState("");
  const [editTxBudgetId, setEditTxBudgetId] = useState(""); // <-- Thêm dòng này

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

  // --- LỊCH SỬ GIAO DỊCH & BỘ LỌC ---
  const [dateFilter, setDateFilter] = useState<DateFilterType>("this_week");
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [customEndDate, setCustomEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFundId, setFilterFundId] = useState<string>("all");

  // Thống kê tính toán Quỹ
  const totalInFunds = useMemo(() => {
    return funds.reduce((sum, f) => sum + Number(f.current_amount || 0), 0);
  }, [funds]);

  const totalTarget = useMemo(() => {
    return funds.reduce((sum, f) => sum + Number(f.target_amount || 0), 0);
  }, [funds]);

  const totalRemaining = useMemo(() => {
    return Math.max(0, totalTarget - totalInFunds);
  }, [totalTarget, totalInFunds]);

  const overallProgress = useMemo(() => {
    if (totalTarget === 0) return 0;
    return Math.min(100, Math.round((totalInFunds / totalTarget) * 100));
  }, [totalInFunds, totalTarget]);

  // Map Wallet & Fund name
  const walletMap = useMemo(() => {
    return new Map(wallets.map((w) => [w.id, w.name]));
  }, [wallets]);

  const fundMap = useMemo(() => {
    return new Map(funds.map((f) => [f.id, f]));
  }, [funds]);

  // SỬA LỖI LỌC GIAO DỊCH: Không làm thay đổi biến `now` gốc
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (dateFilter === "this_week") {
      const d = new Date(now);
      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diffToMonday);
      d.setHours(0, 0, 0, 0);
      startDate = d;
    } else if (dateFilter === "this_month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    } else if (dateFilter === "this_year") {
      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    } else {
      startDate = customStartDate ? new Date(customStartDate) : new Date(0);
      startDate.setHours(0, 0, 0, 0);
      if (customEndDate) {
        endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    return transactions.filter((t: any) => {
      // Nhận diện giao dịch Quỹ linh hoạt hơn
      const noteStr = String(t.note || "").toLowerCase();
      const categoryStr = String(t.category || "").toLowerCase();
      const isBudgetTx =
        Boolean(t.budget_id) ||
        String(t.type) === "budget" ||
        categoryStr.includes("quỹ") ||
        noteStr.includes("quỹ");

      if (!isBudgetTx) return false;

      // Lọc theo Quỹ
      if (filterFundId !== "all" && t.budget_id !== filterFundId) {
        return false;
      }

      // Lọc theo khoảng thời gian
      const rawDate = t.date || t.created_at || t.time;
      if (rawDate) {
        const txDate = new Date(rawDate);
        if (txDate < startDate || txDate > endDate) {
          return false;
        }
      }

      // Lọc theo từ khóa
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const noteMatch = noteStr.includes(q);
        const walletMatch = (walletMap.get(t.wallet_id || "") || "").toLowerCase().includes(q);
        const fundMatch = (fundMap.get(t.budget_id || "")?.name || "").toLowerCase().includes(q);
        if (!noteMatch && !walletMatch && !fundMatch) return false;
      }

      return true;
    }).sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.created_at || 0).getTime();
      const dateB = new Date(b.date || b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [transactions, dateFilter, customStartDate, customEndDate, searchQuery, filterFundId, walletMap, fundMap]);

  // --- HANDLERS VẬN HÀNH QUỸ ---
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

  const handleOpenTransferModal = (fund: Budget) => {
    setSelectedFundForTransfer(fund);
    setSelectedWalletId(wallets[0]?.id || "");
    setAmountInput("");
    setTransferType("in");
    setTransferOpen(true);
  };

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

  const handleConfirmDeleteFund = async () => {
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

      // 1. Cập nhật số dư Quỹ
      await updateBudgetAmount.mutateAsync({
        id: selectedFundForTransfer.id,
        current_amount: updatedAmount,
      });

      // 2. Ghi lịch sử giao dịch
      if (saveTransaction) {
        await saveTransaction.mutateAsync({
          wallet_id: selectedWalletId,
          budget_id: selectedFundForTransfer.id,
          amount: amount,
          type: transferType === "in" ? "expense" : "income",
          category: transferType === "in" ? "Nạp quỹ" : "Rút quỹ",
          note: transferType === "in"
            ? `Cất tiền vào quỹ ${selectedFundForTransfer.name}`
            : `Rút tiền từ quỹ ${selectedFundForTransfer.name}`,
          date: new Date().toISOString().split("T")[0],
        } as any);
      }

      toast.success(transferType === "in" ? "Đã cất tiền vào Quỹ" : "Đã rút tiền về Ví");
      setTransferOpen(false);
      setAmountInput("");
    } catch (err) {
      toast.error((err as Error).message || "Chuyển tiền thất bại");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // --- XỬ LÝ XÓA & SỬA GIAO DỊCH QUỸ ---
  const handleDeleteTx = async (tx: any) => {
    if (!confirm("Bạn có chắc muốn xóa giao dịch này? Số dư Quỹ sẽ tự động điều chỉnh lại.")) return;

    try {
      // Tự động hoàn lại số dư Quỹ
      if (tx.budget_id) {
        const fund = fundMap.get(tx.budget_id);
        if (fund) {
          const isDeposit = String(tx.type) === "budget" || String(tx.type) === "expense";
          const current = Number(fund.current_amount || 0);
          const newAmount = isDeposit
            ? Math.max(0, current - Number(tx.amount))
            : current + Number(tx.amount);

          await updateBudgetAmount.mutateAsync({
            id: fund.id,
            current_amount: newAmount,
          });
        }
      }

      if (deleteTransaction) {
        await deleteTransaction.mutateAsync(tx.id);
      }
      toast.success("Đã xóa giao dịch thành công");
    } catch (err) {
      toast.error((err as Error).message || "Không thể xóa giao dịch");
    }
  };

const handleOpenEditTx = (tx: any) => {
  setEditingTx(tx);
  setEditTxNote(tx.note || "");
  setEditTxAmount(String(tx.amount || ""));

  // Dùng optional chaining ?.id để tránh lỗi undefined
  const initialBudgetId = tx.budget_id || funds[0]?.id || "";
  setEditTxBudgetId(initialBudgetId);

  setEditTxModalOpen(true);
};

const handleSaveEditTx = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingTx) return;

  const newAmount = Number(editTxAmount);
  if (!newAmount || newAmount <= 0) {
    toast.error("Số tiền không hợp lệ");
    return;
  }

  try {
    const oldBudgetId = editingTx.budget_id;
    const newBudgetId = editTxBudgetId;
    const oldAmount = Number(editingTx.amount);
    const isDeposit = String(editingTx.type) === "budget" || String(editingTx.type) === "expense";

    // 1. Nếu ĐỔI SANG QUỸ KHÁC
    if (oldBudgetId !== newBudgetId) {
      // Trừ số tiền ở Quỹ cũ
      if (oldBudgetId) {
        const oldFund = fundMap.get(oldBudgetId);
        if (oldFund) {
          const currentOld = Number(oldFund.current_amount || 0);
          await updateBudgetAmount.mutateAsync({
            id: oldFund.id,
            current_amount: isDeposit ? Math.max(0, currentOld - oldAmount) : currentOld + oldAmount,
          });
        }
      }

      // Cộng số tiền vào Quỹ mới
      if (newBudgetId) {
        const newFund = fundMap.get(newBudgetId);
        if (newFund) {
          const currentNew = Number(newFund.current_amount || 0);
          await updateBudgetAmount.mutateAsync({
            id: newFund.id,
            current_amount: isDeposit ? currentNew + newAmount : Math.max(0, currentNew - newAmount),
          });
        }
      }
    } 
    // 2. Nếu CÙNG MỘT QUỸ nhưng THAY ĐỔI SỐ TIỀN
    else if (oldBudgetId) {
      const diff = newAmount - oldAmount;
      if (diff !== 0) {
        const fund = fundMap.get(oldBudgetId);
        if (fund) {
          const current = Number(fund.current_amount || 0);
          await updateBudgetAmount.mutateAsync({
            id: fund.id,
            current_amount: isDeposit ? current + diff : Math.max(0, current - diff),
          });
        }
      }
    }

    // 3. Cập nhật lại giao dịch trong Database
    const selectedNewFund = fundMap.get(newBudgetId);
    const updatedNote = editTxNote.trim() || (isDeposit 
      ? `Cất tiền vào quỹ ${selectedNewFund?.name || ""}` 
      : `Rút tiền từ quỹ ${selectedNewFund?.name || ""}`);

    if (saveTransaction) {
      await saveTransaction.mutateAsync({
        ...editingTx,
        budget_id: newBudgetId,
        note: updatedNote,
        amount: newAmount,
      });
    }

    toast.success("Cập nhật giao dịch thành công");
    setEditTxModalOpen(false);
  } catch (err) {
    toast.error((err as Error).message || "Cập nhật thất bại");
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
        {/* CỘT TRÁI */}
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
                              title="Sửa thông tin Quỹ"
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
                            <span className="text-[10px] text-slate-400 font-medium block">Còn lại</span>
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

      {/* 3. LỊCH SỬ GIAO DỊCH QUỸ */}
      <section className="rounded-[26px] bg-white border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Lịch sử giao dịch Quỹ
              </h2>
              <p className="text-[11px] font-medium text-slate-500">
                Danh sách nạp/rút tiền & chỉnh sửa
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setDateFilter("this_week")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                dateFilter === "this_week" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Tuần này
            </button>
            <button
              type="button"
              onClick={() => setDateFilter("this_month")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                dateFilter === "this_month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Tháng này
            </button>
            <button
              type="button"
              onClick={() => setDateFilter("this_year")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                dateFilter === "this_year" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Năm này
            </button>
            <button
              type="button"
              onClick={() => setDateFilter("custom")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                dateFilter === "custom" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Tùy chỉnh
            </button>
          </div>
        </div>

        {dateFilter === "custom" && (
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <span className="text-xs font-bold text-slate-500">Từ:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <span className="text-xs font-bold text-slate-500">Đến:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo ghi chú, ví..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={filterFundId}
            onChange={(e) => setFilterFundId(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
          >
            <option value="all">Tất cả quỹ</option>
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.icon} {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Danh sách các item giao dịch */}
        <div className="space-y-2 pt-1">
          {filteredTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs font-bold text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              Không tìm thấy giao dịch Quỹ nào trong khoảng thời gian này
            </div>
          ) : (
            filteredTransactions.map((tx: any) => {
              const fund = fundMap.get(tx.budget_id || "");
              const walletName = walletMap.get(tx.wallet_id || "") || "Ví";
              const isDeposit = String(tx.type) === "budget" || String(tx.type) === "expense";

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                        isDeposit ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {fund ? fund.icon : isDeposit ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-slate-900 truncate">
                        {tx.note || (isDeposit ? "Nạp vào quỹ" : "Rút từ quỹ")}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mt-0.5">
                        <span>{tx.date || tx.created_at || "Vừa xong"}</span>
                        <span>•</span>
                        <span className="text-slate-600">{walletName}</span>
                        {fund && (
                          <>
                            <span>•</span>
                            <span style={{ color: fund.color }}>{fund.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <div className="text-right font-['JetBrains_Mono']">
                      <span className={`text-xs sm:text-sm font-bold ${isDeposit ? "text-emerald-600" : "text-amber-600"}`}>
                        {isDeposit ? "-" : "+"}{formatVND(tx.amount)}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">
                        {isDeposit ? "Cất vào quỹ" : "Rút về ví"}
                      </span>
                    </div>

                    {/* NÚT SỬA VÀ XÓA GIAO DỊCH */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditTx(tx)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Chỉnh sửa giao dịch"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTx(tx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa giao dịch"
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
      </section>

      {/* MODAL 1: SỬA GIAO DỊCH */}
      {editTxModalOpen && (
        <div
          onClick={() => setEditTxModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveEditTx}
            className="w-full max-w-sm rounded-[26px] bg-white p-6 space-y-4 shadow-xl border border-slate-200 font-['Be_Vietnam_Pro']"
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900">Sửa giao dịch Quỹ</h3>
              <button
                type="button"
                onClick={() => setEditTxModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
<div className="space-y-1">
        <label className="text-xs font-bold text-slate-900">Chuyển sang Quỹ</label>
        <select
          value={editTxBudgetId}
          onChange={(e) => {
            setEditTxBudgetId(e.target.value);
            // Tự động điều chỉnh ghi chú theo Quỹ mới
            const newFund = fundMap.get(e.target.value);
            if (newFund) {
              const isDeposit = String(editingTx?.type) === "budget" || String(editingTx?.type) === "expense";
              setEditTxNote(isDeposit ? `Cất tiền vào quỹ ${newFund.name}` : `Rút tiền từ quỹ ${newFund.name}`);
            }
          }}
          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
        >
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.icon} {f.name}
            </option>
          ))}
        </select>
      </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Ghi chú</label>
              <input
                type="text"
                value={editTxNote}
                onChange={(e) => setEditTxNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Số tiền (VNĐ)</label>
              <input
                type="number"
                value={editTxAmount}
                onChange={(e) => setEditTxAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 font-['JetBrains_Mono'] text-xs font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditTxModalOpen(false)}
                className="flex-1 rounded-xl text-xs font-bold"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-primary hover:bg-[#0E8A6E] text-white text-xs font-bold"
              >
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: TẠO / SỬA QUỸ */}
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
                    onClick={handleConfirmDeleteFund}
                    className="text-xs font-bold text-[#EF5B45] flex items-center gap-1 hover:underline mr-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Xoá Quỹ
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Số tiền hiện tại trong quỹ (VNĐ)</label>
              <input
                type="number"
                placeholder="0"
                value={formCurrent}
                onChange={(e) => setFormCurrent(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Mục tiêu tích lũy (VNĐ)</label>
              <input
                type="number"
                placeholder="0 (không bắt buộc)"
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 font-['JetBrains_Mono'] text-xs sm:text-sm font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFundModalOpen(false)}
                className="flex-1 rounded-xl text-xs font-bold"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loadingSubmit}
                className="flex-1 rounded-xl bg-primary hover:bg-[#0E8A6E] text-white text-xs font-bold"
              >
                {loadingSubmit ? "Đang lưu..." : "Lưu Quỹ"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: CHUYỂN TIỀN (NẠP / RÚT) */}
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

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setTransferType("in")}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  transferType === "in" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                ↘ Cất vào Quỹ
              </button>
              <button
                type="button"
                onClick={() => setTransferType("out")}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  transferType === "out" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                ↗ Rút về Ví
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Chọn Ví giao dịch</label>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              >
                <option value="">-- Chọn Ví --</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
{w.name} ({formatVND((w as any).balance || (w as any).amount || 0)})                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Số tiền (VNĐ)</label>
              <input
                type="number"
                placeholder="500000"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 p-2.5 font-['JetBrains_Mono'] text-xs font-bold text-slate-900 bg-[#F8F9FA] focus:outline-none focus:border-primary"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTransferOpen(false)}
                className="flex-1 rounded-xl text-xs font-bold"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loadingSubmit}
                className="flex-1 rounded-xl bg-primary hover:bg-[#0E8A6E] text-white text-xs font-bold"
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