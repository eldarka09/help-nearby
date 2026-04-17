import { useMemo, useState } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import type { CategoryId, Post, PostType } from "@/lib/types";
import { PostCard } from "./PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  category: CategoryId | null;
  onClearCategory: () => void;
  onRespond: (post: Post) => void;
}

const tabs: { id: "all" | PostType; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "request", label: "Нужна помощь" },
  { id: "offer", label: "Предлагают помощь" },
];

export function Feed({ category, onClearCategory, onRespond }: Props) {
  const posts = usePostsStore((s) => s.posts);
  const [tab, setTab] = useState<"all" | PostType>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (tab !== "all" && p.type !== tab) return false;
      if (category && p.category !== category) return false;
      if (q) {
        const hay = `${p.name} ${p.city} ${p.district ?? ""} ${p.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [posts, tab, category, query]);

  return (
    <section id="feed" className="container py-16 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Последние запросы</h2>
          <p className="mt-2 text-muted-foreground">Помогите кому-то прямо сейчас</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по городу или району..."
            className="pl-9 h-11 rounded-full bg-card"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              tab === t.id
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
        {category && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={onClearCategory}
          >
            Сбросить категорию ✕
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Ничего не найдено. Попробуйте изменить фильтры.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <PostCard key={p.id} post={p} onRespond={onRespond} />
          ))}
        </div>
      )}
    </section>
  );
}
