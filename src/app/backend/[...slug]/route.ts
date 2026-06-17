import { NextRequest } from "next/server";
import { BACKEND_URL } from "@/shared/api/server-config";

// Рантайм-прокси на бэкенд. В отличие от rewrites() в next.config (они «запекают»
// адрес на этапе сборки), этот роут читает BACKEND_URL = INTERNAL_API_URL в РАНТАЙМЕ.
// Поэтому образ собирается один раз и адрес бэка задаётся при запуске контейнера.
// Браузерный клиент (API_URL = "/backend/api/") ходит сюда same-origin.
export const dynamic = "force-dynamic";

// Заголовки, которые нельзя пробрасывать как есть (их выставит fetch сам).
const STRIP_REQUEST = ["host", "connection", "accept-encoding", "content-length"];
const STRIP_RESPONSE = ["content-encoding", "content-length", "transfer-encoding"];

async function handler(req: NextRequest, ctx: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await ctx.params;
  const target = `${BACKEND_URL}/${slug.join("/")}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  for (const h of STRIP_REQUEST) headers.delete(h);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const res = await fetch(target, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    redirect: "manual",
  });

  const resHeaders = new Headers(res.headers);
  for (const h of STRIP_RESPONSE) resHeaders.delete(h);

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};
