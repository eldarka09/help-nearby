import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  city?: string;
}

interface AuthState {
  user: MockUser | null;
  signIn: (email: string, name?: string, city?: string) => MockUser;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email, name, city) => {
        const u: MockUser = {
          id: email.toLowerCase(),
          email,
          name: name?.trim() || email.split("@")[0],
          city,
        };
        set({ user: u });
        return u;
      },
      signOut: () => set({ user: null }),
    }),
    { name: "pomosh-auth" }
  )
);
