const ACCESS_TOKEN_KEY = "pixelcrm_access_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  const lsToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  // Если токен в localStorage есть — проверяем не протух ли он
  if (lsToken) {
    const exp = getTokenExpiry(lsToken);
    const isExpired = exp !== null && exp <= Math.floor(Date.now() / 1000);
    if (!isExpired) return lsToken;
    // Протух — чистим localStorage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  // Fallback: middleware мог поставить свежий токен в cookie (server-side refresh)
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${ACCESS_TOKEN_KEY}=([^;]+)`));
  const cookieToken = match ? decodeURIComponent(match[1]) : null;
  if (cookieToken) {
    // Синхронизируем в localStorage для следующих вызовов
    localStorage.setItem(ACCESS_TOKEN_KEY, cookieToken);
  }
  return cookieToken;
}

/** Returns the token expiry timestamp in seconds, or null if not a JWT / no exp claim. */
export function getTokenExpiry(token: string): number | null {
  try {
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return null;
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  const exp = getTokenExpiry(token);
  const maxAge = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : 60 * 60 * 24 * 7;
  document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; SameSite=Strict; max-age=${maxAge}`;
}

export function getTokenUser(token: string): { name: string; email: string; role: string; permissions: string[] } | null {
  try {
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return null;
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.name || !payload.email) return null;
    return {
      name: payload.name,
      email: payload.email,
      role: payload.role ?? "",
      permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
    };
  } catch {
    return null;
  }
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  // SameSite must match what setAccessToken used, otherwise some browsers treat them as different cookies
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/** Returns all user data from JWT token */
export function getAllTokenData(token: string): Record<string, unknown> | null {
  try {
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return null;
    return JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
