import { useEffect, useState } from "react";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import { evalExpression, formatVND } from "@/lib/money";

const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "000", "0", ".", "+"];

export function Calculator({
  value,
  onChange,
  tone,
}: {
  value: string;
  onChange: (next: string) => void;
  tone: "income" | "expense";
}) {
  const [preview, setPreview] = useState<number | null>(null);

  useEffect(() => {
    setPreview(evalExpression(value));
  }, [value]);

  const push = (k: string) => onChange(value + k);
  const isOperator = /[+\-×÷]$/.test(value);

  return (
    <div className="rounded-2xl border bg-muted/40 p-3">
      <div className="mb-3 flex items-baseline justify-between gap-2 px-1">
        <span className="truncate font-display text-lg text-muted-foreground">{value || "0"}</span>
        <span
          className={cn(
            "shrink-0 font-display text-xl font-bold",
            tone === "income" ? "text-income" : "text-expense",
          )}
        >
          {formatVND(preview ?? 0)}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              if (["+", "-", "×", "÷"].includes(k)) {
                if (!value) return;
                if (isOperator) return onChange(value.slice(0, -1) + k);
              }
              push(k);
            }}
            className={cn(
              "h-11 rounded-xl border bg-card font-display text-base font-semibold transition-colors hover:bg-accent active:scale-[0.97]",
              ["+", "-", "×", "÷"].includes(k) && "bg-secondary text-secondary-foreground",
            )}
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange("")}
          className="h-11 rounded-xl border bg-card font-display text-sm font-semibold transition-colors hover:bg-accent"
        >
          AC
        </button>
        <button
          type="button"
          onClick={() => onChange(value.slice(0, -1))}
          className="h-11 rounded-xl border bg-card transition-colors hover:bg-accent"
        >
          <Delete className="mx-auto h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => preview !== null && onChange(String(preview))}
          className="col-span-2 h-11 rounded-xl bg-primary font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          =
        </button>
      </div>
    </div>
  );
}
