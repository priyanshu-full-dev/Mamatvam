import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import i18n from '@/i18n';

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'te' | 'bn';
export type PregnancyStage = 'conceive' | 'pregnant' | 'mother' | 'explore';

const ONBOARDING_SEEN_KEY = 'mamatvam_has_seen_onboarding';

export interface PregnancyData {
  firstDate?: string;
  deliveryDate?: string;
  lastPeriodDate?: string;
  babyBirthDate?: string;
  motherHeight?: string;
  motherWeight?: string;
  babyHeight?: string;
  babyWeight?: string;
  height?: string;
  weight?: string;
  bloodGroup?: string;
  isDiabetic?: boolean;
  bloodPressure?: 'low' | 'normal' | 'high' | null;
  babyGender?: 'girl' | 'boy' | null;
  periodCycle?: string;
}

interface AppState {
  language: SupportedLanguage;
  stage: PregnancyStage | null;
  pregnancyData: PregnancyData;
  hasSeenOnboarding: boolean;
  hasSeenMotherWelcomePopup: boolean;
  initAppStore: () => Promise<void>;
  setLanguage: (lang: SupportedLanguage) => void;
  setStage: (stage: PregnancyStage) => void;
  setPregnancyData: (data: Partial<PregnancyData>) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  setHasSeenMotherWelcomePopup: (seen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  stage: null,
  pregnancyData: {
    height: '165',
    weight: '60',
    isDiabetic: false,
    bloodPressure: 'normal',
    babyGender: 'girl',
  },
  hasSeenOnboarding: false,
  hasSeenMotherWelcomePopup: false,
  initAppStore: async () => {
    try {
      const seen = await SecureStore.getItemAsync(ONBOARDING_SEEN_KEY);
      if (seen === 'true') {
        set({ hasSeenOnboarding: true });
      }
    } catch {
      // Ignore
    }
  },
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
  setStage: (stage) => set({ stage }),
  setPregnancyData: (data) =>
    set((state) => ({ pregnancyData: { ...state.pregnancyData, ...data } })),
  setHasSeenOnboarding: (seen) => {
    SecureStore.setItemAsync(ONBOARDING_SEEN_KEY, seen ? 'true' : 'false').catch(() => {});
    set({ hasSeenOnboarding: seen });
  },
  setHasSeenMotherWelcomePopup: (seen) => set({ hasSeenMotherWelcomePopup: seen }),
}));
