import createFetchClient from "openapi-fetch";
import type { paths } from "./schema";
import { getAccessToken, clearAccessToken } from "@/shared/lib/auth-token";
import { API_URL } from "./config";

const fetchClient = createFetchClient<paths>({
  baseUrl: API_URL,
});

let refreshPromise: Promise<boolean> | null = null;

const retryClones = new Map<string, Request>();

if (typeof window !== "undefined") {
  // Attach Bearer token to every request
  fetchClient.use({
    onRequest({ request, id }) {
      const headers = new Headers(request.headers);
      const token = getAccessToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      const finalRequest = new Request(request, { credentials: "include", headers });
      // Нетронутый клон с целым телом — на случай повтора при 401
      retryClones.set(id, finalRequest.clone());
      return finalRequest;
    },

    async onResponse({ response, request, id }) {
      const retrySource = retryClones.get(id);
      retryClones.delete(id);

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

      // Повторяем запрос с новым токеном из нетронутого клона (тело цело)
      const base = retrySource ?? request;
      const headers = new Headers(base.headers);
      const newToken = getAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
      }
      return fetch(new Request(base, { credentials: "include", headers }));
    },

    onError({ id }) {
      retryClones.delete(id);
    },
  });
}

export { fetchClient };
