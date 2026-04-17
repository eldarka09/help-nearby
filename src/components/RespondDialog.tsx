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

interface Props {
  post: Post | null;
  onClose: () => void;
}

export function RespondDialog({ post, onClose }: Props) {
  const addResponse = usePostsStore((s) => s.addResponse);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (post) {
      setName("");
      setMessage(
        post.type === "request"
          ? `Здравствуйте, ${post.name}! Я могу помочь.`
          : `Здравствуйте, ${post.name}! Мне нужна ваша помощь.`
      );
    }
  }, [post]);

  if (!post) return null;

  const submit = () => {
    if (!name.trim() || !message.trim()) return;
    addResponse({ postId: post.id, fromName: name.trim(), message: message.trim() });
    toast.success(`Отклик отправлен пользователю ${post.name}`);
    onClose();
  };

  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Ответ для {post.name}</DialogTitle>
          <DialogDescription>
            {post.city}{post.district ? `, ${post.district}` : ""} · напишите короткое сообщение
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl bg-muted/50 p-3 text-sm text-muted-foreground border border-border">
          {post.description}
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="rname">Ваше имя</Label>
            <Input id="rname" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl h-11" placeholder="Имя" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rmsg">Сообщение</Label>
            <Textarea id="rmsg" value={message} onChange={(e) => setMessage(e.target.value)} className="rounded-2xl min-h-28" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-full">Отмена</Button>
          <Button onClick={submit} className="rounded-full gap-1">
            <Send className="h-4 w-4" /> Отправить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
