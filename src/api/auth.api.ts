import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { authMockService } from '@/services/mock/auth.mock';

export const AUTH_QUERY_KEYS = {
  locations: (search?: string) => ['locations', search] as const,
};

export interface RequestOtpPayload {
  mobile?: string;
  phone?: string;
  pincodeId?: string | number;
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface PincodeItem {
  id: number;
  pincode: string;
  country: string;
  state: string;
  district: string;
  block: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PincodeResponse {
  success: boolean;
  message: string;
  data: PincodeItem[];
}

/**
 * Fetch location details by 6-digit PIN code:
 * GET http://130.210.30.199/api/v1/pincodes/{pincode}
 */
export async function getPincodeDataApi(pincode: string): Promise<PincodeResponse> {
  return apiClient<PincodeResponse>(`/pincodes/${pincode}`, {
    method: 'GET',
  });
}

/**
 * Real API call to request OTP from the backend:
 * POST http://130.210.30.199/api/v1/user/auth/request-otp
 */
export async function requestOtpApi(payload: RequestOtpPayload): Promise<RequestOtpResponse> {
  const mobile = payload.mobile || payload.phone || '';
  const rawPincodeId = payload.pincodeId;
  const pincodeId = rawPincodeId !== undefined && rawPincodeId !== ''
    ? String(rawPincodeId)
    : '1';

  return apiClient<RequestOtpResponse>('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({
      mobile,
      pincodeId,
    }),
  });
}

export interface VerifyOtpPayload {
  mobile?: string;
  phone?: string;
  otp: string;
}

import { UserOnboarding } from '@/store/useAuthStore';

export interface VerifyOtpUser {
  id: string;
  name: string | null;
  email: string | null;
  mobile: string;
  role: {
    id: number;
    name: string;
  };
  belongsTo: {
    id: number;
    name: string;
    type: string;
  };
  onboarding: UserOnboarding;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: VerifyOtpUser;
  };
}

/**
 * Real API call to verify OTP:
 * POST http://130.210.30.199/api/v1/user/auth/verify-otp
 */
export async function verifyOtpApi(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  const mobile = payload.mobile || payload.phone || '';

  return apiClient<VerifyOtpResponse>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      mobile,
      otp: payload.otp,
    }),
  });
}

export function useLocationsQuery(search?: string) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.locations(search),
    queryFn: () => authMockService.fetchLocations(search),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useSendOtpMutation() {
  return useMutation<
    RequestOtpResponse,
    Error,
    { phone?: string; mobile?: string; pincodeId?: string | number }
  >({
    mutationFn: (vars) => requestOtpApi(vars),
  });
}

export function useVerifyOtpMutation() {
  return useMutation<
    VerifyOtpResponse,
    Error,
    { phone?: string; mobile?: string; otp: string; location?: string }
  >({
    mutationFn: (vars) => verifyOtpApi(vars),
  });
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Real API call to logout from the backend:
 * POST http://130.210.30.199/api/v1/user/auth/logout
 * Header: Authorization: Bearer <accessToken>
 * Body: { refreshToken: string }
 */
export async function logoutApi(refreshToken: string, token?: string): Promise<LogoutResponse> {
  return apiClient<LogoutResponse>('/auth/logout', {
    method: 'POST',
    token,
    body: JSON.stringify({
      refreshToken,
    }),
  });
}
