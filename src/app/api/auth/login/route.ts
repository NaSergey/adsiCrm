import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/shared/api/server-config";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);

  return response;
}
