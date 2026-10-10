import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Lock,
  Headphones,
  Crown,
  Heart,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const handleProceed = () => {
    router.push({
      pathname: '/payment',
      params: {
        plan: selectedPlan,
        price: '99',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Subscribe</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero Partner Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextCol}>
            {/* Logo Row */}
            <View style={styles.logoRow}>
              <View style={styles.logoIconBadge}>
                <Heart size={16} color="#EE4D38" fill="#EE4D38" />
              </View>
              <View>
                <Text style={styles.logoTitle}>MAMATVAM</Text>
                <Text style={styles.logoSubtitle}>Healthy Mother | Happy Family</Text>
              </View>
            </View>

            {/* Banner Main Title */}
            <Text style={styles.heroHeading}>
              Your Complete{'\n'}
              <Text style={styles.heroHeadingAccent}>Pregnancy Journey Partner</Text>
            </Text>

            {/* Bullets Tagline */}
            <Text style={styles.heroTagline}>
              Learn • Track • Get Support • Feel Confident
            </Text>
          </View>

          {/* Saree Mother Art Image */}
          <View style={styles.heroImageContainer}>
            <Image
              source={require('@/assets/images/subscription/banner_mother.jpg')}
              style={styles.heroImage}
              contentFit="cover"
            />
          </View>
        </View>

        {/* 2. Choose Your Plan Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <Text style={styles.sectionSubtitle}>
            Get access to all 4 courses and premium features with one subscription.
          </Text>
        </View>

        {/* 3. 4 Course Feature Cards (2x2 Grid) */}
        <View style={styles.coursesGrid}>
          {/* Card 1: Try To Conceive */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/courses')}
            style={[styles.courseCard, { backgroundColor: '#FFF5F2', borderColor: '#FFE4DE' }]}
          >
            <View style={styles.courseImageWrapper}>
              <Image
                source={require('@/assets/images/stages/conceive.png')}
                style={styles.courseImage}
                contentFit="contain"
              />
            </View>
            <Text style={[styles.courseTitle, { color: '#881337' }]}>Try To Conceive</Text>
            <Text style={styles.courseDesc}>Plan. Prepare. Welcome Your Baby.</Text>
            <View style={[styles.cardArrowBtn, { backgroundColor: '#FB7185' }]}>
              <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          </TouchableOpacity>

          {/* Card 2: Pregnancy */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/courses')}
            style={[styles.courseCard, { backgroundColor: '#FFF1F2', borderColor: '#FFE4E6' }]}
          >
            <View style={styles.courseImageWrapper}>
              <Image
                source={require('@/assets/images/stages/pregnant.png')}
                style={styles.courseImage}
                contentFit="contain"
              />
            </View>
            <Text style={[styles.courseTitle, { color: '#9F1239' }]}>Pregnancy</Text>
            <Text style={styles.courseDesc}>Week by Week Care & Guidance.</Text>
            <View style={[styles.cardArrowBtn, { backgroundColor: '#F43F5E' }]}>
              <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          </TouchableOpacity>

          {/* Card 3: Post Pregnancy */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/courses')}
            style={[styles.courseCard, { backgroundColor: '#F5F3FF', borderColor: '#EDE9FE' }]}
          >
            <View style={styles.courseImageWrapper}>
              <Image
                source={require('@/assets/images/stages/mother.png')}
                style={styles.courseImage}
                contentFit="contain"
              />
            </View>
            <Text style={[styles.courseTitle, { color: '#4C1D95' }]}>Post Pregnancy</Text>
            <Text style={styles.courseDesc}>Recover. Bond. Grow Together.</Text>
            <View style={[styles.cardArrowBtn, { backgroundColor: '#8B5CF6' }]}>
              <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          </TouchableOpacity>

          {/* Card 4: IUI/IVF */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/courses')}
            style={[styles.courseCard, { backgroundColor: '#F0FDFA', borderColor: '#CCFBF1' }]}
          >
            <View style={styles.courseImageWrapper}>
              <Image
                source={require('@/assets/images/stages/explore.png')}
                style={styles.courseImage}
                contentFit="contain"
              />
            </View>
            <Text style={[styles.courseTitle, { color: '#134E4A' }]}>IUI/IVF</Text>
            <Text style={styles.courseDesc}>Hope. Science. Your Future Family.</Text>
            <View style={[styles.cardArrowBtn, { backgroundColor: '#14B8A6' }]}>
              <ArrowRight size={13} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. Complete Access Golden Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleProceed()}
          style={styles.accessBanner}
        >
          <View style={styles.crownBadge}>
            <Crown size={20} color="#D97706" />
          </View>
          <View style={styles.accessBannerContent}>
            <Text style={styles.accessBannerTitle}>Get Complete Access</Text>
            <Text style={styles.accessBannerSub}>
              All 4 Courses  +  Premium Tools  +  Expert Support
            </Text>
          </View>
          <ChevronRight size={18} color="#D97706" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* 5. Select Plan Section */}
        <View style={styles.selectPlanSection}>
          <Text style={styles.selectPlanHeader}>Select Plan</Text>

          {/* Annual Plan (Most Popular) */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedPlan('annual')}
            style={[
              styles.planCard,
              selectedPlan === 'annual' && styles.planCardSelected,
            ]}
          >
            {/* Most Popular Tag */}
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>Most Popular</Text>
            </View>

            <View style={styles.planCardContent}>
              {/* Radio Button */}
              <View style={[styles.radioCircle, selectedPlan === 'annual' && styles.radioCircleActive]}>
                {selectedPlan === 'annual' && <View style={styles.radioInnerDot} />}
              </View>

              {/* Plan Info */}
              <View style={styles.planDetailsCol}>
                <Text style={styles.planTitle}>Annual Plan</Text>
                <Text style={styles.planSub}>Save 50% • Full access for 12 months</Text>
              </View>

              {/* Pricing */}
              <View style={styles.priceCol}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceSymbol}>₹ </Text>
                  <Text style={styles.priceNumber}>99</Text>
                  <Text style={styles.priceUnit}>/year</Text>
                </View>
                <Text style={styles.strikethroughPrice}>₹ 198</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedPlan('monthly')}
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
          >
            <View style={styles.planCardContent}>
              {/* Radio Button */}
              <View style={[styles.radioCircle, selectedPlan === 'monthly' && styles.radioCircleActive]}>
                {selectedPlan === 'monthly' && <View style={styles.radioInnerDot} />}
              </View>

              {/* Plan Info */}
              <View style={styles.planDetailsCol}>
                <Text style={styles.planTitle}>Monthly Plan</Text>
                <Text style={styles.planSub}>Full access for 1 month</Text>
              </View>

              {/* Pricing */}
              <View style={styles.priceCol}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceSymbol}>₹ </Text>
                  <Text style={styles.priceNumber}>99</Text>
                  <Text style={styles.priceUnit}>/month</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 6. Trust Badges Row */}
        <View style={styles.trustBadgesRow}>
          <View style={styles.trustItem}>
            <ShieldCheck size={20} color="#EE4D38" strokeWidth={2.2} />
            <Text style={styles.trustText}>Secure{'\n'}Payment</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Lock size={19} color="#EE4D38" strokeWidth={2.2} />
            <Text style={styles.trustText}>Your Data{'\n'}is Safe</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Headphones size={20} color="#EE4D38" strokeWidth={2.2} />
            <Text style={styles.trustText}>24/7{'\n'}Support</Text>
          </View>
        </View>

        {/* 7. Proceed to Payment CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleProceed}
          style={styles.proceedButton}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  navHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FAF9F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  heroBanner: {
    backgroundColor: '#FFF6F2',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFE4D8',
    overflow: 'hidden',
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#EE4D38',
    letterSpacing: 0.6,
  },
  logoSubtitle: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#64748B',
  },
  heroHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 21,
    marginBottom: 6,
  },
  heroHeadingAccent: {
    color: '#EE4D38',
  },
  heroTagline: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#475569',
  },
  heroImageContainer: {
    width: 120,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FED7AA',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 18,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  courseCard: {
    width: CARD_WIDTH,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    minHeight: 170,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  courseImageWrapper: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  courseImage: {
    width: 66,
    height: 66,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3,
  },
  courseDesc: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14,
    maxWidth: '85%',
  },
  cardArrowBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  crownBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  accessBannerContent: {
    flex: 1,
  },
  accessBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#B45309',
  },
  accessBannerSub: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#92400E',
    marginTop: 1,
  },
  selectPlanSection: {
    marginTop: 20,
  },
  selectPlanHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  planCardSelected: {
    borderColor: '#EE4D38',
    backgroundColor: '#FFFBFB',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 0,
    backgroundColor: '#EE4D38',
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  planCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleActive: {
    borderColor: '#EE4D38',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EE4D38',
  },
  planDetailsCol: {
    flex: 1,
    paddingRight: 8,
  },
  planTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  planSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceSymbol: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  priceNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },
  priceUnit: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  strikethroughPrice: {
    fontSize: 11.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFF6F4',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FFE4DE',
    marginTop: 6,
    marginBottom: 16,
  },
  trustItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  trustText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 13,
  },
  trustDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#FED7AA',
  },
  proceedButton: {
    backgroundColor: '#EE4D38',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  proceedButtonText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
