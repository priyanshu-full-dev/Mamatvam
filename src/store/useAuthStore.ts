import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'mamatvam_auth_token';
const USER_KEY = 'mamatvam_user_info';

export interface UserProfile {
  id: string;
  phone: string;
  name?: string;
  location?: string;
  stage?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  phone: string;
  location: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  setPhone: (phone: string) => void;
  setLocation: (location: string) => void;
  login: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  phone: '',
  location: '',
  isAuthenticated: false,
  isLoading: true,

  setPhone: (phone: string) => set({ phone }),
  setLocation: (location: string) => set({ location }),

  login: async (token: string, user: UserProfile) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch {
      // In case SecureStore fails in non-native environment
    }
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch {
      // Ignore
    }
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);
      if (token && userStr) {
        set({
          token,
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
