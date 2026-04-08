import { getAccessToken, setAccessToken } from "@/shared/lib/auth-token";
import { API_URL, API_ENDPOINTS } from "./config";

/** Returns the base API URL */
export function getApiDomain(): string {
  return API_URL;
}

/** Returns the current auth token or empty string */
export function getApiToken(): string {
  return getAccessToken() ?? "";
}

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

/** Refresh the access token using the refresh endpoint */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(API_ENDPOINTS.auth.refresh, {
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
