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

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.mamatvam.com/v1';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...restOptions } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...restOptions,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      json?.message || `Request failed with status ${response.status}`,
      response.status,
      json
    );
  }

  return json as T;
}
