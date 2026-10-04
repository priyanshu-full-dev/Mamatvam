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
  Search,
  Play,
  Pause,
  Clock,
  BookOpen,
  Star,
  Share2,
  RotateCcw,
  MessageSquare,
  Settings,
} from 'lucide-react-native';

const CURRICULUM_LESSONS = [
  { id: '1', title: 'Welcome & Introduction', duration: '8: 30' },
  { id: '2', title: 'Understanding Your Trimester Changes', duration: '12: 45' },
  { id: '3', title: 'Pelvic Mobility & Alignment Routine', duration: '15: 20' },
  { id: '4', title: 'Safe Sleeping & Sitting Postures', duration: '10: 15' },
  { id: '5', title: 'Breathing for Labor & Contraction Ease', duration: '14: 00' },
];

export default function CourseDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Hindi2'>('English');
  const [activeLessonId, setActiveLessonId] = useState('1');

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Check out Complete Pregnancy Masterclass: From Conception to Birth on Mamatvam App!',
      });
    } catch (e) {
      // ignore
    }
  };

  const topPadding = Math.max(insets.top, 24);
  const bottomPadding = Math.max(insets.bottom, 24) + 16;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        {/* 1. Video Player Section matching Screenshot */}
        <View style={[styles.playerContainer, { paddingTop: topPadding }]}>
          <Image
            source={require('@/assets/images/courses/succulent_thumbnail.jpg')}
            style={styles.playerBackgroundImage}
            resizeMode="cover"
          />
          <View style={styles.playerOverlay}>
            {/* Top Bar inside Video Player */}
            <View style={styles.playerTopBar}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.back()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.playerIconButton}
              >
                <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.4} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.push('/courses')}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={styles.playerIconButton}
              >
                <Search size={22} color="#FFFFFF" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            {/* Center Play Button & Language Selector */}
            <View style={styles.playerCenterRow}>
              {/* Big White Center Play Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setIsPlaying(!isPlaying)}
                style={styles.centerPlayButton}
              >
                {isPlaying ? (
                  <Pause size={36} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Play size={36} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>

              {/* Floating Language Selector Pill */}
              <View style={styles.languagePillCard}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedLanguage('English')}
                  style={[
                    styles.langOption,
                    selectedLanguage === 'English' && styles.langOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.langText,
                      selectedLanguage === 'English' && styles.langTextActive,
                    ]}
                  >
                    English
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedLanguage('Hindi')}
                  style={[
                    styles.langOption,
                    selectedLanguage === 'Hindi' && styles.langOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.langText,
                      selectedLanguage === 'Hindi' && styles.langTextActive,
                    ]}
                  >
                    Hindi
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedLanguage('Hindi2')}
                  style={[
                    styles.langOption,
                    selectedLanguage === 'Hindi2' && styles.langOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.langText,
                      selectedLanguage === 'Hindi2' && styles.langTextActive,
                    ]}
                  >
                    Hindi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Scrubber & Controls */}
            <View style={styles.playerBottomControls}>
              <View style={styles.timeAndScrubberRow}>
                <Text style={styles.timeText}>02:00</Text>
                <View style={styles.scrubberTrack}>
                  <View style={styles.scrubberPlayed} />
                  <View style={styles.scrubberKnob} />
                  <View style={styles.scrubberRemaining} />
                </View>
                <Text style={styles.timeText}>04:00</Text>
              </View>

              {/* Control Action Icons */}
              <View style={styles.actionIconsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Speed', 'Playback speed: 1.0x')}
                  style={styles.controlIcon}
                >
                  <RotateCcw size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Subtitles', 'Subtitles enabled: English')}
                  style={styles.controlIcon}
                >
                  <MessageSquare size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Quality', 'Resolution: 1080p Full HD')}
                  style={styles.controlIcon}
                >
                  <Settings size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Course Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.courseMainTitle}>
            Complete Pregnancy Masterclass: From Conception to Birth
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text style={styles.statText}>2h 15min</Text>
            </View>

            <View style={styles.statItem}>
              <BookOpen size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text style={styles.statText}>18 Lessons</Text>
            </View>

            <View style={styles.statItem}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 4 }} />
              <Text style={styles.statText}>4.9 (2.4k)</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleShare}
              style={[styles.statItem, { marginLeft: 'auto' }]}
            >
              <Share2 size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text style={styles.statText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. About This Course Card */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutHeader}>About This Course</Text>
          <Text style={styles.aboutBody}>
            Join Dr. Rachel Kim on a comprehensive journey through pregnancy. This masterclass
            covers everything from early pregnancy symptoms to postpartum recovery.
          </Text>
        </View>

        {/* 4. Instructor Card */}
        <View style={styles.instructorCard}>
          <Image
            source={require('@/assets/images/courses/doctor_sarah.jpg')}
            style={styles.instructorAvatar}
          />
          <View style={styles.instructorDetails}>
            <Text style={styles.instructorLabel}>Instructor</Text>
            <Text style={styles.instructorName}>
              Dr. Sarah Chen, <Text style={styles.instructorRole}>Prenatal Specialist</Text>
            </Text>
          </View>
        </View>

        {/* 5. Curriculum Section */}
        <Text style={styles.curriculumSectionTitle}>Curriculum</Text>

        <View style={styles.curriculumList}>
          {CURRICULUM_LESSONS.map((lesson) => {
            const isActive = activeLessonId === lesson.id;
            return (
              <TouchableOpacity
                key={lesson.id}
                activeOpacity={0.85}
                onPress={() => {
                  setActiveLessonId(lesson.id);
                  setIsPlaying(true);
                }}
                style={[
                  styles.curriculumCard,
                  isActive && styles.curriculumCardActive,
                ]}
              >
                <View style={styles.curriculumThumbWrapper}>
                  <Image
                    source={require('@/assets/images/courses/succulent_thumbnail.jpg')}
                    style={styles.curriculumThumb}
                    resizeMode="cover"
                  />
                  {isActive && (
                    <View style={styles.activePlayingPill}>
                      <Play size={10} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                  )}
                </View>

                <View style={styles.curriculumTextWrapper}>
                  <Text style={[styles.lessonTitle, isActive && styles.lessonTitleActive]}>
                    {lesson.title}
                  </Text>
                  <View style={styles.lessonMetaRow}>
                    <Clock size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  playerContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000000',
    position: 'relative',
  },
  playerBackgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  playerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 44,
  },
  playerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerIconButton: {
    padding: 6,
  },
  playerCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerPlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  languagePillCard: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  langOption: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  langOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  langText: {
    fontSize: 11,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  playerBottomControls: {
    width: '100%',
  },
  timeAndScrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  scrubberTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  scrubberPlayed: {
    width: '50%',
    height: 4,
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  scrubberKnob: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    position: 'absolute',
    left: '50%',
    marginLeft: -5,
  },
  scrubberRemaining: {
    flex: 1,
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  controlIcon: {
    padding: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  courseMainTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  statText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aboutHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  aboutBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    marginTop: 6,
  },
  instructorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  instructorDetails: {
    flex: 1,
  },
  instructorLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  instructorName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  instructorRole: {
    color: '#EF4444',
    fontWeight: '700',
  },
  curriculumSectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E293B',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
  },
  curriculumList: {
    paddingHorizontal: 16,
  },
  curriculumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  curriculumCardActive: {
    borderColor: '#EF4444',
    backgroundColor: '#FFFBFB',
  },
  curriculumThumbWrapper: {
    width: 64,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginRight: 12,
    position: 'relative',
  },
  curriculumThumb: {
    width: '100%',
    height: '100%',
  },
  activePlayingPill: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curriculumTextWrapper: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  lessonTitleActive: {
    color: '#EF4444',
  },
  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lessonDuration: {
    fontSize: 11,
    color: '#64748B',
  },
});
