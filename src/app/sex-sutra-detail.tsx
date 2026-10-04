import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Image,
  Share,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  Play,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react-native';

export default function SexSutraDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [isPlayingHero, setIsPlayingHero] = useState(false);
  const [isPlayingSecond, setIsPlayingSecond] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Complete Pregnancy Masterclass: From Conception to Birth on Mamatvam - Expert maternal guidance for physical comfort and intimacy during pregnancy.',
      });
    } catch (error) {
      // ignore
    }
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Removed' : 'Masterclass Saved! 🌸',
      isSaved
        ? 'Removed from your saved guides.'
        : 'You can access this masterclass anytime offline.'
    );
  };

  const topPadding = Math.max(insets.top, 28) + 8;
  const bottomPadding = Math.max(insets.bottom, 24) + 12;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      {/* Top Header Bar matching Screenshot */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sex Sutra</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleShare}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
        >
          <Share2 size={21} color="#1E293B" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding + 85 },
        ]}
      >
        {/* 1. Top Hero Video / Media Container */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsPlayingHero(!isPlayingHero)}
          style={styles.heroMediaContainer}
        >
          <Image
            source={require('@/assets/images/sutra/masterclass_hero.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.playCircle}>
              <Play size={24} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>18:24 • Full Masterclass</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 2. Main Title */}
        <Text style={styles.masterTitle}>
          Complete Pregnancy Masterclass: From Conception to Birth
        </Text>

        {/* 3. Detailed Guide Description */}
        <Text style={styles.guideParagraph}>
          Understanding intimacy, physical comfort, and emotional connection throughout each
          trimester is a vital part of your maternal journey. With safe positioning, open
          communication with your partner, and gentle pelvic-floor-friendly practices, you can
          maintain close bonding while prioritizing maternal and fetal well-being.
        </Text>

        {/* 4. Second Video Section matching Screenshot */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsPlayingSecond(!isPlayingSecond)}
          style={styles.secondVideoContainer}
        >
          <Image
            source={require('@/assets/images/sutra/partner_bonding.jpg')}
            style={styles.secondVideoImage}
            resizeMode="cover"
          />
          <View style={styles.secondVideoOverlay}>
            <View style={styles.whitePlayIconWrapper}>
              <Play size={32} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Second Video Caption matching Screenshot */}
        <Text style={styles.videoCaption}>
          <Text style={{ fontWeight: '800', color: '#1E293B' }}>Safe Positioning & Pelvic Relief</Text>{' '}
          is simply designed for the 2nd and 3rd trimesters to alleviate lumbar stress and promote
          partner closeness safely.
        </Text>

        {/* 5. Trimester-by-Trimester Comfort & Guidance */}
        <Text style={styles.sectionHeader}>Trimester-by-Trimester Comfort</Text>

        {/* Trimester 1 */}
        <View style={styles.trimCard}>
          <View style={styles.trimHeaderRow}>
            <View style={[styles.trimBadge, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.trimBadgeText, { color: '#E11D48' }]}>Trimester 1 (Weeks 1-12)</Text>
            </View>
          </View>
          <Text style={styles.trimPoint}>
            • Focus on gentle communication and emotional reassurance during fatigue and nausea.
          </Text>
          <Text style={styles.trimPoint}>
            • Gentle closeness, back massages, and non-straining intimacy are completely safe for uncomplicated pregnancies.
          </Text>
        </View>

        {/* Trimester 2 */}
        <View style={styles.trimCard}>
          <View style={styles.trimHeaderRow}>
            <View style={[styles.trimBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.trimBadgeText, { color: '#D97706' }]}>Trimester 2 (Weeks 13-27)</Text>
            </View>
          </View>
          <Text style={styles.trimPoint}>
            • Known as the "golden period" when energy rebounds and pelvic blood flow enhances natural comfort.
          </Text>
          <Text style={styles.trimPoint}>
            • Side-lying ("spooning") and woman-on-top reduce pressure on the growing abdomen and inferior vena cava.
          </Text>
        </View>

        {/* Trimester 3 */}
        <View style={styles.trimCard}>
          <View style={styles.trimHeaderRow}>
            <View style={[styles.trimBadge, { backgroundColor: '#E0E7FF' }]}>
              <Text style={[styles.trimBadgeText, { color: '#4F46E5' }]}>Trimester 3 (Weeks 28-40)</Text>
            </View>
          </View>
          <Text style={styles.trimPoint}>
            • Use supportive maternity pillows beneath hips and between knees for spinal alignment.
          </Text>
          <Text style={styles.trimPoint}>
            • Gentle physical intimacy releases oxytocin, promoting deep relaxation and emotional calm before labor.
          </Text>
        </View>

        {/* 6. Medical Checklist & Caution */}
        <View style={styles.medicalAlertCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <ShieldCheck size={20} color="#0D9488" style={{ marginRight: 8 }} />
            <Text style={styles.medicalAlertTitle}>When to Consult Your OB-GYN</Text>
          </View>
          <Text style={styles.medicalAlertText}>
            Always follow personalized medical advice if your doctor diagnosed placenta previa,
            unexplained spotting, cervical insufficiency, or premature rupture of membranes.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Bar matching Screenshot */}
      <View style={[styles.bottomBarContainer, { paddingBottom: bottomPadding }]}>
        <View style={styles.bottomBarRow}>
          {/* Left Button: Track Your Symptoms */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/record-symptoms')}
            style={styles.trackSymptomsButton}
          >
            <Text style={styles.trackSymptomsText}>Track Your Symptoms</Text>
          </TouchableOpacity>

          {/* Right Button: Save Now */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSaveToggle}
            style={[
              styles.saveNowButton,
              isSaved && { backgroundColor: '#10B981' },
            ]}
          >
            <Text style={styles.saveNowText}>{isSaved ? 'Saved ✓' : 'Save Now'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  headerIconButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroMediaContainer: {
    width: '100%',
    height: 195,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(225, 29, 72, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  heroBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  masterTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 26,
    marginTop: 16,
    letterSpacing: -0.2,
  },
  guideParagraph: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#64748B',
    marginTop: 10,
    marginBottom: 16,
  },
  secondVideoContainer: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    position: 'relative',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  secondVideoImage: {
    width: '100%',
    height: '100%',
  },
  secondVideoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whitePlayIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  videoCaption: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  trimCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trimHeaderRow: {
    marginBottom: 8,
  },
  trimBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trimBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  trimPoint: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
    marginBottom: 4,
  },
  medicalAlertCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    padding: 14,
    marginTop: 6,
    marginBottom: 14,
  },
  medicalAlertTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  medicalAlertText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#115E59',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 6,
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  trackSymptomsButton: {
    flex: 1.4,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#71717A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  trackSymptomsText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  saveNowButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  saveNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
});
