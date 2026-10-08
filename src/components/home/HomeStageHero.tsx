import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import {
  ArrowRight,
  Lightbulb,
  Pencil,
  Sparkles,
  Heart,
  Calendar,
  Check,
} from 'lucide-react-native';
import { PregnancyStage } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

const RING_SIZE = 114;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS = 0.84;
const STROKE_DASH_OFFSET = CIRCUMFERENCE * (1 - PROGRESS);

export interface HomeStageHeroProps {
  stage?: PregnancyStage | null;
  onStageChange?: (newStage: PregnancyStage) => void;
}

export function HomeStageHero({ stage = 'pregnant', onStageChange }: HomeStageHeroProps) {
  const router = useRouter();
  const currentStage: PregnancyStage = stage || 'pregnant';

  return (
    <View style={styles.heroOuterContainer}>
      {/* 1. Stage Switcher Chips - Quick toggle for testing/viewing all 3 stages */}
      <View style={styles.stageSwitcherRow}>
        {(['pregnant', 'mother', 'conceive'] as PregnancyStage[]).map((st) => {
          const isActive = currentStage === st;
          const label = st === 'pregnant' ? 'Pregnancy' : st === 'mother' ? 'Post Pregnancy' : 'Try To Conceive';
          return (
            <TouchableOpacity
              key={st}
              activeOpacity={0.8}
              onPress={() => onStageChange?.(st)}
              style={[
                styles.stageChip,
                isActive && styles.stageChipActive,
                isActive && st === 'mother' && { backgroundColor: '#10B981' },
                isActive && st === 'conceive' && { backgroundColor: '#0284C7' },
              ]}
            >
              <Text
                style={[
                  styles.stageChipText,
                  isActive && styles.stageChipTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. Stage-Specific Hero Content & Gradients */}
      {currentStage === 'mother' ? (
        /* ==================== MOTHER STAGE HERO (Exact to screenshot) ==================== */
        <View style={styles.motherSectionWrapper}>
          {/* Multi-tone Pastel Background Gradient */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="motherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#EBF2FE" stopOpacity="0.9" />
                <Stop offset="35%" stopColor="#FFF1EB" stopOpacity="0.8" />
                <Stop offset="70%" stopColor="#EAF8F0" stopOpacity="0.65" />
                <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0.1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#motherGrad)" />
          </Svg>

          <View style={styles.sectionInnerContent}>
            {/* Circular Baby Avatar with Coral Ring & Edit Pencil */}
            <View style={styles.avatarCenterRow}>
              <View style={styles.babyAvatarContainer}>
                <Image
                  source={require('@/assets/images/home/mother_baby.jpg')}
                  style={styles.babyAvatarImage}
                  contentFit="cover"
                />
                {/* Floating Edit Icon Badge */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => router.push('/(tabs)/profile')}
                  style={styles.editPencilBadge}
                >
                  <Pencil size={13} color="#1E293B" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Baby Title & Age */}
            <Text style={styles.motherBabyTitle}>Baby</Text>
            <Text style={styles.motherAgeTitle}>6 weeks old</Text>
            <Text style={styles.motherDateRange}>Mar 31, 2020 - Apr 6, 2020</Text>

            {/* Two Measurement Pill Cards (Ideal Height & Ideal Weight) */}
            <View style={styles.pillsRow}>
              {/* Left Pill: Ideal Height */}
              <View style={styles.measurementPill}>
                <Text style={styles.pillLabel}>IDEAL HEIGHT</Text>
                <Text style={styles.pillValue}>46.3-53.4 cm</Text>
              </View>

              {/* Right Pill: Ideal Weight */}
              <View style={styles.measurementPill}>
                <Text style={styles.pillLabel}>IDEAL WEIGHT</Text>
                <Text style={styles.pillValue}>2.5-4.3 kg</Text>
              </View>
            </View>

            {/* Baby Says This Week */}
            <View style={styles.babySaysContainer}>
              <Text style={styles.babySaysHeader}>Baby says this week</Text>
              <Text style={styles.babySaysQuote}>
                It's only been a week... but I knew I can rely on you. I can recognize your voice, and the familiarity helps me adjust to the strange new world outside the womb i....
              </Text>
            </View>

            {/* Daily Utility CTA */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/practical-tools')}
              style={styles.dailyUtilityBtn}
            >
              <Text style={styles.dailyUtilityText}>Check out my daily utility</Text>
              <ArrowRight size={14} color="#EE4D38" />
            </TouchableOpacity>
          </View>
        </View>
      ) : currentStage === 'conceive' ? (
        /* ==================== CONCEIVE STAGE HERO (Exact to screenshot) ==================== */
        <View style={styles.motherSectionWrapper}>
          {/* Multi-tone Pastel Background Gradient (Matching Mother & Conceive) */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="conceiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#EBF2FE" stopOpacity="0.9" />
                <Stop offset="35%" stopColor="#FFF1EB" stopOpacity="0.8" />
                <Stop offset="70%" stopColor="#EAF8F0" stopOpacity="0.65" />
                <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0.1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#conceiveGrad)" />
          </Svg>

          <View style={styles.sectionInnerContent}>
            {/* Center Circular Card with Coral Ring, Flower & Pregnancy Chance */}
            <View style={styles.avatarCenterRow}>
              <View style={styles.conceiveRingContainer}>
                <Image
                  source={require('@/assets/images/home/conceive_flower_final.png')}
                  style={styles.conceiveFlowerImage}
                  contentFit="contain"
                />
                <Text style={styles.pregnancyChanceLabel}>Pregnancy Chance</Text>
                <Text style={styles.pregnancyChanceValue}>Low</Text>
              </View>
            </View>

            {/* Baby Title */}
            <Text style={styles.conceiveBabyTitle}>Baby</Text>

            {/* Two Measurement / Metric Cards */}
            <View style={styles.conceiveCardsRow}>
              {/* Left Card: Next Period */}
              <View style={styles.conceiveMetricCard}>
                <View style={styles.conceiveCardHeader}>
                  <Calendar size={18} color="#EE4D38" />
                </View>
                <Text style={styles.conceiveCardLabel}>Next Period</Text>
                <Text style={styles.conceiveCardValue}>13 Feb</Text>
                <Text style={styles.conceiveCardSub}>in 3 days</Text>
              </View>

              {/* Right Card: Ovulation */}
              <View style={styles.conceiveMetricCard}>
                <View style={styles.conceiveCardHeader}>
                  <Sparkles size={18} color="#EAB308" fill="#FDE047" />
                </View>
                <Text style={styles.conceiveCardLabel}>Ovulation</Text>
                <Text style={styles.conceiveCardValue}>13 Feb</Text>
                <Text style={styles.conceiveCardSub}>in 3 days</Text>
              </View>
            </View>

            {/* Daily Utility CTA */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/practical-tools')}
              style={styles.dailyUtilityBtn}
            >
              <Text style={styles.dailyUtilityText}>Check out my daily utility</Text>
              <ArrowRight size={14} color="#EE4D38" />
            </TouchableOpacity>

            {/* Action Buttons Row (Calendar & End Period) */}
            <View style={styles.conceiveActionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/practical-tools')}
                style={styles.calendarBtn}
              >
                <Calendar size={16} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.calendarBtnText}>Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/record-symptoms')}
                style={styles.endPeriodBtn}
              >
                <Check size={16} color="#EE4D38" strokeWidth={2.8} />
                <Text style={styles.endPeriodBtnText}>End Period</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        /* ==================== PREGNANT STAGE HERO (Default) ==================== */
        <View style={styles.pregnantSectionWrapper}>
          {/* Warm Peach/Coral Gradient */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="pregnancySectionGrad" x1="0%" y1="0%" x2="65%" y2="100%">
                <Stop offset="0%" stopColor="#F9D7D2" stopOpacity="0.85" />
                <Stop offset="30%" stopColor="#FBDCD5" stopOpacity="0.65" />
                <Stop offset="65%" stopColor="#FCECE7" stopOpacity="0.4" />
                <Stop offset="90%" stopColor="#FAF4F0" stopOpacity="0.2" />
                <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#pregnancySectionGrad)" />
          </Svg>

          <View style={styles.sectionInnerContent}>
            {/* Top row with Circular Progress Bar Ring & Week counter */}
            <View style={styles.pregnantTopRow}>
              <View style={styles.ringWrapper}>
                <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ringSvg}>
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RADIUS}
                    stroke="#FFD5CE"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                  />
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RADIUS}
                    stroke="#EE4D38"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${CIRCUMFERENCE}`}
                    strokeDashoffset={STROKE_DASH_OFFSET}
                    strokeLinecap="round"
                    fill="none"
                  />
                </Svg>

                {/* Inner Circle with 3D Embryo */}
                <View style={styles.embryoCircle}>
                  <Image
                    source={require('@/assets/images/Pregnancy/a0a1b968baee556452621adcbab5b8d20f0bfba6.png')}
                    style={styles.embryoImage}
                  />
                </View>
              </View>

              <View style={styles.weekTextCol}>
                <Text style={styles.weekLabel}>Your Pregnancy Week</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={styles.weekCount}>3 Week </Text>
                  <Text style={styles.dayCount}>& 6 Days</Text>
                </View>
              </View>
            </View>

            {/* Middle Section: Look Mumma text & Large Corn Sticker */}
            <View style={styles.lookMummaRow}>
              <View style={{ maxWidth: '64%', paddingRight: 6 }}>
                <Text style={styles.lookMummaTitle}>Look Mumma!</Text>
                <Text style={styles.lookMummaSubtitle}>I am as big as a Corn cob</Text>
                <Text style={styles.lookMummaDesc}>
                  Mummy, I'm as long as the ear of a corn. My nostrils are opening now for &quot;practice breathing&quot;; I'll go through the same motions of real breathing but in...
                </Text>
              </View>

              <Image
                source={require('@/assets/images/Pregnancy/52a39d847aabe17092f752bea2422ccd6b3631fe (1).png')}
                style={styles.cornSticker}
                contentFit="contain"
              />
            </View>

            {/* Daily Utility CTA */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/practical-tools')}
              style={styles.dailyUtilityBtn}
            >
              <Text style={styles.dailyUtilityText}>Check out my daily utility</Text>
              <ArrowRight size={14} color="#EE4D38" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 3. Today's Tips Card (Common across stages with cute baby illustration) */}
      <View style={styles.tipsCardContainer}>
        <View style={{ maxWidth: '64%' }}>
          <View style={styles.tipsHeaderRow}>
            <Lightbulb size={18} color="#F59E0B" fill="#FDE68A" />
            <Text style={styles.tipsTitle}>Today tips</Text>
          </View>

          <Text style={styles.tipsDescription}>
            {currentStage === 'mother'
              ? 'Try some gentle pelvic tilts today to relieve lower back pressure and improve circulation.'
              : currentStage === 'conceive'
              ? 'Nourish your body with folate and vitamin E rich foods today to support healthy ovulation.'
              : 'Try some gentle pelvic tilts today to relieve lower back pressure and improve circulation.'}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/today-tips')}
              style={{ marginRight: 20 }}
            >
              <Text style={styles.moreTipsLink}>More Tips</Text>
            </TouchableOpacity>
            <Pressable>
              <Text style={styles.shareLink}>Share</Text>
            </Pressable>
          </View>
        </View>

        {/* Baby sleeping on cloud sticker */}
        <Image
          source={require('@/assets/images/Pregnancy/45f37be85427b6d3faf0be40074ba3dd086c5cd9.gif')}
          style={styles.babyCloudSticker}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroOuterContainer: {
    width: '100%',
  },
  stageSwitcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
    backgroundColor: '#FAF9F6',
    gap: 8,
  },
  stageChip: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stageChipActive: {
    backgroundColor: '#EE4D38',
    borderColor: 'transparent',
  },
  stageChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  stageChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  motherSectionWrapper: {
    width: '100%',
    position: 'relative',
    paddingTop: 16,
    paddingBottom: 22,
  },
  pregnantSectionWrapper: {
    width: '100%',
    position: 'relative',
    paddingTop: 16,
    paddingBottom: 22,
  },
  sectionInnerContent: {
    paddingHorizontal: 20,
  },
  avatarCenterRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  babyAvatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3.5,
    borderColor: '#EE4D38',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  babyAvatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editPencilBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  motherBabyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  motherAgeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 2,
  },
  motherDateRange: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  measurementPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  pillValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 3,
  },
  babySaysContainer: {
    marginTop: 2,
  },
  babySaysHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  babySaysQuote: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
  dailyUtilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  dailyUtilityText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#EE4D38',
    marginRight: 4,
  },
  pregnantTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSvg: {
    position: 'absolute',
    transform: [{ rotate: '-120deg' }],
  },
  embryoCircle: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: '#351713',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  embryoImage: {
    width: 98,
    height: 98,
    borderRadius: 49,
  },
  weekTextCol: {
    flex: 1,
    marginLeft: 16,
  },
  weekLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  weekCount: {
    fontSize: 25,
    fontWeight: '800',
    color: '#EE4D38',
    letterSpacing: -0.3,
  },
  dayCount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#EE4D38',
  },
  lookMummaRow: {
    marginTop: 16,
    minHeight: 140,
    justifyContent: 'center',
  },
  lookMummaTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  lookMummaSubtitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E1E1E',
    marginTop: 3,
  },
  lookMummaDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 6,
  },
  cornSticker: {
    position: 'absolute',
    right: 4,
    top: -6,
    width: 80,
    height: 100,
  },
  conceiveRingContainer: {
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 3.5,
    borderColor: '#FF7060',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  conceiveFlowerImage: {
    width: 50,
    height: 24,
    marginBottom: 4,
  },
  pregnancyChanceLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  pregnancyChanceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#EE4D38',
    textAlign: 'center',
    marginTop: 1,
  },
  conceiveBabyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  conceiveCardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  conceiveMetricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  conceiveCardHeader: {
    marginBottom: 6,
  },
  conceiveCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  conceiveCardValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E1E1E',
    marginTop: 2,
  },
  conceiveCardSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  conceiveActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 14,
  },
  calendarBtn: {
    flex: 1,
    backgroundColor: '#EE4D38',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  calendarBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  endPeriodBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EE4D38',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endPeriodBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EE4D38',
    marginLeft: 6,
  },
  tipsCardContainer: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    minHeight: 145,
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EE4D38',
    marginLeft: 6,
  },
  tipsDescription: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    marginBottom: 14,
  },
  moreTipsLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#EE4D38',
    textDecorationLine: 'underline',
  },
  shareLink: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  babyCloudSticker: {
    position: 'absolute',
    right: 6,
    bottom: -25,
    width: 95,
    height: 100,
  },
});
