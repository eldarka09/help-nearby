import { create } from "zustand";
import type { Post, Response } from "@/lib/types";

const OWNER_ID = "me";

const seed: Post[] = [
  {
    id: "p1",
    type: "request",
    name: "Мария",
    city: "Москва",
    district: "Арбат",
    category: "food",
    description:
      "Нужна помощь с продуктами для пожилой соседки. Не может выйти из дома уже неделю.",
    createdAt: Date.now() - 1000 * 60 * 30,
    ownerId: "u1",
  },
  {
    id: "p2",
    type: "offer",
    name: "Алексей",
    city: "Москва",
    district: "Чертаново",
    category: "tech",
    description:
      "Готов бесплатно починить компьютер или ноутбук. 10 лет опыта, выезд по району.",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    ownerId: "u2",
  },
  {
    id: "p3",
    type: "request",
    name: "Дмитрий",
    city: "Казань",
    district: "Центр",
    category: "moral",
    description:
      "Тяжёлый период в жизни, очень нужна моральная поддержка и просто разговор по душам.",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    ownerId: "u3",
  },
  {
    id: "p4",
    type: "offer",
    name: "Елена",
    city: "Санкт-Петербург",
    district: "Василеостровский",
    category: "medicine",
    description: "Могу привезти лекарства из аптеки людям с ограниченной мобильностью.",
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    ownerId: "u4",
  },
];

interface State {
  posts: Post[];
  responses: Response[];
  addPost: (
    p: Omit<Post, "id" | "createdAt" | "ownerId">,
    ownerId?: string
  ) => Post;
  addResponse: (r: Omit<Response, "id" | "createdAt">) => void;
  toggleResolved: (id: string) => void;
  myOwnerId: string;
}

export const usePostsStore = create<State>((set) => ({
  posts: seed,
  responses: [],
  myOwnerId: OWNER_ID,
  addPost: (p, ownerId) => {
    const post: Post = {
      ...p,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ownerId: ownerId ?? OWNER_ID,
    };
    set((s) => ({ posts: [post, ...s.posts] }));
    return post;
  },
  addResponse: (r) =>
    set((s) => ({
      responses: [
        ...s.responses,
        { ...r, id: crypto.randomUUID(), createdAt: Date.now() },
      ],
    })),
  toggleResolved: (id) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === id ? { ...p, resolved: !p.resolved } : p
      ),
    })),
}));
