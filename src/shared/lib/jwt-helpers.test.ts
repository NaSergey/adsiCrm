import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseRole, getTokenMaxAge } from "./jwt-helpers";
import { makeFakeJwt } from "@/test-utils/jwt";

describe("parseRole", () => {
  it("returns role from JWT payload", () => {
    expect(parseRole(makeFakeJwt({ role: "ADMIN" }))).toBe("ADMIN");
  });

  it("returns null when role is missing", () => {
    expect(parseRole(makeFakeJwt({ sub: 1 }))).toBeNull();
  });

  it("returns null for malformed token", () => {
    expect(parseRole("garbage")).toBeNull();
    expect(parseRole("only.two")).toBeNull();
  });
});

describe("getTokenMaxAge", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-27T12:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("returns seconds remaining until exp", () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = makeFakeJwt({ exp: nowSec + 600 });
    expect(getTokenMaxAge(token)).toBe(600);
  });

  it("returns 0 for an already-expired token", () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = makeFakeJwt({ exp: nowSec - 60 });
    expect(getTokenMaxAge(token)).toBe(0);
  });

  it("returns fallback (900) when exp is missing", () => {
    expect(getTokenMaxAge(makeFakeJwt({ sub: 1 }))).toBe(900);
  });

  it("returns fallback (900) for malformed token", () => {
    expect(getTokenMaxAge("garbage")).toBe(900);
  });
});
