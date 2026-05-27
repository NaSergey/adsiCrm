import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  getTokenExpiry,
  getTokenUser,
  getAllTokenData,
} from "./auth-token";
import { makeFakeJwt, makeJwtWithExpiry } from "@/test-utils/jwt";

describe("getTokenExpiry", () => {
  it("returns exp claim as seconds when present", () => {
    const token = makeFakeJwt({ exp: 1234567890 });
    expect(getTokenExpiry(token)).toBe(1234567890);
  });

  it("returns null when exp is missing", () => {
    const token = makeFakeJwt({ sub: 1 });
    expect(getTokenExpiry(token)).toBeNull();
  });

  it("returns null for malformed token", () => {
    expect(getTokenExpiry("not.a.jwt")).toBeNull();
    expect(getTokenExpiry("garbage")).toBeNull();
  });

  it("returns null when exp is not a number", () => {
    const token = makeFakeJwt({ exp: "soon" });
    expect(getTokenExpiry(token)).toBeNull();
  });
});

describe("setAccessToken / getAccessToken", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-27T12:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("stores token in localStorage and mirrors it in cookie", () => {
    const token = makeJwtWithExpiry(3600);
    setAccessToken(token);
    expect(localStorage.getItem("pixelcrm_access_token")).toBe(token);
    expect(document.cookie).toContain(`pixelcrm_access_token=${token}`);
  });

  it("returns valid (non-expired) token from localStorage", () => {
    const token = makeJwtWithExpiry(3600);
    setAccessToken(token);
    expect(getAccessToken()).toBe(token);
  });

  it("clears localStorage when token is expired and falls back to cookie", () => {
    const expired = makeJwtWithExpiry(-10);
    localStorage.setItem("pixelcrm_access_token", expired);

    const fresh = makeJwtWithExpiry(3600);
    document.cookie = `pixelcrm_access_token=${fresh}; path=/`;

    expect(getAccessToken()).toBe(fresh);
    expect(localStorage.getItem("pixelcrm_access_token")).toBe(fresh);
  });

  it("returns null when no token anywhere", () => {
    expect(getAccessToken()).toBeNull();
  });
});

describe("clearAccessToken", () => {
  it("removes from localStorage and expires the cookie", () => {
    const token = makeJwtWithExpiry(3600);
    setAccessToken(token);

    clearAccessToken();
    expect(localStorage.getItem("pixelcrm_access_token")).toBeNull();
    expect(document.cookie).not.toContain(`pixelcrm_access_token=${token}`);
  });
});

describe("getTokenUser", () => {
  it("extracts user fields from payload", () => {
    const token = makeFakeJwt({
      name: "Admin",
      email: "admin@example.com",
      role: "ADMIN",
      permissions: ["read", "write"],
    });
    expect(getTokenUser(token)).toEqual({
      name: "Admin",
      email: "admin@example.com",
      role: "ADMIN",
      permissions: ["read", "write"],
    });
  });

  it("returns null when name or email missing", () => {
    expect(getTokenUser(makeFakeJwt({ name: "Admin" }))).toBeNull();
    expect(getTokenUser(makeFakeJwt({ email: "x@y.z" }))).toBeNull();
  });

  it("defaults role to empty string and permissions to []", () => {
    const token = makeFakeJwt({ name: "U", email: "u@u.u" });
    expect(getTokenUser(token)).toEqual({
      name: "U",
      email: "u@u.u",
      role: "",
      permissions: [],
    });
  });

  it("returns null for malformed token", () => {
    expect(getTokenUser("oops")).toBeNull();
  });
});

describe("getAllTokenData", () => {
  it("returns full payload object", () => {
    const payload = { sub: 1, role: "ADMIN", custom: "value" };
    expect(getAllTokenData(makeFakeJwt(payload))).toEqual(payload);
  });

  it("returns null for malformed token", () => {
    expect(getAllTokenData("oops")).toBeNull();
  });
});
