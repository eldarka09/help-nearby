import type { TFunction } from "i18next";

export function timeAgo(ts: number, t: TFunction, lang?: string): string {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return t("time.justNow");
  if (m < 60) return t("time.minAgo", { n: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t("time.hourAgo", { n: h });
  const d = Math.floor(h / 24);
  // lang reserved for future locale-specific pluralization
  void lang;
  return t("time.dayAgo", { n: d });
}
