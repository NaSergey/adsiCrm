import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/shared/api/server-config";

export async function GET(request: NextRequest) {
  const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "GET",
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || "Refresh failed" };
  }

  const response = NextResponse.json(data, { status: res.status });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);

  return response;
}
