/**
 * Centralized API configuration
 * All API calls should reference this instead of duplicating the URL
 */

// Браузерные запросы идут на ТОТ ЖЕ origin через рантайм-прокси Next.js:
// роут src/app/backend/[...slug]/route.ts ловит /backend/* и проксирует на
// адрес бэкенда (INTERNAL_API_URL, читается в РАНТАЙМЕ). Раньше для этого
// использовался rewrites() в next.config.ts, но от него отказались — rewrites
// «запекают» адрес на этапе сборки. Поэтому образ собирается ОДИН раз и работает
// где угодно — адрес бэка задаётся при запуске контейнера, а не при сборке
// (NEXT_PUBLIC_* как раз "запекаются" в бандл навсегда, полагаться на них нельзя).
// И baseUrl клиента, и API_ENDPOINTS ниже рассчитывают на хвостовой /.
export const API_URL = "/backend/api/";

export const API_ENDPOINTS = {
  auth: {
    refresh: `${API_URL}auth/refresh`,
    logout: `${API_URL}auth/logout`,
    login: `${API_URL}auth/login`,
  },
  leads: {
    autologinImage: (leadId: number) => `${API_URL}leads/viewAutologinImage/${leadId}`,
    fingerprint:    (leadId: number) => `${API_URL}leads/getFingerprint/${leadId}`,
  },
} as const;
