import { setAccessToken } from "@/shared/lib/auth-token";


/** Returns true if the string is valid JSON */
export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/** @todo implement real token generation */
export function generateToken(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/** Refresh the access token using the Next.js proxy route (same-origin, cookie safe) */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => null);
    const accessToken = data?.accessToken;
    if (!accessToken) return false;
    setAccessToken(accessToken);
    return true;
  } catch {
    return false;
  }
}
