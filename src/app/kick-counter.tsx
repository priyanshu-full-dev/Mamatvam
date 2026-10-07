import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import {
  ArrowLeft,
  Info,
  X,
  Plus,
  Minus,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react-native';

// Custom Smiling Baby Face Badge Icon
function BabyFacePinkIcon({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head circle */}
      <Circle cx="12" cy="12" r="9.5" stroke="#E11D48" strokeWidth={1.8} />
      {/* Hair swirl */}
      <Path
        d="M12 2.5C11.5 4 12 5 13.5 5.5C14.5 5.8 15 5.2 15 4.5"
        stroke="#E11D48"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* Eyes */}
      <Circle cx="9" cy="11.5" r="1.1" fill="#E11D48" />
      <Circle cx="15" cy="11.5" r="1.1" fill="#E11D48" />
      {/* Cheeks */}
      <Circle cx="7.5" cy="13.5" r="1" fill="#FDA4AF" />
      <Circle cx="16.5" cy="13.5" r="1" fill="#FDA4AF" />
      {/* Smile */}
      <Path
        d="M9.5 15C10.5 16.5 13.5 16.5 14.5 15"
        stroke="#E11D48"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 🍳 Breakfast Pan Icon
function BreakfastIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="10" r="7" stroke="#1E293B" strokeWidth={2.2} fill="#F8FAFC" />
      <Path d="M15 15L21 21" stroke="#1E293B" strokeWidth={2.8} strokeLinecap="round" />
      {/* Sunny side egg */}
      <Circle cx="10" cy="10" r="3.2" fill="#F59E0B" />
      <Circle cx="9.2" cy="9.2" r="0.8" fill="#FEF3C7" />
    </Svg>
  );
}

// 🍱 Lunch Box / Meal Icon
function LunchIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="18" height="14" rx="3" stroke="#1E293B" strokeWidth={2} fill="#FEE2E2" />
      <Path d="M3 12H21" stroke="#1E293B" strokeWidth={1.5} />
      <Path d="M12 5V19" stroke="#1E293B" strokeWidth={1.5} />
      <Circle cx="7.5" cy="8.5" r="1.8" fill="#EA580C" />
      <Circle cx="16.5" cy="8.5" r="1.8" fill="#16A34A" />
      <Rect x="5" y="14" width="5" height="3" rx="1" fill="#F59E0B" />
      <Rect x="14" y="14" width="5" height="3" rx="1" fill="#EF4444" />
    </Svg>
  );
}

// 🌙 Dinner Moon Icon
function DinnerMoonIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.5 14.5C19.5 15.5 18 16 16.5 16C12.3579 16 9 12.6421 9 8.5C9 6.8 9.5 5.3 10.5 4C6.2 5 3 8.8 3 13.5C3 18.7467 7.25329 23 12.5 23C16.8 23 20.4 19.8 21.2 15.6C21 15.2 20.8 14.8 20.5 14.5Z"
        fill="#FACC15"
      />
      <Circle cx="18" cy="7" r="1" fill="#FDE047" />
    </Svg>
  );
}

const PAST_HISTORY_DATA = [
  { date: 'Feb 13', breakfast: 7, lunch: 10, dinner: 15 },
  { date: 'Feb 14', breakfast: 5, lunch: 8, dinner: 12 },
  { date: 'Feb 15', breakfast: 3, lunch: 10, dinner: 9 },
  { date: 'Feb 16', breakfast: 2, lunch: 9, dinner: 14 },
  { date: 'Feb 17', breakfast: 6, lunch: 11, dinner: 6 },
  { date: 'Feb 18', breakfast: 3, lunch: 3, dinner: 7 },
];

export default function KickCounterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Counts for each meal window
  const [breakfastKicks, setBreakfastKicks] = useState(0);
  const [lunchKicks, setLunchKicks] = useState(0);
  const [dinnerKicks, setDinnerKicks] = useState(0);

  const [showInfoModal, setShowInfoModal] = useState(false);

  const totalKicks = breakfastKicks + lunchKicks + dinnerKicks;
  const targetKicks = 10;
  const kicksNeeded = Math.max(0, targetKicks - totalKicks);

  // Dynamic Today label formatted like Image 1: 'Today — Feb 19'
  const todayLabel = 'Today — ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Safe top padding to clear camera punch holes and notches on Android and iOS
  const topPadding = Math.max(insets.top, 28) + 10;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: Math.max(insets.bottom, 24) + 20 },
        ]}
      >
        {/* Top Radiant Hero Banner with 100% Native LinearGradient */}
        <LinearGradient
          colors={['#F73698', '#FE5F81']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroContentRow}>
            {/* Back Button */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>

            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text style={styles.heroTitle}>Baby Kick Counter</Text>
              <Text style={styles.heroSubtitle}>Daily Fetal Movement Tracker</Text>
            </View>

            {/* Info Button */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setShowInfoModal(true)}
              style={styles.infoButton}
              accessibilityRole="button"
              accessibilityLabel="Tracker info"
            >
              <Info size={19} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Today's Total Kicks Card */}
        <View style={styles.totalSummaryCard}>
          <View style={styles.babyBadge}>
            <BabyFacePinkIcon size={26} />
          </View>

          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.totalSummaryTitle}>
              Today's Total Kicks
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
              <Text style={styles.totalSummaryCount}>
                {totalKicks}{' '}
              </Text>
              <Text style={styles.totalSummaryUnit}>
                movements
              </Text>
            </View>
            <Text style={[
              styles.totalSummaryHint,
              { color: kicksNeeded > 0 ? '#94A3B8' : '#10B981' }
            ]}>
              {kicksNeeded > 0 ? `${kicksNeeded} more kicks needed` : 'Daily goal reached! 🎉'}
            </Text>
          </View>
        </View>

        {/* Section: Today — Date */}
        <Text style={styles.sectionHeader}>{todayLabel}</Text>

        {/* 1. After Breakfast Card */}
        <View style={[styles.mealCard, { backgroundColor: '#FFFDF5', borderColor: '#FEF08A' }]}>
          <View style={styles.mealIconWrapper}>
            <BreakfastIcon size={28} />
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.mealTitle, { color: '#B45309' }]}>After Breakfast</Text>
            <Text style={styles.mealHint}>Tap + to record a kick</Text>
          </View>

          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setBreakfastKicks((prev) => Math.max(0, prev - 1))}
              style={styles.minusBtn}
            >
              <Minus size={16} color="#64748B" strokeWidth={2.5} />
            </TouchableOpacity>

            <Text style={[styles.countText, { color: '#B45309' }]}>{breakfastKicks}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setBreakfastKicks((prev) => prev + 1)}
              style={[styles.plusBtn, { backgroundColor: '#F59E0B' }]}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. After Lunch Card */}
        <View style={[styles.mealCard, { backgroundColor: '#FFFBF5', borderColor: '#FED7AA' }]}>
          <View style={styles.mealIconWrapper}>
            <LunchIcon size={28} />
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.mealTitle, { color: '#C2410C' }]}>After Lunch</Text>
            <Text style={styles.mealHint}>Tap + to record a kick</Text>
          </View>

          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setLunchKicks((prev) => Math.max(0, prev - 1))}
              style={styles.minusBtn}
            >
              <Minus size={16} color="#64748B" strokeWidth={2.5} />
            </TouchableOpacity>

            <Text style={[styles.countText, { color: '#C2410C' }]}>{lunchKicks}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setLunchKicks((prev) => prev + 1)}
              style={[styles.plusBtn, { backgroundColor: '#EA580C' }]}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. After Dinner Card */}
        <View style={[styles.mealCard, { backgroundColor: '#FFF5F7', borderColor: '#FECDD3' }]}>
          <View style={styles.mealIconWrapper}>
            <DinnerMoonIcon size={28} />
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.mealTitle, { color: '#BE123C' }]}>After Dinner</Text>
            <Text style={styles.mealHint}>Tap + to record a kick</Text>
          </View>

          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDinnerKicks((prev) => Math.max(0, prev - 1))}
              style={styles.minusBtn}
            >
              <Minus size={16} color="#64748B" strokeWidth={2.5} />
            </TouchableOpacity>

            <Text style={[styles.countText, { color: '#BE123C' }]}>{dinnerKicks}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setDinnerKicks((prev) => prev + 1)}
              style={[styles.plusBtn, { backgroundColor: '#F43F5E' }]}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: History Header */}
        <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionHeaderNoMargin}>History</Text>

          <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.last7DaysText}>
              Last 7 days
            </Text>
            <ChevronDown size={14} color="#E11D48" />
          </TouchableOpacity>
        </View>

        {/* History Table Card */}
        <View style={styles.historyTableContainer}>
          {/* Table Header Pink Pill */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, { width: '25%', textAlign: 'left', paddingLeft: 8 }]}>DATE</Text>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>After{'\n'}Breakfast</Text>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>After{'\n'}Lunch</Text>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>After{'\n'}Dinner</Text>
          </View>

          {/* Row 1: Today Dynamic Highlight Row */}
          <View style={styles.tableTodayRow}>
            <Text style={[styles.tableCell, { width: '25%', textAlign: 'left', paddingLeft: 8, fontWeight: '700', color: '#E11D48' }]}>
              Today
            </Text>
            <Text style={[styles.tableCell, { width: '25%', fontWeight: '800', color: '#E11D48' }]}>
              {breakfastKicks}
            </Text>
            <Text style={[styles.tableCell, { width: '25%', fontWeight: '800', color: '#E11D48' }]}>
              {lunchKicks}
            </Text>
            <Text style={[styles.tableCell, { width: '25%', fontWeight: '800', color: '#E11D48' }]}>
              {dinnerKicks}
            </Text>
          </View>

          {/* Past History Rows */}
          {PAST_HISTORY_DATA.map((row, idx) => (
            <View
              key={idx}
              style={[
                styles.tableRow,
                {
                  backgroundColor: idx % 2 === 1 ? '#F8FAFC' : '#FFFFFF',
                  borderBottomWidth: idx === PAST_HISTORY_DATA.length - 1 ? 0 : 1,
                },
              ]}
            >
              <Text style={[styles.tableCell, { width: '25%', textAlign: 'left', paddingLeft: 8, color: '#475569', fontWeight: '500' }]}>
                {row.date}
              </Text>
              <Text style={[styles.tableCell, { width: '25%', color: '#334155' }]}>
                {row.breakfast}
              </Text>
              <Text style={[styles.tableCell, { width: '25%', color: '#334155' }]}>
                {row.lunch}
              </Text>
              <Text style={[styles.tableCell, { width: '25%', color: '#334155' }]}>
                {row.dinner}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Info Guidance Modal */}
      <Modal visible={showInfoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <CheckCircle2 size={20} color="#E11D48" />
                </View>
                <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>How to Count Kicks</Text>
              </View>
              <TouchableOpacity onPress={() => setShowInfoModal(false)} style={{ padding: 4 }}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: '#475569', lineHeight: 19 }}>
              • Choose a quiet time after eating, as babies are most active after meals.{'\n'}
              • Sit comfortably or lie on your left side with pillows for support.{'\n'}
              • Count every distinct kick, roll, swish, or flutter.{'\n'}
              • A normal healthy pattern is at least 10 movements within 2 hours.{'\n'}
              • If you notice a significant decrease in movement, reach out to your doctor or midwife right away.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowInfoModal(false)}
              style={styles.infoCloseBtn}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  heroBanner: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginTop: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 16,
  },
  babyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalSummaryTitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  totalSummaryCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E11D48',
  },
  totalSummaryUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E11D48',
  },
  totalSummaryHint: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 6,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionHeaderNoMargin: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  mealCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  mealIconWrapper: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTitle: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  mealHint: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minusBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  countText: {
    fontSize: 22,
    fontWeight: '800',
    width: 38,
    textAlign: 'center',
  },
  historyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 12,
  },
  last7DaysText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
    marginRight: 2,
  },
  historyTableContainer: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    backgroundColor: '#FFFFFF',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 20,
  },
  tableHeaderRow: {
    backgroundColor: '#F43F5E',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  tableTodayRow: {
    backgroundColor: '#FFF5F7',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableCell: {
    fontSize: 13,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  infoModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  infoCloseBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },
});
