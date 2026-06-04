import createFetchClient from "openapi-fetch";
import { cookies } from "next/headers";
import type { paths } from "./schema";
import { BACKEND_URL } from "./server-config";

const ACCESS_TOKEN_KEY = "pixelcrm_access_token";

/**
 * Серверный API-клиент для использования в Server Components / route handlers.
 * Ходит на бэкенд напрямую (server-to-server) и подставляет access token из cookie.
 * В отличие от браузерного `fetchClient`, не делает авто-refresh при 401 —
 * на сервере это задача middleware (proxy.ts).
 */
// Без хвостового слэша: openapi-fetch склеивает URL как `baseUrl + path`,
// а path уже начинается со слэша ("/campaigns/..."). С `/api/` вышло бы
// `/api//campaigns` → 404. Поэтому baseUrl должен оканчиваться на `/api`.
const serverFetchClient = createFetchClient<paths>({
  baseUrl: `${BACKEND_URL}/api`,
});

serverFetchClient.use({
  async onRequest({ request }) {
    const token = (await cookies()).get(ACCESS_TOKEN_KEY)?.value;
    if (!token) return request;
    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return new Request(request, { headers });
  },
});

export { serverFetchClient };
