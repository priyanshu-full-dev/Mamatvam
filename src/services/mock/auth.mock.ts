import { LocationItem, POPULAR_LOCATIONS } from '@/constants/locations';
import { UserProfile } from '@/store/useAuthStore';

export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresInSeconds: number;
  otpLength: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  token: string;
  user: UserProfile;
  isNewUser: boolean;
}

export const authMockService = {
  async sendOtp(phone: string): Promise<SendOtpResponse> {
    if (!phone || phone.length < 10) {
      throw new Error('Please enter a valid phone number');
    }
    return {
      success: true,
      message: 'OTP sent to +91 ' + phone,
      expiresInSeconds: 30,
      otpLength: 4,
    };
  },

  async verifyOtp(phone: string, otp: string, location?: string): Promise<VerifyOtpResponse> {
    if (otp !== '1234' && otp.length !== 4) {
      throw new Error('Invalid OTP. Please enter 1234 or a valid 4-digit code.');
    }
    return {
      success: true,
      token: `mock_jwt_${Date.now()}_${phone}`,
      user: {
        id: `user_${Date.now()}`,
        phone,
        location: location || 'New Delhi',
        name: 'Mamatvam Mother',
      },
      isNewUser: true,
    };
  },

  async fetchLocations(searchQuery?: string): Promise<LocationItem[]> {
    if (!searchQuery) return POPULAR_LOCATIONS;
    const q = searchQuery.toLowerCase();
    return POPULAR_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) || loc.state.toLowerCase().includes(q)
    );
  },
};
