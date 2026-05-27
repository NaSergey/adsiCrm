import { NextRequest, NextResponse } from "next/server";
import { PERMISSIONS } from "@/shared/config/permissions";
import { parseRole, getTokenMaxAge } from "@/shared/lib/jwt-helpers";

const PUBLIC_PATH = "/";
const TOKEN_KEY = "pixelcrm_access_token";
// Middleware вызывает бэк напрямую (server-to-server, без CORS и проблем с портами)
const API_BASE = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const REFRESH_URL = `${API_BASE}/auth/refresh`;

async function tryRefresh(request: NextRequest): Promise<{ accessToken: string; setCookie: string | null } | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasRefreshCookie = cookieHeader.includes("refreshToken=");
  try {
    const res = await fetch(REFRESH_URL, {
      method: "GET",
      headers: { cookie: cookieHeader },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "(unreadable)");
      console.log("[middleware tryRefresh] FAIL status:", res.status, "body:", body);
      return null;
    }
    const { accessToken } = await res.json();
    if (!accessToken) {
      console.log("[middleware tryRefresh] FAIL: no accessToken in response");
      return null;
    }
    console.log("[middleware tryRefresh] SUCCESS");
    return { accessToken, setCookie: res.headers.get("set-cookie") };
  } catch (e) {
    console.log("[middleware tryRefresh] EXCEPTION:", e);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let token = request.cookies.get(TOKEN_KEY)?.value;
  let refreshedCookie: string | null = null;

  const cookieHeader = request.headers.get("cookie") ?? "";
  console.log(`[middleware] ${pathname} | accessToken: ${!!token} | refreshToken: ${cookieHeader.includes("refreshToken=")} | full cookie: ${cookieHeader.slice(0, 200)}`);

  // Если нет access token — пробуем тихий refresh перед редиректом
  if (!token && pathname !== PUBLIC_PATH) {
    const result = await tryRefresh(request);
    if (result) {
      token = result.accessToken;
      refreshedCookie = result.setCookie;
    }
  }

  const role = token ? parseRole(token) : null;
  const allowedPages = (role && PERMISSIONS[role]?.pages) || [];

  if (pathname === PUBLIC_PATH) {
    if (token && role) {
      const firstPage = allowedPages[0];
      if (firstPage) return NextResponse.redirect(new URL(firstPage, request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const canAccess = allowedPages.some(page => pathname === page || pathname.startsWith(`${page}/`));

  if (!canAccess) {
    const fallback = allowedPages[0] ?? "/";
    const redirect = NextResponse.redirect(new URL(fallback, request.url));
    if (!allowedPages.length) redirect.cookies.delete(TOKEN_KEY);
    return redirect;
  }

  const response = NextResponse.next();

  // Если получили новый access token через refresh — записываем его в cookie
  if (refreshedCookie !== undefined && !request.cookies.get(TOKEN_KEY)?.value && token) {
    response.cookies.set(TOKEN_KEY, token, {
      path: "/",
      sameSite: "strict",
      maxAge: getTokenMaxAge(token),
    });
    // Пробрасываем новый refreshToken cookie от бэка в браузер
    if (refreshedCookie) {
      response.headers.append("Set-Cookie", refreshedCookie);
    }
  }

  return response;
}

export { proxy as middleware };

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|woff2?|css|js)$).*)',
  ],
};