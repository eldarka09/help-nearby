import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingHearts } from "@/components/FloatingHearts";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthDialog } from "@/components/AuthDialog";
import { ChatThread } from "@/components/ChatThread";
import { MessageCircleHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatsPage = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const chats = useChatStore((s) => (user ? s.myChats(user.id) : []));
  const [selected, setSelected] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  const active = chats.find((c) => c.id === selected) ?? chats[0] ?? null;
  const activeId = active?.id ?? null;

  return (
    <main className="min-h-screen relative flex flex-col">
      <FloatingHearts />
      <Header
        onNavigate={(id) => {
          if (id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            navigate(`/#${id}`);
          }
        }}
        onLoginClick={() => setAuthOpen(true)}
      />

      <section className="container py-8 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircleHeart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("chat.title")}
          </h1>
        </div>

        {!user ? (
          <div className="rounded-3xl border bg-card p-10 text-center text-muted-foreground">
            {t("common.needAuth")}
          </div>
        ) : chats.length === 0 ? (
          <div className="rounded-3xl border bg-card p-10 text-center text-muted-foreground">
            {t("chat.empty")}
          </div>
        ) : (
          <div className="rounded-3xl border bg-card overflow-hidden grid md:grid-cols-[300px_1fr] min-h-[60vh]">
            <aside className="border-b md:border-b-0 md:border-r border-border overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
              {chats.map((c) => {
                const otherName =
                  user.id === c.authorId ? c.responderName : c.authorName;
                const unread = c.unread[user.id] ?? 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className={cn(
                      "w-full text-left flex items-center gap-3 p-3 hover:bg-muted/60 transition-colors border-b border-border/60",
                      activeId === c.id && "bg-primary/5"
                    )}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/15 text-primary grid place-items-center font-semibold">
                      {otherName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate text-sm">
                          {otherName}
                        </span>
                        {unread > 0 && (
                          <span className="h-5 min-w-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-semibold grid place-items-center">
                            {unread}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {c.postSnippet}
                      </div>
                    </div>
                  </button>
                );
              })}
            </aside>
            <div className="flex flex-col min-h-[60vh]">
              {active ? (
                <ChatThread chat={active} userId={user.id} />
              ) : (
                <div className="flex-1 grid place-items-center text-muted-foreground">
                  {t("chat.empty")}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </main>
  );
};

export default ChatsPage;
