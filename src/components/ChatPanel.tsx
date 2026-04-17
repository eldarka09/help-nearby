import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";
import { ChatThread } from "./ChatThread";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircleHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialChatId?: string | null;
}

export function ChatPanel({ open, onOpenChange, initialChatId }: Props) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const chats = useChatStore((s) => (user ? s.myChats(user.id) : []));
  const [selected, setSelected] = useState<string | null>(initialChatId ?? null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && initialChatId) setSelected(initialChatId);
    if (!open) setSelected(null);
  }, [open, initialChatId]);

  const activeChat = chats.find((c) => c.id === selected) ?? null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 rounded-l-[2rem] flex flex-col bg-background/95 backdrop-blur-xl"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            {activeChat ? (
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-2 bouncy"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("chat.backToList")}
              </button>
            ) : (
              <span className="inline-flex items-center gap-2">
                <MessageCircleHeart className="h-5 w-5 text-primary" />
                {t("chat.title")}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {activeChat && user ? (
          <ChatThread chat={activeChat} userId={user.id} />
        ) : (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {t("chat.empty")}
              </div>
            ) : (
              chats.map((c) => {
                const otherName =
                  user?.id === c.authorId ? c.responderName : c.authorName;
                const initial = otherName.charAt(0).toUpperCase();
                const unread = user ? c.unread[user.id] ?? 0 : 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className={cn(
                      "w-full text-left flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/60 transition-colors bouncy",
                      unread > 0 && "bg-primary/5"
                    )}
                  >
                    <div className="h-11 w-11 shrink-0 rounded-full bg-primary/15 text-primary grid place-items-center font-semibold">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold truncate">{otherName}</span>
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
              })
            )}
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full rounded-full bouncy"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/chats");
                }}
              >
                {t("chat.openAll")}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
