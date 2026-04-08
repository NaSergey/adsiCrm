"use client";

import * as React from "react";

export function useDropdown(ref: React.RefObject<HTMLDivElement | null>) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, ref]);

  return { isOpen, toggle: () => setIsOpen((v) => !v), close: () => setIsOpen(false) };
}
