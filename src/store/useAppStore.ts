import { create } from 'zustand';
import i18n from '@/i18n';

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'te';
export type PregnancyStage = 'conceive' | 'pregnant' | 'mother' | 'explore';

interface AppState {
  language: SupportedLanguage;
  stage: PregnancyStage | null;
  hasSeenOnboarding: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  setStage: (stage: PregnancyStage) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  stage: null,
  hasSeenOnboarding: false,
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
  setStage: (stage) => set({ stage }),
  setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),
}));
