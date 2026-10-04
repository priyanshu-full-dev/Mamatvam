import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Utensils,
  Lightbulb,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const NUTRIENT_CARD_WIDTH = (width - 44) / 2;

interface MealItem {
  id: string;
  name: string;
  time: string;
  icon: string;
  items: string[];
}

export default function DietDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    planId?: string;
    trimesterId?: string;
    cuisine?: string;
    dietType?: string;
  }>();

  const cuisine = params.cuisine || 'South Indian';
  const dietType = params.dietType || 'VEG';
  const isVeg = dietType === 'VEG';

  const planTitle = `${cuisine} ${isVeg ? 'Vegetarian' : 'Non-Veg'} Diet`;

  // Expanded meal sections (Breakfast open by default matching Image 3)
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set(['breakfast']));

  const toggleMeal = (id: string) => {
    setExpandedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 7 Daily Meals customized for cuisine and veg/non-veg
  const meals: MealItem[] = [
    {
      id: 'early_morning',
      name: 'Early Morning',
      time: '7:00 AM',
      icon: '🌅',
      items: [
        '1 glass warm water with lemon or soaked almonds (5-6)',
        '1 cup warm milk or herbal ginger tea',
      ],
    },
    {
      id: 'breakfast',
      name: 'Breakfast',
      time: '8:30 AM',
      icon: '🍳',
      items: isVeg
        ? cuisine === 'South Indian'
          ? [
              '2 idlis with sambar + chutney',
              'OR 1 dosa with sambar',
              '1 glass buttermilk or milk',
            ]
          : [
              '2 stuffed paneer or methi parathas with curd',
              'OR 1 bowl vegetable poha / upma',
              '1 glass fresh fruit juice or milk',
            ]
        : cuisine === 'South Indian'
        ? [
            '2 egg appams or idlis with egg curry',
            'OR 1 vegetable dosa with boiled egg',
            '1 glass fresh buttermilk',
          ]
        : [
            '2 boiled or scrambled eggs with whole wheat toast',
            'OR 1 egg bhurji with roti',
            '1 glass fresh milk or juice',
          ],
    },
    {
      id: 'mid_morning',
      name: 'Mid-Morning Snack',
      time: '11:00 AM',
      icon: '🥗',
      items: [
        '1 seasonal fresh fruit (apple, orange, pomegranate, or guava)',
        'Handful of walnuts, figs, and pumpkin seeds',
        '1 glass tender coconut water',
      ],
    },
    {
      id: 'lunch',
      name: 'Lunch',
      time: '1:30 PM',
      icon: '🍛',
      items: isVeg
        ? cuisine === 'South Indian'
          ? [
              '1 cup brown rice or unpolished white rice',
              '1 bowl drumstick/vegetable sambar or tomato rasam',
              '1 cup green leafy poriyal (spinach/cabbage)',
              '1 cup homemade curd or fresh raita',
            ]
          : [
              '2 whole wheat rotis + 1/2 cup jeera rice',
              '1 bowl dal tadka or palak paneer',
              '1 bowl seasonal green sabzi',
              'Fresh cucumber tomato salad + curd',
            ]
        : cuisine === 'South Indian'
        ? [
            '1 cup rice with fish curry (low-mercury) or country chicken gravy',
            '1 cup vegetable stir fry / poriyal',
            '1 cup rasam and fresh curd',
          ]
        : [
            '2 rotis + 1/2 cup rice',
            '1 bowl chicken curry or fish gravy',
            '1 cup yellow dal and mixed salad',
            '1 cup fresh curd',
          ],
    },
    {
      id: 'evening_snack',
      name: 'Evening Snack',
      time: '4:30 PM',
      icon: '☕',
      items: [
        'Roasted makhana (fox nuts) or boiled chana / sundal',
        '1 cup light cardamom milk or caffeine-free herbal tea',
      ],
    },
    {
      id: 'dinner',
      name: 'Dinner',
      time: '8:00 PM',
      icon: '🌙',
      items: [
        '2 multigrain rotis or 1 cup vegetable khichdi',
        '1 bowl mixed lentil dal or light paneer/tofu curry',
        'Steamed vegetables with light cumin seasoning',
      ],
    },
    {
      id: 'bedtime',
      name: 'Bedtime',
      time: '10:00 PM',
      icon: '🥛',
      items: [
        '1 cup warm milk with a pinch of turmeric and saffron',
      ],
    },
  ];

  const topPadding = Math.max(insets.top, 28);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) + 24 }}
      >
        {/* Hero Image Section */}
        <View style={styles.heroWrapper}>
          <Image
            source={
              cuisine === 'South Indian'
                ? isVeg
                  ? require('@/assets/images/diet/detail_hero_si_veg.png')
                  : require('@/assets/images/diet/south_indian_nonveg.png')
                : isVeg
                ? require('@/assets/images/diet/north_indian_veg.png')
                : require('@/assets/images/diet/north_indian_nonveg.png')
            }
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={[styles.floatingBackBtn, { top: topPadding + 6 }]}
          >
            <ArrowLeft size={20} color="#1E293B" strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Bottom Gradient Overlay on Hero */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.heroGradientOverlay}
          >
            <Text style={styles.heroPlanTitle}>{planTitle}</Text>
            <View style={styles.tagRow}>
              <View
                style={[
                  styles.vegTag,
                  { backgroundColor: isVeg ? '#00C950' : '#F86C0D' },
                ]}
              >
                <Text style={styles.vegTagText}>
                  {isVeg ? '🌱 VEGETARIAN' : '🍗 NON-VEGETARIAN'}
                </Text>
              </View>
              <Text style={styles.mealsCountText}>7 meals a day</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          {/* Key Nutrients This Trimester */}
          <Text style={styles.sectionHeading}>Key Nutrients This Trimester</Text>
          <View style={styles.nutrientsGrid}>
            {/* 1. Folic Acid */}
            <View style={[styles.nutrientCard, { backgroundColor: '#DCFCE7' }]}>
              <Text style={[styles.nutrientLabel, { color: '#15803D' }]}>Folic Acid</Text>
              <Text style={[styles.nutrientValue, { color: '#16A34A' }]}>600 mcg/day</Text>
            </View>

            {/* 2. Iron */}
            <View style={[styles.nutrientCard, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.nutrientLabel, { color: '#B91C1C' }]}>Iron</Text>
              <Text style={[styles.nutrientValue, { color: '#DC2626' }]}>27 mg/day</Text>
            </View>

            {/* 3. Calcium */}
            <View style={[styles.nutrientCard, { backgroundColor: '#DBEAFE' }]}>
              <Text style={[styles.nutrientLabel, { color: '#1D4ED8' }]}>Calcium</Text>
              <Text style={[styles.nutrientValue, { color: '#2563EB' }]}>1000 mg/day</Text>
            </View>

            {/* 4. Calories */}
            <View style={[styles.nutrientCard, { backgroundColor: '#FEF9C3' }]}>
              <Text style={[styles.nutrientLabel, { color: '#A16207' }]}>Calories</Text>
              <Text style={[styles.nutrientValue, { color: '#CA8A04' }]}>+0 extra/day</Text>
            </View>
          </View>

          {/* Daily Meal Plan Header */}
          <View style={styles.mealPlanHeaderRow}>
            <Utensils size={18} color="#E11D48" strokeWidth={2.4} />
            <Text style={styles.mealPlanHeading}>Daily Meal Plan</Text>
          </View>

          {/* 7 Collapsible Meal Cards */}
          {meals.map((meal) => {
            const isExpanded = expandedMeals.has(meal.id);
            return (
              <View key={meal.id} style={styles.mealCard}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleMeal(meal.id)}
                  style={styles.mealHeader}
                >
                  <Text style={styles.mealIcon}>{meal.icon}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.mealTitle}>{meal.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Clock size={11} color="#64748B" style={{ marginRight: 3 }} />
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={18} color="#94A3B8" />
                  ) : (
                    <ChevronDown size={18} color="#94A3B8" />
                  )}
                </TouchableOpacity>

                {/* Expanded Meal Items */}
                {isExpanded && (
                  <View style={styles.mealContent}>
                    {meal.items.map((item, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          {/* Trimester Tips Section */}
          <View style={styles.tipsHeaderRow}>
            <Lightbulb size={18} color="#EAB308" strokeWidth={2.4} />
            <Text style={styles.tipsHeading}>Trimester Tips</Text>
          </View>

          <View style={styles.tipsCard}>
            <View style={styles.tipItem}>
              <Text style={styles.tipStar}>✦</Text>
              <Text style={styles.tipText}>
                Eat small, frequent meals to manage nausea
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipStar}>✦</Text>
              <Text style={styles.tipText}>
                Avoid raw/undercooked meat and fish high in mercury
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipStar}>✦</Text>
              <Text style={styles.tipText}>
                Take prescribed folic acid supplements
              </Text>
            </View>
            <View style={[styles.tipItem, { marginBottom: 0 }]}>
              <Text style={styles.tipStar}>✦</Text>
              <Text style={styles.tipText}>
                Stay away from alcohol and excess caffeine
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  heroWrapper: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBackBtn: {
    position: 'absolute',
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  heroGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 14,
  },
  heroPlanTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  vegTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  vegTagText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mealsCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
  },
  contentBody: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  nutrientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutrientCard: {
    width: NUTRIENT_CARD_WIDTH,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  nutrientLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  nutrientValue: {
    fontSize: 15.5,
    fontWeight: '800',
    marginTop: 3,
  },
  mealPlanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  mealPlanHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 8,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  mealIcon: {
    fontSize: 22,
  },
  mealTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  mealTime: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  mealContent: {
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 16,
    color: '#EC4899',
    marginRight: 8,
    lineHeight: 18,
  },
  bulletText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  tipsHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 6,
  },
  tipsCard: {
    backgroundColor: '#FDF2F8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    padding: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipStar: {
    fontSize: 12,
    color: '#EC4899',
    marginRight: 8,
    lineHeight: 17,
  },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
});
