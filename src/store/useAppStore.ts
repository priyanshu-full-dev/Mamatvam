import { create } from 'zustand';
import i18n from '@/i18n';

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'te';
export type PregnancyStage = 'conceive' | 'pregnant' | 'mother' | 'explore';

export interface PregnancyData {
  firstDate?: string;
  deliveryDate?: string;
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
}

interface AppState {
  language: SupportedLanguage;
  stage: PregnancyStage | null;
  pregnancyData: PregnancyData;
  hasSeenOnboarding: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  setStage: (stage: PregnancyStage) => void;
  setPregnancyData: (data: Partial<PregnancyData>) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
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
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
  setStage: (stage) => set({ stage }),
  setPregnancyData: (data) =>
    set((state) => ({ pregnancyData: { ...state.pregnancyData, ...data } })),
  setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),
}));
