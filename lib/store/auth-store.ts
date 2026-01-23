import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (permissionId: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        if (roleArray.includes("all")) return true;
        return roleArray.includes(user.role);
      },

      hasPermission: (permissionId) => {
        const { user } = get();
        if (!user) return false;
        return user.permissions?.includes(permissionId) || false;
      },
    }),
    {
      name: "ntms-auth-storage",
    }
  )
);
