import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';

interface Slide {
  id: string;
  image: any;
  titleKey?: string;
  defaultTitle?: string;
  titleColor?: string;
  splitTitle?: {
    first: string;
    second: string;
  };
  subtitleKey: string;
  defaultSubtitle: string;
  showToolsButton?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    image: require('@/assets/images/pregnancy-together.png'),
    titleKey: 'onboarding.title',
    defaultTitle: 'Pregnancy Together',
    titleColor: '#EE4D38',
    subtitleKey: 'onboarding.subtitle',
    defaultSubtitle: "Every heartbeat, every step — we're with you",
    showToolsButton: true,
  },
  {
    id: '2',
    image: require('@/assets/images/slider-2.png'),
    titleKey: 'onboarding.slide2Title',
    defaultTitle: 'Pregnancy Track',
    titleColor: '#111827',
    subtitleKey: 'onboarding.slide2Subtitle',
    defaultSubtitle: 'Welcome to the Pregnancy Track',
  },
  {
    id: '3',
    image: require('@/assets/images/slider-3.png'),
    splitTitle: {
      first: 'Tracking',
      second: 'Tools',
    },
    subtitleKey: 'onboarding.slide3Subtitle',
    defaultSubtitle: 'Monitor your progress seamlessly with us!',
  },
];

export default function CarouselScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setHasSeenOnboarding } = useAppStore();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleFinish = () => {
    setHasSeenOnboarding(true);
    router.replace('/(auth)/sign-in');
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} className="justify-between">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Horizontal Swiping ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={{ flex: 1, width }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {SLIDES.map((slide, index) => (
          <View
            key={slide.id}
            style={{ width, flex: 1 }}
            className="px-6 justify-between"
          >
            {/* Top header row (Slide 1 has Tools badge) */}
            <View className="h-16 flex-row justify-end items-center pt-2">
              {slide.showToolsButton ? (
                <Pressable
                  onPress={() => router.push('/(auth)/language')}
                  className="items-center"
                  hitSlop={10}
                >
                  <View className="w-10 h-10 rounded-full bg-[#007AFF] items-center justify-center shadow-sm">
                    <Settings size={20} color="#FFFFFF" />
                  </View>
                  <View className="mt-1 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-xs">
                    <Text className="text-[10px] font-medium text-gray-700">Tools</Text>
                  </View>
                </Pressable>
              ) : (
                <View className="h-12" />
              )}
            </View>

            {/* Illustration and text */}
            <View className="items-center justify-center flex-1 py-4">
              <View className="w-full items-center justify-center mb-6">
                <Image
                  source={slide.image}
                  style={{
                    width: width * 0.78,
                    height: width * 0.78,
                    maxHeight: 330,
                  }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                  priority="high"
                />
              </View>

              {slide.splitTitle ? (
                <View className="items-center">
                  <Text className="text-3xl font-extrabold text-[#111827] text-center tracking-tight">
                    {t('onboarding.slide3Title', slide.splitTitle.first)}
                  </Text>
                  <Text className="text-3xl font-extrabold text-[#EE4D38] text-center tracking-tight mt-0.5">
                    {t('onboarding.slide3Highlight', slide.splitTitle.second)}
                  </Text>
                </View>
              ) : (
                <Text
                  className="text-2xl md:text-3xl font-bold text-center tracking-tight"
                  style={{ color: slide.titleColor || '#111827' }}
                >
                  {t(slide.titleKey || '', slide.defaultTitle || '')}
                </Text>
              )}

              <Text className="text-base text-[#4B5563] text-center mt-3 max-w-[290px] leading-relaxed">
                {t(slide.subtitleKey, slide.defaultSubtitle)}
              </Text>
            </View>

            {/* Spacing placeholder inside slide */}
            <View className="h-4" />
          </View>
        ))}
      </ScrollView>

      {/* Slide 3 Action Button */}
      {currentIndex === 2 && (
        <View className="px-6 mb-3">
          <Button
            title={t('onboarding.getStarted', 'Get Started')}
            onPress={handleFinish}
          />
        </View>
      )}

      {/* Bottom Navigation & Indicator Dots */}
      <View className="px-8 py-5 flex-row items-center justify-between">
        <Pressable
          onPress={handleFinish}
          hitSlop={15}
          className="py-2 px-1 min-w-[50px]"
        >
          <Text className="text-sm font-semibold tracking-wider text-[#6B7280]">
            {t('common.skip', 'SKIP')}
          </Text>
        </Pressable>

        {/* 3 Pagination Dots */}
        <View className="flex-row items-center justify-center">
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              hitSlop={10}
              onPress={() => goToSlide(i)}
              className={`h-2 rounded-full mx-1.5 transition-all ${
                currentIndex === i ? 'w-6 bg-[#EE4D38]' : 'w-2 bg-[#E2E8F0]'
              }`}
            />
          ))}
        </View>

        {currentIndex < SLIDES.length - 1 ? (
          <Pressable
            onPress={handleNext}
            hitSlop={15}
            className="py-2 px-1 min-w-[50px] items-end"
          >
            <Text className="text-sm font-bold tracking-wider text-[#1E1E1E]">
              {t('common.next', 'NEXT')}
            </Text>
          </Pressable>
        ) : (
          <View className="min-w-[50px]" />
        )}
      </View>
    </SafeAreaView>
  );
}
