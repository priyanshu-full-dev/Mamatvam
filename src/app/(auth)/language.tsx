import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StatusBar, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Radio } from '@/components/ui/Radio';
import { Button } from '@/components/ui/Button';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { useAppStore, SupportedLanguage } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  getOnboardingLanguagesApi,
  selectLanguageApi,
  getRouteForOnboardingStep,
} from '@/api/onboarding.api';

interface LanguageOption {
  id: SupportedLanguage;
  nativeTitle: string;
  subtitle: string;
  bgColor: string;
  watermark: string;
}

const LANGUAGE_META: Record<string, { nativeTitle: string; watermark: string; bgColor: string }> = {
  en: { nativeTitle: 'English', watermark: 'Aa', bgColor: '#FCE2E2' }, // soft coral pink
  hi: { nativeTitle: 'हिन्दी', watermark: 'अ', bgColor: '#FDE8D7' }, // soft peach
  mr: { nativeTitle: 'मराठी', watermark: 'म', bgColor: '#DFF8D8' }, // soft mint green
  te: { nativeTitle: 'తెలుగు', watermark: 'అ', bgColor: '#D5ECFD' }, // soft sky blue
  bn: { nativeTitle: 'বাংলা', watermark: 'অ', bgColor: '#F3E8FF' }, // soft lavender
};

const DEFAULT_LANGUAGES: LanguageOption[] = [
  {
    id: 'en',
    nativeTitle: 'English',
    subtitle: 'English',
    bgColor: '#FCE2E2',
    watermark: 'Aa',
  },
  {
    id: 'hi',
    nativeTitle: 'हिन्दी',
    subtitle: 'Hindi',
    bgColor: '#FDE8D7',
    watermark: 'अ',
  },
  {
    id: 'mr',
    nativeTitle: 'मराठी',
    subtitle: 'Marathi',
    bgColor: '#DFF8D8',
    watermark: 'म',
  },
  {
    id: 'te',
    nativeTitle: 'తెలుగు',
    subtitle: 'Telugu',
    bgColor: '#D5ECFD',
    watermark: 'అ',
  },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();
  const { token, setOnboarding } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [languages, setLanguages] = useState<LanguageOption[]>(DEFAULT_LANGUAGES);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language || 'en');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchLanguages() {
      setIsLoading(true);
      try {
        const res = await getOnboardingLanguagesApi(token || undefined);
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: LanguageOption[] = res.data.map((item) => {
            const code = item.code.toLowerCase();
            const meta = LANGUAGE_META[code] || {
              nativeTitle: item.name,
              watermark: item.name.charAt(0),
              bgColor: '#F1F5F9',
            };
            return {
              id: code as SupportedLanguage,
              nativeTitle: meta.nativeTitle,
              subtitle: item.name,
              bgColor: meta.bgColor,
              watermark: meta.watermark,
            };
          });
          setLanguages(mapped);
        }
      } catch (err) {
        console.warn('Error fetching onboarding languages, using defaults:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLanguages();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
  };

  const handleNext = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await selectLanguageApi({ languageCode: selectedLang }, token || undefined);
      if (res?.data) {
        // Update user onboarding state in auth store
        await setOnboarding({
          completed: res.data.completed,
          nextStep: res.data.nextStep,
          language: res.data.language?.code || selectedLang,
          category: res.data.category,
          profileComplete: res.data.profileComplete,
        });

        // Set language in local app store & i18n
        setLanguage(selectedLang);

        // Determine destination based on API nextStep (e.g. 'CATEGORY' -> /(auth)/stage)
        const nextRoute = getRouteForOnboardingStep({
          completed: res.data.completed,
          nextStep: res.data.nextStep,
          language: res.data.language?.code || selectedLang,
          category: res.data.category,
          profileComplete: res.data.profileComplete,
        });
        router.push(nextRoute as any);
        return;
      }
    } catch (err: any) {
      console.warn('Failed to update language on server, falling back locally:', err);
    } finally {
      setIsSubmitting(false);
    }

    // Fallback: update local store and navigate to stage
    setLanguage(selectedLang);
    router.push('/(auth)/stage');
  };

  const isShortScreen = height < 750;
  const globeSize = isShortScreen ? 110 : Math.min(width * 0.42, 150);
  const cardMinHeight = isShortScreen ? 56 : 64;
  const cardGap = isShortScreen ? 8 : 12;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          {/* Top Header: Globe + Title + Subtitle tightly grouped */}
        <View style={{ alignItems: 'center' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={require('@/assets/images/world-languages.png')}
              style={{ width: globeSize, height: globeSize }}
              contentFit="contain"
              cachePolicy="memory-disk"
              priority="high"
            />
          </View>

          <View style={{ alignItems: 'center', marginTop: isShortScreen ? 8 : 14, paddingHorizontal: 12 }}>
            <Text
              style={{
                fontSize: isShortScreen ? 21 : 24,
                fontWeight: '800',
                color: '#1E1E1E',
                textAlign: 'center',
                letterSpacing: -0.3,
              }}
            >
              {t('language.title', 'Choose your language')}
            </Text>
            <Text
              style={{
                fontSize: isShortScreen ? 13.5 : 15,
                color: '#4B5563',
                textAlign: 'center',
                marginTop: 6,
                lineHeight: isShortScreen ? 19 : 22,
                maxWidth: 340,
                fontWeight: '500',
              }}
            >
              {t(
                'language.subtitle',
                'This helps us to provide content in your preferred language'
              )}
            </Text>
          </View>
        </View>

        {/* Middle: Language Cards from API */}
        <View style={{ gap: cardGap, width: '100%', marginTop: isShortScreen ? 22 : 36 }}>
          {languages.map((item) => {
            const isSelected = selectedLang === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelectLanguage(item.id)}
                style={{
                  backgroundColor: item.bgColor,
                  minHeight: cardMinHeight,
                  borderRadius: 16,
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 2,
                  borderColor: isSelected ? '#F06292' : 'transparent',
                  overflow: 'hidden',
                }}
              >
                {/* Language script watermark icon on right */}
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    right: 48,
                    top: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0.16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: isShortScreen ? 38 : 46,
                      fontWeight: '800',
                      color: '#000000',
                      includeFontPadding: false,
                    }}
                  >
                    {item.watermark}
                  </Text>
                </View>

                {/* Language Info */}
                <View style={{ zIndex: 10 }}>
                  <Text
                    style={{
                      fontSize: isShortScreen ? 15 : 16.5,
                      fontWeight: '700',
                      color: '#1E1E1E',
                    }}
                  >
                    {item.nativeTitle}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#475569',
                      marginTop: 2,
                      fontWeight: '500',
                    }}
                  >
                    {item.subtitle}
                  </Text>
                </View>

                {/* Radio Indicator */}
                <View style={{ zIndex: 10 }}>
                  <Radio
                    selected={isSelected}
                    onPress={() => handleSelectLanguage(item.id)}
                    size={22}
                    color="#F06292"
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom: Fixed Next Button */}
      <BottomActionBar
        title={t('common.next', 'Next')}
        onPress={handleNext}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  </SafeAreaView>
  );
}
