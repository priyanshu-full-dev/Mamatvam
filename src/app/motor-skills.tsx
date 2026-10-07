import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MilestoneItem {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  completed: boolean;
}

interface AgeCategory {
  id: string;
  pillTitle: string;
  stageName: string;
  stageEmoji: string;
  items: MilestoneItem[];
}

// 25 Milestones across 5 Pediatric Development Stages
const INITIAL_CATEGORIES: AgeCategory[] = [
  {
    id: '0-3m',
    pillTitle: '0–3 months',
    stageName: 'Newborn',
    stageEmoji: '👶',
    items: [
      {
        id: 'ms_0_1',
        emoji: '👶',
        title: 'Lifts head briefly',
        desc: 'Raises head during tummy time for a few seconds',
        completed: true,
      },
      {
        id: 'ms_0_2',
        emoji: '👁️',
        title: 'Tracks faces & objects',
        desc: 'Eyes follow slow-moving objects or faces',
        completed: true,
      },
      {
        id: 'ms_0_3',
        emoji: '👂',
        title: 'Responds to sounds',
        desc: 'Startles at loud noises, calms to familiar voices',
        completed: true,
      },
      {
        id: 'ms_0_4',
        emoji: '✊',
        title: 'Grasp reflex',
        desc: 'Curls fingers around an object placed in palm',
        completed: false,
      },
      {
        id: 'ms_0_5',
        emoji: '😊',
        title: 'Social smile',
        desc: 'Smiles in response to a familiar face or voice',
        completed: false,
      },
    ],
  },
  {
    id: '3-6m',
    pillTitle: '3–6 months',
    stageName: 'Infant',
    stageEmoji: '🧸',
    items: [
      {
        id: 'ms_3_1',
        emoji: '🤸',
        title: 'Rolls tummy to back',
        desc: 'Uses head and torso momentum to turn onto back',
        completed: false,
      },
      {
        id: 'ms_3_2',
        emoji: '🧸',
        title: 'Reaches for toys',
        desc: 'Actively stretches arms to grab colorful rattles',
        completed: false,
      },
      {
        id: 'ms_3_3',
        emoji: '💪',
        title: 'Pushes up on elbows',
        desc: 'Lifts chest steady and holds head 90° upright',
        completed: false,
      },
      {
        id: 'ms_3_4',
        emoji: '🗣️',
        title: 'Babbles with vowels',
        desc: 'Plays with coos (ah, eh, oo) when interacting',
        completed: false,
      },
      {
        id: 'ms_3_5',
        emoji: '👄',
        title: 'Hands to mouth',
        desc: 'Explores textures by bringing fists & toys to mouth',
        completed: false,
      },
    ],
  },
  {
    id: '6-9m',
    pillTitle: '6–9 months',
    stageName: 'Sitting & Crawling',
    stageEmoji: '🧘',
    items: [
      {
        id: 'ms_6_1',
        emoji: '🧘',
        title: 'Sits without support',
        desc: 'Maintains steady seated posture with free hands',
        completed: false,
      },
      {
        id: 'ms_6_2',
        emoji: '🐢',
        title: 'Creeps or crawls',
        desc: 'Pushes forward on hands and knees across floor',
        completed: false,
      },
      {
        id: 'ms_6_3',
        emoji: '🔁',
        title: 'Transfers objects',
        desc: 'Passes a ring or teether from one hand to the other',
        completed: false,
      },
      {
        id: 'ms_6_4',
        emoji: '🍞',
        title: 'Raking grasp foods',
        desc: 'Picks up soft finger food pieces with palm raking',
        completed: false,
      },
      {
        id: 'ms_6_5',
        emoji: '👂',
        title: 'Responds to own name',
        desc: 'Turns head immediately when spoken to by name',
        completed: false,
      },
    ],
  },
  {
    id: '9-12m',
    pillTitle: '9–12 months',
    stageName: 'Standing & Exploring',
    stageEmoji: '🚶',
    items: [
      {
        id: 'ms_9_1',
        emoji: '🤏',
        title: 'Pincer grasp',
        desc: 'Picks up tiny items between thumb and forefinger',
        completed: false,
      },
      {
        id: 'ms_9_2',
        emoji: '🪜',
        title: 'Pulls up to stand',
        desc: 'Uses furniture edge or rails to stand on two feet',
        completed: false,
      },
      {
        id: 'ms_9_3',
        emoji: '🛋️',
        title: 'Cruises on furniture',
        desc: 'Steps sideways holding onto low couch or coffee table',
        completed: false,
      },
      {
        id: 'ms_9_4',
        emoji: '👋',
        title: 'Waves and claps',
        desc: 'Imitates clapping hands and waves bye-bye',
        completed: false,
      },
      {
        id: 'ms_9_5',
        emoji: '📦',
        title: 'Puts toys in container',
        desc: 'Drops small blocks into a bowl and retrieves them',
        completed: false,
      },
    ],
  },
  {
    id: '12-18m',
    pillTitle: '12–18 months',
    stageName: 'Toddler Steps',
    stageEmoji: '🏃',
    items: [
      {
        id: 'ms_12_1',
        emoji: '🚶',
        title: 'First independent steps',
        desc: 'Walks a few paces without holding caregiver hands',
        completed: false,
      },
      {
        id: 'ms_12_2',
        emoji: '🧱',
        title: 'Stacks 2–3 blocks',
        desc: 'Balances wooden cubes neatly without knocking over',
        completed: false,
      },
      {
        id: 'ms_12_3',
        emoji: '🥄',
        title: 'Drinks from open cup',
        desc: 'Brings small cup or spoon towards mouth independently',
        completed: false,
      },
      {
        id: 'ms_12_4',
        emoji: '🖍️',
        title: 'Scribbles with crayon',
        desc: 'Makes spontaneous strokes on paper with palm grip',
        completed: false,
      },
      {
        id: 'ms_12_5',
        emoji: '⚽',
        title: 'Kicks a soft ball',
        desc: 'Balances on one foot briefly to kick a ball forward',
        completed: false,
      },
    ],
  },
];

export default function MotorSkillsScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<AgeCategory[]>(INITIAL_CATEGORIES);
  const [selectedCatId, setSelectedCatId] = useState<string>('0-3m');

  // Overall milestone metrics
  const { totalMilestones, achievedMilestones } = useMemo(() => {
    let total = 0;
    let achieved = 0;
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        total++;
        if (item.completed) achieved++;
      });
    });
    return { totalMilestones: total, achievedMilestones: achieved };
  }, [categories]);

  // Selected category info
  const selectedCat = useMemo(() => {
    return categories.find((c) => c.id === selectedCatId) || categories[0];
  }, [categories, selectedCatId]);

  const catCompletedCount = useMemo(() => {
    return selectedCat.items.filter((it) => it.completed).length;
  }, [selectedCat]);

  const catTotalCount = selectedCat.items.length;
  const catProgressPercent = catTotalCount > 0 ? (catCompletedCount / catTotalCount) * 100 : 0;

  // Toggle completion
  const handleToggleItem = (itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCategories((prevCats) =>
      prevCats.map((cat) => {
        if (cat.id !== selectedCatId) return cat;
        return {
          ...cat,
          items: cat.items.map((it) => {
            if (it.id !== itemId) return it;
            return { ...it, completed: !it.completed };
          }),
        };
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Navigation Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Motor Skills Tracker</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Milestone Achievement Subtitle */}
        <Text style={styles.achievedSubtitle}>
          {achievedMilestones}/{totalMilestones} milestones achieved
        </Text>

        {/* Horizontal Age Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsScrollRow}
        >
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCatId;
            const catAchieved = cat.items.filter((it) => it.completed).length;
            const catTotal = cat.items.length;

            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setSelectedCatId(cat.id);
                }}
                style={[
                  styles.pillButton,
                  isSelected ? styles.pillButtonActive : styles.pillButtonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.pillTitleText,
                    isSelected ? styles.pillTitleActive : styles.pillTitleInactive,
                  ]}
                >
                  {cat.pillTitle}
                </Text>
                <Text
                  style={[
                    styles.pillCountText,
                    isSelected ? styles.pillCountActive : styles.pillCountInactive,
                  ]}
                >
                  {catAchieved}/{catTotal}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Stage Summary Banner Card */}
        <View style={styles.stageCard}>
          <View style={styles.stageCardLeft}>
            <Text style={styles.stageCardTitle}>{selectedCat.pillTitle}</Text>
            <Text style={styles.stageCardSubtitle}>
              {selectedCat.stageName} · {catCompletedCount}/{catTotalCount} achieved
            </Text>

            {/* Pink Progress Bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(6, catProgressPercent)}%` },
                ]}
              />
            </View>
          </View>

          {/* Baby / Stage Emoji */}
          <Text style={styles.stageEmojiText}>{selectedCat.stageEmoji}</Text>
        </View>

        {/* Milestones List */}
        <View style={styles.itemsListContainer}>
          {selectedCat.items.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handleToggleItem(item.id)}
              style={styles.itemCard}
            >
              {/* Milestone Emoji Icon */}
              <Text style={styles.itemEmoji}>{item.emoji}</Text>

              {/* Title & Description */}
              <View style={styles.itemInfoCol}>
                <Text
                  style={[
                    styles.itemTitle,
                    item.completed ? styles.itemTitleCompleted : styles.itemTitlePending,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
              </View>

              {/* Status Action Indicator: Pink Star if complete, Outline circle if pending */}
              <View
                style={[
                  styles.checkCircle,
                  item.completed ? styles.checkCircleCompleted : styles.checkCirclePending,
                ]}
              >
                {item.completed && <Star size={16} color="#FFFFFF" fill="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 36,
  },
  achievedSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  pillsScrollRow: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  pillButton: {
    minWidth: 92,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillButtonActive: {
    backgroundColor: '#F6349A',
    shadowColor: '#F6349A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  pillButtonInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillTitleText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  pillTitleActive: {
    color: '#FFFFFF',
  },
  pillTitleInactive: {
    color: '#475569',
  },
  pillCountText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  pillCountActive: {
    color: 'rgba(255, 255, 255, 0.95)',
  },
  pillCountInactive: {
    color: '#94A3B8',
  },
  stageCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: '#FFF5F9',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stageCardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  stageCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F6349A',
  },
  stageCardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 3,
    marginBottom: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F6349A',
    borderRadius: 4,
  },
  stageEmojiText: {
    fontSize: 38,
  },
  itemsListContainer: {
    paddingHorizontal: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFE4EF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  itemEmoji: {
    fontSize: 24,
    marginRight: 14,
  },
  itemInfoCol: {
    flex: 1,
    paddingRight: 10,
  },
  itemTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  itemTitleCompleted: {
    color: '#F6349A',
  },
  itemTitlePending: {
    color: '#1E293B',
  },
  itemDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
    lineHeight: 16,
  },
  checkCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#F6349A',
  },
  checkCirclePending: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
});
