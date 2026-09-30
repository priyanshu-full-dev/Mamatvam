import React, { useState } from 'react';
import { View, Text, Pressable, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, {
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  image: any;
  titleKey: string;
  subtitleKey: string;
  defaultTitle: string;
  defaultSubtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    image: require('@/assets/images/pregnancy-together.png'),
    titleKey: 'onboarding.title',
    subtitleKey: 'onboarding.subtitle',
    defaultTitle: 'Pregnancy Together',
    defaultSubtitle: "Every heartbeat, every step — we're with you",
  },
  {
    id: '2',
    image: require('@/assets/images/mamatvam-logo.png'),
    titleKey: 'onboarding.slide2Title',
    subtitleKey: 'onboarding.slide2Subtitle',
    defaultTitle: 'Expert Doctor Support',
    defaultSubtitle: 'Trusted gynecologists, pediatricians and counselors at your fingertips',
  },
];

export default function CarouselScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setHasSeenOnboarding } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFinish = () => {
    setHasSeenOnboarding(true);
    router.replace('/(auth)/sign-in');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top spacer */}
      <View className="h-6" />

      {/* Slide Content */}
      <Animated.View
        key={currentSlide.id}
        entering={FadeInRight.duration(350)}
        exiting={FadeOutLeft.duration(250)}
        className="flex-1 items-center justify-center px-6"
      >
        <View className="w-full items-center justify-center mb-8">
          <Image
            source={currentSlide.image}
            style={{ width: width * 0.82, height: width * 0.82, maxHeight: 360 }}
            contentFit="contain"
            cachePolicy="memory-disk"
            priority="high"
          />
        </View>

        <Text className="text-2xl md:text-3xl font-bold text-[#EE4D38] text-center tracking-tight">
          {t(currentSlide.titleKey, currentSlide.defaultTitle)}
        </Text>

        <Text className="text-base text-[#1E1E1E] text-center mt-3 max-w-[280px] leading-relaxed">
          {t(currentSlide.subtitleKey, currentSlide.defaultSubtitle)}
        </Text>

        {/* Pagination Dots */}
        <View className="flex-row items-center justify-center mt-8 space-x-2">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full mx-1 transition-all ${
                currentIndex === i ? 'w-6 bg-[#EE4D38]' : 'w-2 bg-[#E2E8F0]'
              }`}
            />
          ))}
        </View>
      </Animated.View>

      {/* Bottom Navigation */}
      <View className="px-8 py-6 flex-row items-center justify-between">
        <Pressable
          onPress={handleFinish}
          hitSlop={15}
          className="py-2 px-1"
        >
          <Text className="text-sm font-semibold tracking-wider text-[#6B7280]">
            {t('common.skip', 'SKIP')}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          hitSlop={15}
          className="py-2 px-1"
        >
          <Text className="text-sm font-bold tracking-wider text-[#1E1E1E]">
            {t('common.next', 'NEXT')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
