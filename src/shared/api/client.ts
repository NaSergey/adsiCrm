import createFetchClient from "openapi-fetch";
import type { paths } from "./schema";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/shared/lib/auth-token";

// Backend on :3000, frontend on :3001 — always point to backend
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

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
      // Skip refresh endpoint itself to avoid infinite loop
      if (response.status !== 401 || request.url.includes("/auth/refresh")) {
        return response;
      }

      // Try to refresh the access token
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        clearAccessToken();
        window.location.href = "/";
        return response;
      }

      const { accessToken } = await refreshRes.json();
      setAccessToken(accessToken);

      // Retry original request with new token
      const headers = new Headers(request.headers);
      headers.set("Authorization", `Bearer ${accessToken}`);
      return fetch(new Request(request, { credentials: "include", headers }));
    },
  });
}

export { fetchClient };
