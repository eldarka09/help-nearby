import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryId, PostType } from "@/lib/types";
import { usePostsStore } from "@/store/usePostsStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  type: PostType;
}

export function CreatePostDialog({ open, onOpenChange, type }: Props) {
  const addPost = usePostsStore((s) => s.addPost);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setStep(0);
      setName("");
      setCity("");
      setDistrict("");
      setCategory(null);
      setDescription("");
    }
  }, [open]);

  const isRequest = type === "request";
  const total = 3;

  const canNext =
    (step === 0 && name.trim() && city.trim()) ||
    (step === 1 && category) ||
    (step === 2 && description.trim().length >= 10);

  const submit = () => {
    if (!category) return;
    addPost({
      type,
      name: name.trim(),
      city: city.trim(),
      district: district.trim() || undefined,
      category,
      description: description.trim(),
    });
    toast.success(isRequest ? "Запрос опубликован" : "Предложение опубликовано");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isRequest ? "Попросить помощь" : "Предложить помощь"}
          </DialogTitle>
          <DialogDescription>
            Шаг {step + 1} из {total}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5 mb-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Анна" className="rounded-xl h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">Город</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Москва" className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Район</Label>
                <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Арбат" className="rounded-xl h-11" />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-foreground/20"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-xl grid place-items-center mb-2", c.colorClass, c.textClass)}>
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium">{c.label}</div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <Label htmlFor="desc">Опишите подробнее</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isRequest ? "Какая помощь нужна?" : "Чем вы можете помочь?"}
              className="rounded-2xl min-h-32"
            />
            <p className="text-xs text-muted-foreground">Минимум 10 символов</p>
          </div>
        )}

        <div className="flex justify-between gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Назад
          </Button>
          {step < total - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="rounded-full"
            >
              Далее <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={!canNext}
              className={cn(
                "rounded-full",
                isRequest
                  ? "bg-request text-request-foreground hover:bg-request/90"
                  : "bg-offer text-offer-foreground hover:bg-offer/90"
              )}
            >
              <Check className="h-4 w-4 mr-1" /> Опубликовать
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
