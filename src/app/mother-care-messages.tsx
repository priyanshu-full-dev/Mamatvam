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
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type MotherCategoryId = 'week1_2' | 'week3_6' | 'physical' | 'emotional';

export interface MotherTipItem {
  id: string;
  badge: string;
  emoji: string;
  title: string;
  fullDesc: string;
  shortDesc: string;
}

export interface MotherCategoryData {
  id: MotherCategoryId;
  label: string;
  emoji: string;
  activeColor: string;
  inactiveBg: string;
  inactiveBorder: string;
  inactiveText: string;
  gradColors: [string, string];
  tipsHeader: string;
  tips: MotherTipItem[];
}

const CATEGORIES: MotherCategoryData[] = [
  {
    id: 'week1_2',
    label: 'Week 1–2',
    emoji: '🌸',
    activeColor: '#E11D48',
    inactiveBg: '#FFF1F2',
    inactiveBorder: '#FECDD3',
    inactiveText: '#E11D48',
    gradColors: ['#FF2A85', '#E11D48'],
    tipsHeader: 'All Week 1–2 Tips',
    tips: [
      {
        id: 'w1_1',
        badge: 'Postpartum Week 1–2 · Recovery',
        emoji: '🩹',
        title: 'Rest is Non-Negotiable',
        fullDesc:
          'Your body just did something extraordinary. Sleep when baby sleeps. Avoid lifting anything heavier than your baby. Accept all help offered to you.',
        shortDesc: 'Your body just did something extraordinary. Sleep when baby sleep...',
      },
      {
        id: 'w1_2',
        badge: 'Bleeding & Uterus',
        emoji: '🩸',
        title: 'Lochia is Normal',
        fullDesc:
          'Postpartum bleeding (lochia) can last up to 6 weeks, starting bright red and fading to pink, brown, and yellowish-white. Report sudden heavy clots.',
        shortDesc: 'Postpartum bleeding (lochia) can last up to 6 weeks, starting bri...',
      },
      {
        id: 'w1_3',
        badge: 'Hydration',
        emoji: '💧',
        title: 'Drink, Drink, Drink',
        fullDesc:
          'Breastfeeding requires an extra 500ml of water daily. Keep a large insulated water bottle beside your nursing station and sip during every feed.',
        shortDesc: 'Breastfeeding requires an extra 500ml of water daily. Keep a larg...',
      },
      {
        id: 'w1_4',
        badge: 'Nutrition',
        emoji: '🥗',
        title: 'Eat to Heal & Feed',
        fullDesc:
          'Focus on iron-rich foods (leafy greens, dal, eggs) to recover blood loss, plus high-protein and warm soups to promote milk supply and wound repair.',
        shortDesc: 'Focus on iron-rich foods (leafy greens, dal, eggs) to recover blo...',
      },
      {
        id: 'w1_5',
        badge: 'Supplements',
        emoji: '💊',
        title: 'Keep Taking Your Vitamins',
        fullDesc:
          'Continue prenatal vitamins or switch to postnatal vitamins. Breastfeeding draws calcium, vitamin D, and iron directly from your body reserves.',
        shortDesc: 'Continue prenatal vitamins or switch to postnatal vitamins. Breas...',
      },
    ],
  },
  {
    id: 'week3_6',
    label: 'Week 3–6',
    emoji: '🌿',
    activeColor: '#059669',
    inactiveBg: '#ECFDF5',
    inactiveBorder: '#A7F3D0',
    inactiveText: '#059669',
    gradColors: ['#10B981', '#059669'],
    tipsHeader: 'All Week 3–6 Tips',
    tips: [
      {
        id: 'w2_1',
        badge: 'Gentle Mobility',
        emoji: '🚶‍♀️',
        title: 'Short Gentle Walks',
        fullDesc:
          'Start with 10–15 minute stroller walks in fresh air. It boosts circulation, helps prevent blood clots, and lifts mood without straining the pelvic floor.',
        shortDesc: 'Start 10–15 min calm walks to boost circulation and elevate mood...',
      },
      {
        id: 'w2_2',
        badge: 'Pelvic Floor',
        emoji: '🧘',
        title: 'Gentle Kegel Exercises',
        fullDesc:
          'Begin gentle pelvic floor contractions (Kegels) to strengthen perineal muscles and bladder control. Never strain or hold your breath.',
        shortDesc: 'Rebuild core & pelvic muscles with gentle daily contraction reps...',
      },
      {
        id: 'w2_3',
        badge: 'Feeding Comfort',
        emoji: '🤱',
        title: 'Latch & Nipple Care',
        fullDesc:
          'Sore nipples should improve once baby’s latch is deep. Express a drop of breast milk onto nipples or use medical-grade lanolin cream after nursing.',
        shortDesc: 'Ensure deep latch and apply soothing breast milk or lanolin...',
      },
      {
        id: 'w2_4',
        badge: 'Perineal Healing',
        emoji: '🛁',
        title: 'Warm Sitz Baths',
        fullDesc:
          'A warm sitz bath with Epsom salts or calendula 1–2 times a day reduces perineal swelling, eases hemorrhoids, and accelerates tissue repair.',
        shortDesc: 'Warm sitz soak eases swelling and speeds stitches healing...',
      },
      {
        id: 'w2_5',
        badge: 'Postpartum Check',
        emoji: '🩺',
        title: 'Prepare 6-Week Checkup',
        fullDesc:
          'Write down questions about incision healing, contraception, pelvic health, and exercise clearance before your routine 6-week postnatal checkup.',
        shortDesc: 'List questions about healing, birth control & exercise clearance...',
      },
    ],
  },
  {
    id: 'physical',
    label: 'Physical',
    emoji: '💪',
    activeColor: '#D97706',
    inactiveBg: '#FFFBEB',
    inactiveBorder: '#FDE68A',
    inactiveText: '#D97706',
    gradColors: ['#F59E0B', '#D97706'],
    tipsHeader: 'All Physical Care Tips',
    tips: [
      {
        id: 'p_1',
        badge: 'Posture',
        emoji: '🪑',
        title: 'Nursing Posture Alignment',
        fullDesc:
          'Bring baby to your breast, not your breast down to baby. Use supportive nursing pillows behind your lower back and beneath baby to avoid hunching.',
        shortDesc: 'Bring baby to breast using pillows to prevent neck & shoulder strain...',
      },
      {
        id: 'p_2',
        badge: 'Core Restoration',
        emoji: '🤸‍♀️',
        title: 'Diastasis Recti Check',
        fullDesc:
          'Avoid conventional sit-ups or crunches that worsen abdominal separation. Focus on diaphragmatic breathing and gentle transverse abdominis engagement.',
        shortDesc: 'Protect abdominal wall; avoid harsh crunches or heavy lifting...',
      },
      {
        id: 'p_3',
        badge: 'Incision Care',
        emoji: '🩹',
        title: 'C-Section Incision Care',
        fullDesc:
          'Keep incision site clean and dry. Watch for redness, warmth, increasing pain, or discharge. Wear high-waisted cotton briefs that don’t press against the scar.',
        shortDesc: 'Keep scar dry & clean; wear loose high-waist cotton underwear...',
      },
      {
        id: 'p_4',
        badge: 'Back & Spine',
        emoji: '💆‍♀️',
        title: 'Safe Baby Lifting Technique',
        fullDesc:
          'Bend your knees and lift from your legs and glutes, keeping baby close to your chest. Avoid twisting your spine while picking baby up from the crib.',
        shortDesc: 'Bend from knees not spine when lifting baby from crib or floor...',
      },
      {
        id: 'p_5',
        badge: 'Circulation',
        emoji: '🧦',
        title: 'Elevate Feet When Resting',
        fullDesc:
          'Postpartum fluid shifts often cause swelling in ankles and feet. Prop legs up on cushions whenever nursing or resting to assist lymphatic return.',
        shortDesc: 'Prop legs up on cushions during nursing to drain fluid swelling...',
      },
    ],
  },
  {
    id: 'emotional',
    label: 'Emotional',
    emoji: '💜',
    activeColor: '#7C3AED',
    inactiveBg: '#F5F3FF',
    inactiveBorder: '#DDD6FE',
    inactiveText: '#7C3AED',
    gradColors: ['#8B5CF6', '#6D28D9'],
    tipsHeader: 'All Emotional Care Tips',
    tips: [
      {
        id: 'e_1',
        badge: 'Hormonal Shifts',
        emoji: '💭',
        title: 'Baby Blues vs PPD',
        fullDesc:
          'Mild mood swings, tearfulness, and overwhelm are very common in days 3–14 (baby blues). If deep sadness lasts beyond 2 weeks, speak with your doctor.',
        shortDesc: 'Tearfulness in weeks 1–2 is normal; seek warm support if persistent...',
      },
      {
        id: 'e_2',
        badge: 'Boundaries',
        emoji: '🛑',
        title: 'Set Visitor Boundaries',
        fullDesc:
          'You do not owe anyone hosting duties. Limit visits to people who bring food, wash dishes, or let you nap. Protect your sacred recovery space.',
        shortDesc: 'Limit visits; prioritize resting and bonding over hosting guests...',
      },
      {
        id: 'e_3',
        badge: 'Self-Compassion',
        emoji: '💖',
        title: 'Drop Perfectionism',
        fullDesc:
          'Unfolded laundry and messy rooms are marks of a new mom doing her job. A fed, comforted baby and a resting mother are all that matters right now.',
        shortDesc: 'Let chores wait; your rest and baby’s bonding come first...',
      },
      {
        id: 'e_4',
        badge: 'Connection',
        emoji: '🤝',
        title: 'Share Feelings with Partner',
        fullDesc:
          'Talk openly about night-shift exhaustion, hormonal waves, and intimacy fears. Clear gentle communication prevents resentment and brings you closer.',
        shortDesc: 'Openly share exhaustion and feelings to stay closely connected...',
      },
      {
        id: 'e_5',
        badge: 'Me-Time',
        emoji: '☕',
        title: '5-Minute Daily Pause',
        fullDesc:
          'Take 5 minutes every day entirely for yourself: a warm quiet shower, a cup of warm tea, or slow deep breathing. You cannot pour from an empty cup.',
        shortDesc: 'Take 5 peaceful minutes daily for a warm shower or quiet tea...',
      },
    ],
  },
];

export default function MotherCareMessagesScreen() {
  const router = useRouter();
  const [selectedCatId, setSelectedCatId] = useState<MotherCategoryId>('week1_2');
  const [activeTipIndex, setActiveTipIndex] = useState<number>(0);

  const currentCat = CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];
  const tips = currentCat.tips;
  const activeTip = tips[activeTipIndex] || tips[0];

  const handleSelectCategory = (catId: MotherCategoryId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCatId(catId);
    setActiveTipIndex(0);
  };

  const handlePrevTip = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTipIndex((prev) => (prev > 0 ? prev - 1 : tips.length - 1));
  };

  const handleNextTip = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTipIndex((prev) => (prev < tips.length - 1 ? prev + 1 : 0));
  };

  const handleSelectTipItem = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTipIndex(idx);
  };

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

        <Text style={styles.headerTitle}>Mother Care Messages</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Horizontal Category Switcher Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCatId;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => handleSelectCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  isSelected
                    ? { backgroundColor: cat.activeColor, borderColor: cat.activeColor }
                    : { backgroundColor: cat.inactiveBg, borderColor: cat.inactiveBorder },
                ]}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected ? styles.categoryTextActive : { color: cat.inactiveText },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Carousel Card with Native LinearGradient */}
        <LinearGradient
          colors={currentCat.gradColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.carouselCard}
        >
          {/* Subtle Decorative Circle Overlay in Top-Right */}
          <View style={styles.cardGlowCircle} />

          {/* Top Row: Badge & Pagination Counter */}
          <View style={styles.cardTopRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{activeTip.badge}</Text>
            </View>

            <Text style={styles.counterText}>
              {activeTipIndex + 1}/{tips.length}
            </Text>
          </View>

          {/* Big Featured Emoji */}
          <Text style={styles.featuredEmoji}>{activeTip.emoji}</Text>

          {/* Featured Title */}
          <Text style={styles.featuredTitle}>{activeTip.title}</Text>

          {/* Featured Description */}
          <Text style={styles.featuredDesc}>{activeTip.fullDesc}</Text>

          {/* Bottom Carousel Controls: Prev, Dots, Next */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePrevTip}
              style={styles.controlBtn}
            >
              <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Pagination Dots */}
            <View style={styles.dotsRow}>
              {tips.map((_, dotIdx) => {
                const isDotActive = dotIdx === activeTipIndex;
                return (
                  <TouchableOpacity
                    key={dotIdx}
                    activeOpacity={0.7}
                    onPress={() => handleSelectTipItem(dotIdx)}
                    style={[
                      styles.dot,
                      isDotActive ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                );
              })}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleNextTip}
              style={styles.controlBtn}
            >
              <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Section Header */}
        <Text style={styles.sectionTitle}>{currentCat.tipsHeader}</Text>

        {/* Tips List */}
        <View style={styles.tipsListContainer}>
          {tips.map((tip, idx) => {
            const isCurrent = idx === activeTipIndex;
            return (
              <TouchableOpacity
                key={tip.id}
                activeOpacity={0.8}
                onPress={() => handleSelectTipItem(idx)}
                style={[
                  styles.tipCard,
                  isCurrent && {
                    backgroundColor: currentCat.inactiveBg,
                    borderColor: currentCat.inactiveBorder,
                  },
                ]}
              >
                <Text style={styles.tipCardEmoji}>{tip.emoji}</Text>

                <View style={styles.tipCardInfo}>
                  <Text
                    style={[
                      styles.tipCardTitle,
                      isCurrent && { color: currentCat.activeColor },
                    ]}
                  >
                    {tip.title}
                  </Text>
                  <Text style={styles.tipCardDesc} numberOfLines={1}>
                    {tip.shortDesc}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
    paddingBottom: 48,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  categoryEmoji: {
    fontSize: 15,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  carouselCard: {
    marginHorizontal: 16,
    borderRadius: 28,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#FF2A85',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  cardGlowCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 175,
    height: 175,
    borderRadius: 88,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  counterText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  featuredEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(255, 255, 255, 0.94)',
    marginBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 12,
  },
  tipsListContainer: {
    paddingHorizontal: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  tipCardEmoji: {
    fontSize: 24,
    marginRight: 14,
  },
  tipCardInfo: {
    flex: 1,
  },
  tipCardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  tipCardDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
});
