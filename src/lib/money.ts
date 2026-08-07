export function formatVND(value: number, opts: { sign?: boolean; compact?: boolean } = {}) {
  const abs = Math.abs(value);
  const formatted = opts.compact
    ? new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(abs)
    : new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(abs);
  const prefix = opts.sign ? (value < 0 ? "-" : "+") : value < 0 ? "-" : "";
  return `${prefix}${formatted}\u00A0₫`;
}

/** Evaluate a simple calculator expression: digits, + - × ÷ . ( ) */
export function evalExpression(raw: string): number | null {
  const expr = raw.replace(/×/g, "*").replace(/÷/g, "/").replace(/,/g, ".").trim();
  if (!expr) return null;
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict";return (${expr})`)() as unknown;
    if (typeof result !== "number" || !Number.isFinite(result)) return null;
    return Math.round(result * 100) / 100;
  } catch {
    return null;
  }
}

export const VI_WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function ymd(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}
