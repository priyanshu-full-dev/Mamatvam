import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Compass } from 'lucide-react-native';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
      <View className="w-16 h-16 rounded-full bg-[#FFF1EE] items-center justify-center mb-3">
        <Compass size={32} color="#EE4D38" />
      </View>
      <Text className="text-xl font-bold text-[#1E1E1E]">Explore & Articles</Text>
      <Text className="text-sm text-[#6B7280] text-center mt-1">
        Curated guides and videos for every stage of your pregnancy
      </Text>
    </SafeAreaView>
  );
}
