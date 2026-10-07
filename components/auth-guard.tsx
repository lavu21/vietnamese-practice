"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const LOGIN_PATH = "/login";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady, isAuthenticated } = useAuth();

  const isLoginPage = pathname === LOGIN_PATH;
  const shouldRedirect = isReady && (isAuthenticated === isLoginPage);

  useEffect(() => {
    if (!shouldRedirect) return;
    router.replace(isLoginPage ? "/" : LOGIN_PATH);
  }, [shouldRedirect, isLoginPage, router]);

  if (!isReady || shouldRedirect) return null;

  return <>{children}</>;
}
