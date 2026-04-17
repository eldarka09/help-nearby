import { Apple, Pill, Laptop, HeartHandshake, Users, MessageCircle, type LucideIcon } from "lucide-react";
import type { CategoryId } from "./types";

export interface CategoryDef {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  colorClass: string; // bg
  textClass: string; // text
}

export const CATEGORIES: CategoryDef[] = [
  { id: "food", label: "Продукты", icon: Apple, colorClass: "bg-cat-food/15", textClass: "text-cat-food" },
  { id: "medicine", label: "Лекарства", icon: Pill, colorClass: "bg-cat-medicine/15", textClass: "text-cat-medicine" },
  { id: "tech", label: "Техника", icon: Laptop, colorClass: "bg-cat-tech/15", textClass: "text-cat-tech" },
  { id: "moral", label: "Моральная поддержка", icon: HeartHandshake, colorClass: "bg-cat-moral/15", textClass: "text-cat-moral" },
  { id: "volunteer", label: "Волонтёрство", icon: Users, colorClass: "bg-cat-volunteer/15", textClass: "text-cat-volunteer" },
  { id: "consult", label: "Консультации", icon: MessageCircle, colorClass: "bg-cat-consult/15", textClass: "text-cat-consult" },
];

export const getCategory = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
