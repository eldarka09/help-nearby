import { Heart, Download, Mail, Shield, Info } from "lucide-react";
import { usePostsStore } from "@/store/usePostsStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  const exportData = () => {
    const { posts, responses } = usePostsStore.getState();
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), posts, responses }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pomosh-ryadom-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("footer.exported"));
  };

  const links = [
    { icon: Info, label: t("footer.about") },
    { icon: Shield, label: t("footer.privacy") },
    { icon: Mail, label: t("footer.contact") },
  ];

  return (
    <footer className="mt-10 border-t border-border bg-card/60 backdrop-blur-sm">
      <div className="container py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold text-lg">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Heart className="h-5 w-5" fill="currentColor" />
            </span>
            {t("common.appName")}
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            {t("footer.tagline")}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t("footer.navTitle")}</h4>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast(t("footer.soon", { label: l.label }));
                  }}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">{t("footer.devTitle")}</h4>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2 bouncy w-fit"
              onClick={exportData}
            >
              <Download className="h-4 w-4" />
              {t("footer.quickExport")}
            </Button>
            <Link
              to="/admin/data"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t("footer.adminLink")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            {t("footer.madeWith")} <Heart className="h-3 w-3 text-primary" fill="currentColor" /> {t("footer.forNeighbors")}
          </span>
          <span>© {new Date().getFullYear()} {t("common.appName")}</span>
        </div>
      </div>
    </footer>
  );
}
