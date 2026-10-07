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
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  X,
  Moon,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AgeTab = '0-1m' | '1-3m' | '3-6m' | '6-12m' | '1-2y';

interface SleepRecommendation {
  header: string;
  totalSleep: string;
  nightSleep: string;
  dayNaps: string;
}

interface SleepLogItem {
  id: string;
  type: string;
  emoji: string;
  timeRange: string;
  durationText: string;
  durationMinutes: number;
  bgColor: string;
  borderColor: string;
  titleColor: string;
}

const AGE_TABS: { id: AgeTab; label: string }[] = [
  { id: '0-1m', label: '0–1 month' },
  { id: '1-3m', label: '1–3 months' },
  { id: '3-6m', label: '3–6 months' },
  { id: '6-12m', label: '6–12 months' },
  { id: '1-2y', label: '1–2 years' },
];

const RECOMMENDATIONS: Record<AgeTab, SleepRecommendation> = {
  '0-1m': {
    header: 'Recommended for 0–1 month',
    totalSleep: '14–17 hrs',
    nightSleep: '8–9 hrs',
    dayNaps: '4–5 naps',
  },
  '1-3m': {
    header: 'Recommended for 1–3 months',
    totalSleep: '14–16 hrs',
    nightSleep: '8–10 hrs',
    dayNaps: '3–4 naps',
  },
  '3-6m': {
    header: 'Recommended for 3–6 months',
    totalSleep: '12–15 hrs',
    nightSleep: '9–11 hrs',
    dayNaps: '3 naps',
  },
  '6-12m': {
    header: 'Recommended for 6–12 months',
    totalSleep: '12–14 hrs',
    nightSleep: '10–12 hrs',
    dayNaps: '2 naps',
  },
  '1-2y': {
    header: 'Recommended for 1–2 years',
    totalSleep: '11–14 hrs',
    nightSleep: '11–12 hrs',
    dayNaps: '1 nap',
  },
};

const SLEEP_TIPS: Record<AgeTab, string[]> = {
  '3-6m': [
    'Establish a consistent bedtime routine (bath ➔ feed ➔ sleep)',
    'Put baby to sleep drowsy but awake after 3 months',
    'Dark, quiet room helps signal night time',
    'Avoid screens and stimulation before bed',
  ],
  '0-1m': [
    'Newborns sleep in cycles of 2–4 hours around the clock',
    'Swaddle snugly to prevent involuntary startle reflex waking',
    'Keep day environment bright and nighttime environment dim',
    'Always place baby on their back on a firm mattress to sleep',
  ],
  '1-3m': [
    'Watch for sleepy cues (yawning, eye rubbing, staring into space)',
    'Day and night circadian rhythm naturally stabilizes around 8 weeks',
    'Offer active tummy time during alert daylight wake windows',
    'Cluster feeding before bedtime encourages longer first sleep stretch',
  ],
  '6-12m': [
    'Most babies transition from 3 daytime naps to 2 stable naps',
    'Teething & separation anxiety can cause temporary sleep regressions',
    'Offer gentle soothing without creating direct feed-to-sleep dependency',
    'Maintain an early consistent bedtime between 7:00 PM – 8:00 PM',
  ],
  '1-2y': [
    'Toddlers thrive on 1 restorative midday nap (1.5–2.5 hours)',
    'Keep evening storytime calm, predictable, and screen-free',
    'Avoid sugar, cocoa, and heavy juices within 2 hours of bedtime',
    'Soft warm night lights help reassure toddlers afraid of the dark',
  ],
};

const INITIAL_LOGS: SleepLogItem[] = [
  {
    id: 'log_1',
    type: 'Night Sleep',
    emoji: '🌙',
    timeRange: '21:00 – 05:30',
    durationText: '8h 30m',
    durationMinutes: 510,
    bgColor: '#EEF2FF',
    borderColor: '#E0E7FF',
    titleColor: '#4338CA',
  },
  {
    id: 'log_2',
    type: 'Morning Nap',
    emoji: '🌤️',
    timeRange: '08:00 – 09:30',
    durationText: '1h 30m',
    durationMinutes: 90,
    bgColor: '#FEFCE8',
    borderColor: '#FEF08A',
    titleColor: '#B45309',
  },
  {
    id: 'log_3',
    type: 'Afternoon Nap',
    emoji: '🌅',
    timeRange: '13:00 – 15:00',
    durationText: '2h 0m',
    durationMinutes: 120,
    bgColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    titleColor: '#C2410C',
  },
];

export default function SleepPatternScreen() {
  const router = useRouter();
  const [selectedAge, setSelectedAge] = useState<AgeTab>('3-6m');
  const [logs, setLogs] = useState<SleepLogItem[]>(INITIAL_LOGS);

  // Add Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newType, setNewType] = useState('Morning Nap');
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newEndTime, setNewEndTime] = useState('11:30');

  // Compute Total Sleep in Hours and Minutes
  const totalSleepFormatted = useMemo(() => {
    const totalMins = logs.reduce((sum, item) => sum + item.durationMinutes, 0);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hrs}h ${mins}m`;
  }, [logs]);

  const rec = RECOMMENDATIONS[selectedAge];
  const tips = SLEEP_TIPS[selectedAge];

  const handleAgeChange = (age: AgeTab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedAge(age);
  };

  const handleDeleteLog = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddLog = () => {
    // Parse hours and minutes
    const [startH, startM] = newStartTime.split(':').map((n) => parseInt(n, 10) || 0);
    const [endH, endM] = newEndTime.split(':').map((n) => parseInt(n, 10) || 0);

    let startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;
    if (endTotal < startTotal) {
      endTotal += 24 * 60; // crossed midnight
    }
    const diff = Math.max(15, endTotal - startTotal);
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    const durStr = `${hrs}h ${mins > 0 ? `${mins}m` : '0m'}`;

    let emoji = '🌤️';
    let bgColor = '#FEFCE8';
    let borderColor = '#FEF08A';
    let titleColor = '#B45309';

    if (newType.includes('Night')) {
      emoji = '🌙';
      bgColor = '#EEF2FF';
      borderColor = '#E0E7FF';
      titleColor = '#4338CA';
    } else if (newType.includes('Afternoon')) {
      emoji = '🌅';
      bgColor = '#FFF7ED';
      borderColor = '#FFEDD5';
      titleColor = '#C2410C';
    } else if (newType.includes('Evening')) {
      emoji = '🌆';
      bgColor = '#FDF2F8';
      borderColor = '#FCE7F3';
      titleColor = '#BE185D';
    }

    const newLogItem: SleepLogItem = {
      id: `log_${Date.now()}`,
      type: newType,
      emoji,
      timeRange: `${newStartTime} – ${newEndTime}`,
      durationText: durStr,
      durationMinutes: diff,
      bgColor,
      borderColor,
      titleColor,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLogs((prev) => [...prev, newLogItem]);
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

        <Text style={styles.headerTitle}>Sleep Pattern</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Baby's Age Label */}
        <Text style={styles.sectionLabel}>Baby's Age</Text>

        {/* Horizontal Age Pills Switcher */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.agePillsScroll}
        >
          {AGE_TABS.map((tab) => {
            const isSelected = selectedAge === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.8}
                onPress={() => handleAgeChange(tab.id)}
                style={[styles.agePill, isSelected ? styles.agePillActive : styles.agePillInactive]}
              >
                <Text
                  style={[
                    styles.agePillText,
                    isSelected ? styles.agePillTextActive : styles.agePillTextInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recommended Banner Card (Peach background) */}
        <View style={styles.recommendedCard}>
          <Text style={styles.recommendedHeader}>{rec.header}</Text>

          <View style={styles.metricCardsRow}>
            {/* Metric 1: Total Sleep */}
            <View style={styles.metricCard}>
              <Text style={styles.metricEmoji}>💤</Text>
              <Text style={styles.metricValue}>{rec.totalSleep}</Text>
              <Text style={styles.metricSubtitle}>Total Sleep</Text>
            </View>

            {/* Metric 2: Night Sleep */}
            <View style={styles.metricCard}>
              <Text style={styles.metricEmoji}>🌙</Text>
              <Text style={styles.metricValue}>{rec.nightSleep}</Text>
              <Text style={styles.metricSubtitle}>Night Sleep</Text>
            </View>

            {/* Metric 3: Day Naps */}
            <View style={styles.metricCard}>
              <Text style={styles.metricEmoji}>☀️</Text>
              <Text style={styles.metricValue}>{rec.dayNaps}</Text>
              <Text style={styles.metricSubtitle}>Day Naps</Text>
            </View>
          </View>
        </View>

        {/* Today's Sleep Log Section */}
        <View style={styles.logHeaderRow}>
          <View>
            <Text style={styles.logSectionTitle}>Today's Sleep Log</Text>
            <Text style={styles.logTotalText}>
              Total: <Text style={styles.logTotalHighlight}>{totalSleepFormatted}</Text>
            </Text>
          </View>

          {/* + Add Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            style={styles.addBtn}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 4 }} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Log Cards List */}
        <View style={styles.logsListContainer}>
          {logs.map((item) => (
            <View
              key={item.id}
              style={[
                styles.logCard,
                { backgroundColor: item.bgColor, borderColor: item.borderColor },
              ]}
            >
              <Text style={styles.logEmoji}>{item.emoji}</Text>

              <View style={styles.logInfoCol}>
                <Text style={[styles.logTitle, { color: item.titleColor }]}>{item.type}</Text>
                <View style={styles.timeRow}>
                  <Clock size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.timeText}>
                    {item.timeRange} · {item.durationText}
                  </Text>
                </View>
              </View>

              {/* Trash Delete Action */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleDeleteLog(item.id)}
                style={styles.deleteBtn}
              >
                <Trash2 size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Sleep Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsSectionTitle}>💡 Sleep Tips</Text>

          <View style={styles.tipsCard}>
            {tips.map((tip, idx) => (
              <View key={idx} style={styles.tipItemRow}>
                <Text style={styles.tipSparkle}>✦</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Log Sleep Session Bottom Sheet Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            {/* Modal Title */}
            <Text style={styles.modalTitle}>Log Sleep Session</Text>

            {/* Sleep Type Label */}
            <Text style={styles.inputLabel}>Sleep Type</Text>

            {/* 2x2 Grid of Sleep Types */}
            <View style={styles.typeGrid}>
              {[
                { title: 'Night Sleep', emoji: '🌙' },
                { title: 'Morning Nap', emoji: '🌤️' },
                { title: 'Afternoon Nap', emoji: '🌅' },
                { title: 'Evening Nap', emoji: '🌆' },
              ].map((item) => {
                const isSelected = newType === item.title;
                return (
                  <TouchableOpacity
                    key={item.title}
                    activeOpacity={0.8}
                    onPress={() => setNewType(item.title)}
                    style={[
                      styles.typeCard,
                      isSelected ? styles.typeCardActive : styles.typeCardInactive,
                    ]}
                  >
                    <Text style={styles.typeEmoji}>{item.emoji}</Text>
                    <Text
                      style={[
                        styles.typeCardText,
                        isSelected ? styles.typeCardTextActive : styles.typeCardTextInactive,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Start and End Time Columns */}
            <View style={styles.timeInputRow}>
              <View style={styles.timeCol}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TextInput
                  value={newStartTime}
                  onChangeText={setNewStartTime}
                  placeholder="21:00"
                  placeholderTextColor="#94A3B8"
                  style={styles.timeInput}
                />
              </View>

              <View style={styles.timeCol}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TextInput
                  value={newEndTime}
                  onChangeText={setNewEndTime}
                  placeholder="05:30"
                  placeholderTextColor="#94A3B8"
                  style={styles.timeInput}
                />
              </View>
            </View>

            {/* Save Sleep Entry CTA */}
            <TouchableOpacity activeOpacity={0.85} onPress={handleAddLog} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save Sleep Entry</Text>
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
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  agePillsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  agePill: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agePillActive: {
    backgroundColor: '#5B50F6',
    shadowColor: '#5B50F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  agePillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  agePillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  agePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  agePillTextInactive: {
    color: '#64748B',
  },
  recommendedCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 18,
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    padding: 16,
  },
  recommendedHeader: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#EA580C',
    marginBottom: 12,
  },
  metricCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  metricEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  metricSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  logHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  logSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  logTotalText: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  logTotalHighlight: {
    color: '#5B50F6',
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B50F6',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    shadowColor: '#5B50F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logsListContainer: {
    paddingHorizontal: 16,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  logEmoji: {
    fontSize: 26,
    marginRight: 14,
  },
  logInfoCol: {
    flex: 1,
  },
  logTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tipsSection: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  tipsSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  tipsCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    padding: 16,
  },
  tipItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipSparkle: {
    fontSize: 12,
    color: '#5B50F6',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
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
    paddingTop: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeCard: {
    width: '48%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  typeCardActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#818CF8',
  },
  typeCardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  typeCardText: {
    fontSize: 13.5,
  },
  typeCardTextActive: {
    fontWeight: '700',
    color: '#4F46E5',
  },
  typeCardTextInactive: {
    fontWeight: '600',
    color: '#475569',
  },
  timeInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeCol: {
    width: '48%',
  },
  timeInput: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  saveBtn: {
    backgroundColor: '#5B50F6',
    borderRadius: 20,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: '#5B50F6',
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
