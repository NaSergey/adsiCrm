"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { useTokenRefresh } from "@/shared/lib/use-token-refresh";
import { useLogUserData } from "@/shared/lib/use-log-user-data";
import { ToastProvider } from "@/shared/ui/toast";

function TokenRefresher() {
  useTokenRefresh();
  return null;
}

function UserDataLogger() {
  useLogUserData();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TokenRefresher />
          <UserDataLogger />
          {children}
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
