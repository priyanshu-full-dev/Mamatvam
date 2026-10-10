import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Heart,
  Sparkles,
} from 'lucide-react-native';

export default function CourseArticleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    category?: string;
  }>();

  const [isSaved, setIsSaved] = useState(false);
  const [isReadCompleted, setIsReadCompleted] = useState(false);

  const articleTitle = params.title || 'Safe Prenatal Yoga: Essential Postures & Daily Guide';
  const category = params.category || 'PRENATAL FITNESS';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${articleTitle} - Essential prenatal wellness article on Mamatvam App!`,
      });
    } catch {
      // ignore
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Removed' : 'Article Saved! 🌸',
      isSaved
        ? 'Removed from your saved articles library.'
        : 'Saved to your offline reading collection.'
    );
  };

  const handleMarkAsRead = () => {
    setIsReadCompleted(true);
    Alert.alert('Completed! 🌸', 'You completed reading this article. Great job on taking care of yourself today!');
  };

  const topPadding = Math.max(insets.top, 24) + 8;
  const bottomPadding = Math.max(insets.bottom, 24) + 80;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* Header Bar */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.iconButton}
        >
          <ArrowLeft size={24} color="#1E293B" strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Reading Article
        </Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSave}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconButton}
          >
            <Bookmark
              size={22}
              color={isSaved ? '#E11D48' : '#1E293B'}
              fill={isSaved ? '#E11D48' : 'none'}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShare}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.iconButton, { marginLeft: 8 }]}
          >
            <Share2 size={22} color="#1E293B" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        {/* Hero Image Banner */}
        <View style={styles.heroImageWrapper}>
          <Image
            source={require('@/assets/images/courses/succulent_thumbnail.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.readingBadgeOverlay}>
            <BookOpen size={12} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 5 }} />
            <Text style={styles.readingBadgeText}>Reading Article</Text>
          </View>
        </View>

        {/* Article Meta Bar */}
        <View style={styles.contentContainer}>
          <View style={styles.metaRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{category}</Text>
            </View>
            <View style={styles.readTimeBadge}>
              <Clock size={12} color="#64748B" style={{ marginRight: 4 }} />
              <Text style={styles.readTimeText}>10 min read</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.articleTitle}>{articleTitle}</Text>

          {/* Author / Doctor Card */}
          <View style={styles.authorCard}>
            <Image
              source={require('@/assets/images/courses/doctor_sarah.jpg')}
              style={styles.authorAvatar}
            />
            <View style={styles.authorInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.authorName}>Dr. Sarah Chen, MD</Text>
                <Sparkles size={13} color="#E11D48" style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.authorRole}>Prenatal OB-GYN & Yoga Specialist</Text>
              <Text style={styles.reviewedDate}>Medically Reviewed • Updated 2026</Text>
            </View>
          </View>

          {/* Quick Key Takeaways Box */}
          <View style={styles.takeawaysCard}>
            <View style={styles.takeawaysHeader}>
              <Sparkles size={16} color="#E11D48" style={{ marginRight: 6 }} />
              <Text style={styles.takeawaysTitle}>Key Takeaways for You</Text>
            </View>
            <View style={styles.takeawaysItem}>
              <CheckCircle2 size={16} color="#10B981" style={styles.takeawayIcon} />
              <Text style={styles.takeawayText}>
                Gentle prenatal movement reduces common lower back ache and improves circulation by up to 35%.
              </Text>
            </View>
            <View style={styles.takeawaysItem}>
              <CheckCircle2 size={16} color="#10B981" style={styles.takeawayIcon} />
              <Text style={styles.takeawayText}>
                Always listen to your breath: never hold your breath or push through sharp abdominal sensations.
              </Text>
            </View>
            <View style={styles.takeawaysItem}>
              <CheckCircle2 size={16} color="#10B981" style={styles.takeawayIcon} />
              <Text style={styles.takeawayText}>
                Supported hip openers gently prepare your pelvic ligaments for an easier, smoother labor.
              </Text>
            </View>
          </View>

          {/* Chapter 1 */}
          <View style={styles.articleSection}>
            <Text style={styles.sectionHeader}>1. Why Mindful Movement Matters in Pregnancy</Text>
            <Text style={styles.paragraph}>
              During pregnancy, your body undergoes extraordinary biochemical and physical transformations.
              The hormone relaxin softens joints and ligaments to make room for your growing baby. While this
              is essential, it can occasionally destabilize pelvic joints and put extra strain on lumbar muscles.
            </Text>
            <Text style={styles.paragraph}>
              Gentle, targeted prenatal yoga acts as a natural stabilizer. By prioritizing alignment over
              deep flexibility, you reinforce core stability, tone the pelvic floor muscles safely, and cultivate
              calm mental resilience through conscious diaphragmatic breathing.
            </Text>
          </View>

          {/* Chapter 2: Recommended Safe Postures */}
          <View style={styles.articleSection}>
            <Text style={styles.sectionHeader}>2. Safe Core Postures for Every Stage</Text>
            
            <View style={styles.poseCard}>
              <Text style={styles.poseTitle}>• Cat-Cow Stretch (Marjaryasana-Bitilasana)</Text>
              <Text style={styles.poseDesc}>
                Gently relieves spinal compression and encourages the baby into an optimal anterior head-down
                position. Keep wrists directly below shoulders and move at the rhythm of your deep inhalation.
              </Text>
            </View>

            <View style={styles.poseCard}>
              <Text style={styles.poseTitle}>• Supported Butterfly (Baddha Konasana)</Text>
              <Text style={styles.poseDesc}>
                Place yoga blocks or rolled towels under both knees to protect your inner groin ligaments. Sit
                tall against a wall to relieve pressure off your lower spine.
              </Text>
            </View>

            <View style={styles.poseCard}>
              <Text style={styles.poseTitle}>• Side-Lying Rest Pose (Parsva Savasana)</Text>
              <Text style={styles.poseDesc}>
                After the 16th week, avoid resting flat on your back to prevent compression of the inferior vena
                cava. Rest on your left side with a supportive cushion tucked between your knees.
              </Text>
            </View>
          </View>

          {/* Caution Alert Box */}
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <AlertCircle size={18} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={styles.warningTitle}>Safety Precautions & Red Flags</Text>
            </View>
            <Text style={styles.warningText}>
              Stop immediately and contact your obstetrician if you experience any dizziness, sudden shortness
              of breath, vaginal spotting, cramping, or sharp chest pain. Avoid hot rooms, closed twists, or
              deep abdominal crunches throughout all trimesters.
            </Text>
          </View>

          {/* Switch to Video Masterclass Banner */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/course-detail',
                params: {
                  id: params.id || '1',
                  title: articleTitle,
                },
              })
            }
            style={styles.switchVideoCard}
          >
            <View style={styles.switchVideoLeft}>
              <View style={styles.playIconCircle}>
                <PlayCircle size={24} color="#FFFFFF" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.switchVideoTitle}>Prefer video instructions?</Text>
                <Text style={styles.switchVideoSub}>Watch the step-by-step video class</Text>
              </View>
            </View>
            <Text style={styles.switchVideoAction}>Watch Now →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          style={[styles.bottomButtonSecondary, isSaved && styles.bottomButtonSecondaryActive]}
        >
          <Heart
            size={18}
            color={isSaved ? '#E11D48' : '#475569'}
            fill={isSaved ? '#E11D48' : 'none'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.bottomButtonSecondaryText, isSaved && { color: '#E11D48' }]}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleMarkAsRead}
          style={[styles.bottomButtonPrimary, isReadCompleted && styles.bottomButtonPrimaryDone]}
        >
          <CheckCircle2 size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.bottomButtonPrimaryText}>
            {isReadCompleted ? 'Completed ✓' : 'Mark as Read'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    zIndex: 10,
  },
  iconButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    backgroundColor: '#FFFFFF',
  },
  heroImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: '#E2E8F0',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  readingBadgeOverlay: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  readingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  readTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 28,
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  authorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
  },
  authorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  authorRole: {
    fontSize: 12,
    color: '#E11D48',
    fontWeight: '600',
    marginTop: 1,
  },
  reviewedDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  takeawaysCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  takeawaysHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  takeawaysTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9F1239',
  },
  takeawaysItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  takeawayIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  takeawayText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
  },
  articleSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    lineHeight: 22,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 10,
  },
  poseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3.5,
    borderLeftColor: '#E11D48',
  },
  poseTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  poseDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  warningText: {
    fontSize: 12.5,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  switchVideoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  switchVideoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchVideoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchVideoSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  switchVideoAction: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F43F5E',
    marginLeft: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8,
  },
  bottomButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  bottomButtonSecondaryActive: {
    backgroundColor: '#FFE4E6',
  },
  bottomButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  bottomButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#E11D48',
  },
  bottomButtonPrimaryDone: {
    backgroundColor: '#10B981',
  },
  bottomButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
