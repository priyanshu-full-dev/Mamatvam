import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://130.210.30.199/api/v1/user')
  .trim()
  .replace(/\/+$/, '');

const TOKEN_KEY = 'mamatvam_auth_token';
const REFRESH_TOKEN_KEY = 'mamatvam_refresh_token';
const USER_KEY = 'mamatvam_user_info';

export interface UserRole {
  id: number;
  name: string;
}

export interface UserBelongsTo {
  id: number;
  name: string;
  type: string;
}

export interface UserOnboardingLanguage {
  id?: number;
  code?: string;
  name?: string;
}

export interface UserOnboardingCategory {
  id?: number;
  code?: string;
  name?: string;
}

export interface UserOnboarding {
  completed: boolean;
  nextStep: string;
  language: string | UserOnboardingLanguage | null;
  category: string | UserOnboardingCategory | null;
  profileComplete: boolean;
}

export interface UserProfile {
  id: string;
  phone?: string;
  mobile?: string;
  name?: string | null;
  email?: string | null;
  location?: string;
  stage?: string;
  role?: UserRole;
  belongsTo?: UserBelongsTo;
  onboarding?: UserOnboarding;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  phone: string;
  location: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  setPhone: (phone: string) => void;
  setLocation: (location: string) => void;
  login: (token: string, user: UserProfile, refreshToken?: string) => Promise<void>;
  setTokens: (token: string, refreshToken?: string) => Promise<void>;
  setOnboarding: (onboarding: UserOnboarding) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  phone: '',
  location: '',
  isAuthenticated: false,
  isLoading: true,

  setPhone: (phone: string) => set({ phone }),
  setLocation: (location: string) => set({ location }),

  login: async (token: string, user: UserProfile, refreshToken?: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch {
      // In case SecureStore fails in non-native environment
    }
    set({ token, refreshToken: refreshToken || null, user, isAuthenticated: true, isLoading: false });
  },

  setTokens: async (token: string, refreshToken?: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch {
      // In case SecureStore fails in non-native environment
    }
    set((state) => ({
      token,
      refreshToken: refreshToken || state.refreshToken,
    }));
  },

  setOnboarding: async (onboarding: UserOnboarding) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, onboarding } : null;
      if (updatedUser) {
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser)).catch(() => {});
      }
      return { user: updatedUser };
    });
  },

  logout: async () => {
    const currentToken = get().token;
    const currentRefreshToken = get().refreshToken;

    if (currentRefreshToken) {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
          },
          body: JSON.stringify({
            refreshToken: currentRefreshToken,
          }),
        });
      } catch (err) {
        console.warn('Backend logout request failed or already invalidated:', err);
      }
    }

    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch {
      // Ignore
    }
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false, isLoading: false });
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);
      if (token && userStr) {
        set({
          token,
          refreshToken,
          user: JSON.parse(userStr),
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch {
      // Fallback
    }
    set({ isLoading: false });
  },
}));
