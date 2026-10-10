import i18n from '@/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

// Prevent splash screen from auto-hiding until ready
SplashScreen.preventAutoHideAsync().catch(() => { });

// High-performance QueryClient configuration for 1M daily users
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen smoothly after app is ready
    SplashScreen.hideAsync().catch(() => { });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#FFFFFF' },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="today-tips" />
              <Stack.Screen name="practical-tools" />
              <Stack.Screen name="kick-counter" />
              <Stack.Screen name="contractions" />
              <Stack.Screen name="hydration-tracker" />
              <Stack.Screen name="hospital-bag" />
              <Stack.Screen name="pregnancy-diet" />
              <Stack.Screen name="diet-detail" />
              <Stack.Screen name="record-symptoms" />
              <Stack.Screen name="symptoms-history" />
              <Stack.Screen name="dadi-nani-nuskhe" />
              <Stack.Screen name="upload-report" />
              <Stack.Screen name="new-appointment" />
              <Stack.Screen name="sex-sutra" />
              <Stack.Screen name="sex-sutra-detail" />
              <Stack.Screen name="courses" />
              <Stack.Screen name="playlist" />
              <Stack.Screen name="course-detail" />
              <Stack.Screen name="course-article" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="motor-skills" />
              <Stack.Screen name="vaccination-schedule" />
              <Stack.Screen name="baby-names" />
              <Stack.Screen name="nutrition-values" />
              <Stack.Screen name="sleep-pattern" />
              <Stack.Screen name="feed-pattern" />
              <Stack.Screen name="baby-care-messages" />
              <Stack.Screen name="mother-care-messages" />
              <Stack.Screen name="types-of-tests" />
              <Stack.Screen name="ovulation-tracker" />
              <Stack.Screen name="fertility-guide" />
              <Stack.Screen name="expert-directory" />
              <Stack.Screen name="expert-profile" />
              <Stack.Screen name="hospital-profile" />
              <Stack.Screen name="user-profile" />
              <Stack.Screen name="privacy" />
              <Stack.Screen name="help-support" />
              <Stack.Screen name="community-guidelines" />
              <Stack.Screen name="account-settings" />
              <Stack.Screen name="subscribe" />
              <Stack.Screen name="payment" />
            </Stack>
          </QueryClientProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
