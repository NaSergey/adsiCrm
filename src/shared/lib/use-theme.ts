"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Читаем реальную тему после гидрации (инлайн-скрипт уже выставил html.dark)
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  const applyTheme = (next: Theme) => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(next);
    html.style.colorScheme = next;
    localStorage.setItem("theme", next);
    document.cookie = `theme=${next};path=/;max-age=31536000`;
    setTheme(next);
  };

  const toggleTheme = () => applyTheme(theme === "dark" ? "light" : "dark");

  return { theme, toggleTheme, isDark: theme === "dark", mounted };
}
