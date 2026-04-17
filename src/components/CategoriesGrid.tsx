import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  active: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}

export function CategoriesGrid({ active, onSelect }: Props) {
  return (
    <section id="categories" className="container py-16 scroll-mt-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">Категории помощи</h2>
        <p className="mt-3 text-muted-foreground">Выберите, чтобы отфильтровать запросы</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((c) => {
          const isActive = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(isActive ? null : c.id)}
              className={cn(
                "group rounded-3xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                isActive
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card"
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
              <div className="font-semibold">{c.label}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
