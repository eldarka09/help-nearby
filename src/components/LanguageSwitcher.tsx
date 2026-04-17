import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-sm font-medium",
            "bg-card/70 border border-border hover:bg-card transition-colors bouncy",
            compact && "px-2.5"
          )}
        >
          <Globe className="h-4 w-4 text-primary" />
          <span>{current.flag}</span>
          <span className="uppercase tracking-wide text-xs">{current.code}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl w-44">
        {LANGUAGES.map((l) => {
          const active = l.code === i18n.language;
          return (
            <DropdownMenuItem
              key={l.code}
              onClick={() => i18n.changeLanguage(l.code)}
              className="rounded-xl gap-2 cursor-pointer"
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1">{l.label}</span>
              {active && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
