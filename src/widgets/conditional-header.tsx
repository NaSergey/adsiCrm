"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/widgets/header";

const NO_CHROME = ["/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noChrome = NO_CHROME.includes(pathname);
  return (
    <>
      {!noChrome && <Header />}
      <main className={noChrome ? "min-h-screen" : "min-h-screen pt-28 sm:pt-31"}>
        {children}
      </main>
    </>
  );
}
