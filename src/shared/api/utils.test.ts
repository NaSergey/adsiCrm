import { describe, it, expect, vi, beforeEach } from "vitest";
import { refreshAccessToken, isJson, generateToken } from "./utils";
import * as authToken from "@/shared/lib/auth-token";

describe("isJson", () => {
  it("returns true for valid JSON", () => {
    expect(isJson('{"a":1}')).toBe(true);
    expect(isJson("[]")).toBe(true);
    expect(isJson("null")).toBe(true);
  });

  it("returns false for invalid JSON", () => {
    expect(isJson("{a:1}")).toBe(false);
    expect(isJson("undefined")).toBe(false);
  });
});

describe("generateToken", () => {
  it("returns string of given length", () => {
    expect(generateToken(8)).toHaveLength(8);
    expect(generateToken(16)).toHaveLength(16);
  });

  it("uses only allowed chars", () => {
    expect(generateToken(50)).toMatch(/^[a-z0-9]+$/);
  });
});

describe("refreshAccessToken", () => {
  beforeEach(() => {
    vi.spyOn(authToken, "setAccessToken").mockImplementation(() => {});
  });

  it("saves token and returns true on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ accessToken: "new-token" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await refreshAccessToken();

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/refresh", {
      method: "GET",
      credentials: "include",
    });
    expect(authToken.setAccessToken).toHaveBeenCalledWith("new-token");
  });

  it("returns false on non-2xx response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    expect(await refreshAccessToken()).toBe(false);
    expect(authToken.setAccessToken).not.toHaveBeenCalled();
  });

  it("returns false when response has no accessToken", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }));
    expect(await refreshAccessToken()).toBe(false);
    expect(authToken.setAccessToken).not.toHaveBeenCalled();
  });

  it("returns false when response body is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new Error("not json"); },
    }));
    expect(await refreshAccessToken()).toBe(false);
  });

  it("returns false on network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    expect(await refreshAccessToken()).toBe(false);
  });
});
