import { useEffect, useState } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AdminExport() {
  const posts = usePostsStore((s) => s.posts);
  const responses = usePostsStore((s) => s.responses);
  const [json, setJson] = useState("");

  useEffect(() => {
    setJson(JSON.stringify({ exportedAt: new Date().toISOString(), posts, responses }, null, 2));
  }, [posts, responses]);

  const download = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pomosh-ryadom-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Экспорт скачан");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    toast.success("Скопировано в буфер обмена");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-10 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> На главную
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dev Mode — экспорт данных</h1>
            <p className="text-muted-foreground mt-1">
              {posts.length} публикаций · {responses.length} откликов
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={copy} className="rounded-full">Скопировать</Button>
            <Button onClick={download} className="rounded-full gap-2">
              <Download className="h-4 w-4" /> Скачать JSON
            </Button>
          </div>
        </div>
        <pre className="rounded-3xl border border-border bg-card p-5 text-xs overflow-auto max-h-[70vh]">
{json}
        </pre>
      </div>
    </main>
  );
}
