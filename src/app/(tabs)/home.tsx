import { HomeHelpfulTools } from '@/components/home/HomeHelpfulTools';
import { HomeStageHero } from '@/components/home/HomeStageHero';
import { MotherWelcomeModal } from '@/components/home/MotherWelcomeModal';
import { PregnancyStage, useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Lightbulb,
  Play,
  Star,
  Video,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const EXPERT_ADVICE_LIST = [
  {
    id: 'exp-1',
    type: 'video' as const,
    date: '5-01-2025',
    title: 'Essential nutrition tips for healthy pregnancy development',
    author: 'expert one',
    image: require('@/assets/images/home/course_baby.jpg'),
  },
  {
    id: 'exp-2',
    type: 'text' as const,
    date: '5-01-2025',
    title: 'Essential nutrition tips for healthy pregnancy development',
    author: 'expert one',
    image: require('@/assets/images/home/course_baby.jpg'),
  },
  {
    id: 'exp-3',
    type: 'video' as const,
    date: '3-01-2025',
    title: 'Safe daily movement & breathing for expecting mothers',
    author: 'expert two',
    image: require('@/assets/images/home/course_baby.jpg'),
  },
  {
    id: 'exp-4',
    type: 'text' as const,
    date: '2-01-2025',
    title: 'Managing morning sickness & fatigue naturally',
    author: 'expert three',
    image: require('@/assets/images/home/course_baby.jpg'),
  },
];

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

const REAL_STORIES = [
  {
    id: 'story-1',
    name: 'Priya S.',
    category: 'Pregnancy • Week 28',
    duration: '0:42',
    rating: 5,
    quote: '“I feel supported every week.”',
    image: require('@/assets/images/stories/story_priya.jpg'),
  },
  {
    id: 'story-2',
    name: 'Anjali & Rohit',
    category: 'Trying to Conceive',
    duration: '0:56',
    rating: 5,
    quote: '“We learned together.”',
    image: require('@/assets/images/stories/story_anjali_rohit.jpg'),
  },
  {
    id: 'story-3',
    name: 'Neha M.',
    category: 'New Mom',
    duration: '0:38',
    rating: 5,
    quote: '“Helpful tips for my first weeks.”',
    image: require('@/assets/images/stories/story_neha.jpg'),
  },
  {
    id: 'story-4',
    name: 'Kavita R.',
    category: 'Postpartum Care',
    duration: '0:49',
    rating: 5,
    quote: '“Gentle guidance when I needed it most.”',
    image: require('@/assets/images/home/mother_baby.jpg'),
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { stage, setStage, hasSeenMotherWelcomePopup, setHasSeenMotherWelcomePopup } = useAppStore();
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const handleStoryScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const itemWidth = 184; // 172 card width + 12 marginRight
    const index = Math.round(scrollOffset / itemWidth);
    if (index >= 0 && index < REAL_STORIES.length && index !== activeStoryIndex) {
      setActiveStoryIndex(index);
    }
  };

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
          paddingVertical: 8,
          backgroundColor: '#FAF9F6',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/hospital-profile')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FFF0EE',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: '#FBDCD5',
              overflow: 'hidden',
            }}
          >
            <Image
              source={require('@/assets/images/mamatvam-circle-logo.png')}
              style={{ width: 26, height: 26 }}
              contentFit="contain"
            />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 11.5, fontWeight: '600', color: currentStage === 'mother' ? '#8E8E93' : currentStage === 'explore' ? '#8B5CF6' : currentStage === 'conceive' ? '#0284C7' : '#e62a09', letterSpacing: 0.2 }}>
              {currentStage === 'mother' ? 'Strawberry' : (currentStage === 'conceive' || currentStage === 'explore') ? 'Fertility Care' : 'Healthcare pvt limited'}
            </Text>
            <Text style={{ fontSize: 16.5, fontWeight: '800', color: '#1E1E1E' }}>
              {user?.name || 'Mamatvam Hospital'}
            </Text>
          </View>
        </TouchableOpacity>

        <Pressable
          onPress={() => router.push('/notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
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
          <Bell size={19} color="#e62a09" />
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 9,
              width: 7,
              height: 7,
              borderRadius: 3.5,
              backgroundColor: '#e62a09',
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
        <View style={{ marginTop: 12, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
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
                onPress={() => router.push('/playlist')}
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
                    style={{ width: '100%', height: 100 }}
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
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#e62a09', marginTop: 4 }}>
                    20% off
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Next Appointment Bar Section */}
        <View style={{ marginTop: 6, marginBottom: 16, paddingHorizontal: 16 }}>
          {/* Header Row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} color="#0F172A" strokeWidth={2.2} />
              <Text
                style={{
                  fontSize: 13.5,
                  fontWeight: '800',
                  color: '#0F172A',
                  letterSpacing: 0.6,
                }}
              >
                NEXT APPOINTMENT
              </Text>
            </View>
            <Text
              style={{
                fontSize: 13.5,
                fontWeight: '700',
                color: '#0F172A',
                letterSpacing: 0.4,
              }}
            >
              JUNE 15
            </Text>
          </View>

          {/* Appointment Reminder Card */}
          <View
            style={{
              backgroundColor: '#FDECE7',
              borderRadius: 16,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* White Date Box */}
            <View
              style={{
                width: 58,
                height: 58,
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: '#0F172A',
                  lineHeight: 23,
                }}
              >
                15
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '800',
                  color: '#0F172A',
                  letterSpacing: 0.5,
                }}
              >
                JUNE
              </Text>
            </View>

            {/* Doctor & Clinic Info */}
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: '#0F172A',
                }}
                numberOfLines={1}
              >
                Dr. Aris • Morphology Scan
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: '#64748B',
                  marginTop: 4,
                }}
                numberOfLines={1}
              >
                10:30 AM • City Maternity Center
              </Text>
            </View>
          </View>
        </View>

        {/* Dynamic Helpful Tools Section for 3 Stages */}
        <HomeHelpfulTools stage={currentStage} />

        {/* Expert Advice For You */}
        <View style={{ marginTop: 14, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>
              Expert Advice For You
            </Text>
            <Pressable onPress={() => router.push('/playlist')} hitSlop={8}>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>
                See more
              </Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
            {EXPERT_ADVICE_LIST.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => {
                  if (item.type === 'video') {
                    router.push({
                      pathname: '/course-detail',
                      params: {
                        id: item.id,
                        title: item.title,
                      },
                    });
                  } else {
                    router.push({
                      pathname: '/course-article',
                      params: {
                        id: item.id,
                        title: item.title,
                        category: 'EXPERT ADVICE',
                      },
                    });
                  }
                }}
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
                <View style={{ position: 'relative' }}>
                  <Image
                    source={item.image}
                    style={{ width: '100%', height: 115 }}
                    contentFit="cover"
                  />
                  {/* Top-Right Badge: Video or Text */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 8,
                      paddingHorizontal: 7,
                      paddingVertical: 3,
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    {item.type === 'video' ? (
                      <Video size={10.5} color="#DC2626" strokeWidth={2.4} style={{ marginRight: 3.5 }} />
                    ) : (
                      <BookOpen size={10.5} color="#2563EB" strokeWidth={2.4} style={{ marginRight: 3.5 }} />
                    )}
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '800',
                        color: item.type === 'video' ? '#DC2626' : '#2563EB',
                        letterSpacing: 0.2,
                      }}
                    >
                      {item.type === 'video' ? 'Video' : 'Text'}
                    </Text>
                  </View>
                </View>

                <View style={{ padding: 12 }}>
                  <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '500' }}>
                    {item.date}
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
                    {item.title}
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
                      {item.author}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Expert Category */}
        <View style={{ marginTop: 22, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E1E' }}>
              Expert Category
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

        {/* Real Stories. Real Smiles. Section */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 18,
            marginBottom: 14,
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            padding: 16,
            borderWidth: 1,
            borderColor: '#F1F5F9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {/* Header Row */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/story-detail')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View>
              <Text style={{ fontSize: 17.5, fontWeight: '800', color: '#0F172A', letterSpacing: -0.2 }}>
                Real Stories. Real Smiles.
              </Text>
              <Text style={{ fontSize: 12.5, color: '#64748B', fontWeight: '500', marginTop: 2 }}>
                Hear from families like yours
              </Text>
            </View>
            <ChevronRight size={20} color="#e62a09" strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Stories Horizontal Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleStoryScroll}
            scrollEventThrottle={16}
            style={{ marginTop: 14, marginHorizontal: -4, paddingHorizontal: 4 }}
          >
            {REAL_STORIES.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.88}
                onPress={() => {
                  router.push({
                    pathname: '/story-detail',
                    params: { id: item.id },
                  });
                }}
                style={{
                  width: 172,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 8,
                  marginRight: 12,
                  borderWidth: 1,
                  borderColor: '#F1F5F9',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 5,
                  elevation: 2,
                }}
              >
                {/* Thumbnail with overlay badges */}
                <View style={{ position: 'relative', width: '100%', height: 144, borderRadius: 12, overflow: 'hidden' }}>
                  <Image
                    source={item.image}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                  {/* Top Right: Sample story badge */}
                  <View
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      paddingHorizontal: 7,
                      paddingVertical: 2.5,
                      borderRadius: 6,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.08,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#1E293B' }}>
                      Sample story
                    </Text>
                  </View>

                  {/* Centered Play Button */}
                  <View
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: -18,
                      marginLeft: -18,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: 'rgba(15, 23, 42, 0.58)',
                      borderWidth: 1.5,
                      borderColor: 'rgba(255, 255, 255, 0.65)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Play size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
                  </View>

                  {/* Bottom Right Duration Badge */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      right: 6,
                      backgroundColor: 'rgba(15, 23, 42, 0.82)',
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 }}>
                      {item.duration}
                    </Text>
                  </View>
                </View>

                {/* Info */}
                <View style={{ paddingTop: 8, paddingHorizontal: 2 }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '800', color: '#0F172A' }} numberOfLines={1}>
                    {item.name}
                  </Text>

                  {/* Category Pill */}
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: '#FCE7F3',
                      paddingHorizontal: 7,
                      paddingVertical: 2.5,
                      borderRadius: 8,
                      marginTop: 4,
                    }}
                  >
                    <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#BE185D' }}>
                      {item.category}
                    </Text>
                  </View>

                  {/* 5 Stars */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} color="#e62a09" fill="#e62a09" />
                    ))}
                  </View>

                  {/* Quote */}
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: '#334155',
                      marginTop: 6,
                      lineHeight: 15,
                    }}
                    numberOfLines={2}
                  >
                    {item.quote}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer with pagination dots and View all stories */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 14,
              paddingTop: 4,
            }}
          >
            {/* Dots */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {REAL_STORIES.map((_, idx) => (
                <View
                  key={idx}
                  style={{
                    width: idx === activeStoryIndex ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: idx === activeStoryIndex ? '#e62a09' : '#CBD5E1',
                    marginRight: 5,
                  }}
                />
              ))}
            </View>

            {/* View all stories link */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/story-detail')}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 12.5, fontWeight: '800', color: '#e62a09', marginRight: 4 }}>
                View all stories
              </Text>
              <ArrowRight size={13.5} color="#e62a09" strokeWidth={2.4} />
            </TouchableOpacity>
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
              Open
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
