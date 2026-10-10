import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import {
  ArrowLeft,
  Clock,
  Timer,
  Gauge,
  Lightbulb,
  Heart,
  Droplet,
  Baby,
  Play,
  Square,
  Activity,
  Calendar,
  AlertCircle,
  HelpCircle,
  Share2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Custom wave / uterus badge icon
function WavePulseIcon({ size = 20, color = '#6D28D9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 13C6 7 8 7 10 13C12 18 14 18 16 13C18 7 20 7 21 13"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Discomfort / Back pain icon matching mockup
function DiscomfortBackIcon({ size = 22, color = '#6D28D9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="5" r="2.5" stroke={color} strokeWidth="2" />
      <Path d="M12 8v6M9 11l3-1 3 1" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M15 14l-2 1M10 20l2-6 2 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 11c1 .5 1 1.5 0 2M19 10c1.5 1 1.5 3 0 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

// Custom 60+ seconds stopwatch icon matching mockup
function Stopwatch60Icon({ size = 28, color = '#6D28D9' }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="13" r="8.5" stroke={color} strokeWidth="2" />
        <Path d="M12 1.5v3M9.5 1.5h5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M18.5 6.5l-1.5 1.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
      <Text
        style={{
          position: 'absolute',
          top: 6.5,
          fontSize: 8.5,
          fontWeight: '900',
          color: color,
          textAlign: 'center',
        }}
      >
        60+
      </Text>
    </View>
  );
}

// Custom Bleeding Droplet icon (double drop) matching mockup
function BleedingIcon({ size = 24, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M10.5 2.5C10.5 2.5 5 9 5 13.5a5.5 5.5 0 0 0 11 0c0-4.5-5.5-11-5.5-11z" />
      <Circle cx="17.5" cy="18" r="2.2" />
    </Svg>
  );
}

// Hand holding heart icon for inspiring banner
function HandHoldingHeartIcon({ size = 28, color = '#6D28D9' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7.5c-1.3-1.8-3.8-1.8-5 0-1.2 1.8 0 3.8 2.8 5.6L12 15l2.2-1.9c2.8-1.8 4-3.8 2.8-5.6-1.2-1.8-3.7-1.8-5 0z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      <Path
        d="M3 18h4l3-2h4c1.4 0 2.5-.8 2.5-1.8v-.6M8 16l-3.5 3.5H2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Cursive decorative loop heart line for bottom banner
function LoopHeartLine({ width = 75, height = 30, color = '#7C3AED' }: { width?: number; height?: number; color?: string }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 75 30" fill="none">
      <Path
        d="M2 22C14 22 22 14 30 10C38 6 46 14 42 22C39 28 32 26 34 18C36 10 44 4 52 10C60 16 68 22 74 18"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Custom Heart with pulse wave icon in purple
function HeartPulseBadge({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="#3B0764">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
      <Path
        d="M6 12h2.5l1.5-3 2 6 1.5-3H18"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export default function ContractionsScreen() {
  const router = useRouter();

  // Contraction Tracker Timer State
  const [isTiming, setIsTiming] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [lastFrequency, setLastFrequency] = useState('5m apart');
  const [lastTimeAgo, setLastTimeAgo] = useState('15m ago');
  const [history, setHistory] = useState([
    { id: '1', duration: '48s', interval: '5m', time: '15m ago', intensity: 'Moderate' },
    { id: '2', duration: '52s', interval: '6m', time: '21m ago', intensity: 'Mild' },
    { id: '3', duration: '45s', interval: '5m', time: '27m ago', intensity: 'Moderate' },
  ]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isTiming) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTiming]);

  const handleToggleTimer = () => {
    if (isTiming) {
      // Stop timer and log
      setIsTiming(false);
      const newEntry = {
        id: Date.now().toString(),
        duration: `${seconds}s`,
        interval: '5m',
        time: 'Just now',
        intensity: seconds > 45 ? 'Moderate' : 'Mild',
      };
      setHistory([newEntry, ...history.slice(0, 4)]);
      setSeconds(0);
      setLastTimeAgo('Just now');
    } else {
      // Start timer
      setSeconds(0);
      setIsTiming(true);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contractions</Text>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7}>
          <Share2 size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. Top Hero Section - Matching Design Infographic */}
        <View style={styles.heroCard}>
          {/* Top Title Row with Purple Heart Badge */}
          <View style={styles.heroTopRow}>
            <HeartPulseBadge size={32} />
            <Text style={styles.heroTitle}>Contractions</Text>
          </View>

          <Text style={styles.heroSubtitle}>
            Your Body’s Way of Preparing for a New Life
          </Text>

          <Text style={styles.heroDescription}>
            Contractions are rhythmic tightening of your uterus. They help your baby move down and prepare your body for delivery.
          </Text>

          {/* Educational Illustration Banner */}
          <View style={styles.illustrationCard}>
            <Image
              source={require('@/assets/images/Pregnancy/contractions_header.jpg')}
              style={styles.heroIllustration}
              contentFit="cover"
            />
            <View style={styles.illustrationOverlayBadge}>
              <Text style={styles.illustrationCaption}>
                Contractions = Uterus tightens and relaxes
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Live Contraction Counter Widget (Matching Card 1) */}
        <View style={styles.liveTimerCard}>
          <View style={styles.timerHeaderRow}>
            <View style={styles.timerStatusBadge}>
              <Activity size={16} color="#7C3AED" />
              <Text style={styles.timerStatusText}>
                {isTiming ? 'Timing Contraction...' : 'Contractions Tracker'}
              </Text>
            </View>
            <Text style={styles.timerLastSummary}>
              Last: {lastFrequency} • {lastTimeAgo}
            </Text>
          </View>

          <View style={styles.timerDisplayCenter}>
            <Text style={styles.timerDigits}>{formatTimer(seconds)}</Text>
            <Text style={styles.timerSubLabel}>
              {isTiming ? 'Tap stop when contraction eases' : 'Tap start when contraction begins'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleToggleTimer}
            style={[
              styles.timerActionButton,
              isTiming && { backgroundColor: '#EF4444', shadowColor: '#EF4444' },
            ]}
          >
            {isTiming ? (
              <>
                <Square size={18} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.timerActionText}>Stop Contraction</Text>
              </>
            ) : (
              <>
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.timerActionText}>Start Contraction</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* 4. Section: How to Recognize a Contraction? */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionMainTitle}>How to Recognize a Contraction?</Text>

          <View style={styles.twoColumnRecognition}>
            {/* Left Column: 4 Key Points */}
            <View style={styles.recognitionPointsList}>
              {/* Point 1 */}
              <View style={styles.recognitionPointItem}>
                <View style={styles.pointIconCircle}>
                  <WavePulseIcon size={20} color="#6D28D9" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pointTitle}>Feels like a wave</Text>
                  <Text style={styles.pointDesc}>
                    Starts at the top of your uterus and moves down to your lower belly.
                  </Text>
                </View>
              </View>

              {/* Point 2 */}
              <View style={styles.recognitionPointItem}>
                <View style={styles.pointIconCircle}>
                  <Clock size={20} color="#6D28D9" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pointTitle}>Comes and goes</Text>
                  <Text style={styles.pointDesc}>
                    Builds up, feels tight, then relaxes completely.
                  </Text>
                </View>
              </View>

              {/* Point 3 */}
              <View style={styles.recognitionPointItem}>
                <View style={styles.pointIconCircle}>
                  <DiscomfortBackIcon size={20} color="#6D28D9" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pointTitle}>May cause discomfort</Text>
                  <Text style={styles.pointDesc}>
                    Often felt in the lower back, belly or thighs.
                  </Text>
                </View>
              </View>

              {/* Point 4 */}
              <View style={styles.recognitionPointItem}>
                <View style={styles.pointIconCircle}>
                  <Calendar size={20} color="#6D28D9" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pointTitle}>Becomes more regular</Text>
                  <Text style={styles.pointDesc}>
                    As labor approaches, contractions happen at regular intervals and get stronger.
                  </Text>
                </View>
              </View>
            </View>

            {/* Right Column / Card: Example: What the Numbers Mean */}
            <View style={styles.exampleNumbersCard}>
              <View style={styles.exampleHeaderPill}>
                <Text style={styles.exampleHeaderPillText}>
                  Example: What the Numbers Mean
                </Text>
              </View>

              <Text style={styles.exampleSubheading}>
                In early labor, contractions may look like this:
              </Text>

              {/* 3 Metric Cards */}
              <View style={styles.threeMetricsRow}>
                {/* Frequency */}
                <View style={styles.metricMiniBox}>
                  <Text style={styles.metricBoxHeader}>Frequency</Text>
                  <Clock size={18} color="#6D28D9" style={{ marginVertical: 4 }} />
                  <Text style={styles.metricBoxValue}>Every 10 min</Text>
                  <Text style={styles.metricBoxDesc}>
                    (time between start of one and next)
                  </Text>
                </View>

                {/* Duration */}
                <View style={styles.metricMiniBox}>
                  <Text style={styles.metricBoxHeader}>Duration</Text>
                  <Timer size={18} color="#6D28D9" style={{ marginVertical: 4 }} />
                  <Text style={styles.metricBoxValue}>30–60 sec</Text>
                  <Text style={styles.metricBoxDesc}>
                    (how long each contraction lasts)
                  </Text>
                </View>

                {/* Intensity */}
                <View style={styles.metricMiniBox}>
                  <Text style={styles.metricBoxHeader}>Intensity</Text>
                  <Gauge size={18} color="#6D28D9" style={{ marginVertical: 4 }} />
                  <Text style={styles.metricBoxValue}>Mild to moderate</Text>
                  <Text style={styles.metricBoxDesc}>
                    (you can still talk and move)
                  </Text>
                </View>
              </View>

              {/* Example in Real Life Callout Box */}
              <View style={styles.realLifeCallout}>
                <View style={styles.calloutHeader}>
                  <Lightbulb size={18} color="#EAB308" fill="#FDE047" />
                  <Text style={styles.calloutTitle}>Example in Real Life</Text>
                </View>
                <Text style={styles.calloutBody}>
                  If you feel 4–5 contractions in 1 hour, each lasting 40 seconds and coming every 10 minutes, it may be time to contact your doctor or hospital.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Section: When Should You Contact Your Doctor? */}
        <View style={styles.doctorOuterContainer}>
          <View style={styles.doctorHeaderRow}>
            <Heart size={22} color="#7C3AED" fill="#7C3AED" />
            <Text style={styles.sectionDoctorTitle}>
              When Should You Contact Your Doctor?
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.doctorCardsScroll}
          >
            {/* Card 1: Frequency */}
            <View style={styles.doctorCard}>
              <View style={[styles.doctorIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Clock size={24} color="#6D28D9" />
              </View>
              <Text style={styles.doctorCardText}>
                Contractions are every 5 minutes or less.
              </Text>
            </View>

            {/* Card 2: Duration 60+ */}
            <View style={styles.doctorCard}>
              <View style={[styles.doctorIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Stopwatch60Icon size={28} color="#6D28D9" />
              </View>
              <Text style={styles.doctorCardText}>
                Each contraction lasts 60 seconds or more.
              </Text>
            </View>

            {/* Card 3: Water Breaks */}
            <View style={styles.doctorCard}>
              <View style={[styles.doctorIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Droplet size={24} color="#6D28D9" fill="#6D28D9" />
              </View>
              <Text style={styles.doctorCardText}>
                Water breaks (leakage of fluid).
              </Text>
            </View>

            {/* Card 4: Bleeding */}
            <View style={styles.doctorCard}>
              <View style={[styles.doctorIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <BleedingIcon size={24} color="#EF4444" />
              </View>
              <Text style={styles.doctorCardText}>
                Vaginal bleeding (spotting or heavier).
              </Text>
            </View>

            {/* Card 5: Baby Moving Less */}
            <View style={styles.doctorCard}>
              <View style={[styles.doctorIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Baby size={24} color="#6D28D9" />
              </View>
              <Text style={styles.doctorCardText}>
                You feel your baby moving less than usual.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* 6. Inspiring Bottom Footer Note */}
        <View style={styles.inspiringCard}>
          <View style={styles.inspiringInner}>
            <View style={styles.inspiringLeft}>
              <HandHoldingHeartIcon size={28} color="#6D28D9" />
            </View>
            <View style={{ flex: 1, paddingRight: 4 }}>
              <Text style={styles.inspiringBoldText}>
                Every contraction brings you closer to meeting your baby.
              </Text>
              <Text style={styles.inspiringItalicText}>
                Stay calm, stay informed, and always seek medical advice when needed!
              </Text>
            </View>
            <View style={styles.inspiringRight}>
              <LoopHeartLine width={56} height={26} color="#7C3AED" />
            </View>
          </View>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#FAF7FD',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2E1065',
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 13.5,
    color: '#4B5563',
    lineHeight: 19,
    marginBottom: 14,
  },
  illustrationCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  heroIllustration: {
    width: '100%',
    height: 190,
  },
  illustrationOverlayBadge: {
    backgroundColor: '#F3E8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  illustrationCaption: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6D28D9',
  },
  liveTimerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  timerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  timerStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  timerLastSummary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  timerDisplayCenter: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  timerDigits: {
    fontSize: 44,
    fontWeight: '900',
    color: '#2E1065',
    letterSpacing: 1,
  },
  timerSubLabel: {
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  timerActionButton: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 24,
    marginTop: 14,
    gap: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  timerActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionContainer: {
    marginBottom: 22,
  },
  sectionMainTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#2E1065',
    marginBottom: 12,
  },
  twoColumnRecognition: {
    gap: 14,
  },
  recognitionPointsList: {
    backgroundColor: '#FAF7FD',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    gap: 12,
  },
  recognitionPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pointIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E1065',
  },
  pointDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginTop: 2,
  },
  exampleNumbersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  exampleHeaderPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 8,
  },
  exampleHeaderPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  exampleSubheading: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  threeMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  metricMiniBox: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  metricBoxHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6D28D9',
  },
  metricBoxValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E1E1E',
    textAlign: 'center',
  },
  metricBoxDesc: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 12,
  },
  realLifeCallout: {
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  calloutTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#7C3AED',
  },
  calloutBody: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
  },
  doctorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionDoctorTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#2E1065',
    flex: 1,
  },
  doctorCardsScroll: {
    gap: 10,
    paddingRight: 8,
  },
  doctorCard: {
    width: 145,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  doctorIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  badgeMiniText: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 2,
  },
  doctorCardText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1E1E1E',
    textAlign: 'center',
    lineHeight: 16,
  },
  doctorOuterContainer: {
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 20,
  },
  inspiringCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  inspiringInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inspiringLeft: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspiringRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspiringBoldText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#2E1065',
    lineHeight: 18,
    marginBottom: 3,
  },
  inspiringItalicText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
