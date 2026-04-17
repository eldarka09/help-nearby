import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
  active: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}

export function CategoriesGrid({ active, onSelect }: Props) {
  const { t } = useTranslation();
  return (
    <section id="categories" className="container py-16 scroll-mt-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">{t("categoriesSection.title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("categoriesSection.subtitle")}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((c) => {
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(isActive ? null : c.id)}
              className={cn(
                "group rounded-3xl border p-5 text-left transition-all bouncy",
                isActive
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-border bg-card hover:shadow-soft"
              )}
            >
              <div
                className={cn(
                  "h-12 w-12 rounded-2xl grid place-items-center mb-3",
                  c.colorClass,
                  c.textClass
                )}
              >
                <c.icon className="h-6 w-6" />
              </div>
              <div className="font-semibold">{t(c.labelKey)}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
