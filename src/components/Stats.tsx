import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const targets = [
  { key: "stats.helped", value: 12480 },
  { key: "stats.volunteers", value: 3200 },
  { key: "stats.cities", value: 84 },
];

function useCount(target: number, run: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return v;
}

function Counter({ target, label }: { target: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setRun(true),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const v = useCount(target, run);
  return (
    <div ref={ref} className="rounded-3xl bg-card border border-border p-8 text-center shadow-soft">
      <div className="text-4xl md:text-5xl font-bold text-primary tabular-nums">
        {v.toLocaleString()}+
      </div>
      <div className="mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}

export function Stats() {
  const { t } = useTranslation();
  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {targets.map((it) => (
          <Counter key={it.key} target={it.value} label={t(it.key)} />
        ))}
      </div>
    </section>
  );
}
