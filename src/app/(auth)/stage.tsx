import React, { useState } from 'react';
import { View, Text, Pressable, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import { Button } from '@/components/ui/Button';
import { useAppStore, PregnancyStage } from '@/store/useAppStore';

const { width, height } = Dimensions.get('window');
const horizontalPadding = 24;
const gap = 16;
const cardWidth = (width - horizontalPadding * 2 - gap) / 2;

// Exact proportions matching the design screenshot (curve extends to ~31.5% of screen height)
const headerHeight = Math.round(height * 0.315);
const topGapBelowWave = Math.round(height * 0.055); // ~45-50px of clean white space between wave & cards

interface StageOption {
  id: PregnancyStage;
  titleKey: string;
  defaultTitle: string;
  bgColor: string;
  image: any;
}

const STAGES: StageOption[] = [
  {
    id: 'pregnant',
    titleKey: 'stage.pregnant',
    defaultTitle: 'Pregnancy',
    bgColor: '#FFE8E5',
    image: require('@/assets/images/stages/pregnant.png'),
  },
  {
    id: 'mother',
    titleKey: 'stage.mother',
    defaultTitle: 'Post Pregnancy',
    bgColor: '#E5F9EA',
    image: require('@/assets/images/stages/mother.png'),
  },
  {
    id: 'conceive',
    titleKey: 'stage.conceive',
    defaultTitle: 'Try To Conceive',
    bgColor: '#DEF2FB',
    image: require('@/assets/images/stages/conceive.png'),
  },
  {
    id: 'explore',
    titleKey: 'stage.explore',
    defaultTitle: 'IUI, IVF',
    bgColor: '#F3E8FF',
    image: require('@/assets/images/stages/explore.png'),
  },
];

export default function StageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { stage, setStage } = useAppStore();

  const [selectedStage, setSelectedStage] = useState<PregnancyStage>(stage || 'pregnant');

  const handleStagePress = (stageId: PregnancyStage) => {
    setSelectedStage(stageId);
    if (stageId === 'pregnant') {
      setStage('pregnant');
      router.push('/(auth)/pregnancy');
    } else if (stageId === 'mother') {
      setStage('mother');
      router.push('/(auth)/baby-gender');
    } else if (stageId === 'conceive') {
      setStage('conceive');
      router.push('/(auth)/conceive');
    } else if (stageId === 'explore') {
      setStage('explore');
    }
  };

  const handleContinue = () => {
    setStage(selectedStage);
    if (selectedStage === 'pregnant') {
      router.push('/(auth)/pregnancy');
    } else if (selectedStage === 'mother') {
      router.push('/(auth)/baby-gender');
    } else if (selectedStage === 'conceive') {
      router.push('/(auth)/conceive');
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDEEEC" />

      {/* Top Header Banner with Deep Curved Wave matching Image 2 */}
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
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 }}>
              {t('stage.title', 'Choose your stage')}
            </Text>
            <Text style={{ fontSize: 15, color: '#6B7280', marginTop: 8, fontWeight: '500' }}>
              {t('stage.subtitle', 'So your journey feels truly personalized')}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content Area: Boxes and Continue Button pushed down matching Image 2 */}
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: horizontalPadding }}>
        {/* 2x2 Grid of Stages with comfortable top margin */}
        <View style={{ marginTop: topGapBelowWave }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {STAGES.map((item) => {
              const isSelected = selectedStage === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleStagePress(item.id)}
                  style={[
                    {
                      width: cardWidth,
                      height: cardWidth * 1.08,
                      backgroundColor: item.bgColor,
                      borderRadius: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: gap,
                      padding: 12,
                    },
                    isSelected
                      ? { borderColor: '#EE4D38', borderWidth: 2 }
                      : { borderColor: 'transparent', borderWidth: 2 },
                    {
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isSelected ? 0.08 : 0.03,
                      shadowRadius: 10,
                      elevation: 2,
                    },
                  ]}
                >
                  <Image
                    source={item.image}
                    style={{ width: 70, height: 70 }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 15,
                      fontWeight: '700',
                      color: '#1E1E1E',
                      marginTop: 10,
                      textAlign: 'center',
                      lineHeight: 19,
                    }}
                  >
                    {t(item.titleKey, item.defaultTitle)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Continue Button */}
        <SafeAreaView edges={['bottom']} style={{ paddingBottom: 24 }}>
          <Button
            title={t('stage.continue', 'Continue')}
            onPress={handleContinue}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}
