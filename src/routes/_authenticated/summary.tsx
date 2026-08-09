import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Pencil,
  Plus,
  Trash2,
  Wallet as WalletIcon,
  PieChart,
  Coins,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  LayoutGrid,
  List,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Icon, ICON_NAMES, PALETTE } from "@/lib/icons";
import { formatVND } from "@/lib/money";
import {
  useAllTransactions,
  useCategories,
  useDeleteWallet,
  useSaveWallet,
  useWallets,
  type Wallet,
} from "@/lib/db";

export const Route = createFileRoute("/_authenticated/summary")({
  head: () => ({
    meta: [
      { title: "Tóm tắt — Xu" },
      { name: "description", content: "Số dư từng ví và tổng quan thu chi của bạn." },
      { property: "og:title", content: "Tóm tắt — Xu" },
      { property: "og:description", content: "Số dư từng ví và tổng quan thu chi của bạn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SummaryPage,
});

function SummaryPage() {
  const { data: wallets = [] } = useWallets();
  const { data: txs = [] } = useAllTransactions();
  const { data: categories = [] } = useCategories();
  const del = useDeleteWallet();
  const [editing, setEditing] = useState<Wallet | null>(null);
  const [open, setOpen] = useState(false);

  // Chế độ xem: 'grid' hoặc 'list'
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // State quản lý Modal xác nhận xóa ví
  const [deletingWallet, setDeletingWallet] = useState<Wallet | null>(null);

 // 💡 TÍNH SỐ DƯ THỰC TẾ CỦA TỪNG VÍ:
const balances = useMemo(() => {
  const map = new Map<string, number>();
  
  // 1. Khởi tạo số dư ban đầu cho tất cả các ví
  for (const w of wallets) {
    map.set(w.id, w.initial_balance ?? 0);
  }

  // 2. Duyệt qua từng giao dịch để cộng/trừ tiền
  for (const t of txs) {
    if (!t.wallet_id) continue;

    const currentBalance = map.get(t.wallet_id) ?? 0;

    if (t.type === "income") {
      // Thu nhập: Cộng tiền vào ví
      map.set(t.wallet_id, currentBalance + t.amount);
    } else if (t.type === "expense" || t.type === "budget" || t.type === "transfer") {
      // Chi tiêu / Nạp Quỹ / Chuyển khoản: Trừ tiền khỏi ví
      map.set(t.wallet_id, currentBalance - t.amount);
    }
  }

  return map;
}, [wallets, txs]);

  // Tổng tài sản = Tổng số dư thực tế của tất cả các ví
  const total = useMemo(
    () => wallets.reduce((sum, w) => sum + (balances.get(w.id) ?? 0), 0),
    [wallets, balances]
  );

  // Tính tổng Thu & Tổng Chi
  const { totalIncome, totalExpense } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const t of txs) {
      if (t.type === "income") inc += t.amount;
      if (t.type === "expense") exp += t.amount;
    }
    return { totalIncome: inc, totalExpense: exp };
  }, [txs]);

  // Thống kê chi tiêu theo từng danh mục
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of txs) {
      if (t.type !== "expense" || !t.category_id) continue;
      map.set(t.category_id, (map.get(t.category_id) ?? 0) + t.amount);
    }
    const list = [...map.entries()]
      .map(([id, amount]) => ({ category: categories.find((c) => c.id === id), amount }))
      .filter((x) => x.category)
      .sort((a, b) => b.amount - a.amount);
    const max = list[0]?.amount ?? 1;
    return { list, max };
  }, [txs, categories]);

  const confirmDelete = () => {
    if (!deletingWallet) return;
    del.mutate(deletingWallet.id, {
      onSuccess: () => {
        toast.success("Đã xóa ví thành công");
        setDeletingWallet(null);
      },
      onError: (err) => toast.error((err as Error).message),
    });
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-5 bg-[#F8F9FA] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      
      {/* 1. Header Trang Tóm Tắt */}
      <section className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
            Tóm tắt tài chính
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Quản lý ví và phân tích dòng tiền tổng quan
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-full bg-primary hover:bg-[#0E8A6E] text-white font-bold text-xs sm:text-sm px-4 py-2 h-auto shadow-sm transition-all"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Thêm ví
        </Button>
      </section>

      {/* 2. Hero Cards Tổng Quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="rounded-[22px] bg-white border border-slate-200/80 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <Coins className="h-3.5 w-3.5 text-primary" />
                Tổng tài sản thực tế
              </span>
              <p className="mt-1.5 font-['JetBrains_Mono'] text-2xl font-bold leading-none tabular-nums text-slate-900">
                {formatVND(total)}
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-primary">
              <WalletIcon className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Tổng từ {wallets.length} ví
          </div>
        </div>

        <div className="rounded-[22px] bg-white border border-slate-200/80 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <ArrowDownRight className="h-3.5 w-3.5 text-emerald-600" />
                Tổng thu nhập
              </span>
              <p className="mt-1.5 font-['JetBrains_Mono'] text-2xl font-bold leading-none tabular-nums text-emerald-600">
                {formatVND(totalIncome)}
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownRight className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
            Tổng dòng tiền vào
          </div>
        </div>

        <div className="rounded-[22px] bg-white border border-slate-200/80 shadow-sm p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <ArrowUpRight className="h-3.5 w-3.5 text-[#EF5B45]" />
                Tổng đã chi
              </span>
              <p className="mt-1.5 font-['JetBrains_Mono'] text-2xl font-bold leading-none tabular-nums text-slate-900">
                {formatVND(totalExpense)}
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-[#EF5B45]">
              <ArrowUpRight className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
            Tổng dòng tiền ra
          </div>
        </div>
      </div>

      {/* 3. Bố cục Grid / List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* CỘT BÊN TRÁI: Danh sách Ví (Chiếm 7/12 cột) */}
        <section className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <WalletIcon className="h-4 w-4 text-primary" />
              Ví của bạn ({wallets.length})
            </h2>

            {/* Nút Chuyển Đổi Chế Độ View: Grid / List */}
            <div className="flex items-center rounded-lg bg-slate-200/60 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 text-xs font-semibold transition-all",
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                )}
                aria-label="Chế độ lưới"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 text-xs font-semibold transition-all",
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                )}
                aria-label="Chế độ danh sách"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Dạng hiển thị động dựa vào state viewMode */}
          {wallets.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-slate-300 bg-white p-8 text-center text-xs font-bold text-slate-500">
              Chưa có ví nào trong tài khoản — Bấm "+ Thêm ví" để bắt đầu
            </div>
          ) : viewMode === "grid" ? (
            /* BIỂU DIỄN DẠNG LƯỚI (GRID) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wallets.map((w) => (
                <div
                  key={w.id}
                  className="flex flex-col justify-between rounded-[20px] bg-white border border-slate-200/80 p-3.5 shadow-sm hover:border-slate-300 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: w.color || "#109C7C" }}
                    >
                      <Icon name={w.icon || "Wallet"} className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(w);
                          setOpen(true);
                        }}
                        className="h-7 w-7 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                        aria-label="Sửa ví"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingWallet(w)}
                        className="h-7 w-7 rounded-full text-slate-400 hover:text-[#EF5B45] hover:bg-rose-50"
                        aria-label="Xoá ví"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-[#EF5B45]" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="truncate text-xs font-bold text-slate-500">
                      {w.name}
                    </p>
                    <p className="font-['JetBrains_Mono'] text-base font-bold tabular-nums text-slate-900 mt-0.5">
                      {formatVND(balances.get(w.id) ?? 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* BIỂU DIỄN DẠNG DANH SÁCH (LIST) */
            <div className="rounded-[20px] bg-white border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {wallets.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3 sm:p-3.5 hover:bg-slate-50/80 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: w.color || "#109C7C" }}
                    >
                      <Icon name={w.icon || "Wallet"} className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-extrabold text-slate-900">
                        {w.name}
                      </p>
                      <p className="font-['JetBrains_Mono'] text-xs font-bold tabular-nums text-slate-600">
                        {formatVND(balances.get(w.id) ?? 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(w);
                        setOpen(true);
                      }}
                      className="h-7 w-7 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                      aria-label="Sửa ví"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingWallet(w)}
                      className="h-7 w-7 rounded-full text-slate-400 hover:text-[#EF5B45] hover:bg-rose-50"
                      aria-label="Xoá ví"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#EF5B45]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CỘT BÊN PHẢI: Thống kê Chi tiêu theo Phân loại */}
        <section className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-[#EF5B45]" />
              Chi tiêu theo phân loại
            </h2>
          </div>

          <div className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm">
            {byCategory.list.length > 0 ? (
              <div className="space-y-3.5">
                {byCategory.list.map(({ category, amount }) => (
                  <div key={category!.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-2 font-bold text-slate-900">
                        <span
                          className="flex h-5.5 w-5.5 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${category!.color}20`, color: category!.color }}
                        >
                          <Icon name={category!.icon} className="h-3.5 w-3.5" />
                        </span>
                        {category!.name}
                      </span>
                      <span className="font-['JetBrains_Mono'] font-bold text-slate-900 tabular-nums text-xs">
                        {formatVND(amount)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(4, (amount / byCategory.max) * 100)}%`,
                          backgroundColor: category!.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 space-y-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Inbox className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">Chưa có dữ liệu chi tiêu</p>
                <p className="text-[11px] font-medium text-slate-400 max-w-[200px]">
                  Các khoản chi theo danh mục sẽ tự động tổng hợp và hiển thị tại đây.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Dialog Thêm/Sửa Ví */}
      <WalletDialog open={open} onOpenChange={setOpen} editing={editing} />

      {/* Dialog XÁC NHẬN XÓA VÍ */}
      <Dialog open={!!deletingWallet} onOpenChange={(v) => !v && setDeletingWallet(null)}>
        <DialogContent className="sm:max-w-sm rounded-[26px] bg-white p-6 font-['Be_Vietnam_Pro'] border-slate-200">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-[#EF5B45]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold text-slate-900">
                Xác nhận xóa ví?
              </DialogTitle>
            </DialogHeader>
            <p className="text-xs font-medium text-slate-500">
              Bạn có chắc chắn muốn xóa ví <span className="font-bold text-slate-900">"{deletingWallet?.name}"</span> không? Hành động này không thể hoàn tác.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-full border-slate-200 font-bold text-xs py-2.5 h-auto text-slate-900 hover:bg-slate-100"
              onClick={() => setDeletingWallet(null)}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 rounded-full bg-[#EF5B45] hover:bg-[#DC4C37] text-white font-bold text-xs py-2.5 h-auto transition-all"
              onClick={confirmDelete}
              disabled={del.isPending}
            >
              {del.isPending ? "Đang xóa..." : "Xóa ví"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function WalletDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Wallet | null;
}) {
  const save = useSaveWallet();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Wallet");
  const [color, setColor] = useState(PALETTE[0]!);
  const [initial, setInitial] = useState("0");

  const key = `${open}-${editing?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[26px] bg-white p-6 font-['Be_Vietnam_Pro'] border-slate-200" key={key}>
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold text-slate-900">
            {editing ? "Sửa ví" : "Thêm ví mới"}
          </DialogTitle>
        </DialogHeader>
        <WalletForm
          initialValues={editing}
          name={name}
          setName={setName}
          icon={icon}
          setIcon={setIcon}
          color={color}
          setColor={setColor}
          initial={initial}
          setInitial={setInitial}
        />
        <Button
          className="w-full rounded-full bg-primary hover:bg-[#0E8A6E] text-white font-bold py-2.5 h-auto transition-all mt-2"
          onClick={async () => {
            if (!name.trim()) {
              toast.error("Nhập tên ví");
              return;
            }
            try {
              await save.mutateAsync({
                ...(editing?.id ? { id: editing.id } : {}),
                name: name.trim(),
                icon,
                color,
                initial_balance: Number(initial) || 0,
              });
              toast.success("Đã lưu ví");
              onOpenChange(false);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        >
          Lưu ví
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function WalletForm(props: {
  initialValues: Wallet | null;
  name: string;
  setName: (v: string) => void;
  icon: string;
  setIcon: (v: string) => void;
  color: string;
  setColor: (v: string) => void;
  initial: string;
  setInitial: (v: string) => void;
}) {
  const { initialValues } = props;
  const [ready, setReady] = useState(false);
  if (!ready) {
    props.setName(initialValues?.name ?? "");
    props.setIcon(initialValues?.icon ?? "Wallet");
    props.setColor(initialValues?.color ?? PALETTE[0]!);
    props.setInitial(String(initialValues?.initial_balance ?? 0));
    setReady(true);
  }

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label htmlFor="w-name" className="text-xs font-bold text-slate-900">Tên ví</Label>
        <Input
          id="w-name"
          value={props.name}
          maxLength={40}
          placeholder="Tiền mặt, Momo, BIDV..."
          onChange={(e) => props.setName(e.target.value)}
          className="rounded-xl border-slate-200 bg-[#F8F9FA] focus-visible:ring-[#109C7C] font-medium text-xs sm:text-sm text-slate-900"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="w-init" className="text-xs font-bold text-slate-900">Số dư ban đầu</Label>
        <Input
          id="w-init"
          type="number"
          value={props.initial}
          onChange={(e) => props.setInitial(e.target.value)}
          className="rounded-xl border-slate-200 bg-[#F8F9FA] focus-visible:ring-[#109C7C] font-['JetBrains_Mono'] font-bold text-xs sm:text-sm text-slate-900"
        />
      </div>
      <IconColorPicker
        icon={props.icon}
        color={props.color}
        setIcon={props.setIcon}
        setColor={props.setColor}
      />
    </div>
  );
}

export function IconColorPicker({
  icon,
  color,
  setIcon,
  setColor,
}: {
  icon: string;
  color: string;
  setIcon: (v: string) => void;
  setColor: (v: string) => void;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-900">Màu sắc</Label>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={cn(
                "h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition-all active:scale-90",
                color === c && "ring-2 ring-slate-900"
              )}
              aria-label={`Màu ${c}`}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-900">Biểu tượng</Label>
        <div className="grid max-h-32 grid-cols-8 gap-1.5 overflow-y-auto p-1 bg-[#F8F9FA] rounded-xl border border-slate-200">
          {ICON_NAMES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setIcon(n)}
              className={cn(
                "flex h-9 items-center justify-center rounded-lg border transition-all active:scale-90",
                icon === n ? "border-slate-900 bg-white text-slate-900 shadow-sm" : "border-transparent text-slate-400 hover:bg-white/50"
              )}
              aria-label={n}
            >
              <Icon name={n} className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}