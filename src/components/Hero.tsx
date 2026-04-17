import { Button } from "@/components/ui/button";
import { HandHelping, HeartHandshake, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  onRequest: () => void;
  onOffer: () => void;
}

export function Hero({ onRequest, onOffer }: Props) {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden">
      <div className="container py-16 md:py-24 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-4 py-1.5 text-sm text-primary font-medium mb-6 shadow-soft border border-primary/10">
          <Sparkles className="h-4 w-4" />
          {t("hero.badge")}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
          {t("hero.title1")}{" "}
          <span className="bg-gradient-to-r from-primary via-cat-moral to-request bg-clip-text text-transparent">
            {t("hero.title2")}
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          {t("hero.subtitle")}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={onRequest}
            className="h-14 px-8 rounded-full bg-request text-request-foreground hover:bg-request/90 text-base gap-2 shadow-sky bouncy"
          >
            <HandHelping className="h-5 w-5" />
            {t("hero.requestBtn")}
          </Button>
          <Button
            size="lg"
            onClick={onOffer}
            className="h-14 px-8 rounded-full bg-offer text-offer-foreground hover:bg-offer/90 text-base gap-2 shadow-mint bouncy"
          >
            <HeartHandshake className="h-5 w-5" />
            {t("hero.offerBtn")}
          </Button>
        </div>
      </div>
    </section>
  );
}
