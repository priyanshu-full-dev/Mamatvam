import { useAuthStore } from '@/store/useAuthStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Apple,
  Baby,
  Bell,
  Eye,
  Heart,
  MessageCircle,
  Send,
  Share2,
  ShoppingBag,
  Sparkles,
  ThumbsUp,
  X,
} from 'lucide-react-native';
import { useState } from 'react';
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

interface CommunityCategory {
  id: string;
  name: string;
  icon: any;
}

interface CommunityPost {
  id: string;
  authorName: string;
  authorCategory: string;
  authorAvatar: any;
  date: string;
  content: string;
  image?: any;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  commentsList: string[];
  views: number;
  shares: number;
}

const CATEGORIES_DATA: CommunityCategory[] = [
  { id: 'all', name: 'All', icon: Sparkles },
  { id: 'pregnancy', name: 'Pregnancy', icon: Heart },
  { id: 'baby_care', name: 'Baby Care', icon: Baby },
  { id: 'ecommerce', name: 'Ecommerce', icon: ShoppingBag },
  { id: 'motherhood', name: 'Motherhood', icon: Sparkles },
  { id: 'nutrition', name: 'Nutrition', icon: Apple },
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorName: 'Super Admin',
    authorCategory: 'Motherhood',
    authorAvatar: require('@/assets/images/home/categories/astrologer.jpg'),
    date: '5 January 2026',
    content:
      "Lorem Ipsum is a dummy text used in the printing and typesetting industry. It has been the industry's standard placeholder text since the 1500s, when an unknown printer scrambled a galley of type to create a type specimen book. The text is derived from sections 1.10.3...",
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
    likes: 0,
    isLiked: false,
    commentsCount: 0,
    commentsList: [],
    views: 0,
    shares: 0,
  },
  {
    id: 'post_2',
    authorName: 'Super Admin',
    authorCategory: 'Motherhood',
    authorAvatar: require('@/assets/images/home/categories/doctor.jpg'),
    date: '5 January 2026',
    content:
      "Lorem Ipsum is a dummy text used in the printing and typesetting industry. It has been the industry's standard placeholder text since the 1500s, when an unknown printer scrambled a galley of type to create a type specimen book. The text is derived from sections 1.10.3...",
    image: require('@/assets/images/nuskhe/nuskhe_hero_herbs.jpg'),
    likes: 0,
    isLiked: false,
    commentsCount: 0,
    commentsList: [],
    views: 0,
    shares: 0,
  },
  {
    id: 'post_3',
    authorName: 'Super Admin',
    authorCategory: 'Motherhood',
    authorAvatar: require('@/assets/images/home/categories/lactationist.jpg'),
    date: '5 January 2026',
    content:
      "Lorem Ipsum is a dummy text used in the printing and typesetting industry. It has been the industry's standard placeholder text since the 1500s, when an unknown printer scrambled a galley of type to create a type specimen book. The text is derived from sections 1.10.3...",
    image: require('@/assets/images/nuskhe/nuskhe_coconut_water.jpg'),
    likes: 0,
    isLiked: false,
    commentsCount: 0,
    commentsList: [],
    views: 0,
    shares: 0,
  },
  {
    id: 'post_4',
    authorName: 'Super Admin',
    authorCategory: 'Motherhood',
    authorAvatar: require('@/assets/images/home/categories/nutritionist.jpg'),
    date: '5 January 2026',
    content:
      "Lorem Ipsum is a dummy text used in the printing and typesetting industry. It has been the industry's standard placeholder text since the 1500s, when an unknown printer scrambled a galley of type to create a type specimen book. The text is derived from sections 1.10.3...",
    image: require('@/assets/images/home/course_baby.jpg'),
    likes: 0,
    isLiked: false,
    commentsCount: 0,
    commentsList: [],
    views: 0,
    shares: 0,
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  // Create post modal state
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [newPostText, setNewPostText] = useState<string>('');
  const [newPostCategory, setNewPostCategory] = useState<string>('Motherhood');

  // Comments modal state
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  const activeCommentsPost = posts.find((p) => p.id === activeCommentsPostId);

  // Handle Like Toggle
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  // Handle Share Post
  const handleSharePost = async (post: CommunityPost) => {
    try {
      await Share.share({
        message: `${post.authorName} on Mamatvam Community:\n\n${post.content.slice(0, 140)}...`,
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, shares: p.shares + 1 } : p))
      );
    } catch {
      // Ignore dismiss
    }
  };

  // Handle Create Post Submit
  const handlePublishPost = () => {
    if (!newPostText.trim()) {
      Alert.alert('Empty Post', 'Please write something before publishing.');
      return;
    }

    const createdPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorName: user?.name || 'Miss sarah',
      authorCategory: newPostCategory,
      authorAvatar: require('@/assets/images/courses/doctor_sarah.jpg'),
      date: 'Today',
      content: newPostText.trim(),
      image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      commentsList: [],
      views: 1,
      shares: 0,
    };

    setPosts([createdPost, ...posts]);
    setNewPostText('');
    setCreateModalVisible(false);
  };

  // Handle Add Comment
  const handleAddComment = () => {
    if (!commentInput.trim() || !activeCommentsPostId) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === activeCommentsPostId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [...p.commentsList, commentInput.trim()],
          };
        }
        return p;
      })
    );

    setCommentInput('');
  };

  // Filter posts if category selected
  const displayedPosts = posts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.authorCategory.toLowerCase().includes(selectedCategory.replace('_', ' ').toLowerCase());
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Matching Screenshot */}
      <View style={styles.headerRow}>
        <View style={styles.userInfoRow}>
          {/* User Profile Avatar Circle */}
          <View style={styles.userAvatarCircle}>
            <Image
              source={require('@/assets/images/courses/doctor_sarah.jpg')}
              style={styles.headerAvatarImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.userTextCol}>
            <Text style={styles.greetingText}>Good morning</Text>
            <Text style={styles.userNameText}>{user?.name || 'Miss sarah'}</Text>
          </View>
        </View>

        {/* Bell Notification Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/notifications')}
          style={styles.notificationBtn}
          accessibilityLabel="Notifications"
        >
          <Bell size={22} color="#EE4D38" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Category Circles Bar */}
        <View style={styles.categoriesBarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            {CATEGORIES_DATA.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const IconComp = cat.icon;

              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.75}
                  onPress={() => setSelectedCategory(isSelected && cat.id !== 'all' ? 'all' : cat.id)}
                  style={styles.categoryCircleItem}
                >
                  <View
                    style={[
                      styles.circleBadge,
                      isSelected && styles.circleBadgeSelected,
                    ]}
                  >
                    <IconComp
                      size={24}
                      color={isSelected ? '#EE4D38' : '#6B7280'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabelText,
                      isSelected && styles.categoryLabelTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* "Ask Anything" Create Post Bar */}
        <View style={styles.askAnythingRow}>
          <Image
            source={require('@/assets/images/courses/doctor_sarah.jpg')}
            style={styles.askUserAvatar}
            contentFit="cover"
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCreateModalVisible(true)}
            style={styles.askInputPill}
          >
            <Text style={styles.askInputPlaceholder}>Ask Anything</Text>
          </TouchableOpacity>
        </View>

        {/* Community Feed Posts */}
        {displayedPosts.map((post, index) => (
          <View key={post.id}>
            <View style={styles.postCard}>
              {/* Post Header: Avatar, Name, Category, Date */}
              <View style={styles.postHeaderRow}>
                <Image
                  source={post.authorAvatar}
                  style={styles.authorAvatar}
                  contentFit="cover"
                />

                <View style={styles.authorMetaCol}>
                  <Text style={styles.authorName}>{post.authorName}</Text>
                  <Text style={styles.authorCategory}>{post.authorCategory}</Text>
                </View>

                <Text style={styles.postDateText}>{post.date}</Text>
              </View>

              {/* Post Content Text */}
              <Text style={styles.postBodyText}>{post.content}</Text>

              {/* Post Image Matching Screenshot */}
              {post.image && (
                <View style={styles.postImageContainer}>
                  <Image
                    source={post.image}
                    style={styles.postImage}
                    contentFit="cover"
                  />
                </View>
              )}

              {/* Bottom Action Row: Like, Comment, Views, Share */}
              <View style={styles.actionRow}>
                {/* 1. Like */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleToggleLike(post.id)}
                  style={styles.actionItem}
                >
                  <ThumbsUp
                    size={15}
                    color={post.isLiked ? '#EE4D38' : '#374151'}
                  />
                  <Text
                    style={[
                      styles.actionLabel,
                      post.isLiked && { color: '#EE4D38', fontWeight: '700' },
                    ]}
                  >
                    {post.likes} like
                  </Text>
                </TouchableOpacity>

                {/* 2. Comment */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setActiveCommentsPostId(post.id)}
                  style={styles.actionItem}
                >
                  <MessageCircle size={15} color="#374151" />
                  <Text style={styles.actionLabel}>{post.commentsCount} comment</Text>
                </TouchableOpacity>

                {/* 3. Views */}
                <View style={styles.actionItem}>
                  <Eye size={15} color="#374151" />
                  <Text style={styles.actionLabel}>{post.views} Views</Text>
                </View>

                {/* 4. Share */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSharePost(post)}
                  style={styles.actionItem}
                >
                  <Share2 size={15} color="#374151" />
                  <Text style={styles.actionLabel}>{post.shares} share</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Separator between posts */}
            {index < displayedPosts.length - 1 && <View style={styles.postDivider} />}
          </View>
        ))}
      </ScrollView>

      {/* ================= CREATE POST MODAL ================= */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.createModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Ask the Community</Text>
              <TouchableOpacity
                onPress={() => setCreateModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Category Select Pills */}
            <Text style={styles.inputLabel}>Select Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {['Pregnancy', 'Baby Care', 'Motherhood', 'Ecommerce', 'Nutrition'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setNewPostCategory(cat)}
                  style={[
                    styles.tagChoicePill,
                    newPostCategory === cat && styles.tagChoicePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagChoiceText,
                      newPostCategory === cat && styles.tagChoiceTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              multiline
              numberOfLines={4}
              value={newPostText}
              onChangeText={setNewPostText}
              placeholder="What questions or thoughts do you have today? Connect with moms and specialists..."
              placeholderTextColor="#9CA3AF"
              style={styles.postTextInput}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePublishPost}
              style={styles.publishBtn}
            >
              <Text style={styles.publishBtnText}>Post Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= COMMENTS MODAL ================= */}
      {activeCommentsPostId && activeCommentsPost && (
        <Modal
          visible={!!activeCommentsPostId}
          transparent
          animationType="slide"
          onRequestClose={() => setActiveCommentsPostId(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.commentsModalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>
                  Comments ({activeCommentsPost.commentsCount})
                </Text>
                <TouchableOpacity
                  onPress={() => setActiveCommentsPostId(null)}
                  style={styles.modalCloseBtn}
                >
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 280, marginBottom: 12 }}>
                {activeCommentsPost.commentsList.length === 0 ? (
                  <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                    <Text style={{ fontSize: 13, color: '#9CA3AF' }}>
                      No comments yet. Be the first to share advice!
                    </Text>
                  </View>
                ) : (
                  activeCommentsPost.commentsList.map((comm, idx) => (
                    <View key={idx} style={styles.commentBubble}>
                      <Text style={styles.commentAuthor}>Community Member</Text>
                      <Text style={styles.commentBody}>{comm}</Text>
                    </View>
                  ))
                )}
              </ScrollView>

              <View style={styles.commentInputRow}>
                <TextInput
                  value={commentInput}
                  onChangeText={setCommentInput}
                  placeholder="Write a supportive reply..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.commentInput}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleAddComment}
                  style={styles.sendCommentBtn}
                >
                  <Send size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D1D5DB',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  userTextCol: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  notificationBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },

  // Categories Bar
  categoriesBarContainer: {
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
  },
  categoryCircleItem: {
    alignItems: 'center',
    marginRight: 18,
    width: 64,
  },
  circleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBadgeSelected: {
    borderWidth: 2,
    borderColor: '#EE4D38',
    backgroundColor: '#FFF1EE',
  },
  categoryLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E1E1E',
    marginTop: 6,
    textAlign: 'center',
  },
  categoryLabelTextSelected: {
    color: '#EE4D38',
    fontWeight: '800',
  },

  // Ask Anything Row
  askAnythingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  askUserAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: '#E2E8F0',
  },
  askInputPill: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  askInputPlaceholder: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '400',
  },

  // Post Card
  postCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    marginRight: 10,
  },
  authorMetaCol: {
    flex: 1,
  },
  authorName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  authorCategory: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  postDateText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  postBodyText: {
    fontSize: 12.5,
    color: '#374151',
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  postImageContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  postImage: {
    width: 220,
    height: 220,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 11.5,
    color: '#374151',
    marginLeft: 5,
    fontWeight: '500',
  },
  postDivider: {
    height: 8,
    backgroundColor: '#F3F4F6',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  createModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  commentsModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '80%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  tagChoicePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  tagChoicePillActive: {
    backgroundColor: '#EE4D38',
  },
  tagChoiceText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  tagChoiceTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  postTextInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13.5,
    color: '#1E293B',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  publishBtn: {
    backgroundColor: '#EE4D38',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  commentBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  commentBody: {
    fontSize: 12.5,
    color: '#374151',
    marginTop: 2,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1E293B',
    marginRight: 8,
  },
  sendCommentBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EE4D38',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
