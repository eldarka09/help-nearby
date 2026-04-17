import { usePostsStore } from "@/store/usePostsStore";
import { PostCard } from "./PostCard";
import type { Post } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  onRespond: (post: Post) => void;
}

export function MyDashboard({ onRespond }: Props) {
  const posts = usePostsStore((s) => s.posts);
  const myId = usePostsStore((s) => s.myOwnerId);
  const toggle = usePostsStore((s) => s.toggleResolved);
  const mine = posts.filter((p) => p.ownerId === myId);

  return (
    <section id="dashboard" className="container py-16 scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">Мои запросы</h2>
        <p className="mt-2 text-muted-foreground">Управляйте своими публикациями</p>
      </div>
      {mine.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
          У вас пока нет публикаций. Создайте запрос или предложение выше.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mine.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              isMine
              onRespond={onRespond}
              onResolve={(post) => {
                toggle(post.id);
                toast.success("Запрос отмечен как решённый");
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
