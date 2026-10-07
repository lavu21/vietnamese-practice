"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { MOCK_USERS } from "./constants";

const STORAGE_KEY = "vnp_auth_username";

interface AuthContextValue {
  username: string | null;
  isAuthenticated: boolean;
  /** false cho tới khi đọc xong phiên từ localStorage. */
  isReady: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Khôi phục phiên đăng nhập giả lập từ localStorage sau khi tải lại trang.
  useEffect(() => {
    setUsername(window.localStorage.getItem(STORAGE_KEY));
    setIsReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      username,
      isAuthenticated: username !== null,
      isReady,
      // API đăng nhập giả: mô phỏng độ trễ mạng rồi so khớp với MOCK_USERS.
      login: async (inputUsername, inputPassword) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const match = MOCK_USERS.find(
          (user) => user.username === inputUsername && user.password === inputPassword,
        );
        if (!match) return false;
        setUsername(match.username);
        window.localStorage.setItem(STORAGE_KEY, match.username);
        return true;
      },
      logout: () => {
        setUsername(null);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [username, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
