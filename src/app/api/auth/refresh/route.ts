import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/shared/api/server-config";

export async function GET(request: NextRequest) {
  const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: "GET",
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) response.headers.append("Set-Cookie", setCookie);

  return response;
}
