import type { Post } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import { timeAgo } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
  post: Post;
  isMine?: boolean;
  onRespond: (post: Post) => void;
  onResolve?: (post: Post) => void;
}

export function PostCard({ post, isMine, onRespond, onResolve }: Props) {
  const { t, i18n } = useTranslation();
  const cat = getCategory(post.category);
  const isRequest = post.type === "request";

  return (
    <article
      className={cn(
        "rounded-3xl border bg-card p-5 sm:p-6 transition-all hover:shadow-soft",
        post.resolved && "opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 text-primary grid place-items-center font-semibold text-lg">
          {post.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-semibold truncate">{post.name}</h3>
            <span
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-full",
                isRequest ? "bg-request/10 text-request" : "bg-offer/10 text-offer"
              )}
            >
              {isRequest ? t("feed.needHelp") : t("feed.offeringHelp")}
            </span>
            {post.resolved && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {t("common.resolved")}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {post.city}
              {post.district ? `, ${post.district}` : ""}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(post.createdAt, t, i18n.language)}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "hidden sm:inline-flex h-10 w-10 rounded-2xl items-center justify-center shrink-0",
            cat.colorClass,
            cat.textClass
          )}
          title={t(cat.labelKey)}
        >
          <cat.icon className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-4 text-foreground/90 leading-relaxed">{post.description}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span
          className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1.5",
            cat.colorClass,
            cat.textClass
          )}
        >
          <cat.icon className="h-3.5 w-3.5" />
          {t(cat.labelKey)}
        </span>
        <div className="flex gap-2">
          {isMine && onResolve && !post.resolved && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bouncy"
              onClick={() => onResolve(post)}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              {t("common.markResolved")}
            </Button>
          )}
          {!post.resolved && (
            <Button
              size="sm"
              onClick={() => onRespond(post)}
              className={cn(
                "rounded-full bouncy",
                isRequest
                  ? "bg-request text-request-foreground hover:bg-request/90"
                  : "bg-offer text-offer-foreground hover:bg-offer/90"
              )}
            >
              {t("common.respond")}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
