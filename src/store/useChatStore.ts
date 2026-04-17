import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  postId: string;
  postSnippet: string;
  postType: "request" | "offer";
  // participants
  authorId: string;
  authorName: string;
  responderId: string;
  responderName: string;
  // unread tracking per participant
  unread: Record<string, number>;
  resolved?: boolean;
  createdAt: number;
  lastMessageAt: number;
}

interface ChatState {
  chats: Chat[];
  messages: ChatMessage[];
  /** Returns existing or new chat between responder and post author. */
  openOrCreateChat: (input: {
    postId: string;
    postSnippet: string;
    postType: "request" | "offer";
    authorId: string;
    authorName: string;
    responderId: string;
    responderName: string;
  }) => Chat;
  sendMessage: (chatId: string, senderId: string, text: string) => void;
  markRead: (chatId: string, userId: string) => void;
  unreadTotal: (userId: string) => number;
  myChats: (userId: string) => Chat[];
  chatMessages: (chatId: string) => ChatMessage[];
  resolveChat: (chatId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      messages: [],
      openOrCreateChat: (input) => {
        const existing = get().chats.find(
          (c) =>
            c.postId === input.postId &&
            c.responderId === input.responderId &&
            c.authorId === input.authorId
        );
        if (existing) return existing;
        const chat: Chat = {
          id: crypto.randomUUID(),
          postId: input.postId,
          postSnippet: input.postSnippet.slice(0, 120),
          postType: input.postType,
          authorId: input.authorId,
          authorName: input.authorName,
          responderId: input.responderId,
          responderName: input.responderName,
          unread: { [input.authorId]: 0, [input.responderId]: 0 },
          createdAt: Date.now(),
          lastMessageAt: Date.now(),
        };
        set((s) => ({ chats: [chat, ...s.chats] }));
        return chat;
      },
      sendMessage: (chatId, senderId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const msg: ChatMessage = {
          id: crypto.randomUUID(),
          chatId,
          senderId,
          text: trimmed,
          createdAt: Date.now(),
        };
        set((s) => ({
          messages: [...s.messages, msg],
          chats: s.chats.map((c) => {
            if (c.id !== chatId) return c;
            const otherIds = Object.keys(c.unread).filter((id) => id !== senderId);
            const nextUnread = { ...c.unread };
            otherIds.forEach((id) => {
              nextUnread[id] = (nextUnread[id] ?? 0) + 1;
            });
            return { ...c, unread: nextUnread, lastMessageAt: msg.createdAt };
          }),
        }));
      },
      markRead: (chatId, userId) =>
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === chatId ? { ...c, unread: { ...c.unread, [userId]: 0 } } : c
          ),
        })),
      unreadTotal: (userId) =>
        get()
          .chats.filter((c) => c.authorId === userId || c.responderId === userId)
          .reduce((sum, c) => sum + (c.unread[userId] ?? 0), 0),
      myChats: (userId) =>
        get()
          .chats.filter((c) => c.authorId === userId || c.responderId === userId)
          .sort((a, b) => b.lastMessageAt - a.lastMessageAt),
      chatMessages: (chatId) =>
        get()
          .messages.filter((m) => m.chatId === chatId)
          .sort((a, b) => a.createdAt - b.createdAt),
      resolveChat: (chatId) =>
        set((s) => ({
          chats: s.chats.map((c) => (c.id === chatId ? { ...c, resolved: true } : c)),
        })),
    }),
    { name: "pomosh-chats" }
  )
);
