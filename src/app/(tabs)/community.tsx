import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users } from 'lucide-react-native';

export default function CommunityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <View className="w-16 h-16 rounded-full bg-[#DFF8D8] items-center justify-center mb-3">
        <Users size={32} color="#16A34A" />
      </View>
      <Text className="text-xl font-bold text-[#1E1E1E]">Mamatvam Community</Text>
      <Text className="text-sm text-[#6B7280] text-center mt-1">
        Connect with mothers in the same week and share your journey
      </Text>
    </SafeAreaView>
  );
}
