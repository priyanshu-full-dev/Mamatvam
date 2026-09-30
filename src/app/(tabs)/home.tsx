import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Bell,
  Calendar,
  Heart,
  Activity,
  Video,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const { user, location } = useAuthStore();
  const { language } = useAppStore();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-[#F1F5F9] flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            source={require('@/assets/images/mamatvam-logo.png')}
            style={{ width: 38, height: 38 }}
            contentFit="contain"
          />
          <View className="ml-3">
            <Text className="text-xs text-[#6B7280]">Welcome back,</Text>
            <Text className="text-base font-bold text-[#1E1E1E]">
              {user?.name || 'Mamatvam Mother'}
            </Text>
          </View>
        </View>

        <Pressable className="w-10 h-10 rounded-full bg-[#F8FAFC] items-center justify-center border border-[#E2E8F0]">
          <Bell size={18} color="#1E1E1E" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Weekly Baby Development Hero Card */}
        <View className="p-6">
          <View className="bg-gradient-to-br bg-[#EE4D38] rounded-3xl p-6 shadow-md shadow-[#EE4D38]/20">
            <View className="flex-row justify-between items-start">
              <View>
                <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-2">
                  <Text className="text-xs font-bold text-white tracking-wider">
                    WEEK 16 • 2ND TRIMESTER
                  </Text>
                </View>
                <Text className="text-2xl font-extrabold text-white">
                  Baby is the size of an Avocado!
                </Text>
                <Text className="text-white/80 text-xs mt-1.5 max-w-[200px]">
                  Baby can now make facial expressions and perceive light.
                </Text>
              </View>

              <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center">
                <Heart size={32} color="#FFFFFF" />
              </View>
            </View>

            {/* Progress indicator */}
            <View className="mt-5">
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-xs text-white/90 font-medium">Pregnancy Progress</Text>
                <Text className="text-xs text-white font-bold">40% Complete</Text>
              </View>
              <View className="w-full h-2.5 bg-black/15 rounded-full overflow-hidden">
                <View className="w-[40%] h-full bg-white rounded-full" />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Badges */}
        <View className="px-6">
          <Text className="text-base font-bold text-[#1E1E1E] mb-3">Daily Trackers</Text>
          <View className="flex-row justify-between">
            <Pressable className="flex-1 bg-white p-4 rounded-2xl items-center mr-2 border border-[#F1F5F9] shadow-sm shadow-black/5">
              <View className="w-12 h-12 rounded-xl bg-[#FFF1EE] items-center justify-center mb-2">
                <Activity size={22} color="#EE4D38" />
              </View>
              <Text className="text-xs font-bold text-[#1E1E1E]">Kick Counter</Text>
              <Text className="text-[10px] text-[#6B7280] mt-0.5">8 kicks today</Text>
            </Pressable>

            <Pressable className="flex-1 bg-white p-4 rounded-2xl items-center mx-1 border border-[#F1F5F9] shadow-sm shadow-black/5">
              <View className="w-12 h-12 rounded-xl bg-[#FDE8D7] items-center justify-center mb-2">
                <Calendar size={22} color="#F97316" />
              </View>
              <Text className="text-xs font-bold text-[#1E1E1E]">Doctor Visit</Text>
              <Text className="text-[10px] text-[#6B7280] mt-0.5">In 4 days</Text>
            </Pressable>

            <Pressable className="flex-1 bg-white p-4 rounded-2xl items-center ml-2 border border-[#F1F5F9] shadow-sm shadow-black/5">
              <View className="w-12 h-12 rounded-xl bg-[#DFF8D8] items-center justify-center mb-2">
                <Sparkles size={22} color="#16A34A" />
              </View>
              <Text className="text-xs font-bold text-[#1E1E1E]">Daily Tip</Text>
              <Text className="text-[10px] text-[#6B7280] mt-0.5">Hydration tips</Text>
            </Pressable>
          </View>
        </View>

        {/* Doctor Consultation Banner */}
        <View className="px-6 mt-6">
          <View className="bg-white rounded-3xl p-5 border border-[#F1F5F9] flex-row items-center justify-between shadow-sm shadow-black/5">
            <View className="flex-1 pr-3">
              <View className="bg-[#FFF1EE] self-start px-2.5 py-0.5 rounded-full mb-1.5">
                <Text className="text-[10px] font-bold text-[#EE4D38]">24/7 CARE</Text>
              </View>
              <Text className="text-base font-bold text-[#1E1E1E]">
                Talk to a Gynecologist
              </Text>
              <Text className="text-xs text-[#6B7280] mt-1">
                Instant video call consultation with top verified doctors
              </Text>
            </View>

            <Pressable className="bg-[#EE4D38] p-3 rounded-2xl items-center justify-center">
              <Video size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Recommended Articles & Insights */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-[#1E1E1E]">Recommended for You</Text>
            <Pressable className="flex-row items-center">
              <Text className="text-xs font-semibold text-[#EE4D38] mr-1">See All</Text>
              <ChevronRight size={14} color="#EE4D38" />
            </Pressable>
          </View>

          <View className="bg-white rounded-2xl p-4 border border-[#F1F5F9] mb-3 flex-row items-center">
            <View className="w-14 h-14 rounded-xl bg-[#D5ECFD] items-center justify-center mr-3">
              <Heart size={24} color="#0284C7" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#1E1E1E]">
                Nutrition Essentials in Month 4
              </Text>
              <Text className="text-xs text-[#6B7280] mt-0.5">
                Iron, calcium and folic acid requirements
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
