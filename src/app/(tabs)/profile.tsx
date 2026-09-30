import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <View className="items-center pt-8 pb-6 border-b border-[#F1F5F9]">
        <View className="w-20 h-20 rounded-full bg-[#FFF1EE] items-center justify-center mb-3">
          <User size={36} color="#EE4D38" />
        </View>
        <Text className="text-xl font-bold text-[#1E1E1E]">
          {user?.name || 'Mamatvam Mother'}
        </Text>
        <Text className="text-sm text-[#6B7280] mt-0.5">
          {user?.phone ? `+91 ${user.phone}` : ''}
        </Text>
      </View>

      <View className="mt-8">
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center py-4 px-4 bg-[#FEE2E2]/40 rounded-2xl"
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="ml-3 text-base font-semibold text-red-600">
            Log out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
