import {
  Banknote,
  Briefcase,
  Bus,
  Car,
  Coffee,
  CreditCard,
  Dumbbell,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  PawPrint,
  PiggyBank,
  Plane,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Tag,
  Wallet,
  Banknote,
  Briefcase,
  Gift,
  TrendingUp,
  PiggyBank,
  Laptop,
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  ShoppingCart,
  Car,
  Bus,
  Plane,
  Home,
  ReceiptText,
  CreditCard,
  Gamepad2,
  HeartPulse,
  Dumbbell,
  GraduationCap,
  PawPrint,
  Sparkles,
  Smartphone,
  Landmark,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Tag;
  return <Cmp className={className} />;
}
export const PALETTE = [
  "#EC4899", // 🩷 Hồng (Pink)
  "#EF5B45", // ❤️ Đỏ / Coral
  "#F43F5E", // 🌹 Hồng đỏ / Rose
  "#3B82F6", // 💙 Xanh biển (Blue)
  "#0EA5E9", // 🩵 Xanh da trời (Sky)
  "#8B5CF6", // 💜 Tím (Purple)
  "#109C7C", // 💚 Xanh lá mint (Teal)
  "#22C55E", // 🟢 Xanh lá tươi
  "#F59E0B", // 💛 Cam vàng (Amber)
  "#64748B", // 🩶 Xám (Slate)
];