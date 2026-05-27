import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { makeFakeJwt } from "@/test-utils/jwt";

vi.mock("@/shared/lib/auth-token", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/auth-token")>("@/shared/lib/auth-token");
  return {
    ...actual,
    getAccessToken: vi.fn(),
  };
});

import { getAccessToken } from "@/shared/lib/auth-token";
import { usePermissions } from "./use-permissions";

function setToken(payload: Record<string, unknown> | null) {
  vi.mocked(getAccessToken).mockReturnValue(payload ? makeFakeJwt(payload) : null);
}

describe("usePermissions", () => {
  beforeEach(() => {
    vi.mocked(getAccessToken).mockReset();
  });

  describe("no token", () => {
    it("returns empty role and no access", () => {
      setToken(null);
      const { result } = renderHook(() => usePermissions());
      expect(result.current.role).toBe("");
      expect(result.current.allowedPages).toEqual([]);
      expect(result.current.canAccessPage("/leads")).toBe(false);
      expect(result.current.hasFeature("create_lead")).toBe(false);
    });
  });

  describe("ADMIN", () => {
    beforeEach(() => {
      setToken({ name: "A", email: "a@a.a", role: "ADMIN", permissions: [] });
    });

    it("has all pages", () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canAccessPage("/leads")).toBe(true);
      expect(result.current.canAccessPage("/users")).toBe(true);
      expect(result.current.canAccessPage("/wiki")).toBe(true);
    });

    it("gets gated features without JWT permissions (admin bypass)", () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasFeature("export_leads")).toBe(true);
      expect(result.current.hasFeature("view_all_partners")).toBe(true);
      expect(result.current.hasFeature("create_broker")).toBe(true);
    });
  });

  describe("MANAGER", () => {
    it("does NOT get gated features without JWT permission", () => {
      setToken({ name: "M", email: "m@m.m", role: "MANAGER", permissions: [] });
      const { result } = renderHook(() => usePermissions());
      // export_leads is gated by full_leads_display
      expect(result.current.hasFeature("export_leads")).toBe(false);
      expect(result.current.hasFeature("full_leads_filters")).toBe(false);
    });

    it("unlocks gated features when JWT permission is granted", () => {
      setToken({
        name: "M",
        email: "m@m.m",
        role: "MANAGER",
        permissions: ["full_leads_display"],
      });
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasFeature("export_leads")).toBe(true);
      expect(result.current.hasFeature("full_leads_filters")).toBe(true);
    });

    it("keeps non-gated features regardless of JWT permissions", () => {
      setToken({ name: "M", email: "m@m.m", role: "MANAGER", permissions: [] });
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasFeature("view_all_leads")).toBe(true);
      expect(result.current.hasFeature("create_lead")).toBe(true);
    });

    it("cannot access /users or /settings", () => {
      setToken({ name: "M", email: "m@m.m", role: "MANAGER", permissions: [] });
      const { result } = renderHook(() => usePermissions());
      expect(result.current.canAccessPage("/users")).toBe(false);
      expect(result.current.canAccessPage("/settings")).toBe(false);
    });
  });

  describe("PARTNER", () => {
    beforeEach(() => {
      setToken({ name: "P", email: "p@p.p", role: "PARTNER", permissions: [] });
    });

    it("has limited pages", () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.allowedPages).toEqual(["/leads", "/wiki"]);
      expect(result.current.canAccessPage("/campaign")).toBe(false);
      expect(result.current.canAccessPage("/users")).toBe(false);
    });

    it("only sees basic lead view, not full", () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasFeature("view_basic_leads")).toBe(true);
      expect(result.current.hasFeature("view_all_leads")).toBe(false);
    });

    it("cannot delete users or leads", () => {
      const { result } = renderHook(() => usePermissions());
      expect(result.current.hasFeature("delete_user")).toBe(false);
      expect(result.current.hasFeature("delete_lead")).toBe(false);
    });
  });

  describe("INTEGRATOR", () => {
    it("gets create_broker only with JWT permission", () => {
      setToken({ name: "I", email: "i@i.i", role: "INTEGRATOR", permissions: [] });
      let { result } = renderHook(() => usePermissions());
      expect(result.current.hasFeature("create_broker")).toBe(false);

      setToken({
        name: "I",
        email: "i@i.i",
        role: "INTEGRATOR",
        permissions: ["access_to_create_broker"],
      });
      ({ result } = renderHook(() => usePermissions()));
      expect(result.current.hasFeature("create_broker")).toBe(true);
    });
  });

  describe("unknown role", () => {
    it("falls back to empty permissions when role isn't in PERMISSIONS map", () => {
      setToken({ name: "X", email: "x@x.x", role: "ALIEN", permissions: [] });
      const { result } = renderHook(() => usePermissions());
      expect(result.current.allowedPages).toEqual([]);
      expect(result.current.hasFeature("create_lead")).toBe(false);
    });
  });
});
