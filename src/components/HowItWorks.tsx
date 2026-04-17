import { Pencil, Search, MessageSquare } from "lucide-react";

const steps = [
  { icon: Pencil, title: "Опишите", text: "Расскажите, какая нужна помощь или что вы готовы предложить." },
  { icon: Search, title: "Найдите", text: "Мы покажем подходящие запросы и предложения рядом с вами." },
  { icon: MessageSquare, title: "Свяжитесь", text: "Отправьте отклик и договоритесь о деталях напрямую." },
];

export function HowItWorks() {
  return (
    <section id="how" className="container py-16 scroll-mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Как это работает</h2>
        <p className="mt-3 text-muted-foreground">Три простых шага, чтобы помочь или получить помощь</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-3xl bg-card border border-border p-8">
            <div className="absolute -top-4 -left-4 h-10 w-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-bold">
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
