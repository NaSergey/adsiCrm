import createFetchClient from "openapi-fetch";
import type { paths } from "./schema";
import { getAccessToken, clearAccessToken } from "@/shared/lib/auth-token";
import { API_URL } from "./config";

const fetchClient = createFetchClient<paths>({
  baseUrl: API_URL,
});

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
          request.url.includes("/auth/login")
        ) {
          return response;
        }

      // Try to refresh the access token using the shared utility
      // Dynamic import to avoid circular dependency with utils.ts
      const { refreshAccessToken } = await import("./utils");
      const ok = await refreshAccessToken();

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
