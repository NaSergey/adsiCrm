import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const res = await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: "GET",
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  const data = await res.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: res.status });

  // Пробрасываем очистку refreshToken cookie от бэка в браузер
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);

  return response;
}
