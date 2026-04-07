import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATH = "/";
const TOKEN_KEY = "pixelcrm_access_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === PUBLIC_PATH) {
    // Already on login page — redirect to /campaign if already authenticated
    const token = request.cookies.get(TOKEN_KEY)?.value;
    if (token) {
      return NextResponse.redirect(new URL("/campaign", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — require token
  const token = request.cookies.get(TOKEN_KEY)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
