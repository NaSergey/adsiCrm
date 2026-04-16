/**
 * Centralized API configuration
 * All API calls should reference this instead of duplicating the URL
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const API_ENDPOINTS = {
  auth: {
    refresh: `${API_URL}/api/auth/refresh`,
    logout: `${API_URL}/api/auth/logout`,
    login: `${API_URL}/api/auth/login`,
  },
  leads: {
    autologinImage: (leadId: number) => `${API_URL}/leads/viewAutologinImage/${leadId}`,
  },
} as const;
