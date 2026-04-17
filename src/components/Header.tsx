import { Heart, Menu, Globe, LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  onNavigate: (id: string) => void;
}

const links = [
  { id: "feed", label: "Запросы" },
  { id: "categories", label: "Категории" },
  { id: "how", label: "Как это работает" },
  { id: "dashboard", label: "Мои запросы" },
];

export function Header({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <button
          onClick={() => go("top")}
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Heart className="h-5 w-5" fill="currentColor" />
          </span>
          ПомощьРядом
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
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1">
            <Globe className="h-4 w-4" /> RU
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-1 rounded-full">
            <LogIn className="h-4 w-4" /> Войти
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Меню"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-3 flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="px-3 py-3 text-left rounded-xl hover:bg-muted transition-colors"
              >
                {l.label}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1 rounded-full">
                <Globe className="h-4 w-4" /> RU
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1 rounded-full">
                <LogIn className="h-4 w-4" /> Войти
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
