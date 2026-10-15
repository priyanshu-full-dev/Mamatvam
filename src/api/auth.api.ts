import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { authMockService, VerifyOtpResponse } from '@/services/mock/auth.mock';

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

/**
 * Real API call to request OTP from the backend:
 * POST http://130.210.30.199/api/v1/auth/user/request-otp
 */
export async function requestOtpApi(payload: RequestOtpPayload): Promise<RequestOtpResponse> {
  const mobile = payload.mobile || payload.phone || '';
  const pincodeId = payload.pincodeId !== undefined && payload.pincodeId !== ''
    ? String(payload.pincodeId)
    : '1';

  return apiClient<RequestOtpResponse>('/auth/user/request-otp', {
    method: 'POST',
    body: JSON.stringify({
      mobile,
      pincodeId,
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
    { phone: string; otp: string; location?: string }
  >({
    mutationFn: ({ phone, otp, location }) =>
      authMockService.verifyOtp(phone, otp, location),
  });
}
