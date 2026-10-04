import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

export interface DietPlan {
  id: string;
  cuisine: string; // 'North Indian' | 'South Indian'
  dietType: 'VEG' | 'NON-VEG';
  title: string;
  subtitle: string;
  image: any;
  mealsCount: number;
}

export interface TrimesterGroup {
  id: string;
  trimesterTitle: string; // 'FIRST TRIMESTER'
  weeksLabel: string; // '(Weeks 1–12)'
  dotColor: string;
  textColor: string;
  plans: DietPlan[];
}

const TRIMESTER_DATA: TrimesterGroup[] = [
  {
    id: 'first',
    trimesterTitle: 'FIRST TRIMESTER',
    weeksLabel: '(Weeks 1–12)',
    dotColor: '#EC4899',
    textColor: '#EC4899',
    plans: [
      {
        id: 't1_ni_veg',
        cuisine: 'North Indian',
        dietType: 'VEG',
        title: 'North Indian',
        subtitle: 'Vegetarian Diet',
        image: require('@/assets/images/diet/north_indian_veg.png'),
        mealsCount: 7,
      },
      {
        id: 't1_si_veg',
        cuisine: 'South Indian',
        dietType: 'VEG',
        title: 'South Indian',
        subtitle: 'Vegetarian Diet',
        image: require('@/assets/images/diet/south_indian_veg.png'),
        mealsCount: 7,
      },
      {
        id: 't1_ni_nonveg',
        cuisine: 'North Indian',
        dietType: 'NON-VEG',
        title: 'North Indian',
        subtitle: 'Non-Veg Diet',
        image: require('@/assets/images/diet/north_indian_nonveg.png'),
        mealsCount: 7,
      },
      {
        id: 't1_si_nonveg',
        cuisine: 'South Indian',
        dietType: 'NON-VEG',
        title: 'South Indian',
        subtitle: 'Non-Veg Diet',
        image: require('@/assets/images/diet/south_indian_nonveg.png'),
        mealsCount: 7,
      },
    ],
  },
  {
    id: 'second',
    trimesterTitle: 'SECOND TRIMESTER',
    weeksLabel: '(Weeks 13–27)',
    dotColor: '#F97316',
    textColor: '#F97316',
    plans: [
      {
        id: 't2_ni_veg',
        cuisine: 'North Indian',
        dietType: 'VEG',
        title: 'North Indian',
        subtitle: 'Vegetarian Diet',
        image: require('@/assets/images/diet/north_indian_veg.png'),
        mealsCount: 7,
      },
      {
        id: 't2_si_veg',
        cuisine: 'South Indian',
        dietType: 'VEG',
        title: 'South Indian',
        subtitle: 'Vegetarian Diet',
        image: require('@/assets/images/diet/south_indian_veg.png'),
        mealsCount: 7,
      },
      {
        id: 't2_ni_nonveg',
        cuisine: 'North Indian',
        dietType: 'NON-VEG',
        title: 'North Indian',
        subtitle: 'Non-Veg Diet',
        image: require('@/assets/images/diet/north_indian_nonveg.png'),
        mealsCount: 7,
      },
      {
        id: 't2_si_nonveg',
        cuisine: 'South Indian',
        dietType: 'NON-VEG',
        title: 'South Indian',
        subtitle: 'Non-Veg Diet',
        image: require('@/assets/images/diet/south_indian_nonveg.png'),
        mealsCount: 7,
      },
    ],
  },
  {
    id: 'third',
    trimesterTitle: 'THIRD TRIMESTER',
    weeksLabel: '(Weeks 28–40)',
    dotColor: '#0D9488',
    textColor: '#0D9488',
    plans: [
      {
        id: 't3_ni_veg',
        cuisine: 'North Indian',
        dietType: 'VEG',
        title: 'North Indian',
        subtitle: 'Vegetarian Diet',
        image: require('@/assets/images/diet/north_indian_veg.png'),
        mealsCount: 7,
      },
      {
        id: 't3_si_veg',
        cuisine: 'South Indian',
        dietType: 'VEG',
        title: 'South Indian',
        subtitle: 'Vegetarian Diet',
        image: require('@/assets/images/diet/south_indian_veg.png'),
        mealsCount: 7,
      },
      {
        id: 't3_ni_nonveg',
        cuisine: 'North Indian',
        dietType: 'NON-VEG',
        title: 'North Indian',
        subtitle: 'Non-Veg Diet',
        image: require('@/assets/images/diet/north_indian_nonveg.png'),
        mealsCount: 7,
      },
      {
        id: 't3_si_nonveg',
        cuisine: 'South Indian',
        dietType: 'NON-VEG',
        title: 'South Indian',
        subtitle: 'Non-Veg Diet',
        image: require('@/assets/images/diet/south_indian_nonveg.png'),
        mealsCount: 7,
      },
    ],
  },
];

export default function PregnancyDietChartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const topPadding = Math.max(insets.top, 28) + 8;

  // Filter trimesters and plans based on query
  const filteredData = TRIMESTER_DATA.map((trimester) => {
    if (!searchQuery.trim()) return trimester;
    const filteredPlans = trimester.plans.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.dietType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...trimester, plans: filteredPlans };
  }).filter((t) => t.plans.length > 0);

  const openPlanDetail = (plan: DietPlan, trimesterId: string) => {
    router.push({
      pathname: '/diet-detail',
      params: {
        planId: plan.id,
        trimesterId: trimesterId,
        cuisine: plan.cuisine,
        dietType: plan.dietType,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pregnancy Diet Chart</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowSearch((prev) => !prev)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.searchBtn}
        >
          {showSearch ? (
            <X size={20} color="#1E293B" strokeWidth={2.4} />
          ) : (
            <Search size={20} color="#1E293B" strokeWidth={2.4} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search Input Bar (if toggled) */}
      {showSearch && (
        <View style={styles.searchInputContainer}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            placeholder="Search diets (veg, non-veg, south, north)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
      >
        {/* Top Hero Banner: Eat well. Grow strong. 🌸 */}
        <View style={styles.heroBanner}>
          <Image
            source={require('@/assets/images/diet/diet_hero_banner.png')}
            style={styles.heroBannerImage}
            resizeMode="cover"
          />
          {/* Subtle gradient vignette overlay for perfect text contrast */}
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Eat well. Grow strong. 🌸</Text>
            <Text style={styles.heroSubtitle}>Personalized for Indian mamas</Text>
          </View>
        </View>

        {/* Trimester Sections */}
        {filteredData.map((trimester) => (
          <View key={trimester.id} style={styles.trimesterSection}>
            {/* Trimester Header */}
            <View style={styles.trimesterHeaderRow}>
              <View style={[styles.trimesterDot, { backgroundColor: trimester.dotColor }]} />
              <Text style={[styles.trimesterTitle, { color: trimester.textColor }]}>
                {trimester.trimesterTitle}
              </Text>
              <Text style={styles.weeksLabel}>{trimester.weeksLabel}</Text>
            </View>

            {/* 2x2 Grid of Diet Plans */}
            <View style={styles.gridContainer}>
              {trimester.plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  activeOpacity={0.85}
                  onPress={() => openPlanDetail(plan, trimester.id)}
                  style={[styles.dietCard, { width: CARD_WIDTH }]}
                >
                  {/* Food Image with Veg / Non-Veg Badge */}
                  <View style={styles.cardImageWrapper}>
                    <Image source={plan.image} style={styles.cardImage} resizeMode="cover" />
                    {/* Badge */}
                    <View
                      style={[
                        styles.dietBadge,
                        {
                          backgroundColor:
                            plan.dietType === 'VEG' ? '#00C950' : '#F86C0D',
                        },
                      ]}
                    >
                      <Text style={styles.dietBadgeText}>
                        {plan.dietType === 'VEG' ? '🌱 VEG' : '🍗 NON-VEG'}
                      </Text>
                    </View>
                  </View>

                  {/* Card Content */}
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {plan.title}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      {plan.subtitle}
                    </Text>
                    <Text style={styles.viewPlanLink}>View plan ›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FAF9F6',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  searchBtn: {
    padding: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    marginLeft: 8,
    padding: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  heroBanner: {
    height: 88,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(131, 24, 67, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  heroTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginTop: 2,
  },
  trimesterSection: {
    marginBottom: 20,
  },
  trimesterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trimesterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  trimesterTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  weeksLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginLeft: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dietCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardImageWrapper: {
    height: 82,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  dietBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  dietBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  viewPlanLink: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#EC4899',
    marginTop: 6,
  },
});
