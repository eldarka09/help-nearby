import { Apple, Pill, Laptop, HeartHandshake, Users, MessageCircle, type LucideIcon } from "lucide-react";
import type { CategoryId } from "./types";

export interface CategoryDef {
  id: CategoryId;
  labelKey: string;
  icon: LucideIcon;
  colorClass: string;
  textClass: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "food", labelKey: "categories.food", icon: Apple, colorClass: "bg-cat-food/15", textClass: "text-cat-food" },
  { id: "medicine", labelKey: "categories.medicine", icon: Pill, colorClass: "bg-cat-medicine/15", textClass: "text-cat-medicine" },
  { id: "tech", labelKey: "categories.tech", icon: Laptop, colorClass: "bg-cat-tech/15", textClass: "text-cat-tech" },
  { id: "moral", labelKey: "categories.moral", icon: HeartHandshake, colorClass: "bg-cat-moral/15", textClass: "text-cat-moral" },
  { id: "volunteer", labelKey: "categories.volunteer", icon: Users, colorClass: "bg-cat-volunteer/15", textClass: "text-cat-volunteer" },
  { id: "consult", labelKey: "categories.consult", icon: MessageCircle, colorClass: "bg-cat-consult/15", textClass: "text-cat-consult" },
];

export const getCategory = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
