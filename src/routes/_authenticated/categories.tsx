import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X, Tags, ArrowDownLeft, ArrowUpRight } from "lucide-react";
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
import { Icon, PALETTE } from "@/lib/icons";
import { IconColorPicker } from "@/routes/_authenticated/summary";
import {
  useCategories,
  useDeleteCategory,
  useDeleteNote,
  useNotes,
  useSaveCategory,
  useSaveNote,
  type Category,
  type TxType,
} from "@/lib/db";

export const Route = createFileRoute("/_authenticated/categories")({
  head: () => ({
    meta: [
      { title: "Phân loại — Xu" },
      { name: "description", content: "Tạo phân loại thu chi riêng với tên, icon, màu và ghi chú." },
      { property: "og:title", content: "Phân loại — Xu" },
      { property: "og:description", content: "Tạo phân loại thu chi riêng với tên, icon, màu và ghi chú." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories = [] } = useCategories();
  const { data: notes = [] } = useNotes();
  const del = useDeleteCategory();
  const delNote = useDeleteNote();
  const saveNote = useSaveNote();
  const [tab, setTab] = useState<TxType>("expense");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const list = categories.filter((c) => c.type === tab);

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phân loại "${name}" không?`)) {
      del.mutate(id, {
        onSuccess: () => toast.success("Đã xóa phân loại"),
        onError: (err) => toast.error((err as Error).message),
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-3xl lg:max-w-6xl space-y-6 bg-[#F3F4F1] px-3.5 sm:px-6 py-4 pb-32 md:pb-12 font-['Be_Vietnam_Pro'] min-h-screen">
      
      {/* 1. Header Trang Phân Loại */}
      <section className="flex items-center justify-between pb-3 border-b border-[#E3E2DC]">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#16181D]">
            Phân loại thu chi
          </h1>
          <p className="text-xs font-medium text-[#8A8D7A]">
            Quản lý danh mục và thẻ ghi chú chi tiết
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold text-xs sm:text-sm px-4 py-2 h-auto shadow-sm transition-all"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Thêm danh mục
        </Button>
      </section>

      {/* 2. Thanh chuyển Tab Thu nhập / Chi tiêu */}
      <section className="flex justify-center sm:justify-start">
        <div className="flex w-full sm:w-auto p-1 bg-[#EAE8E0] rounded-full border border-[#E3E2DC]">
          <button
            onClick={() => setTab("expense")}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all",
              tab === "expense"
                ? "bg-[#16181D] text-white shadow-sm"
                : "text-[#8A8D7A] hover:text-[#16181D]"
            )}
          >
            <ArrowUpRight className={cn("h-4 w-4", tab === "expense" ? "text-[#EF5B45]" : "")} />
            Khoản chi tiêu
          </button>
          <button
            onClick={() => setTab("income")}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all",
              tab === "income"
                ? "bg-[#16181D] text-white shadow-sm"
                : "text-[#8A8D7A] hover:text-[#16181D]"
            )}
          >
            <ArrowDownLeft className={cn("h-4 w-4", tab === "income" ? "text-[#109C7C]" : "")} />
            Khoản thu nhập
          </button>
        </div>
      </section>

      {/* 3. Lưới Responsive Danh mục (1 Cột iPhone, 2 Cột iPad, 3 Cột Desktop) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {list.length === 0 ? (
          <div className="col-span-full rounded-[26px] border border-dashed border-[#D8D6CC] bg-white p-8 text-center text-xs sm:text-sm font-bold text-[#8A8D7A]">
            Chưa có phân loại nào cho mục này — Bấm "+ Thêm danh mục" để tạo nhé
          </div>
        ) : (
          list.map((c) => {
            const catNotes = notes.filter((n) => n.category_id === c.id);
            return (
              <div
                key={c.id}
                className="rounded-[22px] bg-white border border-[#E7E5DC] p-4 shadow-sm hover:border-[#D8D6CC] transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon + Name + Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                        style={{ backgroundColor: c.color || "#109C7C" }}
                      >
                        <Icon name={c.icon || "Tag"} className="h-5.5 w-5.5" />
                      </span>
                      <p className="truncate text-sm sm:text-base font-extrabold text-[#16181D]">
                        {c.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(c);
                          setOpen(true);
                        }}
                        className="h-8 w-8 rounded-full text-[#8A8D7A] hover:text-[#16181D] hover:bg-[#F3F4F1]"
                        aria-label="Sửa"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        className="h-8 w-8 rounded-full text-[#8A8D7A] hover:text-[#EF5B45] hover:bg-[#FCE4E0]"
                        aria-label="Xoá"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-[#EF5B45]" />
                      </Button>
                    </div>
                  </div>

                  {/* Body: Danh sách Thẻ Ghi Chú Nhanh (Notes) */}
                  {catNotes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-[#F3F4F1]">
                      {catNotes.map((n) => (
                        <span
                          key={n.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F1] border border-[#E7E5DC] px-2.5 py-1 text-xs font-semibold text-[#16181D] group transition-all"
                        >
                          {n.text}
                          <button
                            onClick={() => delNote.mutate(n.id)}
                            className="text-[#8A8D7A] hover:text-[#EF5B45] transition-colors"
                            aria-label="Xoá ghi chú"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom: Form Nhập Ghi Chú Nhanh */}
                <form
                  className="flex items-center gap-2 pt-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const text = (noteDrafts[c.id] ?? "").trim();
                    if (!text) return;
                    await saveNote.mutateAsync({ category_id: c.id, text });
                    setNoteDrafts((d) => ({ ...d, [c.id]: "" }));
                  }}
                >
                  <Input
                    value={noteDrafts[c.id] ?? ""}
                    maxLength={100}
                    placeholder={`Thêm thẻ ví dụ: Cơm trưa...`}
                    onChange={(e) => setNoteDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                    className="rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] text-xs font-medium h-9"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-xl bg-[#16181D] hover:bg-[#2A2E37] text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            );
          })
        )}
      </section>

      {/* Dialog Thêm / Sửa Danh Mục */}
      <CategoryDialog open={open} onOpenChange={setOpen} editing={editing} defaultType={tab} />
    </div>
  );
}

function CategoryDialog({
  open,
  onOpenChange,
  editing,
  defaultType,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Category | null;
  defaultType: TxType;
}) {
  const save = useSaveCategory();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Tag");
  const [color, setColor] = useState(PALETTE[0]!);
  const [type, setType] = useState<TxType>(defaultType);
  const [ready, setReady] = useState(false);

  if (open && !ready) {
    setName(editing?.name ?? "");
    setIcon(editing?.icon ?? "Tag");
    setColor(editing?.color ?? PALETTE[0]!);
    setType(editing?.type ?? defaultType);
    setReady(true);
  }
  if (!open && ready) setReady(false);

  const key = `${open}-${editing?.id ?? "new"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[26px] bg-white p-6 font-['Be_Vietnam_Pro'] border-[#E7E5DC]" key={key}>
        <DialogHeader>
          <DialogTitle className="text-base font-extrabold text-[#16181D]">
            {editing ? "Sửa phân loại" : "Tạo phân loại mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Chuyển loại Thu/Chi trong Modal */}
          <div className="flex rounded-full bg-[#F3F4F1] p-1 border border-[#EDECE6]">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={cn(
                "flex-1 py-1.5 rounded-full text-xs font-bold transition-all",
                type === "expense"
                  ? "bg-[#16181D] text-white shadow-sm"
                  : "text-[#8A8D7A]"
              )}
            >
              Chi tiêu
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={cn(
                "flex-1 py-1.5 rounded-full text-xs font-bold transition-all",
                type === "income"
                  ? "bg-[#16181D] text-white shadow-sm"
                  : "text-[#8A8D7A]"
              )}
            >
              Thu nhập
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-name" className="text-xs font-bold text-[#16181D]">
              Tên phân loại
            </Label>
            <Input
              id="c-name"
              value={name}
              maxLength={40}
              placeholder="Ăn uống, Lương hàng tháng, Giải trí..."
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-[#EDECE6] bg-[#F3F4F1] focus-visible:ring-[#16181D] font-medium text-xs sm:text-sm"
            />
          </div>

          {/* Chọn Icon và Màu sắc đồng bộ */}
          <IconColorPicker icon={icon} color={color} setIcon={setIcon} setColor={setColor} />
        </div>

        <Button
          className="w-full rounded-full bg-[#16181D] hover:bg-[#2A2E37] text-white font-bold py-2.5 h-auto transition-all mt-2"
          onClick={async () => {
            if (!name.trim()) {
              toast.error("Vui lòng nhập tên phân loại");
              return;
            }
            try {
              await save.mutateAsync({
                ...(editing?.id ? { id: editing.id } : {}),
                name: name.trim(),
                type,
                icon,
                color,
              });
              toast.success("Đã lưu phân loại");
              onOpenChange(false);
            } catch (e) {
              toast.error((e as Error).message);
            }
          }}
        >
          Lưu phân loại
        </Button>
      </DialogContent>
    </Dialog>
  );
}