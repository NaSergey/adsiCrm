import { vi, beforeEach } from "vitest";

beforeEach(() => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = (eqPos > -1 ? c.slice(0, eqPos) : c).trim();
      if (name) document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  }
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.clearAllTimers();
});
