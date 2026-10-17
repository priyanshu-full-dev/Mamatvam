import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import { Button } from '@/components/ui/Button';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { useAppStore, PregnancyStage } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  getOnboardingCategoriesApi,
  selectCategoryApi,
  getRouteForOnboardingStep,
  OnboardingCategory,
} from '@/api/onboarding.api';

const { width, height } = Dimensions.get('window');
const horizontalPadding = 24;
const gap = 16;
const cardWidth = (width - horizontalPadding * 2 - gap) / 2;

// Exact proportions matching the design screenshot (curve extends to ~31.5% of screen height)
const headerHeight = Math.round(height * 0.315);
const topGapBelowWave = Math.round(height * 0.055); // ~45-50px of clean white space between wave & cards

interface StageOption {
  id: PregnancyStage;
  code: string;
  titleKey: string;
  defaultTitle: string;
  bgColor: string;
  image: any;
}

const CATEGORY_META: Record<string, { stageId: PregnancyStage; titleKey: string; defaultTitle: string; bgColor: string; image: any }> = {
  CONCEIVE: {
    stageId: 'conceive',
    titleKey: 'stage.conceive',
    defaultTitle: 'Try To Conceive',
    bgColor: '#DEF2FB',
    image: require('@/assets/images/stages/conceive.png'),
  },
  PREGNANCY: {
    stageId: 'pregnant',
    titleKey: 'stage.pregnant',
    defaultTitle: 'Pregnancy',
    bgColor: '#FFE8E5',
    image: require('@/assets/images/stages/pregnant.png'),
  },
  MOTHER: {
    stageId: 'mother',
    titleKey: 'stage.mother',
    defaultTitle: 'Post Pregnancy',
    bgColor: '#E5F9EA',
    image: require('@/assets/images/stages/mother.png'),
  },
  IUI_IVF: {
    stageId: 'explore',
    titleKey: 'stage.explore',
    defaultTitle: 'IUI, IVF',
    bgColor: '#F3E8FF',
    image: require('@/assets/images/stages/explore.png'),
  },
};

const DEFAULT_STAGES: StageOption[] = [
  { code: 'CONCEIVE', id: 'conceive', ...CATEGORY_META.CONCEIVE },
  { code: 'PREGNANCY', id: 'pregnant', ...CATEGORY_META.PREGNANCY },
  { code: 'MOTHER', id: 'mother', ...CATEGORY_META.MOTHER },
  { code: 'IUI_IVF', id: 'explore', ...CATEGORY_META.IUI_IVF },
];

export default function StageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { stage, setStage } = useAppStore();
  const { token, setOnboarding } = useAuthStore();

  const [stages, setStages] = useState<StageOption[]>(DEFAULT_STAGES);
  const [selectedStage, setSelectedStage] = useState<PregnancyStage>(stage || 'conceive');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        const res = await getOnboardingCategoriesApi(token || undefined);
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: StageOption[] = res.data.map((item) => {
            const meta = CATEGORY_META[item.code] || {
              stageId: item.code.toLowerCase() as PregnancyStage,
              titleKey: `stage.${item.code.toLowerCase()}`,
              defaultTitle: item.name,
              bgColor: '#F1F5F9',
              image: require('@/assets/images/stages/conceive.png'),
            };
            return {
              code: item.code,
              id: meta.stageId,
              titleKey: meta.titleKey,
              defaultTitle: meta.defaultTitle,
              bgColor: meta.bgColor,
              image: meta.image,
            };
          });
          setStages(mapped);
        }
      } catch (err) {
        console.warn('Error fetching categories from backend, using defaults:', err);
      }
    }

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleStagePress = (stageId: PregnancyStage) => {
    setSelectedStage(stageId);
  };

  const handleContinue = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const currentOption = stages.find((s) => s.id === selectedStage) || DEFAULT_STAGES.find((s) => s.id === selectedStage);
    const categoryCode = currentOption?.code || 'CONCEIVE';

    try {
      const res = await selectCategoryApi({ categoryCode }, token || undefined);
      if (res?.data) {
        await setOnboarding({
          completed: res.data.completed,
          nextStep: res.data.nextStep,
          language: res.data.language?.code || null,
          category: res.data.category?.code || categoryCode,
          profileComplete: res.data.profileComplete,
        });

        setStage(selectedStage);

        // Navigate based on API response
        const nextRoute = getRouteForOnboardingStep({
          completed: res.data.completed,
          nextStep: res.data.nextStep,
          language: res.data.language?.code || null,
          category: res.data.category?.code || categoryCode,
          profileComplete: res.data.profileComplete,
        });
        router.push(nextRoute as any);
        return;
      }
    } catch (err) {
      console.warn('Failed to select category on backend, proceeding locally:', err);
    } finally {
      setIsSubmitting(false);
    }

    setStage(selectedStage);
    if (selectedStage === 'pregnant') {
      router.push('/(auth)/pregnancy');
    } else if (selectedStage === 'mother') {
      router.push('/(auth)/baby-gender');
    } else if (selectedStage === 'conceive') {
      router.push('/(auth)/conceive');
    } else if (selectedStage === 'explore') {
      router.push('/(auth)/iui-ivf');
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
            <Text style={{ fontSize: 15, color: '#6B7280', marginTop: 8, fontWeight: '500', lineHeight: 21 }}>
              {t('stage.subtitle', 'Select your stage to unlock your personalized, step-by-step pregnancy roadmap')}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content Area: Boxes and Continue Button pushed down matching Image 2 */}
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* 2x2 Grid of Stages with comfortable top margin */}
        <View style={{ marginTop: topGapBelowWave, paddingHorizontal: horizontalPadding }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {stages.map((item) => {
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
                      ? { borderColor: '#F06292', borderWidth: 2 }
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
        <BottomActionBar
          title={t('stage.continue', 'Continue')}
          onPress={handleContinue}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}
