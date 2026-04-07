"use client";

import { useLayoutEffect } from "react";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

export function ScrollbarProvider({ children }: { children: React.ReactNode }) {
  const [initialize] = useOverlayScrollbars({
    options: {
      scrollbars: { autoHide: "scroll", autoHideDelay: 600 },
    },
    defer: false,
  });

  useLayoutEffect(() => {
    initialize(document.body);
  }, [initialize]);

  return <>{children}</>;
}
