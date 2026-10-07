import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Info } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AgeTab = '0-6m' | '6-12m' | '1-2y';
type ViewMode = 'nutrients' | 'food_guide';

interface NutrientItem {
  id: string;
  emoji: string;
  title: string;
  source: string;
  value: string;
  bgColor: string;
  borderColor: string;
  titleColor: string;
  sourceColor: string;
  valueColor: string;
}

interface FoodGuideItem {
  id: string;
  emoji: string;
  title: string;
  ageTag: string;
  desc: string;
  bgColor: string;
  borderColor: string;
}

const NUTRIENT_DATA: Record<AgeTab, NutrientItem[]> = {
  '0-6m': [
    {
      id: 'n_energy',
      emoji: '⚡',
      title: 'Energy',
      source: 'Breastmilk / Formula',
      value: '550 kcal/day',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
      titleColor: '#854D0E',
      sourceColor: '#A16207',
      valueColor: '#854D0E',
    },
    {
      id: 'n_protein',
      emoji: '🥩',
      title: 'Protein',
      source: 'Breastmilk',
      value: '9.1 g/day',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      titleColor: '#991B1B',
      sourceColor: '#DC2626',
      valueColor: '#991B1B',
    },
    {
      id: 'n_calcium',
      emoji: '🦴',
      title: 'Calcium',
      source: 'Breastmilk',
      value: '200 mg/day',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      titleColor: '#1D4ED8',
      sourceColor: '#3B82F6',
      valueColor: '#1D4ED8',
    },
    {
      id: 'n_iron',
      emoji: '🩸',
      title: 'Iron',
      source: 'Breastmilk (low but bioavailable)',
      value: '0.27 mg/day',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      titleColor: '#991B1B',
      sourceColor: '#DC2626',
      valueColor: '#991B1B',
    },
    {
      id: 'n_vit_d',
      emoji: '🔆',
      title: 'Vitamin D',
      source: 'Supplement recommended',
      value: '400 IU/day',
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
      titleColor: '#C2410C',
      sourceColor: '#EA580C',
      valueColor: '#C2410C',
    },
    {
      id: 'n_vit_k',
      emoji: '🌿',
      title: 'Vitamin K',
      source: 'Injection at birth / breastmilk',
      value: '2 mcg/day',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0',
      titleColor: '#166534',
      sourceColor: '#15803D',
      valueColor: '#166534',
    },
    {
      id: 'n_dha',
      emoji: '🐟',
      title: 'DHA (Omega-3)',
      source: 'Breastmilk if mother eats fish',
      value: '100 mg/day',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
      titleColor: '#0369A1',
      sourceColor: '#0284C7',
      valueColor: '#0369A1',
    },
    {
      id: 'n_zinc',
      emoji: '🔩',
      title: 'Zinc',
      source: 'Breastmilk',
      value: '2 mg/day',
      bgColor: '#F8FAFC',
      borderColor: '#E2E8F0',
      titleColor: '#334155',
      sourceColor: '#64748B',
      valueColor: '#334155',
    },
  ],
  '6-12m': [
    {
      id: 'n_energy_6',
      emoji: '⚡',
      title: 'Energy',
      source: 'Breastmilk + Solids/Purees',
      value: '700 kcal/day',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
      titleColor: '#854D0E',
      sourceColor: '#A16207',
      valueColor: '#854D0E',
    },
    {
      id: 'n_protein_6',
      emoji: '🥩',
      title: 'Protein',
      source: 'Pureed lentils, eggs, paneer',
      value: '11 g/day',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      titleColor: '#991B1B',
      sourceColor: '#DC2626',
      valueColor: '#991B1B',
    },
    {
      id: 'n_calcium_6',
      emoji: '🦴',
      title: 'Calcium',
      source: 'Breastmilk, plain yogurt',
      value: '260 mg/day',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      titleColor: '#1D4ED8',
      sourceColor: '#3B82F6',
      valueColor: '#1D4ED8',
    },
    {
      id: 'n_iron_6',
      emoji: '🩸',
      title: 'Iron',
      source: 'Fortified cereals & lentils',
      value: '11 mg/day',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      titleColor: '#991B1B',
      sourceColor: '#DC2626',
      valueColor: '#991B1B',
    },
    {
      id: 'n_vit_d_6',
      emoji: '🔆',
      title: 'Vitamin D',
      source: 'Supplement drops + morning sun',
      value: '400 IU/day',
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
      titleColor: '#C2410C',
      sourceColor: '#EA580C',
      valueColor: '#C2410C',
    },
    {
      id: 'n_vit_c_6',
      emoji: '🍊',
      title: 'Vitamin C',
      source: 'Mashed papaya, stewed apples',
      value: '50 mg/day',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      titleColor: '#B45309',
      sourceColor: '#D97706',
      valueColor: '#B45309',
    },
    {
      id: 'n_dha_6',
      emoji: '🐟',
      title: 'DHA (Omega-3)',
      source: 'Fatty fish puree or fortified ghee',
      value: '100 mg/day',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
      titleColor: '#0369A1',
      sourceColor: '#0284C7',
      valueColor: '#0369A1',
    },
    {
      id: 'n_zinc_6',
      emoji: '🔩',
      title: 'Zinc',
      source: 'Whole grain purees & seed paste',
      value: '3 mg/day',
      bgColor: '#F8FAFC',
      borderColor: '#E2E8F0',
      titleColor: '#334155',
      sourceColor: '#64748B',
      valueColor: '#334155',
    },
  ],
  '1-2y': [
    {
      id: 'n_energy_1y',
      emoji: '⚡',
      title: 'Energy',
      source: '3 Family meals + 2 healthy snacks',
      value: '950 kcal/day',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
      titleColor: '#854D0E',
      sourceColor: '#A16207',
      valueColor: '#854D0E',
    },
    {
      id: 'n_protein_1y',
      emoji: '🥩',
      title: 'Protein',
      source: 'Dals, eggs, chicken, paneer',
      value: '13 g/day',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      titleColor: '#991B1B',
      sourceColor: '#DC2626',
      valueColor: '#991B1B',
    },
    {
      id: 'n_calcium_1y',
      emoji: '🦴',
      title: 'Calcium',
      source: 'Cow milk, curd, cheese',
      value: '500 mg/day',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      titleColor: '#1D4ED8',
      sourceColor: '#3B82F6',
      valueColor: '#1D4ED8',
    },
    {
      id: 'n_iron_1y',
      emoji: '🩸',
      title: 'Iron',
      source: 'Spinach, dates syrup, beans',
      value: '7 mg/day',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      titleColor: '#991B1B',
      sourceColor: '#DC2626',
      valueColor: '#991B1B',
    },
    {
      id: 'n_vit_d_1y',
      emoji: '🔆',
      title: 'Vitamin D',
      source: 'Pediatric supplement + sun exposure',
      value: '600 IU/day',
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
      titleColor: '#C2410C',
      sourceColor: '#EA580C',
      valueColor: '#C2410C',
    },
    {
      id: 'n_fiber_1y',
      emoji: '🥦',
      title: 'Dietary Fiber',
      source: 'Oats, cooked veggies, whole fruits',
      value: '19 g/day',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0',
      titleColor: '#166534',
      sourceColor: '#15803D',
      valueColor: '#166534',
    },
    {
      id: 'n_fat_1y',
      emoji: '🥑',
      title: 'Healthy Fats',
      source: 'Pure desi ghee, olive oil, avocado',
      value: '35 g/day',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
      titleColor: '#854D0E',
      sourceColor: '#A16207',
      valueColor: '#854D0E',
    },
    {
      id: 'n_zinc_1y',
      emoji: '🔩',
      title: 'Zinc',
      source: 'Powdered nuts, beans, seeds',
      value: '3 mg/day',
      bgColor: '#F8FAFC',
      borderColor: '#E2E8F0',
      titleColor: '#334155',
      sourceColor: '#64748B',
      valueColor: '#334155',
    },
  ],
};

// Exact Food Guide data matching the user's reference UI
const FOOD_GUIDE_DATA: Record<AgeTab, FoodGuideItem[]> = {
  '6-12m': [
    {
      id: 'fg_khichdi',
      emoji: '🍚',
      title: 'Rice / Dal khichdi',
      ageTag: '6+ months',
      desc: 'Start with single grain, smooth puree',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
    },
    {
      id: 'fg_ragi',
      emoji: '🌾',
      title: 'Ragi porridge',
      ageTag: '6+ months',
      desc: 'Excellent iron + calcium source',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
    },
    {
      id: 'fg_banana',
      emoji: '🍌',
      title: 'Mashed banana / mango',
      ageTag: '6+ months',
      desc: 'Easy first fruits — no added sugar',
      bgColor: '#F7FEE7',
      borderColor: '#D9F99D',
    },
    {
      id: 'fg_carrot',
      emoji: '🥕',
      title: 'Boiled & mashed carrot',
      ageTag: '6+ months',
      desc: 'Rich in Vitamin A',
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
    },
    {
      id: 'fg_egg',
      emoji: '🥚',
      title: 'Egg yolk (mashed)',
      ageTag: '8+ months',
      desc: 'Great protein + iron source',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
    },
    {
      id: 'fg_fish',
      emoji: '🐟',
      title: 'Soft cooked fish',
      ageTag: '8+ months',
      desc: 'Omega-3 for brain development',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
    },
    {
      id: 'fg_curd',
      emoji: '🥛',
      title: 'Curd / Yoghurt',
      ageTag: '8+ months',
      desc: 'Probiotics + calcium',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
    },
  ],
  '0-6m': [
    {
      id: 'fg_breastmilk',
      emoji: '🤱',
      title: 'Breastmilk (On Demand)',
      ageTag: '0+ months',
      desc: 'Complete nutrition, natural antibodies & perfect hydration',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
    },
    {
      id: 'fg_formula',
      emoji: '🍼',
      title: 'Infant Formula (If needed)',
      ageTag: '0+ months',
      desc: 'Iron-fortified infant formula prepared with sterilized water',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
    },
    {
      id: 'fg_vitd',
      emoji: '☀️',
      title: 'Vitamin D Drops',
      ageTag: '2+ weeks',
      desc: '400 IU daily pediatric drops for bone & immune development',
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
    },
    {
      id: 'fg_water',
      emoji: '💧',
      title: 'No Plain Water',
      ageTag: '0–6 months',
      desc: 'Breastmilk is 88% water; plain water can upset electrolytes',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0',
    },
  ],
  '1-2y': [
    {
      id: 'fg_veg_khichdi',
      emoji: '🍲',
      title: 'Mixed vegetable khichdi',
      ageTag: '12+ months',
      desc: 'Cooked rice, moong dal, carrots, peas with desi ghee',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
    },
    {
      id: 'fg_roti_dal',
      emoji: '🫓',
      title: 'Soft roti / idli with dal',
      ageTag: '12+ months',
      desc: 'Torn into easy bite-sized finger food pieces',
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
    },
    {
      id: 'fg_paneer',
      emoji: '🧀',
      title: 'Paneer cubes / Mild cheese',
      ageTag: '12+ months',
      desc: 'Dense calcium and protein for bone & muscle growth',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
    },
    {
      id: 'fg_cow_milk',
      emoji: '🥛',
      title: 'Pasteurized whole milk',
      ageTag: '12+ months',
      desc: 'Limit to 400–500 ml/day so it does not displace solid foods',
      bgColor: '#F0FDF4',
      borderColor: '#BBF7D0',
    },
    {
      id: 'fg_avocado',
      emoji: '🥑',
      title: 'Avocado & fruit chunks',
      ageTag: '12+ months',
      desc: 'Healthy fats & natural dietary fiber for active toddlers',
      bgColor: '#F7FEE7',
      borderColor: '#D9F99D',
    },
    {
      id: 'fg_nuts',
      emoji: '🥜',
      title: 'Almond & walnut powder',
      ageTag: '12+ months',
      desc: 'Finely powdered in porridge — never serve whole nuts',
      bgColor: '#FEFCE8',
      borderColor: '#FEF08A',
    },
  ],
};

const SUBTITLES: Record<AgeTab, string> = {
  '0-6m': 'Exclusive breastfeeding / formula',
  '6-12m': 'Breastmilk + solids introduction',
  '1-2y': 'Family Meals + Toddler Nutrition',
};

export default function NutritionValuesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AgeTab>('6-12m');
  const [viewMode, setViewMode] = useState<ViewMode>('food_guide');

  const nutrients = NUTRIENT_DATA[activeTab];
  const foodGuides = FOOD_GUIDE_DATA[activeTab];

  const handleTabChange = (tab: AgeTab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setViewMode(mode);
  };

  // Dynamic disclaimer alert styling & text based on mode and activeTab
  const getDisclaimer = () => {
    if (viewMode === 'food_guide') {
      if (activeTab === '6-12m') {
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          iconColor: '#D97706',
          textColor: '#92400E',
          text: 'Foods recommended to introduce during 6-12m. Always introduce one food at a time and wait 3 days for allergies.',
        };
      }
      if (activeTab === '0-6m') {
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          iconColor: '#10B981',
          textColor: '#065F46',
          text: 'Exclusive breastfeeding or infant formula recommended for first 6 months. No solids or water needed.',
        };
      }
      return {
        bg: '#EFF6FF',
        border: '#BFDBFE',
        iconColor: '#3B82F6',
        textColor: '#1E40AF',
        text: 'Toddlers can eat family foods. Offer 3 small meals and 2 healthy snacks daily with plenty of water.',
      };
    }

    // Nutrients Mode Disclaimers
    if (activeTab === '0-6m') {
      return {
        bg: '#ECFDF5',
        border: '#A7F3D0',
        iconColor: '#10B981',
        textColor: '#065F46',
        text: 'Daily recommended intake for babies aged 0-6m. Consult your paediatrician for personalised advice.',
      };
    }
    if (activeTab === '6-12m') {
      return {
        bg: '#ECFDF5',
        border: '#A7F3D0',
        iconColor: '#10B981',
        textColor: '#065F46',
        text: 'Daily recommended intake for babies aged 6-12m transitioning onto complementary solid meals.',
      };
    }
    return {
      bg: '#ECFDF5',
      border: '#A7F3D0',
      iconColor: '#10B981',
      textColor: '#065F46',
      text: 'Daily recommended intake for toddlers aged 1-2y. Encourage a diverse rainbow of colorful wholesome foods.',
    };
  };

  const disclaimer = getDisclaimer();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Nutrition Values</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Age Range Segment Switcher */}
        <View style={styles.segmentContainer}>
          {(['0-6m', '6-12m', '1-2y'] as AgeTab[]).map((tab) => {
            const isSelected = activeTab === tab;
            const label = tab === '0-6m' ? '0–6 Months' : tab === '6-12m' ? '6–12 Months' : '1–2 Years';
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => handleTabChange(tab)}
                style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
              >
                <Text style={[styles.segmentText, isSelected && styles.segmentTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feeding Mode Subtitle */}
        <Text style={styles.feedingSubtitle}>{SUBTITLES[activeTab]}</Text>

        {/* View Mode Pills (Nutrients vs Food Guide) */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleViewModeChange('nutrients')}
            style={[styles.modePill, viewMode === 'nutrients' && styles.modePillActive]}
          >
            <Text style={styles.modeIcon}>📊</Text>
            <Text
              style={[
                styles.modePillText,
                viewMode === 'nutrients' && styles.modePillTextActive,
              ]}
            >
              Nutrients
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleViewModeChange('food_guide')}
            style={[styles.modePill, viewMode === 'food_guide' && styles.modePillActive]}
          >
            <Text style={styles.modeIcon}>🥣</Text>
            <Text
              style={[
                styles.modePillText,
                viewMode === 'food_guide' && styles.modePillTextActive,
              ]}
            >
              Food Guide
            </Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer Alert Box */}
        <View
          style={[
            styles.disclaimerCard,
            { backgroundColor: disclaimer.bg, borderColor: disclaimer.border },
          ]}
        >
          <Info size={17} color={disclaimer.iconColor} style={{ marginRight: 8, marginTop: 1 }} />
          <Text style={[styles.disclaimerText, { color: disclaimer.textColor }]}>
            {disclaimer.text}
          </Text>
        </View>

        {/* List Content */}
        {viewMode === 'food_guide' ? (
          /* Food Guide View */
          <View style={styles.foodGuideList}>
            {foodGuides.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.foodCard,
                  { backgroundColor: item.bgColor, borderColor: item.borderColor },
                ]}
              >
                {/* Food Emoji */}
                <Text style={styles.foodEmoji}>{item.emoji}</Text>

                {/* Info Column */}
                <View style={styles.foodInfoCol}>
                  <Text style={styles.foodTitle}>{item.title}</Text>

                  {/* Age Tag Pill */}
                  <View style={styles.ageTagBadge}>
                    <Text style={styles.ageTagText}>{item.ageTag}</Text>
                  </View>

                  {/* Description */}
                  <Text style={styles.foodDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* Nutrients List View */
          <View style={styles.nutrientsList}>
            {nutrients.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.nutrientCard,
                  { backgroundColor: item.bgColor, borderColor: item.borderColor },
                ]}
              >
                <View style={styles.cardLeftCol}>
                  <Text style={styles.nutrientEmoji}>{item.emoji}</Text>
                  <View style={styles.cardInfoCol}>
                    <Text style={[styles.nutrientTitle, { color: item.titleColor }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.nutrientSource, { color: item.sourceColor }]}>
                      {item.source}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.nutrientValue, { color: item.valueColor }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  feedingSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  modePillActive: {
    backgroundColor: '#00C853',
    borderColor: '#00C853',
  },
  modeIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  modePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  modePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16.5,
    fontWeight: '500',
  },
  nutrientsList: {
    paddingHorizontal: 16,
  },
  nutrientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  cardLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  nutrientEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  cardInfoCol: {
    flex: 1,
  },
  nutrientTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  nutrientSource: {
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: '500',
  },
  nutrientValue: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  foodGuideList: {
    paddingHorizontal: 16,
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  foodEmoji: {
    fontSize: 26,
    marginRight: 14,
  },
  foodInfoCol: {
    flex: 1,
  },
  foodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  ageTagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
    marginBottom: 5,
  },
  ageTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  foodDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
