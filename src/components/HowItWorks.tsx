import { Pencil, Search, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { icon: Pencil, title: t("how.s1Title"), text: t("how.s1Text") },
    { icon: Search, title: t("how.s2Title"), text: t("how.s2Text") },
    { icon: MessageSquare, title: t("how.s3Title"), text: t("how.s3Text") },
  ];
  return (
    <section id="how" className="container py-16 scroll-mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">{t("how.title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("how.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="relative rounded-3xl bg-card border border-border p-8 shadow-soft">
            <div className="absolute -top-4 -left-4 h-10 w-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-bold shadow-soft">
              {i + 1}
            </div>
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
              <s.icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
