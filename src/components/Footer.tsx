import { Heart, Download } from "lucide-react";
import { usePostsStore } from "@/store/usePostsStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
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
    toast.success("JSON экспорт скачан");
  };

  return (
    <footer className="border-t border-border mt-10">
      <div className="container py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4 text-primary" fill="currentColor" />
          ПомощьРядом — соседская взаимопомощь © {new Date().getFullYear()}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-2"
          onClick={exportData}
        >
          <Download className="h-4 w-4" />
          Dev: экспорт JSON
        </Button>
      </div>
    </footer>
  );
}
