import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Heart,
  Pause,
  Play,
  Send,
  Share2,
  Star,
  X,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface RealStoryItem {
  id: string;
  name: string;
  fullName: string;
  category: string;
  duration: string;
  videoDuration: string;
  rating: number;
  headline: string;
  quote: string;
  fullStory: string;
  badge: string;
  image: any;
  avatar: any;
  helpfulCount: number;
}

const ALL_STORIES: RealStoryItem[] = [
  {
    id: 'story-1',
    name: 'Priya S.',
    fullName: 'Priya Sharma',
    category: 'Pregnancy • Week 28',
    duration: '0:42',
    videoDuration: '01:24',
    rating: 5,
    headline: '“I feel supported every week”',
    quote: '“I feel supported every week.”',
    fullStory:
      '“MAMATVAM helps me understand my journey one step at a time. The weekly guidance makes me feel more confident.”',
    badge: 'Member story',
    image: require('@/assets/images/stories/story_priya.jpg'),
    avatar: require('@/assets/images/stories/story_priya.jpg'),
    helpfulCount: 42,
  },
  {
    id: 'story-2',
    name: 'Anjali & Rohit',
    fullName: 'Anjali & Rohit',
    category: 'Trying to Conceive',
    duration: '0:56',
    videoDuration: '01:45',
    rating: 5,
    headline: '“We learned together”',
    quote: '“We learned together.”',
    fullStory:
      '“When trying to conceive, tracking everything felt overwhelming. With Mamatvam fertility tools and advice, we stayed calm, informed, and joyful together.”',
    badge: 'Member story',
    image: require('@/assets/images/stories/story_anjali_rohit.jpg'),
    avatar: require('@/assets/images/stories/story_anjali_rohit.jpg'),
    helpfulCount: 38,
  },
  {
    id: 'story-3',
    name: 'Neha M.',
    fullName: 'Neha M.',
    category: 'Motherhood',
    duration: '0:38',
    videoDuration: '01:10',
    rating: 5,
    headline: '“Helpful tips for my first weeks”',
    quote: '“Helpful tips for my first weeks.”',
    fullStory:
      '“The postpartum recovery routines and lactation tips gave me peace of mind. Knowing verified doctors and nutritionists were just a tap away was a lifesaver.”',
    badge: 'Member story',
    image: require('@/assets/images/stories/story_neha.jpg'),
    avatar: require('@/assets/images/stories/story_neha.jpg'),
    helpfulCount: 56,
  },
  {
    id: 'story-4',
    name: 'Kavita R.',
    fullName: 'Kavita Reddy',
    category: 'Postpartum Care',
    duration: '0:49',
    videoDuration: '01:32',
    rating: 5,
    headline: '“Gentle guidance when I needed it most”',
    quote: '“Gentle guidance when I needed it most.”',
    fullStory:
      '“From gentle pelvic exercises to soothing feeding techniques, Mamatvam supported our whole family transition smoothly into healthy parenthood.”',
    badge: 'Member story',
    image: require('@/assets/images/home/mother_baby.jpg'),
    avatar: require('@/assets/images/home/mother_baby.jpg'),
    helpfulCount: 29,
  },
];

export default function StoryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const scrollViewRef = useRef<ScrollView>(null);

  // Active story selection
  const [activeStoryId, setActiveStoryId] = useState<string>(
    params.id && ALL_STORIES.some((s) => s.id === params.id)
      ? params.id
      : ALL_STORIES[0].id
  );

  const activeStory =
    ALL_STORIES.find((s) => s.id === activeStoryId) || ALL_STORIES[0];
  const moreStories = ALL_STORIES.filter((s) => s.id !== activeStory.id);

  // Interactive video simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Helpful state
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const isHelpful = !!helpfulMap[activeStory.id];

  // Share story modal state
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formName, setFormName] = useState('');
  const [formStage, setFormStage] = useState('Pregnancy');
  const [formStory, setFormStory] = useState('');

  const toggleHelpful = () => {
    setHelpfulMap((prev) => {
      const next = !prev[activeStory.id];
      if (next) {
        Alert.alert('Thank you! ❤️', 'Marked as helpful. Your feedback supports our community.');
      }
      return { ...prev, [activeStory.id]: next };
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${activeStory.fullName} shared their story on Mamatvam: "${activeStory.fullStory}" — Join our community on Mamatvam!`,
      });
    } catch {
      // ignore
    }
  };

  const handleSelectStory = (storyId: string) => {
    setActiveStoryId(storyId);
    setIsPlaying(false);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSubmitStory = () => {
    if (!formStory.trim()) {
      Alert.alert('Required', 'Please enter a few words about your journey.');
      return;
    }
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShareModalVisible(false);
      setFormName('');
      setFormStory('');
      Alert.alert(
        'Story Received! 🌸',
        'Thank you for sharing your experience. Our team will review and feature it in the community stories.'
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconButton}
          activeOpacity={0.7}
          hitSlop={12}
        >
          <ArrowLeft size={22} color="#0F172A" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Stories</Text>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.headerIconButton}
          activeOpacity={0.7}
          hitSlop={12}
        >
          <Share2 size={20} color="#64748B" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Video / Featured Player Card */}
        <View style={styles.videoCard}>
          <Image
            source={activeStory.image}
            style={styles.videoImage}
            contentFit="cover"
          />

          {/* Sample story badge */}
          <View style={styles.sampleStoryBadge}>
            <Text style={styles.sampleStoryText}>Sample story</Text>
          </View>

          {/* Center Play / Pause Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsPlaying(!isPlaying)}
            style={styles.playButtonCircle}
          >
            {isPlaying ? (
              <Pause size={22} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={22} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
            )}
          </TouchableOpacity>

          {/* Video Duration Badge */}
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {isPlaying ? 'Playing' : activeStory.videoDuration}
            </Text>
          </View>
        </View>

        {/* Story Metadata & Author Info */}
        <View style={styles.authorSection}>
          <View style={styles.authorRow}>
            <View style={styles.authorLeft}>
              <Image
                source={activeStory.avatar}
                style={styles.avatarImage}
                contentFit="cover"
              />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{activeStory.fullName}</Text>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{activeStory.category}</Text>
                </View>
              </View>
            </View>

            {/* Member story tag */}
            <View style={styles.memberStoryPill}>
              <Text style={styles.memberStoryText}>{activeStory.badge}</Text>
            </View>
          </View>

          {/* 5 Red Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={16} color="#e62a09" fill="#e62a09" />
            ))}
          </View>

          {/* Headline Quote */}
          <Text style={styles.headlineText}>{activeStory.headline}</Text>

          {/* Full Testimonial Body */}
          <Text style={styles.bodyText}>{activeStory.fullStory}</Text>

          {/* Action Buttons: Helpful & Share */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={toggleHelpful}
              style={[styles.actionButton, isHelpful && styles.actionButtonActive]}
            >
              <Heart
                size={18}
                color="#e62a09"
                fill={isHelpful ? '#e62a09' : 'none'}
                strokeWidth={2.2}
              />
              <Text style={styles.actionButtonText}>
                {isHelpful ? 'Helpful (Liked)' : 'Helpful'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleShare}
              style={styles.actionButton}
            >
              <Share2 size={18} color="#e62a09" strokeWidth={2.2} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* "More stories you may like" Section */}
        <View style={styles.moreSection}>
          <Text style={styles.moreTitle}>More stories you may like</Text>

          {moreStories.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleSelectStory(item.id)}
              style={styles.moreCard}
            >
              {/* Thumbnail with Sample story badge */}
              <View style={styles.moreThumbnailWrapper}>
                <Image
                  source={item.image}
                  style={styles.moreThumbnail}
                  contentFit="cover"
                />
                <View style={styles.moreBadge}>
                  <Text style={styles.moreBadgeText}>Sample story</Text>
                </View>
              </View>

              {/* Story Details */}
              <View style={styles.moreDetails}>
                <Text style={styles.moreName}>{item.fullName}</Text>
                <View style={styles.morePill}>
                  <Text style={styles.morePillText}>{item.category}</Text>
                </View>
                <View style={styles.moreStarsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={12} color="#e62a09" fill="#e62a09" />
                  ))}
                </View>
              </View>

              {/* Red Chevron */}
              <ChevronRight size={20} color="#e62a09" strokeWidth={2.4} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom CTA Button */}
        <View style={styles.bottomCtaSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShareModalVisible(true)}
            style={styles.shareStoryButton}
          >
            <Send
              size={17}
              color="#FFFFFF"
              strokeWidth={2.4}
              style={{ transform: [{ rotate: '-20deg' }] }}
            />
            <Text style={styles.shareStoryButtonText}>Share Your Story</Text>
          </TouchableOpacity>
          <Text style={styles.shareStorySubtitle}>
            Your experience may inspire another family.
          </Text>
        </View>
      </ScrollView>

      {/* Share Your Story Form Modal */}
      <Modal
        visible={shareModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Share Your Story</Text>
                <Text style={styles.modalSubtitle}>Inspire mothers and families in the community</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShareModalVisible(false)}
                hitSlop={10}
                style={styles.modalCloseButton}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {submitSuccess ? (
              <View style={styles.modalSuccessView}>
                <CheckCircle2 size={48} color="#16A34A" />
                <Text style={styles.modalSuccessTitle}>Story Submitted!</Text>
                <Text style={styles.modalSuccessText}>
                  Thank you for contributing to the Mamatvam community!
                </Text>
              </View>
            ) : (
              <View style={styles.modalForm}>
                <Text style={styles.fieldLabel}>Your Name (Optional)</Text>
                <TextInput
                  placeholder="e.g. Radhika S."
                  placeholderTextColor="#94A3B8"
                  value={formName}
                  onChangeText={setFormName}
                  style={styles.textInput}
                />

                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Your Stage</Text>
                <View style={styles.stageOptionsRow}>
                  {['Conceive', 'Pregnancy', 'Motherhood'].map((stg) => (
                    <TouchableOpacity
                      key={stg}
                      activeOpacity={0.8}
                      onPress={() => setFormStage(stg)}
                      style={[
                        styles.stageOptionChip,
                        formStage === stg && styles.stageOptionChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stageOptionChipText,
                          formStage === stg && styles.stageOptionChipTextSelected,
                        ]}
                      >
                        {stg}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Your Experience / Quote *</Text>
                <TextInput
                  placeholder="Share a short experience or advice for other mothers..."
                  placeholderTextColor="#94A3B8"
                  value={formStory}
                  onChangeText={setFormStory}
                  multiline
                  numberOfLines={4}
                  style={[styles.textInput, styles.textAreaInput]}
                />

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSubmitStory}
                  style={styles.submitModalButton}
                >
                  <Text style={styles.submitModalButtonText}>Submit Story</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  videoCard: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    height: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  sampleStoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  sampleStoryText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  playButtonCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -26,
    marginLeft: -26,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  authorSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#FFE4E6',
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 3,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BE185D',
  },
  memberStoryPill: {
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  memberStoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BE185D',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 3,
  },
  headlineText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    letterSpacing: -0.2,
  },
  bodyText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FECDD3',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionButtonActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FDA4AF',
  },
  actionButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#e62a09',
    marginLeft: 8,
  },
  moreSection: {
    marginTop: 26,
    paddingHorizontal: 16,
  },
  moreTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  moreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 9,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  moreThumbnailWrapper: {
    position: 'relative',
    width: 108,
    height: 74,
    borderRadius: 11,
    overflow: 'hidden',
  },
  moreThumbnail: {
    width: '100%',
    height: '100%',
  },
  moreBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  moreBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  moreDetails: {
    flex: 1,
    marginLeft: 12,
  },
  moreName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  morePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
    marginTop: 3,
  },
  morePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BE185D',
  },
  moreStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 2,
  },
  bottomCtaSection: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  shareStoryButton: {
    backgroundColor: '#e62a09',
    borderRadius: 30,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e62a09',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  shareStoryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  shareStorySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalForm: {
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textAreaInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  stageOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stageOptionChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  stageOptionChipSelected: {
    backgroundColor: '#FFE4E6',
    borderWidth: 1,
    borderColor: '#FDA4AF',
  },
  stageOptionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  stageOptionChipTextSelected: {
    color: '#BE185D',
    fontWeight: '700',
  },
  submitModalButton: {
    backgroundColor: '#e62a09',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitModalButtonText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalSuccessView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  modalSuccessTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  modalSuccessText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
});
