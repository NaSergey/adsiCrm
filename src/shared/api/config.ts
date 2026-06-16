/**
 * Centralized API configuration
 * All API calls should reference this instead of duplicating the URL
 */

// Браузерные запросы идут на ТОТ ЖЕ origin через прокси Next.js.
// next.config.ts переписывает /backend/* на адрес бэкенда (INTERNAL_API_URL,
// читается в рантайме). Поэтому образ собирается ОДИН раз и работает где угодно —
// адрес бэка задаётся при запуске контейнера, а не при сборке (NEXT_PUBLIC_* как
// раз "запекаются" в бандл навсегда, поэтому полагаться на них для адреса нельзя).
// И baseUrl клиента, и API_ENDPOINTS ниже рассчитывают на хвостовой /.
export const API_URL = "/backend/api/";

// Публичный адрес API ТОЛЬКО для показа в документации (страница /wiki).
// На работу приложения не влияет. Если NEXT_PUBLIC_API_URL не задан при сборке —
// в доке подставится относительный путь как заглушка.
const PUBLIC_API_ORIGIN = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
export const PUBLIC_API_URL = PUBLIC_API_ORIGIN ? `${PUBLIC_API_ORIGIN}/api/` : API_URL;

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
