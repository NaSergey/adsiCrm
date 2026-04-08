"use client";

import { useEffect, useRef } from "react";
import { getAccessToken, getTokenExpiry, clearAccessToken } from "./auth-token";
import { refreshAccessToken } from "@/shared/api/utils";

/** How many seconds before expiry to proactively refresh. */
const REFRESH_BEFORE_SECS = 60;

/** Maximum timer delay — re-schedule after this interval to handle very long-lived tokens. */
const MAX_DELAY_MS = 60 * 60 * 1000; // 1 hour

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
        refreshAccessToken().then((ok) => {
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
        const ok = await refreshAccessToken();
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
