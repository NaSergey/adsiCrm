import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTokenRefresh } from "./use-token-refresh";
import { makeJwtWithExpiry } from "@/test-utils/jwt";

vi.mock("@/shared/api/utils", () => ({
  refreshAccessToken: vi.fn(),
}));
import { refreshAccessToken } from "@/shared/api/utils";

describe("useTokenRefresh", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-27T12:00:00Z"));
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...originalLocation, href: "" },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(window, "location", { writable: true, value: originalLocation });
  });

  it("does nothing when there's no token", () => {
    renderHook(() => useTokenRefresh());
    expect(refreshAccessToken).not.toHaveBeenCalled();
  });

  it("refreshes immediately when token already expired (delay <= 0)", async () => {
    const token = makeJwtWithExpiry(30);
    localStorage.setItem("pixelcrm_access_token", token);
    // Mock simulates real refresh: writes a fresh token so the hook doesn't loop
    vi.mocked(refreshAccessToken).mockImplementation(async () => {
      localStorage.setItem("pixelcrm_access_token", makeJwtWithExpiry(3600));
      return true;
    });

    renderHook(() => useTokenRefresh());

    await act(async () => { await Promise.resolve(); });
    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
  });

  it("does NOT refresh when token has plenty of time left", () => {
    const token = makeJwtWithExpiry(600);
    localStorage.setItem("pixelcrm_access_token", token);

    renderHook(() => useTokenRefresh());

    expect(refreshAccessToken).not.toHaveBeenCalled();
  });

  it("redirects to '/' and clears token when refresh fails", async () => {
    const token = makeJwtWithExpiry(30);
    localStorage.setItem("pixelcrm_access_token", token);
    vi.mocked(refreshAccessToken).mockResolvedValue(false);

    renderHook(() => useTokenRefresh());

    await act(async () => { await Promise.resolve(); });
    expect(window.location.href).toBe("/");
    expect(localStorage.getItem("pixelcrm_access_token")).toBeNull();
  });

  it("clears timer on unmount", () => {
    const token = makeJwtWithExpiry(600);
    localStorage.setItem("pixelcrm_access_token", token);

    const { unmount } = renderHook(() => useTokenRefresh());
    unmount();

    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(refreshAccessToken).not.toHaveBeenCalled();
  });
});
