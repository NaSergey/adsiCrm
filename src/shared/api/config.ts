/**
 * Centralized API configuration
 * All API calls should reference this instead of duplicating the URL
 */

// Нормализуем к виду "<origin>/api/" независимо от того, указан ли в
// NEXT_PUBLIC_API_URL сам /api и хвостовой слеш. И baseUrl клиента, и
// API_ENDPOINTS ниже рассчитывают на префикс /api/.
// (BACKEND_URL/proxy используют отдельный INTERNAL_API_URL = origin и дописывают
// /api сами — их это не касается.)
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000");

export const API_URL = `${API_ORIGIN}/api/`;

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
