import React, { useState } from 'react';
import { View, Text, Pressable, StatusBar, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Radio } from '@/components/ui/Radio';
import { Button } from '@/components/ui/Button';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { useAppStore, SupportedLanguage } from '@/store/useAppStore';

interface LanguageOption {
  id: SupportedLanguage;
  nativeTitle: string;
  subtitle: string;
  bgColor: string;
  watermark: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    id: 'en',
    nativeTitle: 'English',
    subtitle: 'English',
    bgColor: '#FCE2E2', // soft coral pink
    watermark: 'Aa',
  },
  {
    id: 'hi',
    nativeTitle: 'हिन्दी',
    subtitle: 'Hindi',
    bgColor: '#FDE8D7', // soft peach
    watermark: 'अ',
  },
  {
    id: 'bn',
    nativeTitle: 'বাংলা',
    subtitle: 'Bangla',
    bgColor: '#DFF8D8', // soft mint green
    watermark: 'অ',
  },
  {
    id: 'te',
    nativeTitle: 'తెలుగు',
    subtitle: 'Telugu',
    bgColor: '#D5ECFD', // soft sky blue
    watermark: 'అ',
  },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language || 'en');

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
  };

  const handleNext = () => {
    setLanguage(selectedLang);
    router.push('/(auth)/stage');
  };

  const isShortScreen = height < 750;
  const globeSize = isShortScreen ? 120 : Math.min(width * 0.46, 175);
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
                fontSize: isShortScreen ? 20 : 23,
                fontWeight: '700',
                color: '#1E1E1E',
                textAlign: 'center',
              }}
            >
              {t('language.title', 'Choose your language')}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#6B7280',
                textAlign: 'center',
                marginTop: 4,
                lineHeight: 17,
                maxWidth: 320,
              }}
            >
              {t(
                'language.subtitle',
                'This helps us to provide content in your preferred language'
              )}
            </Text>
          </View>
        </View>

        {/* Middle: 4 Language Cards */}
        <View style={{ gap: cardGap, width: '100%' }}>
          {LANGUAGES.map((item) => {
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
                  borderColor: isSelected ? '#e62a09' : 'transparent',
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
                    color="#e62a09"
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
      />
    </View>
  </SafeAreaView>
  );
}
