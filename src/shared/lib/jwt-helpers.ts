import { Role } from "@/shared/config/permissions";

const DEFAULT_FALLBACK_MAX_AGE_SECS = 900;

function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function parseRole(token: string): Role | null {
  const decoded = decodePayload(token);
  if (!decoded) return null;
  return (decoded.role as Role) ?? null;
}

export function getTokenMaxAge(token: string): number {
  const decoded = decodePayload(token);
  if (!decoded || typeof decoded.exp !== "number") return DEFAULT_FALLBACK_MAX_AGE_SECS;
  return Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
}
