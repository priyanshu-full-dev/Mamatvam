import { Stack } from 'expo-router';

export default function AuthLayout() {
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
    </Stack>
  );
}
