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
  Linking,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Calendar,
  Globe,
  ThumbsUp,
  Eye,
  Share2,
  X,
  Send,
} from 'lucide-react-native';

const AVATAR_MAP: Record<string, any> = {
  exp_1: require('@/assets/images/home/categories/gynecology.jpg'),
  exp_2: require('@/assets/images/home/categories/doctor.jpg'),
  exp_3: require('@/assets/images/home/categories/nutritionist.jpg'),
  exp_4: require('@/assets/images/home/categories/sonologist.jpg'),
  exp_5: require('@/assets/images/home/categories/lactationist.jpg'),
  exp_6: require('@/assets/images/home/categories/physiotherapist.jpg'),
  exp_7: require('@/assets/images/home/categories/yoga.jpg'),
  exp_8: require('@/assets/images/home/categories/astrologer.jpg'),
  exp_9: require('@/assets/images/home/categories/financial.jpg'),
  exp_10: require('@/assets/images/home/categories/stem_cell.jpg'),
};

interface PostItem {
  id: string;
  image?: any;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  isLiked?: boolean;
}

export default function ExpertProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    specialty?: string;
    category?: string;
    hospital?: string;
    rating?: string;
  }>();

  const expertName = (params.name as string) || 'Mis sara';
  const expertSubtitle = (params.hospital as string) || 'Healthcare pvt limited';
  const expertCategory = (params.category as string) || 'Motherhood';

  const expertAvatar =
    (params.id && AVATAR_MAP[params.id as string]) ||
    require('@/assets/images/home/categories/astrologer.jpg');

  // Interactive posts state matching Screenshot 2
  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: 'post_1',
      image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
      likes: 0,
      comments: 0,
      views: 0,
      shares: 0,
      isLiked: false,
    },
    {
      id: 'post_2',
      image: require('@/assets/images/courses/wheat_field.jpg'),
      likes: 0,
      comments: 0,
      views: 0,
      shares: 0,
      isLiked: false,
    },
    {
      id: 'post_3',
      image: require('@/assets/images/courses/mountain_pine.jpg'),
      likes: 0,
      comments: 0,
      views: 0,
      shares: 0,
      isLiked: false,
    },
    {
      id: 'post_4',
      likes: 0,
      comments: 0,
      views: 0,
      shares: 0,
      isLiked: false,
    },
  ]);

  // Comment Modal state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newLiked,
            likes: newLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
          };
        }
        return post;
      })
    );
  };

  const handleSharePost = async (postIndex: number) => {
    try {
      await Share.share({
        message: `Check out this expert post by ${expertName} on Mamatvam!`,
      });
      setPosts((prev) =>
        prev.map((post, idx) =>
          idx === postIndex ? { ...post, shares: post.shares + 1 } : post
        )
      );
    } catch (e) {
      // ignore
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !activeCommentPostId) return;
    setPosts((prev) =>
      prev.map((post) =>
        post.id === activeCommentPostId
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
    setCommentText('');
    setActiveCommentPostId(null);
    Alert.alert('Comment Sent', 'Your comment has been posted successfully.');
  };

  const handleCall = () => {
    Alert.alert(
      'Call Expert',
      `Would you like to place a phone consultation with ${expertName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL('tel:+18005550199').catch(() => {
              Alert.alert('Notice', 'Unable to initiate call on this device.');
            });
          },
        },
      ]
    );
  };

  const handleMessage = () => {
    Alert.alert(
      'Message Expert',
      `Start a direct conversation with ${expertName}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Message',
          onPress: () => {
            Alert.alert('Message Sent', `Your inquiry has been forwarded to ${expertName}.`);
          },
        },
      ]
    );
  };

  const topPadding = Math.max(insets.top, 24);
  const bottomPadding = Math.max(insets.bottom, 24) + 20;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        {/* ================= TOP PINK BANNER HEADER ================= */}
        <View style={[styles.topBanner, { paddingTop: topPadding }]}>
          {/* Back Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.backButton}
          >
            <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Action Buttons: Phone & Message */}
          <View style={styles.bannerActionButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCall}
              style={styles.iconCircleButton}
            >
              <Phone size={17} color="#000000" strokeWidth={2.2} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleMessage}
              style={styles.iconCircleButton}
            >
              <MessageSquare size={17} color="#000000" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= PROFILE AVATAR & NAME SECTION ================= */}
        <View style={styles.profileInfoWrapper}>
          {/* Overlapping Large Circular Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={expertAvatar}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>

          {/* Doctor / Expert Name */}
          <Text style={styles.doctorName}>{expertName}</Text>

          {/* Subtitle / Company in Red */}
          <Text style={styles.doctorSubtitle}>{expertSubtitle}</Text>
        </View>

        {/* ================= BIO CARD ================= */}
        <View style={styles.bioCard}>
          <Text style={styles.bioLabel}>Bio</Text>
          <Text style={styles.bioContent}>
            Mumma, i i have arrived, please change your stage to get all
          </Text>
        </View>

        {/* ================= TWO-COLUMN GRID ================= */}
        <View style={styles.twoColumnRow}>
          {/* Left Column: Certifications */}
          <View style={styles.certificationsCard}>
            <View style={styles.cardHeaderRow}>
              <Calendar size={15} color="#475569" style={{ marginRight: 6 }} />
              <Text style={styles.cardHeaderTitle}>Certifications</Text>
            </View>

            <View style={styles.certList}>
              <View style={styles.certItemRow}>
                <Text style={styles.certText}>
                  Mumma, i i have arrived, please change your
                </Text>
              </View>

              <View style={styles.certDivider} />

              <View style={styles.certItemRow}>
                <Text style={styles.certText}>
                  Mumma, i i have arrived, please change your
                </Text>
              </View>

              <View style={styles.certDivider} />

              <View style={styles.certItemRow}>
                <Text style={styles.certText}>
                  Mumma, i i have arrived, please change your
                </Text>
              </View>
            </View>
          </View>

          {/* Right Column: Availability & Languages */}
          <View style={styles.rightColumnWrapper}>
            {/* Top Card: Availability */}
            <View style={styles.availabilityCard}>
              <View style={styles.cardHeaderRow}>
                <Calendar size={15} color="#475569" style={{ marginRight: 6 }} />
                <Text style={styles.cardHeaderTitle}>Availability</Text>
              </View>

              <View style={styles.availSlotPill}>
                <Text style={styles.availDayText}>Fri</Text>
                <Text style={styles.availTimeText}>10:00–12:00</Text>
              </View>

              <View style={[styles.availSlotPill, { marginTop: 6 }]}>
                <Text style={styles.availDayText}>Fri</Text>
                <Text style={styles.availTimeText}>10:00–12:00</Text>
              </View>
            </View>

            {/* Bottom Card: Languages */}
            <View style={styles.languagesCard}>
              <View style={styles.cardHeaderRow}>
                <Globe size={15} color="#475569" style={{ marginRight: 6 }} />
                <Text style={styles.cardHeaderTitle}>Languages</Text>
              </View>

              <Text style={styles.languagesText}>English    Hindi</Text>
            </View>
          </View>
        </View>

        {/* ================= EXPERTISE TAGS CARD ================= */}
        <View style={styles.expertiseCard}>
          <Text style={styles.expertiseLabel}>Expertise Tag...</Text>
          <View style={styles.tagsContainer}>
            {['Paid Social', 'Paid Social', 'Paid Social', 'Paid Social', 'Paid Social'].map(
              (tag, index) => (
                <View key={index} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* ================= POSTS TIMELINE FEED ================= */}
        <View style={styles.postsSection}>
          {posts.map((post, index) => (
            <View key={post.id} style={styles.postCard}>
              {/* Post Author Header */}
              <View style={styles.postHeaderRow}>
                <Image
                  source={expertAvatar}
                  style={styles.postAuthorAvatar}
                  resizeMode="cover"
                />
                <View style={styles.postAuthorInfo}>
                  <Text style={styles.postAuthorName}>{expertName}</Text>
                  <Text style={styles.postCategory}>{expertCategory}</Text>
                </View>
                <Text style={styles.postDate}>5 January 2026</Text>
              </View>

              {/* Post Text Description */}
              <Text style={styles.postBodyText}>
                Lorem Ipsum is a dummy text used in the printing and typesetting industry.
                It has been the industry's standard placeholder text since the 1500s, when an
                unknown printer scrambled a galley of type to create a type specimen book.
                The text is derived from sections 1.10.3...
              </Text>

              {/* Post Image Media */}
              {post.image && (
                <View style={styles.postImageWrapper}>
                  <Image source={post.image} style={styles.postImage} resizeMode="cover" />
                </View>
              )}

              {/* Post Social Engagement Footer */}
              <View style={styles.postFooterRow}>
                {/* Like Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleToggleLike(post.id)}
                  style={styles.engagementBtn}
                >
                  <ThumbsUp
                    size={15}
                    color={post.isLiked ? '#EF4444' : '#64748B'}
                    fill={post.isLiked ? '#EF4444' : 'transparent'}
                  />
                  <Text
                    style={[
                      styles.engagementText,
                      post.isLiked && { color: '#EF4444', fontWeight: '700' },
                    ]}
                  >
                    {post.likes} like
                  </Text>
                </TouchableOpacity>

                {/* Comment Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setActiveCommentPostId(post.id)}
                  style={styles.engagementBtn}
                >
                  <MessageSquare size={15} color="#64748B" />
                  <Text style={styles.engagementText}>{post.comments} comment</Text>
                </TouchableOpacity>

                {/* Views Count */}
                <View style={styles.engagementBtn}>
                  <Eye size={15} color="#64748B" />
                  <Text style={styles.engagementText}>{post.views} Views</Text>
                </View>

                {/* Share Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSharePost(index)}
                  style={styles.engagementBtn}
                >
                  <Share2 size={15} color="#64748B" />
                  <Text style={styles.engagementText}>{post.shares} share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ================= COMMENT POPUP MODAL ================= */}
      {activeCommentPostId && (
        <Modal
          visible={!!activeCommentPostId}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveCommentPostId(null)}
        >
          <View style={styles.commentModalOverlay}>
            <View style={styles.commentModalCard}>
              <View style={styles.commentModalHeader}>
                <Text style={styles.commentModalTitle}>Write a Comment</Text>
                <TouchableOpacity onPress={() => setActiveCommentPostId(null)}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.commentInput}
                placeholder="Share your thoughts on this post..."
                placeholderTextColor="#94A3B8"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                autoFocus
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAddComment}
                style={[
                  styles.commentSubmitBtn,
                  !commentText.trim() && { backgroundColor: '#CBD5E1' },
                ]}
                disabled={!commentText.trim()}
              >
                <Send size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.commentSubmitText}>Post Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  topBanner: {
    backgroundColor: '#FFD7D7',
    height: 140,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    padding: 6,
    marginTop: 4,
  },
  bannerActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  iconCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileInfoWrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -48,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#D1D5DB',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 10,
    letterSpacing: -0.2,
  },
  doctorSubtitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#EF4444',
    marginTop: 3,
  },
  bioCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  bioLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    width: 38,
    marginTop: 1,
  },
  bioContent: {
    flex: 1,
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
  },
  twoColumnRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  certificationsCard: {
    flex: 1.1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  certList: {
    marginTop: 2,
  },
  certItemRow: {
    paddingVertical: 5,
  },
  certText: {
    fontSize: 10.5,
    color: '#475569',
    lineHeight: 15,
  },
  certDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  rightColumnWrapper: {
    flex: 1,
    gap: 12,
  },
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  availSlotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  availDayText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  availTimeText: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '700',
  },
  languagesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  languagesText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  expertiseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    alignItems: 'flex-start',
  },
  expertiseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
    marginRight: 8,
    width: 90,
  },
  tagsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FFFFFF',
  },
  tagText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },
  postsSection: {
    marginTop: 14,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1.5,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    marginRight: 10,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  postCategory: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  postDate: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  postBodyText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#334155',
    marginTop: 10,
  },
  postImageWrapper: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: '#F1F5F9',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  engagementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  engagementText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  commentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  commentModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
  },
  commentModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  commentModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  commentInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13,
    color: '#1E293B',
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  commentSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EE4D38',
    borderRadius: 12,
    paddingVertical: 12,
  },
  commentSubmitText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
