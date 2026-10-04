import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Radio } from '@/components/ui/Radio';
import { Button } from '@/components/ui/Button';
import { useAppStore, SupportedLanguage } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

interface LanguageOption {
  id: SupportedLanguage;
  nativeTitle: string;
  subtitle: string;
  bgColor: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    id: 'en',
    nativeTitle: 'English',
    subtitle: 'English',
    bgColor: '#FCE2E2', // soft coral pink
  },
  {
    id: 'hi',
    nativeTitle: 'हिन्दी',
    subtitle: 'Hindi',
    bgColor: '#FDE8D7', // soft peach
  },
  {
    id: 'bn',
    nativeTitle: 'বাংলা',
    subtitle: 'Bangla',
    bgColor: '#DFF8D8', // soft mint green
  },
  {
    id: 'te',
    nativeTitle: 'తెలుగు',
    subtitle: 'Telugu',
    bgColor: '#D5ECFD', // soft sky blue
  },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language || 'en');

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
  };

  const handleNext = () => {
    setLanguage(selectedLang);
    router.push('/(auth)/stage');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Globe illustration */}
        <View className="items-center justify-center pt-2 pb-2">
          <Image
            source={require('@/assets/images/world-languages.png')}
            style={{ width: width * 0.58, height: width * 0.58, maxHeight: 220 }}
            contentFit="contain"
            cachePolicy="memory-disk"
            priority="high"
          />
        </View>

        {/* Heading & Subtitle */}
        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-[#1E1E1E]">
            {t('language.title', 'Choose your language')}
          </Text>
          <Text className="text-xs text-[#6B7280] text-center mt-1.5 px-6 leading-relaxed">
            {t(
              'language.subtitle',
              'This helps us to provide content in your preferred language'
            )}
          </Text>
        </View>

        {/* Language Cards */}
        <View className="space-y-3.5 flex-1">
          {LANGUAGES.map((item) => {
            const isSelected = selectedLang === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelectLanguage(item.id)}
                style={{ backgroundColor: item.bgColor }}
                className={`relative overflow-hidden rounded-2xl px-5 py-4 flex-row items-center justify-between border-2 ${
                  isSelected ? 'border-[#EE4D38]' : 'border-transparent'
                }`}
              >
                {/* Watermark "Aa" on right */}
                <View
                  pointerEvents="none"
                  className="absolute right-12 -bottom-4"
                  style={{ opacity: 0.15 }}
                >
                  <Text className="text-7xl font-extrabold text-[#000000]">
                    Aa
                  </Text>
                </View>

                {/* Language Info */}
                <View className="z-10">
                  <Text className="text-lg font-bold text-[#1E1E1E]">
                    {item.nativeTitle}
                  </Text>
                  <Text className="text-sm text-[#475569] mt-0.5 font-medium">
                    {item.subtitle}
                  </Text>
                </View>

                {/* Radio Indicator */}
                <View className="z-10">
                  <Radio
                    selected={isSelected}
                    onPress={() => handleSelectLanguage(item.id)}
                    size={22}
                    color="#EE4D38"
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Next Button */}
        <View style={{ marginTop: 28, width: '100%' }}>
          <Button
            title={t('common.next', 'Next')}
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
