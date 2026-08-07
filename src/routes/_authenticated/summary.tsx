import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Wallet as WalletIcon, PieChart, Coins } from "lucide-react";
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

  // Tính số dư thực tế của từng ví = Số dư ban đầu + Thu - Chi
  const balances = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of wallets) map.set(w.id, w.initial_balance ?? 0);
    for (const t of txs) {
      if (!t.wallet_id) continue;
      map.set(
        t.wallet_id,
        (map.get(t.wallet_id) ?? 0) + (t.type === "income" ? t.amount : -t.amount)
      );
    }
    return map;
  }, [wallets, txs]);

  // Tổng tài sản = Tổng số dư thực tế của tất cả các ví
  const total = useMemo(
    () => wallets.reduce((sum, w) => sum + (balances.get(w.id) ?? 0), 0),
    [wallets, balances]
  );

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

  const handleDeleteWallet = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa ví "${name}" không?`)) {
      del.mutate(id, {
        onSuccess: () => toast.success("Đã xóa ví thành công"),
        onError: (err) => toast.error((err as Error).message),
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      
      {/* 1. Header Trang Tóm Tắt */}
      <section className="flex items-center justify-between pb-3 border-b border-[#E3E2DC]">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16181D]">
            Tóm tắt tài chính
          </h1>
          <p className="text-xs font-medium text-[#8A8D7A]">
            Quản lý ví và phân tích chi tiêu
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold text-xs sm:text-sm px-4 py-2 h-auto shadow-sm transition-all"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Thêm ví
        </Button>
      </section>

      {/* 2. Hero Card Tổng Tài Sản */}
      <section className="relative rounded-[26px] bg-white border border-[#E7E5DC] shadow-sm pt-6 pb-5 px-6 overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8A8D7A]">
              <Coins className="h-4 w-4 text-[#D8A13B]" />
              Tổng tài sản thực tế
            </span>
            <p className="mt-2 font-['JetBrains_Mono'] text-3xl sm:text-4xl font-bold leading-none tabular-nums text-[#16181D]">
              {formatVND(total)}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FBEFD7] rotate-6 text-[#B4832B]">
            <WalletIcon className="h-6 w-6" />
          </span>
        </div>
      </section>

      {/* 3. Bố cục Grid Responsive (1 Cột iPhone, 2 Cột MacBook/Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT BÊN TRÁI: Danh sách Ví */}
        <section className="lg:col-span-7 xl:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-[#16181D] flex items-center gap-2">
              <WalletIcon className="h-4.5 w-4.5 text-[#109C7C]" />
              Ví của bạn ({wallets.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {wallets.length === 0 ? (
              <div className="col-span-full rounded-[22px] border border-dashed border-[#D8D6CC] bg-white p-8 text-center text-xs font-bold text-[#8A8D7A]">
                Chưa có ví nào trong tài khoản — Bấm "+ Thêm ví" để bắt đầu
              </div>
            ) : (
              wallets.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between rounded-[22px] bg-white border border-[#E7E5DC] p-4 shadow-sm hover:border-[#D8D6CC] transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                      style={{ backgroundColor: w.color || "#109C7C" }}
                    >
                      <Icon name={w.icon || "Wallet"} className="h-5.5 w-5.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-extrabold text-[#16181D]">
                        {w.name}
                      </p>
                      <p className="font-['JetBrains_Mono'] text-sm sm:text-base font-bold tabular-nums text-[#16181D]">
                        {formatVND(balances.get(w.id) ?? 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(w);
                        setOpen(true);
                      }}
                      className="h-8 w-8 rounded-full text-[#8A8D7A] hover:text-[#16181D] hover:bg-[#F3F4F1]"
                      aria-label="Sửa ví"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWallet(w.id, w.name)}
                      className="h-8 w-8 rounded-full text-[#8A8D7A] hover:text-[#EF5B45] hover:bg-[#FCE4E0]"
                      aria-label="Xoá ví"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#EF5B45]" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* CỘT BÊN PHẢI: Thống kê Chi tiêu theo Phân loại */}
        {byCategory.list.length > 0 && (
          <section className="lg:col-span-5 xl:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm sm:text-base font-extrabold text-[#16181D] flex items-center gap-2">
                <PieChart className="h-4.5 w-4.5 text-[#EF5B45]" />
                Chi tiêu theo phân loại
              </h2>
            </div>

            <div className="rounded-[26px] border border-[#E7E5DC] bg-white p-5 shadow-sm space-y-4">
              {byCategory.list.map(({ category, amount }) => (
                <div key={category!.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="flex items-center gap-2 font-bold text-[#16181D]">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${category!.color}20`, color: category!.color }}
                      >
                        <Icon name={category!.icon} className="h-3.5 w-3.5" />
                      </span>
                      {category!.name}
                    </span>
                    <span className="font-['JetBrains_Mono'] font-bold text-[#16181D] tabular-nums">
                      {formatVND(amount)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F4F1]">
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
          </section>
        )}

      </div>

      {/* Dialog Thêm/Sửa Ví */}
      <WalletDialog open={open} onOpenChange={setOpen} editing={editing} />
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
      <DialogContent className="sm:max-w-md rounded-[26px] bg-white p-6 font-['Be_Vietnam_Pro'] border-[#E7E5DC]" key={key}>
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold text-[#16181D]">
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
          className="w-full rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold py-2.5 h-auto transition-all mt-2"
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
        <Label htmlFor="w-name" className="text-xs font-bold text-[#16181D]">Tên ví</Label>
        <Input
          id="w-name"
          value={props.name}
          maxLength={40}
          placeholder="Tiền mặt, Momo, BIDV..."
          onChange={(e) => props.setName(e.target.value)}
          className="rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] font-medium text-xs sm:text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="w-init" className="text-xs font-bold text-[#16181D]">Số dư ban đầu</Label>
        <Input
          id="w-init"
          type="number"
          value={props.initial}
          onChange={(e) => props.setInitial(e.target.value)}
          className="rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] font-['JetBrains_Mono'] font-bold text-xs sm:text-sm"
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
        <Label className="text-xs font-bold text-[#16181D]">Màu sắc</Label>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={cn(
                "h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition-all active:scale-90",
                color === c && "ring-2 ring-[#16181D]"
              )}
              aria-label={`Màu ${c}`}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-[#16181D]">Biểu tượng</Label>
        <div className="grid max-h-32 grid-cols-8 gap-1.5 overflow-y-auto p-1 bg-[#F3F4F1] rounded-xl border border-[#EDECE6]">
          {ICON_NAMES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setIcon(n)}
              className={cn(
                "flex h-9 items-center justify-center rounded-lg border transition-all active:scale-90",
                icon === n ? "border-[#16181D] bg-white text-[#16181D] shadow-sm" : "border-transparent text-[#8A8D7A] hover:bg-white/50"
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