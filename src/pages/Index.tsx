import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { Feed } from "@/components/Feed";
import { HowItWorks } from "@/components/HowItWorks";
import { MyDashboard } from "@/components/MyDashboard";
import { Footer } from "@/components/Footer";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { FloatingHearts } from "@/components/FloatingHearts";
import { ChatPanel } from "@/components/ChatPanel";
import type { CategoryId, Post, PostType } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Index = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<PostType>("request");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const openOrCreateChat = useChatStore((s) => s.openOrCreateChat);
  const { t } = useTranslation();

  const requireAuth = (after: () => void) => {
    if (!user) {
      toast(t("common.needAuth"));
      setAuthOpen(true);
      return;
    }
    after();
  };

  const openCreate = (type: PostType) => {
    requireAuth(() => {
      setCreateType(type);
      setCreateOpen(true);
    });
  };

  const handleRespond = (post: Post) => {
    requireAuth(() => {
      if (!user) return;
      if (post.ownerId === user.id) {
        toast(t("common.needAuth"));
        return;
      }
      const chat = openOrCreateChat({
        postId: post.id,
        postSnippet: post.description,
        postType: post.type,
        authorId: post.ownerId,
        authorName: post.name,
        responderId: user.id,
        responderName: user.name,
      });
      setActiveChatId(chat.id);
      setChatOpen(true);
      toast.success(t("chat.startedToast", { name: post.name }));
    });
  };

  const navigate = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const selectCategory = (id: CategoryId | null) => {
    setActiveCategory(id);
    if (id) setTimeout(() => document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <main className="min-h-screen relative">
      <FloatingHearts />
      <Header onNavigate={navigate} onLoginClick={() => setAuthOpen(true)} />
      <Hero
        onRequest={() => openCreate("request")}
        onOffer={() => openCreate("offer")}
      />
      <Stats />
      <CategoriesGrid active={activeCategory} onSelect={selectCategory} />
      <Feed
        category={activeCategory}
        onClearCategory={() => setActiveCategory(null)}
        onRespond={handleRespond}
      />
      <HowItWorks />
      <MyDashboard onRespond={handleRespond} />
      <Footer />

      <CreatePostDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        type={createType}
        defaultName={user?.name}
        defaultCity={user?.city}
        ownerId={user?.id}
      />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <ChatPanel
        open={chatOpen}
        onOpenChange={(o) => {
          setChatOpen(o);
          if (!o) setActiveChatId(null);
        }}
        initialChatId={activeChatId}
      />
    </main>
  );
};

export default Index;
