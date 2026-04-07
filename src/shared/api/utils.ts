import { getAccessToken } from "@/shared/lib/auth-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

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
