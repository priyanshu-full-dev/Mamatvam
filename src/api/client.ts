import { useAuthStore } from '@/store/useAuthStore';

// Production API Client Abstraction
// Centralized configuration, token injection, and response interceptor

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  statusCode: number;
}

export class ApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://130.210.30.199/api/v1/user')
  .trim()
  .replace(/\/+$/, '');

/**
 * Universal JWT expiration checker that runs reliably in React Native without external dependencies.
 */
function parseJwtExp(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) base64 += '=';

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    for (let i = 0; i < base64.length; i += 4) {
      const enc1 = chars.indexOf(base64.charAt(i));
      const enc2 = chars.indexOf(base64.charAt(i + 1));
      const enc3 = chars.indexOf(base64.charAt(i + 2));
      const enc4 = chars.indexOf(base64.charAt(i + 3));

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;

      output += String.fromCharCode(chr1);
      if (enc3 !== 64 && enc3 !== -1) output += String.fromCharCode(chr2);
      if (enc4 !== 64 && enc4 !== -1) output += String.fromCharCode(chr3);
    }

    const parsed = JSON.parse(output);
    return typeof parsed.exp === 'number' ? parsed.exp : null;
  } catch {
    return null;
  }
}

import { isTokenExpired } from '@/utils/token';
export { isTokenExpired };

/**
 * Call POST /api/v1/user/auth/refresh-token using the saved refresh token.
 * Uses centralized session refresh in useAuthStore with concurrency deduplication.
 */
export async function refreshAccessToken(): Promise<string | null> {
  return useAuthStore.getState().refreshSession();
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { token?: string | null; _isRetry?: boolean } = {}
): Promise<T> {
  const { token, headers, _isRetry, ...restOptions } = options;

  const isAuthEndpoint =
    endpoint.includes('/auth/request-otp') ||
    endpoint.includes('/auth/verify-otp') ||
    endpoint.includes('/auth/refresh-token') ||
    endpoint.includes('/auth/logout') ||
    endpoint.includes('/pincodes');

  let authToken = token !== undefined ? token : useAuthStore.getState().token;

  // Proactive check: Refresh before calling if access token is already expired or near expiration
  if (!isAuthEndpoint && authToken && isTokenExpired(authToken) && !_isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      authToken = refreshed;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (authToken) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...restOptions,
  });

  const json = await response.json().catch(() => null);

  // Reactive check: If 401 or token expired error received, refresh and retry once
  const isUnauthorized =
    response.status === 401 ||
    json?.code === 'TOKEN_EXPIRED' ||
    (typeof json?.message === 'string' &&
      (json.message.toLowerCase().includes('token expired') ||
        json.message.toLowerCase().includes('unauthorized') ||
        json.message.toLowerCase().includes('jwt expired') ||
        json.message.toLowerCase().includes('invalid token')));

  if (isUnauthorized && !isAuthEndpoint && !_isRetry) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      return apiClient<T>(endpoint, {
        ...options,
        token: refreshedToken,
        _isRetry: true,
      });
    }
  }

  if (!response.ok || !json || json.success === false) {
    throw new ApiError(
      json?.message || `Request failed with status ${response.status}`,
      response.status || 400,
      json
    );
  }

  return json as T;
}
