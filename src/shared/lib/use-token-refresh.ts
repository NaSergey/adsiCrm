"use client";

import { useEffect, useRef } from "react";
import { getAccessToken, getTokenExpiry, setAccessToken, clearAccessToken } from "./auth-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

/** How many seconds before expiry to proactively refresh. */
const REFRESH_BEFORE_SECS = 60;

/** Maximum timer delay — re-schedule after this interval to handle very long-lived tokens. */
const MAX_DELAY_MS = 60 * 60 * 1000; // 1 hour

async function doRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return false;
    const { accessToken } = await res.json();
    setAccessToken(accessToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * Proactively refreshes the access token before it expires.
 * Handles tab visibility changes (user returns after long idle).
 * Falls back to a periodic check if token has no `exp` claim.
 */
export function useTokenRefresh() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleRefreshRef = useRef<() => void>(() => {});

  useEffect(() => {
    scheduleRefreshRef.current = function scheduleRefresh() {
      if (timerRef.current) clearTimeout(timerRef.current);

      const token = getAccessToken();
      if (!token) return;

      const exp = getTokenExpiry(token);

      if (exp === null) {
        timerRef.current = setTimeout(() => scheduleRefreshRef.current(), 5 * 60 * 1000);
        return;
      }

      const nowMs = Date.now();
      const expiryMs = exp * 1000;
      const refreshAtMs = expiryMs - REFRESH_BEFORE_SECS * 1000;
      const rawDelayMs = refreshAtMs - nowMs;

      if (rawDelayMs <= 0) {
        doRefresh().then((ok) => {
          if (ok) {
            scheduleRefreshRef.current();
          } else {
            clearAccessToken();
            window.location.href = "/";
          }
        });
        return;
      }

      const delayMs = Math.min(rawDelayMs, MAX_DELAY_MS);

      timerRef.current = setTimeout(async () => {
        const ok = await doRefresh();
        if (ok) {
          scheduleRefreshRef.current();
        } else {
          clearAccessToken();
          window.location.href = "/";
        }
      }, delayMs);
    };

    scheduleRefreshRef.current();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleRefreshRef.current();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
