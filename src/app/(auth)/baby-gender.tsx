import React, { useState } from 'react';
import { View, Text, Pressable, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

const { width, height } = Dimensions.get('window');
const horizontalPadding = 24;
const gap = 16;
const cardWidth = (width - horizontalPadding * 2 - gap) / 2;

const headerHeight = Math.round(height * 0.315);
const topGapBelowWave = Math.round(height * 0.055);

export default function BabyGenderScreen() {
  const router = useRouter();
  const { pregnancyData, setPregnancyData } = useAppStore();

  const [selectedGender, setSelectedGender] = useState<'girl' | 'boy'>(
    pregnancyData.babyGender || 'girl'
  );

  const handleContinue = () => {
    setPregnancyData({ babyGender: selectedGender });
    router.push('/(auth)/mother');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDEEEC" />

      {/* Top Header Banner with Deep Curved Wave */}
      <View style={{ width: '100%', height: headerHeight, position: 'relative' }}>
        <Svg
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          width="100%"
          height="100%"
          viewBox="0 0 480 325"
          preserveAspectRatio="none"
        >
          <Path
            d="M 0 0 L 480 0 L 480 290 C 420 325 340 330 250 288 C 170 250 80 255 0 295 Z"
            fill="#FDEEEC"
          />
        </Svg>

        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
            <Text style={{ fontSize: 30, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5, lineHeight: 38, textAlign: 'center' }}>
              What is your baby’s{'\n'}gender.
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content Area */}
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: horizontalPadding }}>
        {/* Cards: Girl & Boy Side-by-Side */}
        <View style={{ marginTop: topGapBelowWave }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Girl Card */}
            <Pressable
              onPress={() => setSelectedGender('girl')}
              style={[
                {
                  width: cardWidth,
                  height: cardWidth * 1.15,
                  backgroundColor: '#FFE8E5',
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderWidth: 2,
                  borderColor: selectedGender === 'girl' ? '#EE4D38' : 'transparent',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: selectedGender === 'girl' ? 0.08 : 0.03,
                  shadowRadius: 10,
                  elevation: 2,
                },
              ]}
            >
              <Image
                source={require('@/assets/images/stages/pregnant.png')}
                style={{ width: 85, height: 85 }}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginTop: 14, textAlign: 'center' }}>
                Girl
              </Text>
            </Pressable>

            {/* Boy Card */}
            <Pressable
              onPress={() => setSelectedGender('boy')}
              style={[
                {
                  width: cardWidth,
                  height: cardWidth * 1.15,
                  backgroundColor: '#E5F9EA',
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderWidth: 2,
                  borderColor: selectedGender === 'boy' ? '#EE4D38' : 'transparent',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: selectedGender === 'boy' ? 0.08 : 0.03,
                  shadowRadius: 10,
                  elevation: 2,
                },
              ]}
            >
              <Image
                source={require('@/assets/images/stages/mother.png')}
                style={{ width: 85, height: 85 }}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginTop: 14, textAlign: 'center' }}>
                Boy
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Continue Button */}
        <SafeAreaView edges={['bottom']} style={{ paddingBottom: 24 }}>
          <Button
            title="Continue"
            onPress={handleContinue}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}
