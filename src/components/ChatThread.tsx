import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Send, Flag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore, type Chat } from "@/store/useChatStore";
import { usePostsStore } from "@/store/usePostsStore";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { heartBurst } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface Props {
  chat: Chat;
  userId: string;
}

export function ChatThread({ chat, userId }: Props) {
  const { t } = useTranslation();
  const messages = useChatStore((s) => s.chatMessages(chat.id));
  const sendMessage = useChatStore((s) => s.sendMessage);
  const markRead = useChatStore((s) => s.markRead);
  const resolveChat = useChatStore((s) => s.resolveChat);
  const toggleResolved = usePostsStore((s) => s.toggleResolved);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const isAuthor = userId === chat.authorId;
  const otherName = isAuthor ? chat.responderName : chat.authorName;

  useEffect(() => {
    markRead(chat.id, userId);
  }, [chat.id, userId, markRead, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = (value?: string) => {
    const v = (value ?? text).trim();
    if (!v) return;
    sendMessage(chat.id, userId, v);
    setText("");
  };

  const onResolve = (e: React.MouseEvent) => {
    resolveChat(chat.id);
    toggleResolved(chat.postId);
    heartBurst(e.clientX, e.clientY, 24);
    toast.success(t("chat.resolvedToast"));
  };

  const quickReplies = useMemo(
    () => [t("chat.quickHelp"), t("chat.quickAddress"), t("chat.quickOnWay")],
    [t]
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold truncate">{otherName}</div>
          <div className="text-xs text-muted-foreground truncate">
            {t("chat.aboutPost")} {chat.postSnippet}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full h-9 w-9 text-muted-foreground hover:text-destructive"
            onClick={() => toast(t("chat.reportedToast"))}
            aria-label={t("chat.report")}
            title={t("chat.report")}
          >
            <Flag className="h-4 w-4" />
          </Button>
          {!chat.resolved && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full bouncy gap-1"
              onClick={onResolve}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t("chat.markResolved")}</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gradient-to-b from-background to-muted/30">
        {messages.map((m) => {
          const mine = m.senderId === userId;
          return (
            <div
              key={m.id}
              className={cn("flex", mine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[78%] rounded-3xl px-4 py-2.5 text-sm leading-relaxed shadow-soft animate-fade-in",
                  mine
                    ? "bg-request/15 text-foreground rounded-br-md"
                    : "bg-offer/15 text-foreground rounded-bl-md"
                )}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-border">
        {quickReplies.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={chat.resolved}
            className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors bouncy disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="px-3 pb-3 pt-2 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60 pointer-events-none" />
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("chat.inputPh")}
            disabled={chat.resolved}
            className="pl-9 rounded-full h-11"
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={chat.resolved || !text.trim()}
          className="rounded-full h-11 w-11 bouncy shadow-soft"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
