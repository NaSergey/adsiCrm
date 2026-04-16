import createFetchClient from "openapi-fetch";
import type { paths } from "./schema";
import { getAccessToken, clearAccessToken } from "@/shared/lib/auth-token";
import { API_URL } from "./config";

const fetchClient = createFetchClient<paths>({
  baseUrl: API_URL,
});

// Mutex: гарантирует что refresh выполняется только один раз при параллельных 401
let refreshPromise: Promise<boolean> | null = null;

if (typeof window !== "undefined") {
  // Attach Bearer token to every request
  fetchClient.use({
    onRequest({ request }) {
      const headers = new Headers(request.headers);
      const token = getAccessToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return new Request(request, { credentials: "include", headers });
    },

    async onResponse({ response, request }) {
      if (
          response.status !== 401 ||
          request.url.includes("/auth/refresh") ||
          request.url.includes("/auth/login") ||
          request.url.includes("/auth/logout")
        ) {
          return response;
        }

      // Если refresh уже идёт — ждём его, не запускаем новый
      if (!refreshPromise) {
        const { refreshAccessToken } = await import("./utils");
        refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
      }
      const ok = await refreshPromise;

      if (!ok) {
          clearAccessToken();
          if (typeof window !== "undefined" && window.location.pathname !== "/") {
            window.location.href = "/";
          }
          return response;
        }

      // Retry original request with new token
      const headers = new Headers(request.headers);
      const newToken = getAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
      }
      return fetch(new Request(request, { credentials: "include", headers }));
    },
  });
}

export { fetchClient };
