


import { LinearGradient } from 'expo-linear-gradient';
import {
  Info,
  Minus,
  Plus,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// Water Droplet Icon
function DropletIcon({ size = 16, color = '#FFFFFF', filled = true }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        stroke={color}
        strokeWidth={filled ? 0 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Double Water Droplet Hero Icon
function HeroWaterDropPairIcon({ size = 30 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Primary larger droplet */}
      <Path
        d="M23 11C23 11 17 19 17 23C17 26.3137 19.6863 29 23 29C26.3137 29 29 26.3137 29 23C29 19 23 11 23 11Z"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Secondary smaller droplet */}
      <Path
        d="M13 18C13 18 9 23.5 9 26.5C9 28.7091 10.7909 30.5 13 30.5C15.2091 30.5 17 28.7091 17 26.5C17 23.5 13 18 13 18Z"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 8 Clinical Urine Levels
const URINE_LEVELS = [
  // Healthy Pee (Levels 1-3)
  {
    level: 1,
    color: '#FFFFF0',
    title: 'Very Clear',
    status: 'Possibly over-hydrated',
    statusColor: '#64748B',
    group: 'healthy',
  },
  {
    level: 2,
    color: '#F5F5DC',
    title: 'Pale Yellow',
    status: 'Well hydrated!',
    statusColor: '#16A34A',
    group: 'healthy',
  },
  {
    level: 3,
    color: '#E8E472',
    title: 'Light Yellow',
    status: 'Good hydration',
    statusColor: '#65A30D',
    group: 'healthy',
  },
  // Drink More (Levels 4-8)
  {
    level: 4,
    color: '#F0C040',
    title: 'Yellow',
    status: 'Drink a bit more',
    statusColor: '#D97706',
    group: 'warning',
  },
  {
    level: 5,
    color: '#E8A820',
    title: 'Dark Yellow',
    status: 'Getting dehydrated',
    statusColor: '#EA580C',
    group: 'warning',
  },
  {
    level: 6,
    color: '#D48910',
    title: 'Amber',
    status: 'Dehydrated! Drink water',
    statusColor: '#DC2626',
    group: 'warning',
  },
  {
    level: 7,
    color: '#B86A08',
    title: 'Dark Amber',
    status: 'Very dehydrated!',
    statusColor: '#DC2626',
    group: 'warning',
  },
  {
    level: 8,
    color: '#8B4500',
    title: 'Brown/Orange',
    status: 'See your doctor!',
    statusColor: '#B91C1C',
    group: 'warning',
  },
];

export default function HydrationTrackerScreen() {
  const insets = useSafeAreaInsets();
  const [glasses, setGlasses] = useState(3);
  const [showGuide, setShowGuide] = useState(true);

  const targetGlasses = 8;
  const remaining = Math.max(0, targetGlasses - glasses);

  // Safe top padding to clear Android camera punch-holes and iOS notches
  const topPadding = Math.max(insets.top, 28) + 10;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
      >
        {/* Top Radiant Hero Banner */}
        <LinearGradient
          colors={['#06A6F5', '#4CA2FE']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.heroTitle}>Hydration Tracker</Text>
              <Text style={styles.heroSubtitle}>Pee color & water intake</Text>
            </View>

            {/* Droplets Hero Badge */}
            <View style={styles.heroIconBadge}>
              <HeroWaterDropPairIcon size={32} />
            </View>
          </View>
        </LinearGradient>

        {/* Today's Water Intake Card */}
        <View style={styles.intakeCard}>
          <Text style={styles.intakeHeaderTitle}>Today's Water Intake</Text>

          {/* Stepper & Live Glass Counter */}
          <View style={styles.stepperRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setGlasses((prev) => Math.max(0, prev - 1))}
              style={styles.minusBtn}
            >
              <Minus size={18} color="#0284C7" strokeWidth={2.8} />
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginHorizontal: 20 }}>
              <Text style={styles.countNumber}>{glasses}</Text>
              <Text style={styles.countSubtext}>of 8 glasses</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setGlasses((prev) => prev + 1)}
              style={styles.plusBtn}
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {/* 8 Water Glass / Droplet Badges */}
          <View style={styles.dropletsContainer}>
            {/* Row 1: 7 Droplets */}
            <View style={styles.dropletsRow}>
              {[1, 2, 3, 4, 5, 6, 7].map((glassIndex) => {
                const isFilled = glassIndex <= glasses;
                return (
                  <TouchableOpacity
                    key={glassIndex}
                    activeOpacity={0.75}
                    onPress={() => setGlasses(glassIndex === glasses ? glassIndex - 1 : glassIndex)}
                    style={[
                      styles.dropletBadge,
                      isFilled ? styles.dropletFilled : styles.dropletEmpty,
                    ]}
                  >
                    <DropletIcon
                      size={15}
                      color={isFilled ? '#FFFFFF' : '#38BDF8'}
                      filled={isFilled}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Row 2: 8th Droplet Centered */}
            <View style={styles.dropletCenterRow}>
              {(() => {
                const isFilled = 8 <= glasses;
                return (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setGlasses(8 === glasses ? 7 : 8)}
                    style={[
                      styles.dropletBadge,
                      isFilled ? styles.dropletFilled : styles.dropletEmpty,
                    ]}
                  >
                    <DropletIcon
                      size={15}
                      color={isFilled ? '#FFFFFF' : '#38BDF8'}
                      filled={isFilled}
                    />
                  </TouchableOpacity>
                );
              })()}
            </View>
          </View>

          {/* Goal Status Pill */}
          <View style={styles.goalPill}>
            <Text style={styles.goalPillText}>
              {remaining > 0
                ? `${remaining} more glasses to reach your daily goal`
                : 'Daily goal reached! Great job! 🎉'}
            </Text>
          </View>
        </View>

        {/* Section: Urine Color Guide */}
        <View style={styles.guideHeaderRow}>
          <Text style={styles.guideSectionTitle}>Urine Color Guide</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowGuide((prev) => !prev)}>
            <Text style={styles.hideGuideText}>
              {showGuide ? 'Hide guide' : 'Show guide'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Urine Color Guide Card */}
        {showGuide && (
          <View style={styles.guideCard}>
            {/* Group 1: Healthy Pee Banner */}
            <View style={styles.healthyBanner}>
              <Text style={styles.healthyBannerText}>HEALTHY PEE 💧</Text>
              <Text style={styles.healthyLevelsText}>Levels 1–3</Text>
            </View>

            {/* Healthy Levels (1 to 3) */}
            {URINE_LEVELS.filter((item) => item.group === 'healthy').map((item, idx) => (
              <View
                key={item.level}
                style={[
                  styles.levelRow,
                  { borderBottomWidth: idx === 2 ? 0 : 1 },
                ]}
              >
                <Text style={styles.levelNumber}>{item.level}</Text>
                <View
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: item.color },
                    item.level <= 2 && { borderWidth: 1, borderColor: '#E2E8F0' },
                  ]}
                />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.levelTitle}>{item.title}</Text>
                  <Text style={[styles.levelStatus, { color: item.statusColor }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            ))}

            {/* Group 2: Drink More Banner */}
            <View style={styles.warningBanner}>
              <Text style={styles.warningBannerText}>DRINK MORE 🚨</Text>
              <Text style={styles.warningLevelsText}>Levels 4–8</Text>
            </View>

            {/* Warning Levels (4 to 8) */}
            {URINE_LEVELS.filter((item) => item.group === 'warning').map((item, idx, arr) => (
              <View
                key={item.level}
                style={[
                  styles.levelRow,
                  { borderBottomWidth: idx === arr.length - 1 ? 0 : 1 },
                ]}
              >
                <Text style={styles.levelNumber}>{item.level}</Text>
                <View style={[styles.colorSwatch, { backgroundColor: item.color }]} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.levelTitle}>{item.title}</Text>
                  <Text style={[styles.levelStatus, { color: item.statusColor }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Educational Tip Card */}
        <View style={styles.tipCard}>
          <Info size={19} color="#0284C7" strokeWidth={2.2} style={{ marginTop: 2, marginRight: 10 }} />
          <Text style={styles.tipCardText}>
            During pregnancy, aim for <Text style={{ fontWeight: '700' }}>8–10 glasses</Text> (2–2.5L) of water daily. Good hydration reduces swelling, prevents UTIs, and supports your baby's development.
          </Text>
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
  scrollContent: {
    paddingHorizontal: 16,
  },
  heroBanner: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroRow: {
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
  heroIconBadge: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intakeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0F2FE',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 20,
  },
  intakeHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  minusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0284C7',
    lineHeight: 38,
  },
  countSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  dropletsContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  dropletsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dropletCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  dropletBadge: {
    width: 32,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropletFilled: {
    backgroundColor: '#0284C7',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
  },
  dropletEmpty: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0F2FE',
  },
  goalPill: {
    backgroundColor: '#F0F9FF',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'center',
  },
  goalPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0284C7',
    textAlign: 'center',
  },
  guideHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  guideSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  hideGuideText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0F2FE',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 18,
  },
  healthyBanner: {
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  healthyBannerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.2,
  },
  healthyLevelsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#60A5FA',
  },
  warningBanner: {
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  warningBannerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.2,
  },
  warningLevelsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F87171',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#F1F5F9',
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    width: 22,
  },
  colorSwatch: {
    width: 58,
    height: 26,
    borderRadius: 8,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  levelStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  tipCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipCardText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 18,
  },
});
