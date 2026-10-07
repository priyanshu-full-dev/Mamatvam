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
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Droplets,
  X,
  Utensils,
  Timer,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type FeedType = 'Breast – Left' | 'Breast – Right' | 'Bottle' | 'Solid Food';

export interface FeedItem {
  id: string;
  type: FeedType;
  emoji: string;
  time: string;
  detail: string;
  minutes?: number;
  ml?: number;
  bgColor: string;
  borderColor: string;
  titleColor: string;
}

const INITIAL_FEEDS: FeedItem[] = [
  {
    id: 'f_1',
    type: 'Breast – Left',
    emoji: '🤱',
    time: '15:00',
    detail: '18 min',
    minutes: 18,
    bgColor: '#FFF5F8',
    borderColor: '#FCE7F3',
    titleColor: '#DB2777',
  },
  {
    id: 'f_2',
    type: 'Solid Food',
    emoji: '🥣',
    time: '12:30',
    detail: 'Rice khichdi',
    bgColor: '#FEFCE8',
    borderColor: '#FEF08A',
    titleColor: '#D97706',
  },
  {
    id: 'f_3',
    type: 'Bottle',
    emoji: '🍼',
    time: '10:00',
    detail: '90 ml',
    ml: 90,
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    titleColor: '#0284C7',
  },
  {
    id: 'f_4',
    type: 'Breast – Right',
    emoji: '🤱',
    time: '06:45',
    detail: '12 min',
    minutes: 12,
    bgColor: '#FFF5F8',
    borderColor: '#FCE7F3',
    titleColor: '#DB2777',
  },
  {
    id: 'f_5',
    type: 'Breast – Left',
    emoji: '🤱',
    time: '06:30',
    detail: '15 min',
    minutes: 15,
    bgColor: '#FFF5F8',
    borderColor: '#FCE7F3',
    titleColor: '#DB2777',
  },
];

export default function FeedPatternScreen() {
  const router = useRouter();
  const [feeds, setFeeds] = useState<FeedItem[]>(INITIAL_FEEDS);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedType>('Breast – Left');
  const [inputTime, setInputTime] = useState('16:00');
  const [inputDuration, setInputDuration] = useState('15');
  const [inputMl, setInputMl] = useState('90');
  const [inputFood, setInputFood] = useState('Rice khichdi');

  // Summary Metrics
  const { totalFeeds, totalBreastMins, totalBottleMl, lastFeedTime, breastCount, bottleCount, solidCount } =
    useMemo(() => {
      let bMins = 0;
      let bMl = 0;
      let bCount = 0;
      let botCount = 0;
      let sCount = 0;

      feeds.forEach((f) => {
        if (f.type.startsWith('Breast')) {
          bMins += f.minutes || 0;
          bCount++;
        } else if (f.type === 'Bottle') {
          bMl += f.ml || 0;
          botCount++;
        } else if (f.type === 'Solid Food') {
          sCount++;
        }
      });

      const lastTime = feeds.length > 0 ? feeds[0].time : '--:--';

      return {
        totalFeeds: feeds.length,
        totalBreastMins: bMins,
        totalBottleMl: bMl,
        lastFeedTime: lastTime,
        breastCount: bCount,
        bottleCount: botCount,
        solidCount: sCount,
      };
    }, [feeds]);

  const handleDeleteFeed = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFeeds((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveFeed = () => {
    let emoji = '🤱';
    let bgColor = '#FFF5F8';
    let borderColor = '#FCE7F3';
    let titleColor = '#DB2777';
    let detail = '';
    let minutes: number | undefined;
    let ml: number | undefined;

    if (selectedType === 'Bottle') {
      emoji = '🍼';
      bgColor = '#F0F9FF';
      borderColor = '#BAE6FD';
      titleColor = '#0284C7';
      ml = parseInt(inputMl, 10) || 60;
      detail = `${ml} ml`;
    } else if (selectedType === 'Solid Food') {
      emoji = '🥣';
      bgColor = '#FEFCE8';
      borderColor = '#FEF08A';
      titleColor = '#D97706';
      detail = inputFood.trim() || 'Cereal puree';
    } else {
      minutes = parseInt(inputDuration, 10) || 15;
      detail = `${minutes} min`;
    }

    const newItem: FeedItem = {
      id: `f_${Date.now()}`,
      type: selectedType,
      emoji,
      time: inputTime.trim() || '16:00',
      detail,
      minutes,
      ml,
      bgColor,
      borderColor,
      titleColor,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFeeds((prev) => [newItem, ...prev]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Feed Pattern</Text>

        {/* Top-Right Log Feed Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
          style={styles.topLogBtn}
        >
          <Plus size={15} color="#FFFFFF" strokeWidth={2.6} style={{ marginRight: 3 }} />
          <Text style={styles.topLogBtnText}>Log Feed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Today's Summary Vibrant Gradient Card */}
        <LinearGradient
          colors={['#FF1A75', '#FF4D6D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryHeader}>Today's Summary</Text>

          {/* 2x2 Translucent Metric Tiles */}
          <View style={styles.metricGrid}>
            {/* Tile 1: Total Feeds */}
            <View style={styles.metricTile}>
              <Text style={styles.metricBigText}>{totalFeeds}</Text>
              <Text style={styles.metricLabel}>Total Feeds</Text>
            </View>

            {/* Tile 2: Breast Time */}
            <View style={styles.metricTile}>
              <Text style={styles.metricBigText}>{totalBreastMins}m</Text>
              <Text style={styles.metricLabel}>Breast Time</Text>
            </View>

            {/* Tile 3: Bottle Total */}
            <View style={styles.metricTile}>
              <Text style={styles.metricBigText}>{totalBottleMl}ml</Text>
              <Text style={styles.metricLabel}>Bottle Total</Text>
            </View>

            {/* Tile 4: Last Feed */}
            <View style={styles.metricTile}>
              <Text style={styles.metricBigText}>{lastFeedTime}</Text>
              <Text style={styles.metricLabel}>Last Feed</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Horizontal Category Pill Counters */}
        <View style={styles.pillsRow}>
          {/* Breast Pill */}
          <View style={[styles.categoryPill, styles.pillBreast]}>
            <Text style={styles.pillEmoji}>🤱</Text>
            <Text style={[styles.pillText, { color: '#DB2777' }]}>{breastCount} breast</Text>
          </View>

          {/* Bottle Pill */}
          <View style={[styles.categoryPill, styles.pillBottle]}>
            <Text style={styles.pillEmoji}>🍼</Text>
            <Text style={[styles.pillText, { color: '#0284C7' }]}>{bottleCount} bottle</Text>
          </View>

          {/* Solid Pill */}
          <View style={[styles.categoryPill, styles.pillSolid]}>
            <Text style={styles.pillEmoji}>🥣</Text>
            <Text style={[styles.pillText, { color: '#D97706' }]}>{solidCount} solid</Text>
          </View>
        </View>

        {/* Feed Timeline Section Header */}
        <Text style={styles.timelineSectionTitle}>Feed Timeline</Text>

        {/* Feed Cards List */}
        <View style={styles.timelineContainer}>
          {feeds.map((item) => (
            <View
              key={item.id}
              style={[
                styles.feedCard,
                { backgroundColor: item.bgColor, borderColor: item.borderColor },
              ]}
            >
              {/* Emoji Icon */}
              <Text style={styles.feedEmoji}>{item.emoji}</Text>

              {/* Feed Info Column */}
              <View style={styles.feedInfoCol}>
                <Text style={[styles.feedTitle, { color: item.titleColor }]}>{item.type}</Text>

                <View style={styles.feedSubRow}>
                  <Clock size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                  <Text style={styles.feedTimeText}>{item.time}</Text>

                  {item.type.startsWith('Breast') ? (
                    <>
                      <Timer size={12} color="#94A3B8" style={{ marginLeft: 8, marginRight: 4 }} />
                      <Text style={styles.feedDetailText}>{item.detail}</Text>
                    </>
                  ) : item.type === 'Bottle' ? (
                    <>
                      <Droplets size={12} color="#0284C7" style={{ marginLeft: 8, marginRight: 4 }} />
                      <Text style={styles.feedDetailText}>{item.detail}</Text>
                    </>
                  ) : (
                    <>
                      <Utensils size={12} color="#D97706" style={{ marginLeft: 8, marginRight: 4 }} />
                      <Text style={styles.feedDetailText}>{item.detail}</Text>
                    </>
                  )}
                </View>
              </View>

              {/* Trash Delete Action */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleDeleteFeed(item.id)}
                style={styles.deleteBtn}
              >
                <Trash2 size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Log Feed Bottom Sheet Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            {/* Modal Title Row */}
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Log Feed Session</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Feed Type Selection */}
            <Text style={styles.inputLabel}>Feed Type</Text>
            <View style={styles.typeGrid}>
              {(['Breast – Left', 'Breast – Right', 'Bottle', 'Solid Food'] as FeedType[]).map(
                (t) => {
                  const isSelected = selectedType === t;
                  const emoji =
                    t === 'Bottle' ? '🍼' : t === 'Solid Food' ? '🥣' : '🤱';
                  return (
                    <TouchableOpacity
                      key={t}
                      activeOpacity={0.8}
                      onPress={() => setSelectedType(t)}
                      style={[
                        styles.typeCard,
                        isSelected ? styles.typeCardActive : styles.typeCardInactive,
                      ]}
                    >
                      <Text style={styles.typeEmoji}>{emoji}</Text>
                      <Text
                        style={[
                          styles.typeCardText,
                          isSelected ? styles.typeCardTextActive : styles.typeCardTextInactive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            {/* Time Input */}
            <Text style={styles.inputLabel}>Feed Time</Text>
            <TextInput
              value={inputTime}
              onChangeText={setInputTime}
              placeholder="15:00"
              placeholderTextColor="#94A3B8"
              style={styles.textInput}
            />

            {/* Dynamic Inputs based on type */}
            {selectedType.startsWith('Breast') ? (
              <>
                <Text style={styles.inputLabel}>Duration (minutes)</Text>
                <TextInput
                  value={inputDuration}
                  onChangeText={setInputDuration}
                  placeholder="15"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  style={styles.textInput}
                />
                <View style={styles.presetRow}>
                  {['10', '15', '20', '25'].map((mins) => (
                    <TouchableOpacity
                      key={mins}
                      onPress={() => setInputDuration(mins)}
                      style={styles.presetBtn}
                    >
                      <Text style={styles.presetText}>{mins} min</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : selectedType === 'Bottle' ? (
              <>
                <Text style={styles.inputLabel}>Amount (ml)</Text>
                <TextInput
                  value={inputMl}
                  onChangeText={setInputMl}
                  placeholder="90"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  style={styles.textInput}
                />
                <View style={styles.presetRow}>
                  {['60', '90', '120', '150'].map((vol) => (
                    <TouchableOpacity
                      key={vol}
                      onPress={() => setInputMl(vol)}
                      style={styles.presetBtn}
                    >
                      <Text style={styles.presetText}>{vol} ml</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Food Item Name</Text>
                <TextInput
                  value={inputFood}
                  onChangeText={setInputFood}
                  placeholder="Rice khichdi"
                  placeholderTextColor="#94A3B8"
                  style={styles.textInput}
                />
                <View style={styles.presetRow}>
                  {['Rice khichdi', 'Ragi porridge', 'Banana puree'].map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setInputFood(item)}
                      style={styles.presetBtn}
                    >
                      <Text style={styles.presetText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Save Feed Entry Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSaveFeed}
              style={styles.saveBtn}
            >
              <Text style={styles.saveBtnText}>Save Feed Entry</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    height: 54,
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
  topLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F43F86',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    shadowColor: '#F43F86',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
  },
  topLogBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    borderRadius: 24,
    padding: 16,
  },
  summaryHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  metricTile: {
    width: '48.5%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  metricBigText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.92)',
    marginTop: 3,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 6,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillBreast: {
    backgroundColor: '#FDF2F8',
    borderColor: '#FCE7F3',
  },
  pillBottle: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  pillSolid: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FEF08A',
  },
  pillEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  timelineSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 12,
  },
  timelineContainer: {
    paddingHorizontal: 16,
  },
  feedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  feedEmoji: {
    fontSize: 26,
    marginRight: 14,
  },
  feedInfoCol: {
    flex: 1,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  feedSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  feedTimeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  feedDetailText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeCard: {
    width: '48%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  typeCardActive: {
    backgroundColor: '#FDF2F8',
    borderWidth: 1.5,
    borderColor: '#F43F86',
  },
  typeCardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  typeCardText: {
    fontSize: 13,
  },
  typeCardTextActive: {
    fontWeight: '700',
    color: '#F43F86',
  },
  typeCardTextInactive: {
    fontWeight: '600',
    color: '#475569',
  },
  textInput: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  presetBtn: {
    backgroundColor: '#FDF2F8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  presetText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#DB2777',
  },
  saveBtn: {
    backgroundColor: '#F43F86',
    borderRadius: 20,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#F43F86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
