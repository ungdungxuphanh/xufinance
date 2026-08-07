import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Icon } from "@/lib/icons";
import { evalExpression, ymd } from "@/lib/money";
import { Calculator } from "@/components/Calculator";
import {
  useCategories,
  useNotes,
  useSaveNote,
  useSaveTransaction,
  useWallets,
  type Transaction,
  type TxType,
} from "@/lib/db";

export function TransactionDialog({
  open,
  onOpenChange,
  date,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  date: Date;
  editing?: Transaction | null;
}) {
  const { data: categories = [] } = useCategories();
  const { data: wallets = [] } = useWallets();
  const { data: notes = [] } = useNotes();
  const save = useSaveTransaction();
  const saveNote = useSaveNote();

  const [type, setType] = useState<TxType>("expense");
  const [expr, setExpr] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [day, setDay] = useState(ymd(date));

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setType(editing.type);
      setExpr(String(editing.amount));
      setCategoryId(editing.category_id);
      setWalletId(editing.wallet_id);
      setNote(editing.note ?? "");
      setDay(editing.occurred_on);
    } else {
      setType("expense");
      setExpr("");
      setCategoryId(null);
      setWalletId(wallets[0]?.id ?? null);
      setNote("");
      setDay(ymd(date));
    }
  }, [open, editing, date, wallets]);

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type],
  );
  const categoryNotes = useMemo(
    () => notes.filter((n) => n.category_id === categoryId),
    [notes, categoryId],
  );

  const amount = evalExpression(expr);

  async function submit() {
    if (!amount || amount <= 0) {
      toast.error("Nhập số tiền hợp lệ");
      return;
    }
    if (!categoryId) {
      toast.error("Chọn một phân loại");
      return;
    }
    try {
      await save.mutateAsync({
        ...(editing?.id ? { id: editing.id } : {}),
        type,
        amount,
        category_id: categoryId,
        wallet_id: walletId,
        occurred_on: day,
        note: note.trim() || null,
      });
      toast.success(editing ? "Đã cập nhật" : "Đã lưu giao dịch");
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="font-display">
            {editing ? "Sửa giao dịch" : "Thêm giao dịch"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
              {(["income", "expense"] as TxType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setCategoryId(null);
                  }}
                  className={cn(
                    "rounded-xl py-2 font-display text-sm font-semibold transition-all",
                    type === t
                      ? t === "income"
                        ? "bg-income text-income-foreground shadow-sm"
                        : "bg-expense text-expense-foreground shadow-sm"
                      : "text-muted-foreground",
                  )}
                >
                  {t === "income" ? "Thu nhập" : "Chi tiêu"}
                </button>
              ))}
            </div>

            <Calculator value={expr} onChange={setExpr} tone={type} />

            <div className="space-y-2">
              <Label>Phân loại</Label>
              <div className="flex flex-wrap gap-2">
                {visibleCategories.map((c) => {
                  const active = c.id === categoryId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      style={
                        active
                          ? { backgroundColor: c.color, borderColor: c.color }
                          : { borderColor: `${c.color}55`, color: c.color }
                      }
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                        active && "text-white shadow-sm",
                      )}
                    >
                      <Icon name={c.icon} className="h-4 w-4" />
                      {c.name}
                    </button>
                  );
                })}
                {visibleCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có phân loại — tạo ở mục Phân loại.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ví</Label>
                <div className="flex flex-wrap gap-2">
                  {wallets.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWalletId(w.id)}
                      style={
                        walletId === w.id
                          ? { backgroundColor: w.color, borderColor: w.color }
                          : { borderColor: `${w.color}55`, color: w.color }
                      }
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
                        walletId === w.id && "text-white",
                      )}
                    >
                      <Icon name={w.icon} className="h-4 w-4" />
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tx-date">Ngày</Label>
                <Input
                  id="tx-date"
                  type="date"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tx-note">Ghi chú</Label>
              <div className="flex gap-2">
                <Input
                  id="tx-note"
                  value={note}
                  placeholder="Ví dụ: mua thịt"
                  maxLength={200}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Lưu ghi chú nhanh cho phân loại này"
                  disabled={!categoryId || !note.trim()}
                  onClick={async () => {
                    await saveNote.mutateAsync({ category_id: categoryId!, text: note.trim() });
                    toast.success("Đã lưu ghi chú nhanh");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {categoryNotes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {categoryNotes.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setNote(n.text)}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground hover:bg-accent"
                    >
                      {n.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <Button
            className="w-full font-display"
            size="lg"
            onClick={submit}
            disabled={save.isPending}
          >
            <Check className="mr-1 h-4 w-4" />
            {editing ? "Cập nhật" : "Lưu giao dịch"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
