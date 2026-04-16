import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  // Пробрасываем Set-Cookie от бэка — теперь cookie будет на домене фронта
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);

  return response;
}
