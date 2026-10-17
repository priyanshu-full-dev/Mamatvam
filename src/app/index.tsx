import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { getRouteForOnboardingStep } from '@/api/onboarding.api';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, restoreSession } = useAuthStore();
  const { hasSeenOnboarding } = useAppStore();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 12 });

    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        router.replace('/onboarding/carousel');
      } else if (isAuthenticated) {
        if (user?.onboarding && !user.onboarding.completed) {
          router.replace(getRouteForOnboardingStep(user.onboarding) as any);
        } else {
          router.replace('/(tabs)/home');
        }
      } else {
        router.replace('/(auth)/sign-in');
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, user, hasSeenOnboarding]);

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.View style={animatedStyle} className="items-center justify-center">
        <Image
          source={require('@/assets/images/logo/50360fdf-4693-4fda-a5f0-c2c2a85ea1cd-removebg-preview.png')}
          style={{ width: 280, height: 215 }}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Animated.View>
    </View>
  );
}
