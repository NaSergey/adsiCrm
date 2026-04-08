import { NextRequest, NextResponse } from "next/server";
import { PERMISSIONS, Role } from "@/shared/config/permissions"; 

const PUBLIC_PATH = "/";
const TOKEN_KEY = "pixelcrm_access_token";

function parseRole(token: string): Role | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof window === "undefined") {
      console.log("JWT Payload:", JSON.stringify(decoded, null, 2));
    }
    return (decoded.role as Role) ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  // Парсим роль один раз для всей функции
  const role = token ? parseRole(token) : null;
  // Достаем страницы из единого конфига
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
    // Редирект на первую доступную или на корень, если ролей нет
    const fallback = allowedPages[0] ?? "/";
    const redirect = NextResponse.redirect(new URL(fallback, request.url));
    
    if (!allowedPages.length) redirect.cookies.delete(TOKEN_KEY);
    return redirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|woff2?|css|js)$).*)',
  ],
};