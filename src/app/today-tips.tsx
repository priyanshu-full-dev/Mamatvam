import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react-native';

const TIPS_DATA = [
  {
    id: 1,
    tag: 'Today tips',
    title: 'Make Toning a Daily Ritual',
    description:
      'Try some gentle pelvic tilts today to relieve lower back pressure and improve circulation.',
    nextTip: 'Next tip in 10 Hours',
  },
  {
    id: 2,
    tag: 'Yesterday tips',
    title: 'Nourish with Gentle Hydration',
    description:
      'Keep a water bottle nearby. Consistent sips throughout the day help maintain healthy amniotic fluid levels and curb fatigue.',
    nextTip: 'Completed',
  },
  {
    id: 3,
    tag: '2 Days Ago',
    title: 'Embrace Restful Sleep Postures',
    description:
      'Sleeping on your left side with a pillow between your knees promotes optimal blood flow to the placenta and baby.',
    nextTip: 'Completed',
  },
];

// Clean WhatsApp Icon
function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" fill="#25D366" />
      <Path
        d="M17.2 14.3c-.25-.13-1.46-.72-1.68-.8-.23-.09-.4-.13-.57.13-.17.26-.66.8-.81.97-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.26-.02-.4.1-.53.12-.11.26-.29.39-.44.13-.15.17-.26.26-.44.09-.17.04-.33-.02-.46-.07-.13-.57-1.37-.78-1.88-.2-.5-.42-.43-.57-.44h-.49c-.17 0-.44.06-.67.31-.23.26-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.59.1.48-.07 1.46-.6 1.67-1.17.21-.57.21-1.06.15-1.17-.07-.11-.23-.17-.48-.3z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// Forward / Share curved arrow icon
function ShareArrowIcon({ size = 20, color = '#1E1E1E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12v-1a5 5 0 0 1 5-5h10" />
      <Polyline points="15 2 20 6 15 10" />
    </Svg>
  );
}

export default function TodayTipsScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  const currentTip = TIPS_DATA[currentIndex];
  const hasPrevious = currentIndex < TIPS_DATA.length - 1;
  const hasNext = currentIndex > 0;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mamatvam Pregnancy Tip: "${currentTip.title}" - ${currentTip.description}`,
      });
    } catch {
      // Ignored
    }
  };

  const handleFeedback = (response: 'yes' | 'no') => {
    setFeedback(response);
    Alert.alert(
      response === 'yes' ? 'Thank You!' : 'Feedback Received',
      response === 'yes'
        ? 'We are happy to know this tip was helpful for your pregnancy journey!'
        : 'Thank you for your feedback. We will tailor future tips to better support you.'
    );
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback(null);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex((prev) => prev - 1);
      setFeedback(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6F8" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#1E1E1E" strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Today Tips</Text>

        <Text style={styles.headerRightText}>{currentTip.nextTip}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Tip Card */}
        <View style={styles.mainCard}>
          {/* Tag row */}
          <View style={styles.tagRow}>
            <Lightbulb size={20} color="#F59E0B" fill="#FDE68A" />
            <Text style={styles.tagText}>{currentTip.tag}</Text>
          </View>

          {/* Tip Title */}
          <Text style={styles.tipTitle}>{currentTip.title}</Text>

          {/* Description */}
          <Text style={styles.tipDescription}>{currentTip.description}</Text>

          {/* Share Action Row */}
          <View style={styles.shareRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleShare}
              style={styles.whatsappButton}
            >
              <WhatsAppIcon size={24} />
              <Text style={styles.whatsappText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleShare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ShareArrowIcon size={20} color="#1E1E1E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Previous / Next Navigation Row */}
        <View style={styles.navRow}>
          <TouchableOpacity
            activeOpacity={hasPrevious ? 0.7 : 1}
            onPress={handlePrevious}
            disabled={!hasPrevious}
            style={styles.navButton}
          >
            <ArrowLeft
              size={16}
              color={hasPrevious ? '#EE4D38' : '#D1D5DB'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.navText,
                { color: hasPrevious ? '#EE4D38' : '#D1D5DB' },
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={hasNext ? 0.7 : 1}
            onPress={handleNext}
            disabled={!hasNext}
            style={styles.navButton}
          >
            <Text
              style={[
                styles.navText,
                { color: hasNext ? '#EE4D38' : '#9CA3AF' },
              ]}
            >
              Next
            </Text>
            <ArrowRight
              size={16}
              color={hasNext ? '#EE4D38' : '#9CA3AF'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>

        {/* Feedback Card */}
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackTextCol}>
            <Text style={styles.feedbackTitle}>Was the Tip helpful?</Text>
            <Text style={styles.feedbackSubtitle}>Help Us improve</Text>
          </View>

          <View style={styles.feedbackActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleFeedback('yes')}
              style={[
                styles.feedbackBtn,
                feedback === 'yes' && styles.feedbackBtnSelected,
              ]}
            >
              <Text
                style={[
                  styles.feedbackBtnText,
                  feedback === 'yes' && styles.feedbackBtnTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleFeedback('no')}
              style={[
                styles.feedbackBtn,
                feedback === 'no' && styles.feedbackBtnSelected,
              ]}
            >
              <Text
                style={[
                  styles.feedbackBtnText,
                  feedback === 'no' && styles.feedbackBtnTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F6F8',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  headerRightText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#EE4D38',
    marginLeft: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E1E',
    marginTop: 14,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  tipDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 20,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E1E',
    marginLeft: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginVertical: 22,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  feedbackTextCol: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  feedbackSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  feedbackActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  feedbackBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  feedbackBtnSelected: {
    backgroundColor: '#FEE2E2',
  },
  feedbackBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EE4D38',
  },
  feedbackBtnTextSelected: {
    color: '#DC2626',
  },
});
