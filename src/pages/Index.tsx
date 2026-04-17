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
import { RespondDialog } from "@/components/RespondDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { FloatingHearts } from "@/components/FloatingHearts";
import type { CategoryId, Post, PostType } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Index = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<PostType>("request");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [respondTo, setRespondTo] = useState<Post | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
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
    requireAuth(() => setRespondTo(post));
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
      />
      <RespondDialog
        post={respondTo}
        defaultName={user?.name}
        onClose={() => setRespondTo(null)}
      />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </main>
  );
};

export default Index;
