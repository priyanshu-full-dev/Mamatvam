import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Activity,
  Apple,
  ArrowRight,
  Bell,
  CalendarClock,
  Heart,
  Lightbulb,
  UploadCloud,
} from 'lucide-react-native';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

const RING_SIZE = 114;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS = 0.84; // ~84% progress showing rounded ends
const STROKE_DASH_OFFSET = CIRCUMFERENCE * (1 - PROGRESS);

const CATEGORIES = [
  { id: '1', title: 'Astrologers &\nPandits', image: require('@/assets/images/home/categories/astrologer.jpg') },
  { id: '2', title: 'Financial advisor', image: require('@/assets/images/home/categories/financial.jpg') },
  { id: '3', title: 'Doctor', image: require('@/assets/images/home/categories/doctor.jpg') },
  { id: '4', title: 'Stem Cell\nPreservation', image: require('@/assets/images/home/categories/stem_cell.jpg') },
  { id: '5', title: 'Lactationist', image: require('@/assets/images/home/categories/lactationist.jpg') },
  { id: '6', title: 'Nutritionist', image: require('@/assets/images/home/categories/nutritionist.jpg') },
  { id: '7', title: 'Physiotherapist', image: require('@/assets/images/home/categories/physiotherapist.jpg') },
  { id: '8', title: 'Sonologist', image: require('@/assets/images/home/categories/sonologist.jpg') },
  { id: '9', title: 'Gynecology', image: require('@/assets/images/home/categories/gynecology.jpg') },
  { id: '10', title: 'Yoga Instructor', image: require('@/assets/images/home/categories/yoga.jpg') },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { pregnancyData } = useAppStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF9F6' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Top Header - Upper section remains clean #FAF9F6, NO gradient */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: '#FAF9F6',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/profile')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#D4D4D8',
            }}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#EE4D38', letterSpacing: 0.2 }}>
              Healthcare pvt limited
            </Text>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>
              {user?.name || 'Miss sarah'}
            </Text>
          </View>
        </TouchableOpacity>

        <Pressable
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Bell size={20} color="#EE4D38" />
          <View
            style={{
              position: 'absolute',
              top: 9,
              right: 10,
              width: 7,
              height: 7,
              borderRadius: 3.5,
              backgroundColor: '#EE4D38',
            }}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Pregnancy Week Section - Full Width, Whole Section Gradient (NOT in upper section) */}
        <View
          style={{
            width: '100%',
            position: 'relative',
            paddingTop: 16,
            paddingBottom: 24,
          }}
        >
          {/* Full Width & Height Background Gradient */}
          <Svg
            style={StyleSheet.absoluteFill}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
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

          {/* Inner Content with Horizontal Padding */}
          <View style={{ paddingHorizontal: 20 }}>
            {/* Top row with Circular Progress Bar Ring & Week counter */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>
                <Svg
                  width={RING_SIZE}
                  height={RING_SIZE}
                  style={{ position: 'absolute', transform: [{ rotate: '-120deg' }] }}
                >
                  {/* Background Track */}
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RADIUS}
                    stroke="#FFD5CE"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                  />
                  {/* Progress Arc with Rounded End Cap */}
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

                {/* Inner Circle with 3D Embryo covering the circle */}
                <View
                  style={{
                    width: 98,
                    height: 98,
                    borderRadius: 49,
                    backgroundColor: '#351713',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={require('@/assets/images/Pregnancy/a0a1b968baee556452621adcbab5b8d20f0bfba6.png')}
                    style={{ width: 98, height: 98, borderRadius: 49, transform: [{ scale: 1.28 }] }}
                    contentFit="cover"
                  />
                </View>
              </View>

              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#1E1E1E', marginBottom: 4 }}>
                  Your Pregnancy Week
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 25, fontWeight: '800', color: '#EE4D38', letterSpacing: -0.3 }}>
                    3 Week{' '}
                  </Text>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: '#EE4D38' }}>
                    & 6 Days
                  </Text>
                </View>
              </View>
            </View>

            {/* Middle Section: Look Mumma text & Large Carrot sticker */}
            <View style={{ marginTop: 16, minHeight: 140, justifyContent: 'center' }}>
              {/* Text on left */}
              <View style={{ maxWidth: '64%', paddingRight: 6 }}>
                <Text style={{ fontSize: 19, fontWeight: '800', color: '#1E1E1E' }}>
                  Look Mumma!
                </Text>
                <Text style={{ fontSize: 15.5, fontWeight: '700', color: '#1E1E1E', marginTop: 3 }}>
                  I am as big as a Corn cob
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#64748B',
                    lineHeight: 18,
                    marginTop: 6,
                  }}
                >
                  Mummy, I'm as long as the ear of a corn. My nostrils are opening now for &quot;practice breathing&quot;; I'll go through the same motions of real breathing but in...
                </Text>
              </View>

              {/* Large Carrot Sticker positioned prominently on the right */}
              <Image
                source={require('@/assets/images/Pregnancy/52a39d847aabe17092f752bea2422ccd6b3631fe (1).png')}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -18,
                  width: 135,
                  height: 152,
                }}
                contentFit="contain"
              />
            </View>

            {/* Daily Utility CTA - Centered, fully within gradient, navigates to Practical Tools */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/practical-tools')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#EE4D38', marginRight: 4 }}>
                Check out my daily utility
              </Text>
              <ArrowRight size={14} color="#EE4D38" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's tips card with Animated GIF */}
        <View
          style={{
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
          }}
        >
          {/* Left Text & Actions Column */}
          <View style={{ maxWidth: '62%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Lightbulb size={18} color="#F59E0B" fill="#FDE68A" />
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#EE4D38', marginLeft: 6 }}>
                Today tips
              </Text>
            </View>

            <Text style={{ fontSize: 12, color: '#334155', lineHeight: 17, marginBottom: 14 }}>
              Try some gentle pelvic tilts today to relieve lower back pressure and improve circulation.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/today-tips')}
                style={{ marginRight: 20 }}
              >
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#EE4D38', textDecorationLine: 'underline' }}>
                  More Tips
                </Text>
              </TouchableOpacity>
              <Pressable>
                <Text style={{ fontSize: 12.5, fontWeight: '600', color: '#64748B' }}>
                  Share
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Scalable Baby GIF in bottom right corner */}
          <Image
            source={require('@/assets/images/Pregnancy/45f37be85427b6d3faf0be40074ba3dd086c5cd9.gif')}
            style={{
              position: 'absolute',
              right: 6,
              bottom: -8,
              width: 95,
              height: 100,
            }}
            contentFit="contain"
          />
        </View>

        {/* Holistic Courses Section */}
        <View style={{ marginTop: 22, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>
              Holistic Courses
            </Text>
            <Pressable onPress={() => router.push('/courses')}>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>
                See more
              </Text>
            </Pressable>
          </View>

          {/* 2x2 Grid of Course Cards */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4].map((item) => (
              <Pressable
                key={item}
                onPress={() => router.push('/course-detail')}
                style={{
                  width: (width - 44) / 2,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  marginBottom: 12,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#F1F5F9',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View style={{ position: 'relative' }}>
                  <Image
                    source={require('@/assets/images/home/course_baby.jpg')}
                    style={{ width: '100%', height: 105 }}
                    contentFit="cover"
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      backgroundColor: '#EAB308',
                      borderRadius: 10,
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#FFFFFF' }}>
                      $ 099
                    </Text>
                  </View>
                </View>

                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '800', color: '#1E1E1E' }}>
                    Basic Plan
                  </Text>
                  <Text style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>
                    Essential guides for every stage
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#EE4D38', marginTop: 4 }}>
                    20% off
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Helpful Tools Section */}
        <View style={{ marginTop: 14, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>
              Helpful Tools
            </Text>
            <Pressable>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>
                See more
              </Text>
            </Pressable>
          </View>

          {/* 3x2 Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* Tool 1 */}
            <Pressable
              onPress={() => router.push('/record-symptoms')}
              style={{
                width: (width - 48) / 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                paddingVertical: 14,
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#F1F5F9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
                minHeight: 110,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#EFF6FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: '#3B82F6',
                }}
              >
                <Activity size={22} color="#1D4ED8" />
              </View>
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: '700',
                  color: '#1E1E1E',
                  textAlign: 'center',
                  marginTop: 8,
                  lineHeight: 14,
                }}
              >
                Record Your{'\n'}Symptoms
              </Text>
            </Pressable>

            {/* Tool 2 */}
            <Pressable
              onPress={() => router.push('/pregnancy-diet')}
              style={{
                width: (width - 48) / 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                paddingVertical: 14,
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#F1F5F9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
                minHeight: 110,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#0284C7',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Apple size={22} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: '700',
                  color: '#1E1E1E',
                  textAlign: 'center',
                  marginTop: 8,
                  lineHeight: 14,
                }}
              >
                pregnancy Diet{'\n'}Chart
              </Text>
            </Pressable>

            {/* Tool 3 */}
            <Pressable
              onPress={() => router.push('/dadi-nani-nuskhe')}
              style={{
                width: (width - 48) / 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                paddingVertical: 14,
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#F1F5F9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
                minHeight: 110,
              }}
            >
              <Image
                source={require('@/assets/images/home/herbal_bowl.jpg')}
                style={{ width: 44, height: 44, borderRadius: 22 }}
                contentFit="contain"
              />
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: '700',
                  color: '#1E1E1E',
                  textAlign: 'center',
                  marginTop: 8,
                  lineHeight: 14,
                }}
              >
                Dadi Nani ke{'\n'}Nuskhe
              </Text>
            </Pressable>

            {/* Tool 4 */}
            <Pressable
              onPress={() => router.push('/sex-sutra')}
              style={{
                width: (width - 48) / 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                paddingVertical: 14,
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#F1F5F9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
                minHeight: 110,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#DB2777',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: '700',
                  color: '#1E1E1E',
                  textAlign: 'center',
                  marginTop: 8,
                  lineHeight: 14,
                }}
              >
                Sex Sutra
              </Text>
            </Pressable>

            {/* Tool 5 */}
            <Pressable
              onPress={() => router.push('/upload-report')}
              style={{
                width: (width - 48) / 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                paddingVertical: 14,
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#F1F5F9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
                minHeight: 110,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#BAE6FD',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UploadCloud size={22} color="#0369A1" />
              </View>
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: '700',
                  color: '#1E1E1E',
                  textAlign: 'center',
                  marginTop: 8,
                  lineHeight: 14,
                }}
              >
                Upload reports
              </Text>
            </Pressable>

            {/* Tool 6 */}
            <Pressable
              onPress={() => router.push('/new-appointment')}
              style={{
                width: (width - 48) / 3,
                backgroundColor: '#FFFFFF',
                borderRadius: 18,
                paddingVertical: 14,
                paddingHorizontal: 6,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: '#F1F5F9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
                minHeight: 110,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#E2E8F0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarClock size={22} color="#1E293B" />
              </View>
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: '700',
                  color: '#1E1E1E',
                  textAlign: 'center',
                  marginTop: 8,
                  lineHeight: 14,
                }}
              >
                Next{'\n'}Appointment
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Expert Advice For You */}
        <View style={{ marginTop: 14, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>
              Expert Advice For You
            </Text>
            <Pressable>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>
                See more
              </Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
            {[1, 2].map((item) => (
              <View
                key={item}
                style={{
                  width: 260,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  marginRight: 14,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#F1F5F9',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <Image
                  source={require('@/assets/images/home/course_baby.jpg')}
                  style={{ width: '100%', height: 115 }}
                  contentFit="cover"
                />
                <View style={{ padding: 12 }}>
                  <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '500' }}>
                    5-01-2025
                  </Text>
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: '700',
                      color: '#1E1E1E',
                      marginTop: 4,
                      lineHeight: 17,
                    }}
                    numberOfLines={2}
                  >
                    Essential nutrition tips for healthy pregnancy development
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: '#E2E8F0',
                      }}
                    />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#1E1E1E', marginLeft: 8 }}>
                      expert one
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Expert Post Category */}
        <View style={{ marginTop: 22, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>
              Expert Post Category
            </Text>
            <Pressable>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>
                See more
              </Text>
            </Pressable>
          </View>

          {/* 3-column Grid for Categories */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={{
                  width: (width - 48) / 3,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 8,
                  alignItems: 'center',
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#F1F5F9',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 4,
                  elevation: 1,
                  minHeight: 114,
                }}
              >
                <Image
                  source={cat.image}
                  style={{ width: 62, height: 62, borderRadius: 14 }}
                  contentFit="cover"
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: '#1E1E1E',
                    textAlign: 'center',
                    marginTop: 6,
                    lineHeight: 13,
                  }}
                  numberOfLines={2}
                >
                  {cat.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Yesterday tips card */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 10,
            marginBottom: 20,
            borderRadius: 18,
            backgroundColor: '#FFE4E6',
            padding: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Lightbulb size={18} color="#1E1E1E" />
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#1E1E1E', marginLeft: 6 }}>
              Yesterday tips
            </Text>
          </View>

          <Text style={{ fontSize: 12, color: '#334155', lineHeight: 17, marginBottom: 8 }}>
            Try some gentle pelvic tilts today to relieve lower back pressure and improve circulation.
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/today-tips')}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#1E1E1E', textAlign: 'center' }}>
              More Tips
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
