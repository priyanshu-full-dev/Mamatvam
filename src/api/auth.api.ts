import { useMutation, useQuery } from '@tanstack/react-query';
import { authMockService, SendOtpResponse, VerifyOtpResponse } from '@/services/mock/auth.mock';

export const AUTH_QUERY_KEYS = {
  locations: (search?: string) => ['locations', search] as const,
};

export function useLocationsQuery(search?: string) {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.locations(search),
    queryFn: () => authMockService.fetchLocations(search),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useSendOtpMutation() {
  return useMutation<SendOtpResponse, Error, { phone: string }>({
    mutationFn: ({ phone }) => authMockService.sendOtp(phone),
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
