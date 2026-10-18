import { Stack, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, token } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    const currentScreen = segments[segments.length - 1];
    const isPublicAuthScreen = currentScreen === 'sign-in' || currentScreen === 'otp';

    if ((!isAuthenticated || !token) && !isPublicAuthScreen) {
      router.replace('/(auth)/sign-in');
    }
  }, [segments, isAuthenticated, token, isLoading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="language" />
      <Stack.Screen name="stage" />
      <Stack.Screen name="pregnancy" />
      <Stack.Screen name="baby-gender" />
      <Stack.Screen name="mother" />
      <Stack.Screen name="conceive" />
      <Stack.Screen name="iui-ivf" />
    </Stack>
  );
}
