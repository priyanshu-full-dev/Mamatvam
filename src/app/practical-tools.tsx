import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppStore, PregnancyStage } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Circle,
  Ellipse,
} from 'react-native-svg';
import {
  ArrowLeft,
  X,
  Plus,
  Phone,
  HeartPulse,
  Check,
  Droplets,
  Activity,
  Briefcase,
  Apple,
  Moon,
  Milk,
  Heart,
  Baby,
  Shield,
  Sparkles,
  Calendar,
  Star,
  FlaskConical,
  CalendarClock,
  UploadCloud,
  BookOpen,
} from 'lucide-react-native';

// Custom Siren / Emergency Icon matching the design
function SirenIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2V4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M6 5L7.5 6.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M18 5L16.5 6.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path
        d="M7.5 17.5V13C7.5 10.5147 9.51472 8.5 12 8.5C14.4853 8.5 16.5 10.5147 16.5 13V17.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Path d="M5 17.5H19" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M7.5 21H16.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

// 1. Kick Counter: White baby footprint icon
function BabyFootprintWhiteIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="8" cy="4.8" rx="1.8" ry="2.2" transform="rotate(-15 8 4.8)" fill="#FFFFFF" />
      <Circle cx="12" cy="5.2" r="1.3" fill="#FFFFFF" />
      <Circle cx="15" cy="6.8" r="1.2" fill="#FFFFFF" />
      <Circle cx="17.5" cy="9.2" r="1.1" fill="#FFFFFF" />
      <Circle cx="19.2" cy="11.8" r="0.9" fill="#FFFFFF" />
      <Path
        d="M9.5 8.2C7 8.2 5.5 10 5.5 12.5C5.5 14.5 6.5 16 7.5 18C8.5 20 9 21.5 11 21.5C13 21.5 13.8 20 14.5 17.5C15.2 15 16 13.5 15.5 11C15 8.5 12 8.2 9.5 8.2Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// 2. Contractions: Contraction wave / pulse monitor line
function ContractionsWhiteIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 14H6.5L9 8L13 18L16 11L18 14H21"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="13" cy="18" r="1.5" fill="#FFFFFF" />
    </Svg>
  );
}

// 3. Hospital Bag: Maternity bag / suitcase with medical cross
function HospitalBagWhiteIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
        stroke="#FFFFFF"
        strokeWidth={2}
        fill="rgba(255,255,255,0.18)"
      />
      <Path d="M12 10.5V15.5M9.5 13H14.5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

// 4. Hydration: Water droplet with sparkle
function HydrationWhiteIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C12 3 6.5 10 6.5 14.5C6.5 17.5376 8.96243 20 12 20C15.0376 20 17.5 17.5376 17.5 14.5C17.5 10 12 3 12 3Z"
        fill="#FFFFFF"
      />
      <Path
        d="M9.5 14C9.5 12.5 11 11 12 10.5"
        stroke="rgba(6, 182, 212, 0.45)"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Reusable Vibrant Gradient Squircle Badge
function ColorfulBadge({
  gradientId,
  startColor,
  endColor,
  shadowColor,
  children,
  size = 54,
}: {
  gradientId: string;
  startColor: string;
  endColor: string;
  shadowColor: string;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        shadowColor: shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={startColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={endColor} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill={`url(#${gradientId})`} />
      </Svg>
      {children}
    </View>
  );
}

export default function PracticalToolsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const CARD_WIDTH = (width - 54) / 2;

  const { stage, setStage } = useAppStore();
  const { user } = useAuthStore();
  const currentStage: PregnancyStage =
    stage ||
    (user?.stage as PregnancyStage) ||
    (user?.name?.toLowerCase().includes('mother')
      ? 'mother'
      : user?.name?.toLowerCase().includes('conceive')
      ? 'conceive'
      : 'pregnant');

  const params = useLocalSearchParams<{ tool?: string }>();

  // Interactive States
  const [kickCount, setKickCount] = useState(10);
  const [hydrationLiters, setHydrationLiters] = useState(1.2);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    if (params.tool) {
      setActiveModal(params.tool);
    }
  }, [params.tool]);

  // Mother Interactive States
  const [tummyMinutes, setTummyMinutes] = useState(15);
  const [feedCount, setFeedCount] = useState(6);
  const [lastFeedSide, setLastFeedSide] = useState<'Left' | 'Right'>('Left');
  const [lastFeedTime, setLastFeedTime] = useState('45m ago');
  const [napCount, setNapCount] = useState(4);
  const [totalSleepHours, setTotalSleepHours] = useState(14.5);
  const [milestones, setMilestones] = useState({
    headLift: true,
    eyeFollow: true,
    grasping: true,
    smiling: true,
    kicking: false,
    handToMouth: false,
  });
  const [nutritionChecks, setNutritionChecks] = useState({
    warmFluids: true,
    calcium: true,
    ironProtein: false,
    galactagogues: true,
    postnatalVitamins: true,
  });

  const handleCallEmergency = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Emergency Helpline', `Calling ${number}`);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#F8FAFC',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -8,
          }}
        >
          <ArrowLeft size={24} color="#1E1E1E" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>
          Daily Utilities
        </Text>

        <View style={{ width: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#94A3B8' }} />
        </View>
      </View>

      {/* Stage Switcher Chips */}
      <View style={styles.stageSwitcherRow}>
        {(['pregnant', 'mother', 'conceive'] as PregnancyStage[]).map((st) => {
          const isActive = currentStage === st;
          const label = st === 'pregnant' ? 'Pregnant' : st === 'mother' ? 'Mother' : 'Conceive';
          return (
            <TouchableOpacity
              key={st}
              activeOpacity={0.8}
              onPress={() => setStage(st)}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 }}
      >
        {/* Section Heading: Daily Utilities */}
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1E1E1E', marginBottom: 16 }}>
          {currentStage === 'mother'
            ? 'Mother Daily Utilities'
            : currentStage === 'conceive'
            ? 'Daily Utilities'
            : 'Pregnancy Daily Utilities'}
        </Text>

        {currentStage === 'mother' ? (
          /* ================= MOTHER DAILY UTILITIES (6 TOOLS) ================= */
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* 1. Motor Skills */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/motor-skills')}
              style={[
                styles.utilityCard,
                { width: CARD_WIDTH, minHeight: 180, marginBottom: 14 },
              ]}
            >
              <ColorfulBadge
                gradientId="motorGrad"
                startColor="#F6349A"
                endColor="#EC4899"
                shadowColor="#F6349A"
              >
                <Star size={26} color="#FFFFFF" fill="#FFFFFF" />
              </ColorfulBadge>
              <Text style={styles.cardTitle}>Motor Skills</Text>
              <Text style={styles.cardSubtitle1}>Milestones Tracker</Text>
              <Text style={styles.cardSubtitle2}>3/25 milestones achieved</Text>
            </TouchableOpacity>

            {/* 2. Nutritional Values (Mother) */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/nutrition-values')}
              style={[
                styles.utilityCard,
                { width: CARD_WIDTH, minHeight: 180, marginBottom: 14 },
              ]}
            >
              <ColorfulBadge
                gradientId="nutritionGrad"
                startColor="#10B981"
                endColor="#059669"
                shadowColor="#10B981"
              >
                <Apple size={26} color="#FFFFFF" />
              </ColorfulBadge>
              <Text style={styles.cardTitle}>Nutrition Values</Text>
              <Text style={styles.cardSubtitle1}>Nutrients &amp; Food Guide</Text>
              <Text style={styles.cardSubtitle2}>0-6m · 6-12m · 1-2y</Text>
            </TouchableOpacity>

            {/* 3. Sleep Pattern */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/sleep-pattern')}
              style={[
                styles.utilityCard,
                { width: CARD_WIDTH, minHeight: 180, marginBottom: 14 },
              ]}
            >
              <ColorfulBadge
                gradientId="sleepGrad"
                startColor="#5B50F6"
                endColor="#4F46E5"
                shadowColor="#5B50F6"
              >
                <Moon size={26} color="#FFFFFF" />
              </ColorfulBadge>
              <Text style={styles.cardTitle}>Sleep Pattern</Text>
              <Text style={styles.cardSubtitle1}>Today's Sleep Log</Text>
              <Text style={styles.cardSubtitle2}>Nap &amp; Night Sleep</Text>
            </TouchableOpacity>

            {/* 4. Feed Pattern */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/feed-pattern')}
              style={[
                styles.utilityCard,
                { width: CARD_WIDTH, minHeight: 180, marginBottom: 14 },
              ]}
            >
              <ColorfulBadge
                gradientId="feedGrad"
                startColor="#FF2E79"
                endColor="#FF4B72"
                shadowColor="#FF2E79"
              >
                <Milk size={26} color="#FFFFFF" />
              </ColorfulBadge>
              <Text style={styles.cardTitle}>Feed Pattern</Text>
              <Text style={styles.cardSubtitle1}>Breast, Bottle &amp; Solid</Text>
              <Text style={styles.cardSubtitle2}>Feed Timeline</Text>
            </TouchableOpacity>

            {/* 5. Mother Care Messages */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/mother-care-messages')}
              style={[
                styles.utilityCard,
                { width: CARD_WIDTH, minHeight: 180, marginBottom: 14 },
              ]}
            >
              <ColorfulBadge
                gradientId="motherCareGrad"
                startColor="#EC4899"
                endColor="#F43F5E"
                shadowColor="#EC4899"
              >
                <Heart size={26} color="#FFFFFF" fill="#FFFFFF" />
              </ColorfulBadge>
              <Text style={styles.cardTitle}>Mother Care Messages</Text>
              <Text style={styles.cardSubtitle1}>Messages &amp; Rest</Text>
              <Text style={styles.cardSubtitle2}>Postpartum healing</Text>
            </TouchableOpacity>

            {/* 6. Baby Care Messages */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/baby-care-messages')}
              style={[
                styles.utilityCard,
                { width: CARD_WIDTH, minHeight: 180, marginBottom: 14 },
              ]}
            >
              <ColorfulBadge
                gradientId="babyCareGrad"
                startColor="#0284C7"
                endColor="#06B6D4"
                shadowColor="#0284C7"
              >
                <Baby size={26} color="#FFFFFF" />
              </ColorfulBadge>
              <Text style={styles.cardTitle}>Baby Care Messages</Text>
              <Text style={styles.cardSubtitle1}>Messages &amp; Tips</Text>
              <Text style={styles.cardSubtitle2}>Bathing, cord &amp; soothing</Text>
            </TouchableOpacity>
          </View>
        ) : currentStage === 'conceive' ? (
          /* ================= CONCEIVE DAILY UTILITIES (2 TOP + 1 FULL-WIDTH BOTTOM) ================= */
          <View>
            {/* Top Row: 2 Cards Side-by-Side */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
              {/* Card 1: Water Tracker (Top-Left) */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.push('/hydration-tracker')}
                style={{
                  width: (width - 40 - 12) / 2,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  paddingVertical: 20,
                  paddingHorizontal: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#F1F5F9',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.03,
                  shadowRadius: 6,
                  elevation: 1.5,
                  minHeight: 160,
                }}
              >
                <ExpoLinearGradient
                  colors={['#0284C7', '#38BDF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#0284C7',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>💧</Text>
                </ExpoLinearGradient>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '800',
                    color: '#0F172A',
                    textAlign: 'center',
                    marginTop: 12,
                  }}
                >
                  Water Tracker
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#94A3B8',
                    textAlign: 'center',
                    marginTop: 4,
                    lineHeight: 16,
                  }}
                >
                  Daily hydration, glasses &amp; goal tracking
                </Text>
              </TouchableOpacity>

              {/* Card 2: Ovulation Tracker (Top-Right) */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.push('/ovulation-tracker')}
                style={{
                  width: (width - 40 - 12) / 2,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  paddingVertical: 20,
                  paddingHorizontal: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#F1F5F9',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.03,
                  shadowRadius: 6,
                  elevation: 1.5,
                  minHeight: 160,
                }}
              >
                <ExpoLinearGradient
                  colors={['#8B5CF6', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#8B5CF6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>🌕</Text>
                </ExpoLinearGradient>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '800',
                    color: '#0F172A',
                    textAlign: 'center',
                    marginTop: 12,
                  }}
                >
                  Ovulation Tracker
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#94A3B8',
                    textAlign: 'center',
                    marginTop: 4,
                    lineHeight: 16,
                  }}
                >
                  Cycle calendar, fertile window &amp; phases
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Row: Full-Width Card (Fertility Guide) */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/fertility-guide')}
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                paddingVertical: 22,
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#F1F5F9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 6,
                elevation: 1.5,
                minHeight: 150,
              }}
            >
              <ExpoLinearGradient
                colors={['#FB7185', '#F43F5E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#F43F5E',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize: 24 }}>🌸</Text>
              </ExpoLinearGradient>

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '800',
                  color: '#0F172A',
                  textAlign: 'center',
                  marginTop: 12,
                }}
              >
                Fertility Guide
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#94A3B8',
                  textAlign: 'center',
                  marginTop: 4,
                  lineHeight: 16,
                }}
              >
                Foods, lifestyle &amp; when to get help
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ================= PREGNANCY DAILY UTILITIES (4 TOOLS) ================= */
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* Card 1: Kick Counter - Coral/Rose Gradient Badge */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/kick-counter')}
              style={[
                styles.utilityCard,
                {
                  width: CARD_WIDTH,
                  minHeight: 180,
                },
              ]}
            >
              <ColorfulBadge
                gradientId="kickGrad"
                startColor="#FF5B79"
                endColor="#FF8A65"
                shadowColor="#FF5B79"
              >
                <BabyFootprintWhiteIcon size={25} />
              </ColorfulBadge>

              <Text style={styles.cardTitle}>Kick Counter</Text>
              <Text style={styles.cardSubtitle1}>{kickCount} kicks recorded</Text>
              <Text style={styles.cardSubtitle2}>today • 2h ago</Text>
            </TouchableOpacity>

            {/* Card 2: Contractions - Royal Violet/Purple Gradient Badge */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setActiveModal('contractions')}
              style={[
                styles.utilityCard,
                {
                  width: CARD_WIDTH,
                  minHeight: 180,
                },
              ]}
            >
              <ColorfulBadge
                gradientId="contractionsGrad"
                startColor="#8B5CF6"
                endColor="#6366F1"
                shadowColor="#8B5CF6"
              >
                <ContractionsWhiteIcon size={24} />
              </ColorfulBadge>

              <Text style={styles.cardTitle}>Contractions</Text>
              <Text style={styles.cardSubtitle1}>Last: 5m apart • 15m</Text>
              <Text style={styles.cardSubtitle2}>ago</Text>
            </TouchableOpacity>

            {/* Card 3: Hospital Bag - Golden Amber/Orange Gradient Badge */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/hospital-bag')}
              style={[
                styles.utilityCard,
                {
                  width: CARD_WIDTH,
                  minHeight: 180,
                  marginTop: 14,
                },
              ]}
            >
              <ColorfulBadge
                gradientId="bagGrad"
                startColor="#F59E0B"
                endColor="#FBBF24"
                shadowColor="#F59E0B"
              >
                <HospitalBagWhiteIcon size={24} />
              </ColorfulBadge>

              <Text style={styles.cardTitle}>Hospital Bag</Text>
              <Text style={styles.cardSubtitle1}>0/27 items packed</Text>
            </TouchableOpacity>

            {/* Card 4: Hydration - Ocean Cyan/Sky Blue Gradient Badge */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/hydration-tracker')}
              style={[
                styles.utilityCard,
                {
                  width: CARD_WIDTH,
                  minHeight: 180,
                  marginTop: 14,
                },
              ]}
            >
              <ColorfulBadge
                gradientId="hydrationGrad"
                startColor="#06B6D4"
                endColor="#0284C7"
                shadowColor="#06B6D4"
              >
                <HydrationWhiteIcon size={24} />
              </ColorfulBadge>

              <Text style={styles.cardTitle}>Hydration</Text>
              <Text style={styles.cardSubtitle1}>3 of 8 glasses</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Section Heading: Support & Care */}
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1E1E1E', marginTop: 30, marginBottom: 14 }}>
          Support &amp; Care
        </Text>

        {/* Medical Contacts Card - Delicate Soft Coral Tint */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveModal('contacts')}
          style={{
            backgroundColor: '#FFE6E3',
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: '#FED7D4',
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 16.5, fontWeight: '700', color: '#1E1E1E' }}>
            Medical Contacts
          </Text>
          <Text style={{ fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 18 }}>
            Quick access to your midwife and care team
          </Text>
          <Text style={{ fontSize: 13.5, fontWeight: '600', color: '#EE4D38', marginTop: 10 }}>
            Manage Directory -
          </Text>
        </TouchableOpacity>

        {/* Emergency Support Button - Radiant Red */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveModal('emergency')}
          style={{
            backgroundColor: '#EE4D38',
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#EE4D38',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <SirenIcon size={22} color="#FFFFFF" />
          <Text style={{ fontSize: 16.5, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>
            Emergency Support
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ======================================================== */}
      {/* Interactive Modals                                       */}
      {/* ======================================================== */}

      {/* 1. Kick Counter Modal */}
      <Modal visible={activeModal === 'kick'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <HeartPulse size={20} color="#F43F5E" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Kick Counter</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF1EE', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FF5B79' }}>
                <Text style={{ fontSize: 44, fontWeight: '800', color: '#FF5B79' }}>{kickCount}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#FF5B79' }}>Kicks Today</Text>
              </View>

              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 16, textAlign: 'center', lineHeight: 18 }}>
                Tap below each time you feel your baby kick, flutter, or turn. A healthy goal is 10 movements within 2 hours.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setKickCount((prev) => prev + 1)}
                style={{
                  backgroundColor: '#FF5B79',
                  paddingHorizontal: 28,
                  paddingVertical: 14,
                  borderRadius: 24,
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Plus size={18} color="#FFFFFF" />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 6 }}>Record a Kick</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Contractions Modal */}
      <Modal visible={activeModal === 'contractions'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Activity size={20} color="#8B5CF6" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Contractions Timer</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#F5F3FF', borderRadius: 16, padding: 18 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>Current Interval</Text>
              <Text style={{ fontSize: 32, fontWeight: '800', color: '#6D28D9', marginTop: 2 }}>5 mins apart</Text>
              <Text style={{ fontSize: 12.5, color: '#5B21B6', marginTop: 2 }}>Average duration: 45 seconds • 15m ago</Text>
            </View>

            <View style={{ backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, marginTop: 14, borderWidth: 1, borderColor: '#F1F5F9' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E1E1E' }}>The 5-1-1 Rule for Labor:</Text>
              <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 }}>
                When contractions occur every 5 minutes, last 1 full minute each, for at least 1 hour, contact your doctor or midwife immediately.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 20, backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Start Timer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Hospital Bag Modal */}
      <Modal visible={activeModal === 'bag'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Briefcase size={20} color="#D97706" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Hospital Bag Checklist</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
              12 of 20 essential items packed:
            </Text>

            <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
              {[
                { name: 'Maternity hospital gown & robe', packed: true },
                { name: 'Government ID & insurance paperwork', packed: true },
                { name: 'Baby onesies (newborn & 0-3m size)', packed: true },
                { name: 'Warm socks & non-slip slippers', packed: true },
                { name: 'Nursing bras & disposable maternity pads', packed: true },
                { name: 'Infant car seat pre-installed', packed: false },
                { name: 'Baby swaddles & soft receiving blanket', packed: false },
                { name: 'Postpartum recovery kit & nipple cream', packed: false },
              ].map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: item.packed ? '#10B981' : '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    {item.packed && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={{ fontSize: 13.5, color: '#1E1E1E', fontWeight: item.packed ? '600' : '400' }}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 16, backgroundColor: '#F59E0B', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. Hydration Modal */}
      <Modal visible={activeModal === 'hydration'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Droplets size={20} color="#0284C7" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Hydration Tracker</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' }}>
                <Droplets size={38} color="#0284C7" />
              </View>

              <Text style={{ fontSize: 32, fontWeight: '800', color: '#0284C7', marginTop: 12 }}>
                {hydrationLiters.toFixed(1)} L / 2.5 L
              </Text>
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Daily Hydration Goal</Text>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 22 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setHydrationLiters((prev) => Math.min(4.0, Number((prev + 0.25).toFixed(2))))}
                  style={{
                    backgroundColor: '#0284C7',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>+ 250 ml Glass</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setHydrationLiters((prev) => Math.min(4.0, Number((prev + 0.5).toFixed(2))))}
                  style={{
                    backgroundColor: '#E0F2FE',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0284C7' }}>+ 500 ml Bottle</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 16, backgroundColor: '#06B6D4', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Save Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5. Medical Contacts Modal */}
      <Modal visible={activeModal === 'contacts'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Medical Directory</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View>
              {[
                { role: 'Primary Midwife', name: 'Dr. Rebecca Stone', phone: '+91 98765 43210' },
                { role: 'OB/GYN Consultant', name: 'Dr. Anita Roy', phone: '+91 98765 12345' },
                { role: 'Hospital Desk', name: 'City Maternity Wing', phone: '011-23456789' },
              ].map((contact, idx) => (
                <View key={idx} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#EE4D38', textTransform: 'uppercase' }}>{contact.role}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E1E', marginTop: 2 }}>{contact.name}</Text>
                  <TouchableOpacity onPress={() => handleCallEmergency(contact.phone)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Phone size={14} color="#0284C7" />
                    <Text style={{ fontSize: 13, color: '#0284C7', marginLeft: 6, fontWeight: '600' }}>{contact.phone}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 20, backgroundColor: '#1E1E1E', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 6. Emergency Support Modal */}
      <Modal visible={activeModal === 'emergency'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <HeartPulse size={20} color="#DC2626" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Emergency Contacts</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 18 }}>
              In case of severe cramps, heavy bleeding, or sudden pain, please contact immediate medical assistance:
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCallEmergency('102')}
              style={[styles.emergencyRow, { backgroundColor: '#DC2626' }]}
            >
              <Phone size={18} color="#FFFFFF" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>Call Maternity Ambulance (102)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCallEmergency('108')}
              style={[styles.emergencyRow, { backgroundColor: '#EE4D38', marginTop: 10 }]}
            >
              <Phone size={18} color="#FFFFFF" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>National Emergency (108)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 16, paddingVertical: 12, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 7. Mother: Motor Skills Modal */}
      <Modal visible={activeModal === 'motor_skills'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Activity size={20} color="#4F46E5" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Motor Skills (6 Weeks)</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#6366F1' }}>
                <Text style={{ fontSize: 34, fontWeight: '800', color: '#4F46E5' }}>{tummyMinutes}m</Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#6366F1' }}>Tummy Time Today</Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setTummyMinutes((m) => m + 5)}
                  style={{ backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>+ 5 Mins</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setTummyMinutes((m) => m + 10)}
                  style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#4F46E5' }}>+ 10 Mins</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E1E1E', marginTop: 12, marginBottom: 8 }}>
              Milestones Checklist:
            </Text>
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {[
                { key: 'headLift', text: 'Lifts head 45° briefly during tummy time' },
                { key: 'eyeFollow', text: 'Tracks moving faces or colorful objects' },
                { key: 'grasping', text: 'Grasps fingers reflexively when touched' },
                { key: 'smiling', text: 'Responds to caregiver with social coos & smiles' },
                { key: 'kicking', text: 'Kicks legs with alternating rhythmic motion' },
                { key: 'handToMouth', text: 'Brings hands toward mouth to self-soothe' },
              ].map((m) => (
                <TouchableOpacity
                  key={m.key}
                  activeOpacity={0.7}
                  onPress={() => setMilestones((prev) => ({ ...prev, [m.key]: !prev[m.key as keyof typeof prev] }))}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}
                >
                  <View style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: milestones[m.key as keyof typeof milestones] ? '#4F46E5' : '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    {milestones[m.key as keyof typeof milestones] && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={{ fontSize: 13, color: '#334155', flex: 1 }}>{m.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 14, backgroundColor: '#4F46E5', paddingVertical: 12, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Save Milestones</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 8. Mother: Nutritional Values Modal */}
      <Modal visible={activeModal === 'nutritional_values'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Apple size={20} color="#10B981" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Nutritional Values (Mother)</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 18, marginBottom: 12 }}>
              Daily nutrition targets for postpartum tissue recovery, hormonal balance, and rich breast milk supply.
            </Text>

            <View style={{ backgroundColor: '#F0FDF4', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#DCFCE7' }}>
              <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#166534', marginBottom: 8 }}>Daily Postpartum Intake:</Text>
              {[
                { key: 'warmFluids', label: 'Warm hydration & herbal broths (3.0L+)' },
                { key: 'calcium', label: 'Calcium: 1,000 mg (dairy, sesame, ragi)' },
                { key: 'ironProtein', label: 'Iron & Protein: Tissue repair & energy' },
                { key: 'galactagogues', label: 'Galactagogues: Methi, jeera, oats, garlic' },
                { key: 'postnatalVitamins', label: 'Postnatal vitamins & healthy fats (ghee/nuts)' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.7}
                  onPress={() =>
                    setNutritionChecks((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))
                  }
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      backgroundColor: nutritionChecks[item.key as keyof typeof nutritionChecks]
                        ? '#10B981'
                        : '#E2E8F0',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                  >
                    {nutritionChecks[item.key as keyof typeof nutritionChecks] && (
                      <Check size={13} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                  <Text style={{ fontSize: 13, color: '#166534', flex: 1 }}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setActiveModal(null);
                router.push('/pregnancy-diet');
              }}
              style={{ backgroundColor: '#10B981', paddingVertical: 13, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>View Full Mother Diet Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 9. Mother: Sleep Pattern Modal */}
      <Modal visible={activeModal === 'sleep_pattern'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Moon size={20} color="#8B5CF6" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Sleep Pattern Tracker</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#8B5CF6' }}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: '#8B5CF6' }}>{totalSleepHours}h</Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#8B5CF6' }}>Total Sleep Today</Text>
              </View>

              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 12 }}>
                Logged Naps: {napCount} • Ideal Wake Window: 60-90 mins
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setNapCount((c) => c + 1);
                    setTotalSleepHours((h) => Number((h + 0.75).toFixed(1)));
                  }}
                  style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>+ Log 45m Nap</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setNapCount((c) => c + 1);
                    setTotalSleepHours((h) => Number((h + 1.5).toFixed(1)));
                  }}
                  style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#8B5CF6' }}>+ Log 1.5h Nap</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 14, backgroundColor: '#1E1E1E', paddingVertical: 12, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 10. Mother: Feed Pattern Modal */}
      <Modal visible={activeModal === 'feed_pattern'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Milk size={20} color="#D97706" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Feed Pattern Tracker</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#F59E0B' }}>
                <Text style={{ fontSize: 36, fontWeight: '800', color: '#D97706' }}>{feedCount}</Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#D97706' }}>Feeds Today</Text>
              </View>

              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 12 }}>Select Breast / Nursing Side:</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                {(['Left', 'Right'] as ('Left' | 'Right')[]).map((side) => (
                  <TouchableOpacity
                    key={side}
                    activeOpacity={0.8}
                    onPress={() => {
                      setLastFeedSide(side);
                      setLastFeedTime('Just now');
                    }}
                    style={{
                      paddingHorizontal: 18,
                      paddingVertical: 9,
                      borderRadius: 16,
                      backgroundColor: lastFeedSide === side ? '#F59E0B' : '#FEF3C7',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: lastFeedSide === side ? '#FFFFFF' : '#D97706' }}>
                      {side} Breast
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setFeedCount((c) => c + 1);
                  setLastFeedTime('Just now');
                }}
                style={{ backgroundColor: '#D97706', paddingHorizontal: 22, paddingVertical: 11, borderRadius: 20, marginTop: 14 }}
              >
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#FFFFFF' }}>+ Record Feed</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 12, backgroundColor: '#1E1E1E', paddingVertical: 12, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Save Feed Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 11. Mother: Mother Care Messages Modal */}
      <Modal visible={activeModal === 'mother_care'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FCE7F3', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Heart size={20} color="#DB2777" fill="#DB2777" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Mother Care Messages</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {[
                { title: 'Honor Your Body', desc: 'Your body just performed a miracle. Give yourself grace, avoid strenuous lifts, and allow deep pelvic rest.' },
                { title: 'Nourish & Hydrate', desc: 'Sip warm fenugreek water, light soups, and herbal teas. Healing takes time and dedicated nourishment.' },
                { title: 'Pelvic Floor Care', desc: 'Begin gentle diaphragmatic breathing and soft Kegels; avoid aggressive crunches to protect your core.' },
                { title: 'Emotional Grace', desc: 'Baby blues and hormone shifts are common in early weeks. Communicate openly with your partner and family.' },
                { title: 'Sleep When Baby Sleeps', desc: 'Rest restores oxytocin and prolactin levels. Let household chores wait while you and baby nap.' },
              ].map((msg, i) => (
                <View key={i} style={{ backgroundColor: '#FDF2F8', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#FCE7F3' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#9D174D', marginBottom: 3 }}>🌸 {msg.title}</Text>
                  <Text style={{ fontSize: 12.5, color: '#475569', lineHeight: 18 }}>{msg.desc}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 14, backgroundColor: '#DB2777', paddingVertical: 12, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 12. Mother: Baby Care Messages Modal */}
      <Modal visible={activeModal === 'baby_care'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Baby size={20} color="#0284C7" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Baby Care Messages</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {[
                { title: 'Gentle Sponge Baths & Cord', desc: 'Keep bath time under 10 minutes with lukewarm water. Keep umbilical cord dry and clean until fully detached.' },
                { title: 'Diaper Hygiene & Air-Time', desc: 'Change diapers promptly and allow 5 minutes of diaper-free air time to protect delicate newborn skin.' },
                { title: 'Burping & Relieving Gas', desc: 'Hold baby upright against your shoulder for 10-15 minutes after each feed; try gentle bicycle legs for colic.' },
                { title: 'Soothing with 5 S’s', desc: 'Swaddle snugly, hold gently on side/stomach, whisper rhythmic shushing sounds, and offer comfort suckling.' },
                { title: 'Safe Sleep Environment', desc: 'Always place baby on their back on a firm mattress in a safe crib. Maintain room temperature at 20-22°C.' },
              ].map((msg, i) => (
                <View key={i} style={{ backgroundColor: '#F0F9FF', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#BAE6FD' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0369A1', marginBottom: 3 }}>👶 {msg.title}</Text>
                  <Text style={{ fontSize: 12.5, color: '#475569', lineHeight: 18 }}>{msg.desc}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 14, backgroundColor: '#0284C7', paddingVertical: 12, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stageSwitcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  stageChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
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
  utilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
  },
  cardSubtitle1: {
    fontSize: 12.5,
    color: '#8A94A6',
    textAlign: 'center',
    marginTop: 4,
  },
  cardSubtitle2: {
    fontSize: 12.5,
    color: '#8A94A6',
    textAlign: 'center',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
});
