import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { isTokenExpired } from '@/utils/token';
import { useAppStore } from '@/store/useAppStore';

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
  language?: string | UserOnboardingLanguage | null;
  category?: string | UserOnboardingCategory | null;
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
  refreshSession: () => Promise<string | null>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

let ongoingRefreshPromise: Promise<string | null> | null = null;

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
    useAppStore.getState().setHasSeenOnboarding(true);
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
    // Sync language to app store if provided
    if (onboarding.language) {
      const rawLang =
        typeof onboarding.language === 'object' && onboarding.language !== null
          ? (onboarding.language.code || onboarding.language.name || '')
          : (onboarding.language || '');
      if (rawLang) {
        useAppStore.getState().setLanguage(String(rawLang).toLowerCase() as any);
      }
    }

    // Sync stage/category to app store if provided
    if (onboarding.category) {
      const rawCat =
        typeof onboarding.category === 'object' && onboarding.category !== null
          ? (onboarding.category.code || onboarding.category.name || '')
          : (onboarding.category || '');
      if (rawCat) {
        const cat = String(rawCat).toLowerCase();
        if (cat.includes('conceive')) useAppStore.getState().setStage('conceive');
        else if (cat.includes('pregnant') || cat.includes('pregnancy')) useAppStore.getState().setStage('pregnant');
        else if (cat.includes('mother') || cat.includes('post')) useAppStore.getState().setStage('mother');
        else if (cat.includes('ivf') || cat.includes('explore') || cat.includes('iui')) useAppStore.getState().setStage('explore');
      }
    }

    set((state) => {
      const updatedUser: UserProfile = state.user
        ? { ...state.user, onboarding }
        : ({ id: '', onboarding } as unknown as UserProfile);
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser)).catch(() => {});
      return { user: updatedUser };
    });
  },

  refreshSession: async (): Promise<string | null> => {
    if (ongoingRefreshPromise) {
      return ongoingRefreshPromise;
    }

    ongoingRefreshPromise = (async () => {
      const currentRefreshToken = get().refreshToken || (await SecureStore.getItemAsync(REFRESH_TOKEN_KEY));
      if (!currentRefreshToken) {
        await get().logout();
        return null;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            refreshToken: currentRefreshToken,
          }),
        });

        const json = await response.json().catch(() => null);

        if (response.ok && json?.success && json?.data?.accessToken) {
          const newAccessToken: string = json.data.accessToken;
          const newRefreshToken: string = json.data.refreshToken || currentRefreshToken;

          await get().setTokens(newAccessToken, newRefreshToken);
          set({ isAuthenticated: true, isLoading: false });
          return newAccessToken;
        } else {
          // If refresh token has expired or is rejected with 401/403
          if (response.status === 401 || response.status === 403 || json?.code === 'TOKEN_EXPIRED') {
            await get().logout();
          }
          return null;
        }
      } catch (err) {
        console.warn('Network error while refreshing token:', err);
        return null;
      } finally {
        ongoingRefreshPromise = null;
      }
    })();

    return ongoingRefreshPromise;
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
      const user = userStr ? JSON.parse(userStr) : null;

      // 1. If we have a stored user profile and tokens
      if (user && (token || refreshToken)) {
        // Mark onboarding seen since user previously logged in
        useAppStore.getState().setHasSeenOnboarding(true);

        // Sync stored language and stage to app state if available
        if (user.onboarding) {
          const rawLang =
            typeof user.onboarding.language === 'object' && user.onboarding.language !== null
              ? (user.onboarding.language.code || user.onboarding.language.name || '')
              : (user.onboarding.language || '');
          if (rawLang) {
            useAppStore.getState().setLanguage(String(rawLang).toLowerCase() as any);
          }

          const rawCat =
            typeof user.onboarding.category === 'object' && user.onboarding.category !== null
              ? (user.onboarding.category.code || user.onboarding.category.name || '')
              : (user.onboarding.category || '');
          if (rawCat) {
            const cat = String(rawCat).toLowerCase();
            if (cat.includes('conceive')) useAppStore.getState().setStage('conceive');
            else if (cat.includes('pregnant') || cat.includes('pregnancy')) useAppStore.getState().setStage('pregnant');
            else if (cat.includes('mother') || cat.includes('post')) useAppStore.getState().setStage('mother');
            else if (cat.includes('ivf') || cat.includes('explore') || cat.includes('iui')) useAppStore.getState().setStage('explore');
          }
        }

        set({
          token,
          refreshToken,
          user,
        });

        // 2. Check if access token is still fresh (with 60-second buffer)
        if (token && !isTokenExpired(token, 60)) {
          set({
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }

        // 3. Access token is expired or missing -> use refresh token!
        if (refreshToken) {
          const newAccessToken = await get().refreshSession();
          if (newAccessToken) {
            // Successfully refreshed session with fresh token
            set({
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }

        // 4. If refresh token is also expired or invalid
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }
    } catch (e) {
      console.warn('restoreSession error:', e);
    }

    set({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
