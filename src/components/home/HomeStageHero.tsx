import React, { useState, useMemo } from 'react';
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
import { PregnancyStage, useAppStore } from '@/store/useAppStore';
import { DatePickerModal } from '@/components/ui/DatePickerModal';

const { width } = Dimensions.get('window');
const HERO_CARD_HEIGHT = 270;

const RING_SIZE = 92;
const STROKE_WIDTH = 5;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS = 0.84;
const STROKE_DASH_OFFSET = CIRCUMFERENCE * (1 - PROGRESS);

const STAGE_FLEX: Record<PregnancyStage, number> = {
  conceive: 1.25,
  pregnant: 0.95,
  mother: 1.2,
  explore: 0.8,
};

export interface HomeStageHeroProps {
  stage?: PregnancyStage | null;
  onStageChange?: (newStage: PregnancyStage) => void;
}

export function HomeStageHero({ stage = 'pregnant', onStageChange }: HomeStageHeroProps) {
  const router = useRouter();
  const currentStage: PregnancyStage = stage || 'pregnant';
  const { pregnancyData, setPregnancyData } = useAppStore();
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Dynamically compute Next Period and Ovulation estimates based on Last Period Date
  const nextPeriodInfo = useMemo(() => {
    if (!pregnancyData.lastPeriodDate) {
      return { nextDateStr: '13 Feb', daysSub: 'in 3 days', ovDateStr: '13 Feb', ovSub: 'in 3 days' };
    }
    const parts = pregnancyData.lastPeriodDate.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      const lpd = new Date(y, m, d);
      if (!isNaN(lpd.getTime())) {
        const nextPeriod = new Date(lpd);
        nextPeriod.setDate(nextPeriod.getDate() + 28);

        const ovulation = new Date(lpd);
        ovulation.setDate(ovulation.getDate() + 14);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diffNpDays = Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const diffOvDays = Math.ceil((ovulation.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const npDateStr = `${nextPeriod.getDate()} ${shortMonths[nextPeriod.getMonth()]}`;
        const ovDateStr = `${ovulation.getDate()} ${shortMonths[ovulation.getMonth()]}`;

        const npSub = diffNpDays === 0 ? 'Today' : diffNpDays > 0 ? `in ${diffNpDays} days` : `${Math.abs(diffNpDays)} days ago`;
        const ovSub = diffOvDays === 0 ? 'Today' : diffOvDays > 0 ? `in ${diffOvDays} days` : `${Math.abs(diffOvDays)} days ago`;

        return { nextDateStr: npDateStr, daysSub: npSub, ovDateStr, ovSub };
      }
    }
    return { nextDateStr: '13 Feb', daysSub: 'in 3 days', ovDateStr: '13 Feb', ovSub: 'in 3 days' };
  }, [pregnancyData.lastPeriodDate]);

  return (
    <View style={styles.heroOuterContainer}>
      {/* 1. Stage Switcher Chips - Proportional flex row with proper padding */}
      <View style={styles.stageSwitcherContainer}>
        <View style={styles.stageSwitcherRow}>
          {(['conceive', 'pregnant', 'mother', 'explore'] as PregnancyStage[]).map((st) => {
            const isActive = currentStage === st;
            const label =
              st === 'conceive'
                ? 'Try To Conceive'
                : st === 'pregnant'
                ? 'Pregnancy'
                : st === 'mother'
                ? 'Post Pregnancy'
                : 'IUI, IVF';
            return (
              <TouchableOpacity
                key={st}
                activeOpacity={0.8}
                onPress={() => onStageChange?.(st)}
                style={[
                  styles.stageChip,
                  { flex: STAGE_FLEX[st] },
                  isActive && styles.stageChipActive,
                  isActive && st === 'mother' && { backgroundColor: '#10B981' },
                  isActive && st === 'conceive' && { backgroundColor: '#0284C7' },
                  isActive && st === 'explore' && { backgroundColor: '#8B5CF6' },
                ]}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
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
              <Text numberOfLines={2} style={styles.babySaysQuote}>
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
              <ArrowRight size={14} color="#e62a09" />
            </TouchableOpacity>
          </View>
        </View>
      ) : currentStage === 'conceive' || currentStage === 'explore' ? (
        /* ==================== CONCEIVE & IUI, IVF STAGE HERO ==================== */
        <View style={styles.motherSectionWrapper}>
          {/* Multi-tone Pastel Background Gradient */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="conceiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={currentStage === 'explore' ? "#F3E8FF" : "#EBF2FE"} stopOpacity="0.9" />
                <Stop offset="35%" stopColor={currentStage === 'explore' ? "#FAF5FF" : "#FFF1EB"} stopOpacity="0.8" />
                <Stop offset="70%" stopColor={currentStage === 'explore' ? "#F5F3FF" : "#EAF8F0"} stopOpacity="0.65" />
                <Stop offset="100%" stopColor="#FAF9F6" stopOpacity="0.1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#conceiveGrad)" />
          </Svg>

          <View style={styles.sectionInnerContent}>
            {/* Horizontal Section: Circle Card on Left + 2 Cards on Right */}
            <View style={styles.conceiveHeroHorizontalRow}>
              {/* Left Side: White Card with Red Circle and Baby label */}
              <View style={styles.conceiveLeftCircleCard}>
                <View style={styles.conceiveRingContainer}>
                  <Image
                    source={
                      currentStage === 'explore'
                        ? require('@/assets/images/stages/explore.png')
                        : require('@/assets/images/home/conceive_flower_final.png')
                    }
                    style={styles.conceiveFlowerImage}
                    contentFit="contain"
                  />
                  <Text style={styles.pregnancyChanceLabel}>
                    {currentStage === 'explore' ? 'Fertility Chance' : 'Pregnancy Chance'}
                  </Text>
                  <Text style={styles.pregnancyChanceValue}>
                    {currentStage === 'explore' ? 'High' : 'Low'}
                  </Text>
                </View>
                <Text style={styles.conceiveBabyTitle}>
                  {currentStage === 'explore' ? 'Fertility' : 'Baby'}
                </Text>
              </View>

              {/* Right Side: 2 Metric Cards Stacked Vertically */}
              <View style={styles.conceiveRightCardsCol}>
                {/* Top Card: Next Period */}
                <View style={styles.conceiveMetricCard}>
                  <View style={styles.conceiveCardHeader}>
                    <Calendar size={18} color="#e62a09" />
                  </View>
                  <Text style={styles.conceiveCardLabel}>Next Period</Text>
                  <Text style={styles.conceiveCardValue}>{nextPeriodInfo.nextDateStr}</Text>
                  <Text style={styles.conceiveCardSub}>{nextPeriodInfo.daysSub}</Text>
                </View>

                {/* Bottom Card: Ovulation */}
                <View style={styles.conceiveMetricCard}>
                  <View style={styles.conceiveCardHeader}>
                    <Sparkles size={18} color="#EAB308" fill="#FDE047" />
                  </View>
                  <Text style={styles.conceiveCardLabel}>Ovulation</Text>
                  <Text style={styles.conceiveCardValue}>{nextPeriodInfo.ovDateStr}</Text>
                  <Text style={styles.conceiveCardSub}>{nextPeriodInfo.ovSub}</Text>
                </View>
              </View>
            </View>

            {/* Daily Utility CTA */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/practical-tools')}
              style={styles.dailyUtilityBtn}
            >
              <Text style={styles.dailyUtilityText}>Check out my daily utility</Text>
              <ArrowRight size={14} color="#e62a09" />
            </TouchableOpacity>

            {/* Action Buttons Row (Calendar & End Period) */}
            <View style={styles.conceiveActionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCalendarModal(true)}
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
                <Check size={16} color="#e62a09" strokeWidth={2.8} />
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
                    stroke="#e62a09"
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
              <ArrowRight size={14} color="#e62a09" />
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
              : currentStage === 'conceive' || currentStage === 'explore'
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

      {/* Date Picker Calendar Modal for Try to Conceive Stage */}
      <DatePickerModal
        visible={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        selectedDate={pregnancyData.lastPeriodDate}
        onConfirm={(dateStr) => {
          setPregnancyData({ lastPeriodDate: dateStr });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroOuterContainer: {
    width: '100%',
  },
  stageSwitcherContainer: {
    backgroundColor: '#FAF9F6',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
  },
  stageSwitcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  stageChip: {
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageChipActive: {
    backgroundColor: '#e62a09',
    borderColor: 'transparent',
  },
  stageChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  stageChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  motherSectionWrapper: {
    width: '100%',
    height: HERO_CARD_HEIGHT,
    position: 'relative',
    paddingTop: 8,
    paddingBottom: 10,
  },
  pregnantSectionWrapper: {
    width: '100%',
    height: HERO_CARD_HEIGHT,
    position: 'relative',
    paddingTop: 8,
    paddingBottom: 10,
  },
  sectionInnerContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  avatarCenterRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  babyAvatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#e62a09',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#e62a09',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  babyAvatarImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  editPencilBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  motherBabyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  motherAgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 1,
  },
  motherDateRange: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 3,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 3,
  },
  measurementPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  pillLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  pillValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 1,
  },
  babySaysContainer: {
    marginTop: 0,
  },
  babySaysHeader: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 1,
  },
  babySaysQuote: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14.5,
  },
  dailyUtilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  dailyUtilityText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#e62a09',
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
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#351713',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  embryoImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  weekTextCol: {
    flex: 1,
    marginLeft: 14,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 2,
  },
  weekCount: {
    fontSize: 21,
    fontWeight: '800',
    color: '#e62a09',
    letterSpacing: -0.3,
  },
  dayCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e62a09',
  },
  lookMummaRow: {
    marginTop: 6,
    minHeight: 90,
    justifyContent: 'center',
  },
  lookMummaTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  lookMummaSubtitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E1E1E',
    marginTop: 1,
  },
  lookMummaDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 3,
  },
  cornSticker: {
    position: 'absolute',
    right: 4,
    top: -4,
    width: 68,
    height: 84,
  },
  conceiveHeroHorizontalRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
    marginTop: 2,
    height: 172,
  },
  conceiveLeftCircleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  conceiveRingContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FF7060',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    shadowColor: '#e62a09',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  conceiveFlowerImage: {
    width: 36,
    height: 18,
    marginBottom: 1,
  },
  pregnancyChanceLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  pregnancyChanceValue: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#e62a09',
    textAlign: 'center',
    marginTop: 1,
  },
  conceiveBabyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 6,
  },
  conceiveRightCardsCol: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 8,
  },
  conceiveMetricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  conceiveCardHeader: {
    marginBottom: 2,
  },
  conceiveCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  conceiveCardValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E1E',
    marginTop: 1,
  },
  conceiveCardSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 1,
  },
  conceiveActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 6,
  },
  calendarBtn: {
    flex: 1,
    backgroundColor: '#e62a09',
    borderRadius: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e62a09',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  endPeriodBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#e62a09',
    borderRadius: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endPeriodBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#e62a09',
    marginLeft: 6,
  },
  tipsCardContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    minHeight: 105,
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e62a09',
    marginLeft: 5,
  },
  tipsDescription: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 15,
    marginBottom: 8,
  },
  moreTipsLink: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#e62a09',
    textDecorationLine: 'underline',
  },
  shareLink: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  babyCloudSticker: {
    position: 'absolute',
    right: 4,
    bottom: -16,
    width: 78,
    height: 82,
  },
});
