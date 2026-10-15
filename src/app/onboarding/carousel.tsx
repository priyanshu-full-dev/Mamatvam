import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Star,
  ArrowRight,
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function CarouselScreen() {
  const router = useRouter();
  const { setHasSeenOnboarding } = useAppStore();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fade animation for smooth slide transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const handleSkip = () => {
    setHasSeenOnboarding(true);
    router.replace('/(auth)/sign-in');
  };

  const handleFinish = () => {
    setHasSeenOnboarding(true);
    router.replace('/(auth)/sign-in');
  };

  const goToSlide = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex > 2 || targetIndex === currentIndex) return;

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.2,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentIndex(targetIndex);
  };

  // PanResponder to support intuitive left/right swiping on touch
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          // Swipe Left -> Next Slide
          if (currentIndexRef.current < 2) {
            goToSlide(currentIndexRef.current + 1);
          }
        } else if (gestureState.dx > 50) {
          // Swipe Right -> Prev Slide
          if (currentIndexRef.current > 0) {
            goToSlide(currentIndexRef.current - 1);
          }
        }
      },
    })
  ).current;

  // Responsive sizes based on screen height
  const isSmallScreen = height < 750;
  const slide1ImgSize = isSmallScreen ? 210 : 250;
  const slide2ImgHeight = isSmallScreen ? 180 : 210;

  // Slide 1 (formerly Slide 3) couple & cards responsive sizes
  const coupleBannerHeight = Math.min(height * 0.34, width / (682 / 303));
  const cardWidth = (width - 32 - 10) / 2;
  const cardHeight = cardWidth / (300 / 178);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF8" />

      <Animated.View
        style={[styles.container, { opacity: fadeAnim }]}
        {...panResponder.panHandlers}
      >
        {/* ==================== SLIDE 1 (NEW): YOUR COMPLETE PREGNANCY JOURNEY TOGETHER ==================== */}
        {currentIndex === 0 && (
          <View style={styles.slide3Container}>
            {/* Top Original MAMATVAM Logo with safe margin from status bar */}
            <View style={styles.slide3HeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('@/assets/images/onboarding/mamatvam_icon_transparent.png')}
                  style={styles.slide3HeaderLogoIcon}
                  contentFit="contain"
                />
                <View style={styles.slide3HeaderLogoTextCol}>
                  <Text style={styles.slide3HeaderBrandName}>MAMATVAM</Text>
                  <Text style={styles.slide3HeaderTagline}>Healthy Mother | Happy Family</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSkip}
                style={styles.slide3SkipButton}
              >
                <Text style={styles.slide3SkipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>

            {/* Whole Body Content (Banner + Cards + Tagline) */}
            <View style={styles.slide3BodyWrapper}>
              {/* Seamless Illustrated Couple Banner */}
              <View style={styles.slide3HeroWrapper}>
                <Image
                  source={require('@/assets/images/onboarding/slide3_couple_cropped.png')}
                  style={{ width: width, height: coupleBannerHeight }}
                  contentFit="contain"
                  priority="high"
                />
              </View>

              {/* 2x2 Feature Cards Grid matching the mockup */}
              <View style={styles.slide3CardsSection}>
                <View style={styles.slide3CardsGrid}>
                  {/* Card 1: Pregnancy Together */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => goToSlide(1)}
                    style={[styles.featureCardTouchable, { width: cardWidth, height: cardHeight }]}
                  >
                    <Image
                      source={require('@/assets/images/onboarding/slide3_card1_full.png')}
                      style={styles.featureCardImg}
                      contentFit="contain"
                    />
                  </TouchableOpacity>

                  {/* Card 2: Pregnancy Tracker */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => goToSlide(1)}
                    style={[styles.featureCardTouchable, { width: cardWidth, height: cardHeight }]}
                  >
                    <Image
                      source={require('@/assets/images/onboarding/slide3_card2_full.png')}
                      style={styles.featureCardImg}
                      contentFit="contain"
                    />
                  </TouchableOpacity>

                  {/* Card 3: Helping Tools */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => goToSlide(1)}
                    style={[styles.featureCardTouchable, { width: cardWidth, height: cardHeight }]}
                  >
                    <Image
                      source={require('@/assets/images/onboarding/slide3_card3_full.png')}
                      style={styles.featureCardImg}
                      contentFit="contain"
                    />
                  </TouchableOpacity>

                  {/* Card 4: Daily Activities */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => goToSlide(1)}
                    style={[styles.featureCardTouchable, { width: cardWidth, height: cardHeight }]}
                  >
                    <Image
                      source={require('@/assets/images/onboarding/slide3_card4_full.png')}
                      style={styles.featureCardImg}
                      contentFit="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tagline */}
              <View style={styles.slide3TaglineWrapper}>
                <Text style={styles.slide3TaglineText}>
                  <Text style={styles.taglineHeart}>♥  </Text>
                  Because every moment matters
                  <Text style={styles.taglineHeart}>  ♥</Text>
                </Text>
              </View>
            </View>

            {/* Next Button */}
            <View style={styles.bottomButtonWrapper}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => goToSlide(1)}
                style={styles.primaryPillButton}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.primaryButtonText}>Next</Text>
                  <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.8} style={{ marginLeft: 6 }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ==================== SLIDE 2 (NEW): DEDICATED TO ALL UPCOMING MOMMIES ==================== */}
        {currentIndex === 1 && (
          <View style={styles.slideContent}>
            {/* Top Header: Skip */}
            <View style={styles.slideTopHeaderRow}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSkip}
                style={styles.slide3SkipButton}
              >
                <Text style={styles.slide3SkipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>

            {/* Center Circular Watercolor Artwork */}
            <View style={styles.slide1ImageWrapper}>
              <Image
                source={require('@/assets/images/onboarding/slide_upcoming_mommies.jpg')}
                style={{ width: slide1ImgSize, height: slide1ImgSize, borderRadius: 20 }}
                contentFit="contain"
                priority="high"
              />
            </View>

            {/* Heading & Subtitle */}
            <View style={styles.slide1TextContainer}>
              <Text style={styles.slide1Title}>
                Dedicated to All Upcoming{'\n'}Mommies ♡
              </Text>
              <Text style={styles.slide1Subtitle}>
                Your beautiful journey to motherhood starts here.{'\n'}
                We're with you every step of the way.
              </Text>
            </View>

            {/* Bottom Actions: Continue */}
            <View style={styles.bottomButtonWrapper}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => goToSlide(2)}
                style={styles.primaryPillButton}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ==================== SLIDE 3 (NEW): TRUSTED BY 10,000+ MOTHERS ==================== */}
        {currentIndex === 2 && (
          <View style={styles.slideContent}>
            {/* Top Header: Mamatvam & 5 Stars */}
            <View style={styles.slide2Header}>
              <Text style={styles.slide2Logo}>M A M A T V A M</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15} color="#D97706" fill="#F59E0B" style={{ marginHorizontal: 2 }} />
                ))}
              </View>
              <Text style={styles.slide2Title}>
                Trusted by 10,000+ Mothers{'\n'}And They Are Happy Mothers
              </Text>
            </View>

            {/* Center 3 Mothers on Sofa Watercolor Artwork */}
            <View style={styles.slide2ImageWrapper}>
              <Image
                source={require('@/assets/images/onboarding/slide_trusted_mothers.jpg')}
                style={[styles.slide2Image, { height: slide2ImgHeight }]}
                contentFit="cover"
                priority="high"
              />
            </View>

            {/* Social Proof Bar (3 Avatars + Rating 4.9) */}
            <View style={styles.socialProofBar}>
              <View style={styles.avatarsWrapper}>
                <Image
                  source={require('@/assets/images/onboarding/slide_mothers_avatars.jpg')}
                  style={styles.avatarsImage}
                  contentFit="contain"
                />
              </View>

              <View style={styles.socialDivider} />

              <View style={styles.ratingInfoCol}>
                <Text style={styles.ratingNumber}>4.9</Text>
                <View style={styles.miniStarsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={9} color="#D97706" fill="#F59E0B" style={{ marginRight: 1 }} />
                  ))}
                </View>
                <Text style={styles.ratingCount}>• 10k+ mothers</Text>
              </View>
            </View>

            {/* Tagline */}
            <Text style={styles.slide2Tagline}>Join our happy community</Text>

            {/* Get Started Button -> Finishes Onboarding */}
            <View style={styles.bottomButtonWrapper}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleFinish}
                style={styles.primaryPillButton}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Unified Bottom Pagination Dots - Exact same position on all 3 slides */}
      <View style={styles.bottomDotsRow}>
        {[0, 1, 2].map((i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            onPress={() => goToSlide(i)}
            style={[
              styles.dotCircle,
              currentIndex === i ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  slideContent: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 18 : 12,
    justifyContent: 'space-between',
  },

  /* ------------------- SLIDE 1 STYLES ------------------- */
  topDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  dotCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3.5,
  },
  dotActive: {
    backgroundColor: '#e62a09',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotInactive: {
    backgroundColor: '#FDE4D8',
    borderWidth: 1,
    borderColor: '#F8C8B5',
  },
  slide1ImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  slide1TextContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  slide1Title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  slide1Subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 320,
  },
  slide1ActionsContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 2,
    paddingHorizontal: 6,
  },
  primaryPillButton: {
    backgroundColor: '#e62a09',
    borderRadius: 26,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e62a09',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  skipButton: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#e62a09',
    textDecorationLine: 'underline',
  },

  /* ------------------- SLIDE 2 STYLES ------------------- */
  slide2Header: {
    alignItems: 'center',
    paddingTop: 2,
  },
  slide2Logo: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 3,
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  slide2Title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#451A03',
    textAlign: 'center',
    lineHeight: 25,
  },
  slide2ImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  slide2Image: {
    width: '100%',
    borderRadius: 18,
  },
  socialProofBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    marginVertical: 2,
  },
  avatarsWrapper: {
    width: 105,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarsImage: {
    width: '100%',
    height: '100%',
  },
  socialDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  ratingInfoCol: {
    alignItems: 'flex-start',
  },
  ratingNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
    lineHeight: 18,
  },
  miniStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  ratingCount: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  slide2Tagline: {
    fontSize: 13,
    fontWeight: '700',
    color: '#451A03',
    textAlign: 'center',
    marginVertical: 2,
  },
  bottomButtonWrapper: {
    width: '100%',
    paddingHorizontal: 6,
    paddingTop: 4,
    paddingBottom: 2,
  },
  bottomDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    backgroundColor: '#FDFBF7',
  },
  slideTopHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 2,
    paddingHorizontal: 16,
  },

  /* ------------------- SLIDE 3 STYLES ------------------- */
  slide3Container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 16 : 10,
  },
  slide3HeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 2,
    paddingHorizontal: 16,
  },
  slide3SkipButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  slide3SkipButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#E84A1C',
    textDecorationLine: 'underline',
  },
  slide3HeaderLogoIcon: {
    width: 44,
    height: 44,
    marginRight: 10,
  },
  slide3HeaderLogoTextCol: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  slide3HeaderBrandName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#E84A1C',
    letterSpacing: 1.2,
    lineHeight: 25,
  },
  slide3HeaderTagline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#713F24',
    marginTop: 1,
    letterSpacing: 0.3,
  },
  slide3BodyWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 14,
  },
  slide3HeroWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  slide3CardsSection: {
    paddingHorizontal: 16,
    width: '100%',
    marginTop: 8,
  },
  slide3CardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  featureCardTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#DF532B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  featureCardImg: {
    width: '100%',
    height: '100%',
  },
  slide3TaglineWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 2,
  },
  slide3TaglineText: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#42170D',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  taglineHeart: {
    color: '#E84A1C',
    fontSize: 15,
  },
  slide3BottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  slide3BottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeLeaves: {
    width: 44,
    height: 48,
    marginRight: 8,
  },
  slide3DotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slide3DotActive: {
    backgroundColor: '#E84A1C',
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  slide3DotInactive: {
    backgroundColor: '#FAD5C0',
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  slide3NextButton: {
    backgroundColor: '#E84A1C',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E84A1C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  slide3NextButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
