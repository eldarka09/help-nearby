import { Button } from "@/components/ui/button";
import { HandHelping, HeartHandshake } from "lucide-react";

interface Props {
  onRequest: () => void;
  onOffer: () => void;
}

export function Hero({ onRequest, onOffer }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 via-background to-background" />
      <div className="absolute -z-10 top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -z-10 top-40 -right-20 h-72 w-72 rounded-full bg-offer/10 blur-3xl" />

      <div className="container py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium mb-6">
          <HeartHandshake className="h-4 w-4" />
          Соседская взаимопомощь
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
          Помогайте и получайте помощь{" "}
          <span className="text-primary">рядом с вами</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Простой способ найти поддержку или предложить её людям в вашем городе и районе.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={onRequest}
            className="h-14 px-8 rounded-2xl bg-request text-request-foreground hover:bg-request/90 text-base gap-2 shadow-lg shadow-request/20"
          >
            <HandHelping className="h-5 w-5" />
            Попросить помощь
          </Button>
          <Button
            size="lg"
            onClick={onOffer}
            className="h-14 px-8 rounded-2xl bg-offer text-offer-foreground hover:bg-offer/90 text-base gap-2 shadow-lg shadow-offer/20"
          >
            <HeartHandshake className="h-5 w-5" />
            Предложить помощь
          </Button>
        </div>
      </div>
    </section>
  );
}
