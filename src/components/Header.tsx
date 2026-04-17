import { Heart, Menu, LogIn, X, LogOut, User, MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ChatPanel } from "./ChatPanel";
import { cn } from "@/lib/utils";

interface Props {
  onNavigate: (id: string) => void;
  onLoginClick: () => void;
}

export function Header({ onNavigate, onLoginClick }: Props) {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const unread = useChatStore((s) => (user ? s.unreadTotal(user.id) : 0));
  const { t } = useTranslation();

  const links = [
    { id: "feed", label: t("nav.feed") },
    { id: "categories", label: t("nav.categories") },
    { id: "how", label: t("nav.how") },
    { id: "dashboard", label: t("nav.dashboard") },
  ];

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  const openChat = () => {
    if (!user) {
      toast(t("common.needAuth"));
      onLoginClick();
      return;
    }
    setChatOpen(true);
  };

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <button
          onClick={() => go("top")}
          className="flex items-center gap-2 font-semibold text-lg bouncy"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Heart className="h-5 w-5" fill="currentColor" />
          </span>
          {t("common.appName")}
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <button
            onClick={openChat}
            aria-label={t("chat.title")}
            className={cn(
              "relative h-10 w-10 rounded-full grid place-items-center bouncy transition-colors",
              "hover:bg-muted text-foreground"
            )}
          >
            <MessageCircleHeart className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold grid place-items-center ring-2 ring-background">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground font-semibold grid place-items-center shadow-soft bouncy">
                  {initials || <User className="h-4 w-4" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => go("dashboard")} className="rounded-xl">
                  {t("nav.myRequests")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    toast(t("auth.byeToast"));
                  }}
                  className="rounded-xl text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("common.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onLoginClick}
              size="sm"
              className="hidden sm:inline-flex gap-1 rounded-full bouncy shadow-soft"
            >
              <LogIn className="h-4 w-4" /> {t("common.login")}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setOpen((o) => !o)}
            aria-label={t("common.menu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="container py-3 flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="px-3 py-3 text-left rounded-2xl hover:bg-muted transition-colors"
              >
                {l.label}
              </button>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <LanguageSwitcher />
              {!user && (
                <Button
                  onClick={() => {
                    setOpen(false);
                    onLoginClick();
                  }}
                  className="flex-1 rounded-full bouncy gap-1"
                >
                  <LogIn className="h-4 w-4" /> {t("common.login")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <ChatPanel open={chatOpen} onOpenChange={setChatOpen} />
    </header>
  );
}
