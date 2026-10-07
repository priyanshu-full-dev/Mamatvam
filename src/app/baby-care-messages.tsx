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

export type CategoryId = 'bathing' | 'massage' | 'skincare' | 'diaper';

export interface TipItem {
  id: string;
  badge: string;
  emoji: string;
  title: string;
  fullDesc: string;
  shortDesc: string;
}

export interface CategoryData {
  id: CategoryId;
  label: string;
  emoji: string;
  activeColor: string;
  inactiveBg: string;
  inactiveBorder: string;
  inactiveText: string;
  gradColors: [string, string];
  tipsHeader: string;
  tips: TipItem[];
}

const CATEGORIES: CategoryData[] = [
  {
    id: 'bathing',
    label: 'Bathing',
    emoji: '🛁',
    activeColor: '#0EA5E9',
    inactiveBg: '#F0F9FF',
    inactiveBorder: '#BAE6FD',
    inactiveText: '#0284C7',
    gradColors: ['#00B4D8', '#1E88E5'],
    tipsHeader: 'All Bathing Tips',
    tips: [
      {
        id: 'b_1',
        badge: 'Temperature',
        emoji: '🌡️',
        title: 'Perfect Water Temperature',
        fullDesc:
          'Always test bathwater with your elbow — it should feel comfortably warm (36–38°C), not hot. Newborns cannot regulate body temperature well.',
        shortDesc: 'Always test bathwater with your elbow — it should feel comfo...',
      },
      {
        id: 'b_2',
        badge: 'Timing',
        emoji: '⏱️',
        title: 'Best Time to Bathe Baby',
        fullDesc:
          'Avoid bathing right after a feed to prevent spitting up. The best time is 30 minutes before evening bedtime or during alert daytime.',
        shortDesc: 'Avoid bathing right after a feed. Best time is 30 minutes be...',
      },
      {
        id: 'b_3',
        badge: 'Safety',
        emoji: '🧒',
        title: "Support Baby's Head",
        fullDesc:
          "Always keep one secure hand under baby's head and neck at all times. Use a non-slip contoured bath insert or infant tub.",
        shortDesc: "Always keep one hand under baby's head and neck. Use a non-s...",
      },
      {
        id: 'b_4',
        badge: 'Skincare',
        emoji: '🧴',
        title: 'Gentle Baby Products Only',
        fullDesc:
          'Use fragrance-free, pH-neutral, tear-free baby wash and shampoo sparingly (2–3 times weekly is plenty). Avoid strong soaps.',
        shortDesc: 'Use fragrance-free, pH-neutral, tear-free baby wash and sham...',
      },
      {
        id: 'b_5',
        badge: 'Cord Care',
        emoji: '🏳️',
        title: 'Until Cord Falls Off',
        fullDesc:
          'Until the umbilical cord stump falls off naturally (1–3 weeks), give sponge baths only. Keep the cord area clean, dry, and exposed to air.',
        shortDesc: 'Until the umbilical cord stump falls off (1–3 weeks), give o...',
      },
    ],
  },
  {
    id: 'massage',
    label: 'Massage',
    emoji: '🤲',
    activeColor: '#D97706',
    inactiveBg: '#FFFBEB',
    inactiveBorder: '#FDE68A',
    inactiveText: '#D97706',
    gradColors: ['#F59E0B', '#EA580C'],
    tipsHeader: 'All Massage Tips',
    tips: [
      {
        id: 'm_1',
        badge: 'Oil Choice',
        emoji: '🫒',
        title: 'Safe Natural Oils Only',
        fullDesc:
          'Use pure cold-pressed coconut or sweet almond oil. Do a 24-hour patch test on baby’s forearm first before full massage.',
        shortDesc: 'Use pure cold-pressed coconut or almond oil for soft skin...',
      },
      {
        id: 'm_2',
        badge: 'Colic Relief',
        emoji: '🌀',
        title: 'I-Love-U Tummy Strokes',
        fullDesc:
          'Gentle clockwise circular strokes on the lower belly help release trapped gas bubbles and soothe evening colic restlessness.',
        shortDesc: 'Gentle clockwise strokes on lower belly ease trapped gas...',
      },
      {
        id: 'm_3',
        badge: 'Duration',
        emoji: '⏰',
        title: '10–15 Minutes Max',
        fullDesc:
          'Keep sessions short (10–15 mins). Watch baby’s cues: if they avert their gaze, arch their back, or cry, pause and comfort them.',
        shortDesc: 'Keep sessions calm and brief; stop if baby shows distress...',
      },
      {
        id: 'm_4',
        badge: 'Touch',
        emoji: '🦶',
        title: 'Foot & Reflexology Strokes',
        fullDesc:
          'Gently stroke the soles from heel to toes. This relaxes the central nervous system and prepares baby for deeper sleep.',
        shortDesc: 'Stroke soles and toes to relax the nervous system deeply...',
      },
      {
        id: 'm_5',
        badge: 'Warmth',
        emoji: '☀️',
        title: 'Warm, Draft-Free Room',
        fullDesc:
          'Warm your hands by rubbing them together before touching baby. Ensure room temperature is comfortably warm (24–26°C).',
        shortDesc: 'Warm hands first and keep room draft-free and peaceful...',
      },
    ],
  },
  {
    id: 'skincare',
    label: 'Skin Care',
    emoji: '✨',
    activeColor: '#E11D48',
    inactiveBg: '#FFF1F2',
    inactiveBorder: '#FECDD3',
    inactiveText: '#E11D48',
    gradColors: ['#F43F5E', '#BE123C'],
    tipsHeader: 'All Skin Care Tips',
    tips: [
      {
        id: 's_1',
        badge: 'Hydration',
        emoji: '🧴',
        title: '3-Minute Moisture Rule',
        fullDesc:
          'Apply pediatric moisturizer within 3 minutes of patting dry to lock in bath hydration and protect the natural skin barrier.',
        shortDesc: 'Apply gentle lotion within 3 minutes of bath to lock moisture...',
      },
      {
        id: 's_2',
        badge: 'Scalp Care',
        emoji: '👶',
        title: 'Gentle Cradle Cap Care',
        fullDesc:
          'Massage a few drops of coconut oil into flaky scalp patches for 15 mins, then gently brush with a soft baby bristle brush.',
        shortDesc: 'Soft coconut oil soak and gentle bristle brush for cradle cap...',
      },
      {
        id: 's_3',
        badge: 'Drying',
        emoji: '🧽',
        title: 'Pat Dry Skin Folds',
        fullDesc:
          'Never rub delicate skin. Gently pat dry, paying close attention to chubby folds behind ears, neck, armpits, and thighs.',
        shortDesc: 'Pat gently dry with soft muslin, especially neck & thigh folds...',
      },
      {
        id: 's_4',
        badge: 'Fabrics',
        emoji: '👕',
        title: '100% Breathable Cotton',
        fullDesc:
          'Dress baby in soft, pre-washed breathable cotton fabrics. Wash baby clothes with fragrance-free, hypoallergenic detergent.',
        shortDesc: 'Dress in soft breathable cotton; use hypoallergenic wash...',
      },
      {
        id: 's_5',
        badge: 'Sun Safety',
        emoji: '🌤️',
        title: 'Early Morning Sun Only',
        fullDesc:
          'Direct harsh sun should be avoided under 6 months. Gentle early morning sunlight (5–10 mins before 8 AM) is ideal.',
        shortDesc: 'Brief early morning sunlight only; protect from mid-day rays...',
      },
    ],
  },
  {
    id: 'diaper',
    label: 'Diapering',
    emoji: '🩲',
    activeColor: '#7C3AED',
    inactiveBg: '#F5F3FF',
    inactiveBorder: '#DDD6FE',
    inactiveText: '#7C3AED',
    gradColors: ['#8B5CF6', '#6D28D9'],
    tipsHeader: 'All Diapering Tips',
    tips: [
      {
        id: 'd_1',
        badge: 'Prevention',
        emoji: '🛡️',
        title: 'Zinc Barrier Ointment',
        fullDesc:
          'Apply a thin coat of zinc oxide diaper cream at each change to shield sensitive skin from acidic wetness and friction.',
        shortDesc: 'Apply zinc barrier cream at every change to block moisture...',
      },
      {
        id: 'd_2',
        badge: 'Healing',
        emoji: '💨',
        title: 'Daily Diaper-Free Time',
        fullDesc:
          'Allow 15–20 minutes of diaper-free air time daily on a waterproof mat. Fresh circulating air is the fastest healer.',
        shortDesc: '15–20 mins of daily diaper-free air time heals skin fastest...',
      },
      {
        id: 'd_3',
        badge: 'Hygiene',
        emoji: '🧼',
        title: 'Wipe Front to Back',
        fullDesc:
          'Always clean gently from front to back using warm water or alcohol-free, 99% pure water wipes to prevent bacterial transfer.',
        shortDesc: 'Always wipe front-to-back using warm water or gentle wipes...',
      },
      {
        id: 'd_4',
        badge: 'Frequency',
        emoji: '⏰',
        title: 'Change Every 2–3 Hours',
        fullDesc:
          'Change diapers promptly after every bowel movement and every 2–3 hours during daytime to prevent bacterial skin breakdown.',
        shortDesc: 'Change promptly after poops and every 2–3 hours during day...',
      },
      {
        id: 'd_5',
        badge: 'Fit',
        emoji: '📏',
        title: 'Two Finger Fit Rule',
        fullDesc:
          'Fasten diaper so two adult fingers slide comfortably under waistband. If you see red pressure marks, size up.',
        shortDesc: 'Ensure two fingers fit under waistband; size up if marks show...',
      },
    ],
  },
];

export default function BabyCareMessagesScreen() {
  const router = useRouter();
  const [selectedCatId, setSelectedCatId] = useState<CategoryId>('bathing');
  const [activeTipIndex, setActiveTipIndex] = useState<number>(0);

  const currentCat = CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];
  const tips = currentCat.tips;
  const activeTip = tips[activeTipIndex] || tips[0];

  const handleSelectCategory = (catId: CategoryId) => {
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

        <Text style={styles.headerTitle}>Baby Care Messages</Text>

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
              {activeTipIndex + 1} / {tips.length}
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
    shadowColor: '#00B4D8',
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
  tipCardCurrent: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
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
  tipCardTitleCurrent: {
    color: '#0284C7',
  },
  tipCardDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
});
