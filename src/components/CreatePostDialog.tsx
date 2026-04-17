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
import { heartBurst } from "@/lib/confetti";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  type: PostType;
  defaultName?: string;
  defaultCity?: string;
  ownerId?: string;
}

export function CreatePostDialog({ open, onOpenChange, type, defaultName, defaultCity, ownerId }: Props) {
  const addPost = usePostsStore((s) => s.addPost);
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setStep(0);
      setName(defaultName ?? "");
      setCity(defaultCity ?? "");
      setDistrict("");
      setCategory(null);
      setDescription("");
    }
  }, [open, defaultName, defaultCity]);

  const isRequest = type === "request";
  const total = 3;

  const canNext =
    (step === 0 && name.trim() && city.trim()) ||
    (step === 1 && category) ||
    (step === 2 && description.trim().length >= 10);

  const submit = (e: React.MouseEvent) => {
    if (!category) return;
    addPost(
      {
        type,
        name: name.trim(),
        city: city.trim(),
        district: district.trim() || undefined,
        category,
        description: description.trim(),
      },
      ownerId
    );
    toast.success(isRequest ? t("create.successRequest") : t("create.successOffer"));
    heartBurst(e.clientX, e.clientY, 28);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isRequest ? t("create.titleRequest") : t("create.titleOffer")}
          </DialogTitle>
          <DialogDescription>
            {t("create.step", { current: step + 1, total })}
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
              <Label htmlFor="name">{t("create.name")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("create.namePh")} className="rounded-xl h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">{t("create.city")}</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("create.cityPh")} className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">{t("create.district")}</Label>
                <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder={t("create.districtPh")} className="rounded-xl h-11" />
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
                  <div className="text-sm font-medium">{t(c.labelKey)}</div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <Label htmlFor="desc">{t("create.descLabel")}</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isRequest ? t("create.descPhRequest") : t("create.descPhOffer")}
              className="rounded-2xl min-h-32"
            />
            <p className="text-xs text-muted-foreground">{t("create.minChars")}</p>
          </div>
        )}

        <div className="flex justify-between gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> {t("common.back")}
          </Button>
          {step < total - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="rounded-full"
            >
              {t("common.next")} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={!canNext}
              className={cn(
                "rounded-full bouncy",
                isRequest
                  ? "bg-request text-request-foreground hover:bg-request/90"
                  : "bg-offer text-offer-foreground hover:bg-offer/90"
              )}
            >
              <Check className="h-4 w-4 mr-1" /> {t("common.publish")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
