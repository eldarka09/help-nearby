import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Post } from "@/lib/types";
import { usePostsStore } from "@/store/usePostsStore";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { heartBurst } from "@/lib/confetti";
import { useTranslation } from "react-i18next";

interface Props {
  post: Post | null;
  defaultName?: string;
  onClose: () => void;
}

export function RespondDialog({ post, defaultName, onClose }: Props) {
  const addResponse = usePostsStore((s) => s.addResponse);
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (post) {
      setName(defaultName ?? "");
      setMessage(
        post.type === "request"
          ? t("respond.helloRequest", { name: post.name })
          : t("respond.helloOffer", { name: post.name })
      );
    }
  }, [post, defaultName, t]);

  if (!post) return null;

  const submit = (e: React.MouseEvent) => {
    if (!name.trim() || !message.trim()) return;
    addResponse({ postId: post.id, fromName: name.trim(), message: message.trim() });
    toast.success(t("respond.sentToast", { name: post.name }));
    heartBurst(e.clientX, e.clientY, 18);
    onClose();
  };

  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2rem]">
        <DialogHeader>
          <DialogTitle>{t("respond.title", { name: post.name })}</DialogTitle>
          <DialogDescription>
            {post.city}{post.district ? `, ${post.district}` : ""} · {t("respond.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl bg-muted/60 p-3 text-sm text-muted-foreground border border-border">
          {post.description}
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="rname">{t("respond.yourName")}</Label>
            <Input id="rname" value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl h-11" placeholder={t("respond.yourNamePh")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rmsg">{t("respond.message")}</Label>
            <Textarea id="rmsg" value={message} onChange={(e) => setMessage(e.target.value)} className="rounded-2xl min-h-28" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-full">{t("common.cancel")}</Button>
          <Button onClick={submit} className="rounded-full gap-1 bouncy shadow-soft">
            <Send className="h-4 w-4" /> {t("common.send")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
