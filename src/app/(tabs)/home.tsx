import { HomeHelpfulTools } from '@/components/home/HomeHelpfulTools';
import { HomeStageHero } from '@/components/home/HomeStageHero';
import { MotherWelcomeModal } from '@/components/home/MotherWelcomeModal';
import { PregnancyStage, useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  Bell,
  CalendarClock,
  Lightbulb,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

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
  const { stage, setStage, hasSeenMotherWelcomePopup, setHasSeenMotherWelcomePopup } = useAppStore();
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);

  // Resolve stage: priority to explicit stage in appStore, then user.stage, then detect from user.name, default to 'pregnant'
  const currentStage: PregnancyStage =
    stage ||
    (user?.stage as PregnancyStage) ||
    (user?.name?.toLowerCase().includes('mother')
      ? 'mother'
      : user?.name?.toLowerCase().includes('conceive')
        ? 'conceive'
        : 'pregnant');

  useEffect(() => {
    if (!stage && currentStage) {
      setStage(currentStage);
    }
  }, [stage, currentStage]);

  // One-time Mother Welcome Popup check
  useEffect(() => {
    let isMounted = true;
    async function checkMotherWelcome() {
      if (currentStage === 'mother' && !hasSeenMotherWelcomePopup) {
        try {
          const stored = await SecureStore.getItemAsync('has_seen_mother_welcome_modal');
          if (!stored && isMounted) {
            setWelcomeModalVisible(true);
          } else if (stored && isMounted) {
            setHasSeenMotherWelcomePopup(true);
          }
        } catch {
          if (isMounted) setWelcomeModalVisible(true);
        }
      }
    }
    checkMotherWelcome();
    return () => {
      isMounted = false;
    };
  }, [currentStage, hasSeenMotherWelcomePopup]);

  const handleCloseWelcomeModal = async () => {
    setWelcomeModalVisible(false);
    setHasSeenMotherWelcomePopup(true);
    try {
      await SecureStore.setItemAsync('has_seen_mother_welcome_modal', 'true');
    } catch {
      // Ignore
    }
  };

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
            <Text style={{ fontSize: 12, fontWeight: '500', color: currentStage === 'mother' ? '#8E8E93' : '#EE4D38', letterSpacing: 0.2 }}>
              {currentStage === 'mother' ? 'Strawberry' : currentStage === 'conceive' ? 'Fertility Care' : 'Healthcare pvt limited'}
            </Text>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>
              {user?.name || 'Miss sarah'}
            </Text>
          </View>
        </TouchableOpacity>

        <Pressable
          onPress={() => router.push('/notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
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
        {/* Dynamic Upper Hero Section for 3 Stages (Pregnant, Mother, Conceive) */}
        <HomeStageHero stage={currentStage} onStageChange={setStage} />

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

        {/* Dynamic Helpful Tools Section for 3 Stages */}
        <HomeHelpfulTools stage={currentStage} />

        {/* Next Appointment Card matching Image 1 */}
        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CalendarClock size={16} color="#475569" style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 11.5, fontWeight: '800', color: '#1E293B', letterSpacing: 0.5 }}>
                NEXT APPOINTMENT
              </Text>
            </View>
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#64748B' }}>
              JUNE 15
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/new-appointment')}
            style={{
              backgroundColor: '#FFE4E6',
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                paddingVertical: 6,
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>15</Text>
              <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#64748B' }}>JUNE</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>
                Dr. Aris • Morphology Scan
              </Text>
              <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                10:30 AM • City Maternity Center
              </Text>
            </View>
          </TouchableOpacity>
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
            <Pressable
              onPress={() => router.push('/expert-directory')}
              hitSlop={8}
            >
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>
                See more
              </Text>
            </Pressable>
          </View>

          {/* 3-column Grid for Categories */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/expert-directory',
                    params: {
                      categoryId: cat.id,
                      categoryTitle: cat.title.replace('\n', ' '),
                    },
                  })
                }
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
              </TouchableOpacity>
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

      {/* One-Time Mother Stage Welcome Celebration Popup */}
      <MotherWelcomeModal
        visible={welcomeModalVisible}
        onClose={handleCloseWelcomeModal}
        stage={currentStage}
      />
    </SafeAreaView>
  );
}
