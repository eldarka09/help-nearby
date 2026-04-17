import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { heartBurst } from "@/lib/confetti";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

type Mode = "login" | "signup";

export function AuthDialog({ open, onOpenChange }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const signIn = useAuthStore((s) => s.signIn);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (mode === "signup" && !name.trim()) return;
    const u = signIn(email.trim(), name.trim() || undefined, city.trim() || undefined);
    toast.success(`Привет, ${u.name}! 🌸`);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    heartBurst(rect.left + rect.width / 2, rect.top + 60, 18);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[2rem] border-primary/20">
        <DialogHeader className="items-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary grid place-items-center mb-1 animate-wiggle">
            <Heart className="h-7 w-7" fill="currentColor" />
          </div>
          <DialogTitle className="text-2xl">
            {mode === "login" ? "С возвращением!" : "Создайте аккаунт"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Войдите, чтобы откликаться и публиковать"
              : "Это займёт меньше минуты ✨"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex p-1 rounded-full bg-muted">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-full transition-all",
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              {m === "login" ? "Войти" : "Регистрация"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="aname">Имя</Label>
                <Input id="aname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" className="rounded-2xl h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acity">Город</Label>
                <Input id="acity" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Москва" className="rounded-2xl h-11" />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="aemail">Email</Label>
            <Input id="aemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-2xl h-11" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="apass">Пароль</Label>
            <Input id="apass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="rounded-2xl h-11" required />
          </div>
          <Button type="submit" className="w-full h-12 rounded-full bouncy gap-2 shadow-soft">
            <Sparkles className="h-4 w-4" />
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground pt-1">
            Демо-режим: данные хранятся локально в браузере
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
