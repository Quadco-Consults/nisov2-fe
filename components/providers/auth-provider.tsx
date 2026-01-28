"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { demoUser } from "@/server/services/mock-data";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // Auto-login with demo user if no user is logged in
    if (!user) {
      setUser({
        ...demoUser,
        role: "super_admin", // Give full access for demo
      });
    }
  }, [user, setUser]);

  return <>{children}</>;
}
