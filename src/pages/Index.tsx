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
import type { CategoryId, Post, PostType } from "@/lib/types";

const Index = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<PostType>("request");
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [respondTo, setRespondTo] = useState<Post | null>(null);

  const openCreate = (type: PostType) => {
    setCreateType(type);
    setCreateOpen(true);
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
    <main className="min-h-screen bg-background">
      <Header onNavigate={navigate} />
      <Hero
        onRequest={() => openCreate("request")}
        onOffer={() => openCreate("offer")}
      />
      <Stats />
      <CategoriesGrid active={activeCategory} onSelect={selectCategory} />
      <Feed
        category={activeCategory}
        onClearCategory={() => setActiveCategory(null)}
        onRespond={setRespondTo}
      />
      <HowItWorks />
      <MyDashboard onRespond={setRespondTo} />
      <Footer />

      <CreatePostDialog open={createOpen} onOpenChange={setCreateOpen} type={createType} />
      <RespondDialog post={respondTo} onClose={() => setRespondTo(null)} />
    </main>
  );
};

export default Index;
