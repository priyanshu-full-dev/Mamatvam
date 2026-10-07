import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Thermometer,
  Heart,
  Droplet,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const CALENDAR_DAY_SIZE = (width - 64) / 7;

type TabType = 'calendar' | 'phases' | 'tracking' | 'tips';

interface CalendarDayInfo {
  dayNumber: number;
  phase: 'normal' | 'menstrual' | 'follicular' | 'fertile' | 'ovulation' | 'luteal';
  isOvulationPeak?: boolean;
}

export default function OvulationTrackerScreen() {
  const router = useRouter();

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('calendar');

  // Cycle settings
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodDays, setPeriodDays] = useState<number>(5);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(21);

  // Month navigation (Defaults to February 2026 matching reference)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(1); // 0 = Jan, 1 = Feb

  // Tracking state for "Tracking" tab
  const [bbt, setBbt] = useState<number>(36.6);
  const [cervicalMucus, setCervicalMucus] = useState<string>('eggwhite');
  const [lhTest, setLhTest] = useState<string>('peak');
  const [hadIntercourse, setHadIntercourse] = useState<boolean>(true);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleTabChange = (tab: TabType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  // Steppers for cycle length and period days
  const adjustCycleLength = (delta: number) => {
    setCycleLength((prev) => Math.max(21, Math.min(45, prev + delta)));
  };

  const adjustPeriodDays = (delta: number) => {
    setPeriodDays((prev) => Math.max(2, Math.min(10, prev + delta)));
  };

  // Generate days for February 2026 (or selected month)
  const calendarGrid = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayWeekday = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sun

    const days: (CalendarDayInfo | null)[] = [];

    // Empty leading padding for first day alignment
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      let phase: CalendarDayInfo['phase'] = 'normal';
      let isOvulationPeak = false;

      // When showing Feb 2026:
      if (currentYear === 2026 && currentMonthIndex === 1) {
        // Last period start: Feb 12
        // Period days: 5 (12, 13, 14, 15, 16)
        if (day >= 12 && day < 12 + periodDays) {
          phase = 'menstrual';
        } else if (day >= 12 + periodDays && day < 20) {
          phase = 'follicular'; // 17, 18, 19
        } else if (day >= 20 && day <= 24) {
          phase = 'fertile'; // 20, 22, 23, 24
        } else if (day === 25) {
          phase = 'ovulation'; // 25 (Ovulation Day)
          isOvulationPeak = true;
        } else if (day >= 26) {
          phase = 'luteal'; // 26, 27, 28
        }
      } else {
        // Generic approximation for other months
        if (day >= 1 && day <= periodDays) {
          phase = 'menstrual';
        } else if (day > periodDays && day < 11) {
          phase = 'follicular';
        } else if (day >= 11 && day <= 15) {
          phase = day === 14 ? 'ovulation' : 'fertile';
          isOvulationPeak = day === 14;
        } else if (day > 15) {
          phase = 'luteal';
        }
      }

      days.push({
        dayNumber: day,
        phase,
        isOvulationPeak,
      });
    }

    return days;
  }, [currentYear, currentMonthIndex, periodDays, cycleLength]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ovulation Tracker</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Fertile Phase Banner Card */}
        <View style={styles.fertileBannerCard}>
          <View style={styles.bannerHeaderRow}>
            <View style={styles.bannerLeftCol}>
              <Text style={styles.bannerSubText}>Right now you're in</Text>
              <View style={styles.phaseTitleRow}>
                <Text style={styles.sproutEmoji}>🌿</Text>
                <Text style={styles.phaseTitleText}>Fertile Phase</Text>
              </View>
              <Text style={styles.cycleSubDetail}>
                Day 10 of cycle • {cycleLength - 10}d to next period
              </Text>
            </View>

            <View style={styles.bannerRightCol}>
              <Text style={styles.ovulationInLabel}>Ovulation in</Text>
              <Text style={styles.ovulationDaysCount}>4</Text>
              <Text style={styles.ovulationDaysUnit}>days</Text>
            </View>
          </View>

          {/* Cycle Timeline Progress Bar */}
          <View style={styles.timelineTrack}>
            {/* Period Segment */}
            <View style={[styles.timelineSegment, { flex: 1.8, backgroundColor: '#FDA4AF' }]} />
            {/* Follicular / Gap */}
            <View style={[styles.timelineSegment, { flex: 1.2, backgroundColor: '#FEF08A' }]} />
            {/* Fertile Window with Current Day Marker */}
            <View style={[styles.timelineSegment, { flex: 2.2, backgroundColor: '#4ADE80' }]}>
              {/* Day 10 indicator needle */}
              <View style={styles.timelineCurrentMarker} />
            </View>
            {/* Ovulation Day */}
            <View style={[styles.timelineSegment, { flex: 0.7, backgroundColor: '#C084FC' }]} />
            {/* Luteal Segment */}
            <View style={[styles.timelineSegment, { flex: 3.5, backgroundColor: '#E2E8F0' }]} />
          </View>

          {/* Timeline Phase Labels */}
          <View style={styles.timelineLabelsRow}>
            <Text style={[styles.timelineLabelText, { color: '#F43F5E' }]}>Period</Text>
            <Text style={[styles.timelineLabelText, { color: '#10B981' }]}>Fertile Window</Text>
            <Text style={[styles.timelineLabelText, { color: '#9333EA' }]}>Ovulation</Text>
            <Text style={[styles.timelineLabelText, { color: '#0EA5E9' }]}>Luteal</Text>
          </View>
        </View>

        {/* Sub-Navigation Tabs Bar */}
        <View style={styles.tabsBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('calendar')}
            style={[styles.tabButton, activeTab === 'calendar' && styles.tabButtonActive]}
          >
            <Text style={styles.tabEmoji}>📅</Text>
            <Text style={[styles.tabButtonText, activeTab === 'calendar' && styles.tabButtonTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('phases')}
            style={[styles.tabButton, activeTab === 'phases' && styles.tabButtonActive]}
          >
            <Text style={styles.tabEmoji}>🔄</Text>
            <Text style={[styles.tabButtonText, activeTab === 'phases' && styles.tabButtonTextActive]}>
              Phases
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('tracking')}
            style={[styles.tabButton, activeTab === 'tracking' && styles.tabButtonActive]}
          >
            <Text style={styles.tabEmoji}>📊</Text>
            <Text style={[styles.tabButtonText, activeTab === 'tracking' && styles.tabButtonTextActive]}>
              Tracking
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('tips')}
            style={[styles.tabButton, activeTab === 'tips' && styles.tabButtonActive]}
          >
            <Text style={styles.tabEmoji}>💡</Text>
            <Text style={[styles.tabButtonText, activeTab === 'tips' && styles.tabButtonTextActive]}>
              Tips
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= TAB 1: CALENDAR VIEW ================= */}
        {activeTab === 'calendar' && (
          <View>
            {/* Cycle Settings Card */}
            <View style={styles.cycleSettingsCard}>
              <Text style={styles.settingsTitle}>Cycle Settings</Text>

              <View style={styles.settingsRow}>
                {/* Last Period Input */}
                <View style={styles.settingsCol}>
                  <Text style={styles.settingLabel}>Last Period</Text>
                  <View style={styles.lastPeriodInputBox}>
                    <Text style={styles.lastPeriodDateText}>12 Feb</Text>
                  </View>
                </View>

                {/* Cycle Length Stepper */}
                <View style={styles.settingsCol}>
                  <Text style={styles.settingLabel}>Cycle Length</Text>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => adjustCycleLength(-1)}
                      style={styles.stepperBtn}
                    >
                      <Minus size={14} color="#64748B" />
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{cycleLength}</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => adjustCycleLength(1)}
                      style={styles.stepperBtn}
                    >
                      <Plus size={14} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Period Days Stepper */}
                <View style={styles.settingsCol}>
                  <Text style={styles.settingLabel}>Period Days</Text>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => adjustPeriodDays(-1)}
                      style={styles.stepperBtn}
                    >
                      <Minus size={14} color="#64748B" />
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{periodDays}</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => adjustPeriodDays(1)}
                      style={styles.stepperBtn}
                    >
                      <Plus size={14} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Calendar Card */}
            <View style={styles.calendarCard}>
              {/* Month Header Nav */}
              <View style={styles.monthHeaderRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handlePrevMonth}
                  style={styles.monthNavBtn}
                >
                  <ChevronLeft size={20} color="#64748B" />
                </TouchableOpacity>

                <Text style={styles.monthTitleText}>
                  {monthNames[currentMonthIndex]} {currentYear}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleNextMonth}
                  style={styles.monthNavBtn}
                >
                  <ChevronRight size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Day of Week Headers */}
              <View style={styles.weekdaysRow}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <Text key={d} style={styles.weekdayText}>
                    {d}
                  </Text>
                ))}
              </View>

              {/* Day Grid */}
              <View style={styles.daysGrid}>
                {calendarGrid.map((item, index) => {
                  if (!item) {
                    return <View key={`empty-${index}`} style={styles.dayCell} />;
                  }

                  const isSelected = selectedDayNumber === item.dayNumber;

                  // Determine background & text colors based on phase & selection
                  let cellBg = '#FFFFFF';
                  let cellTextColor = '#1E293B';
                  let hasStar = item.isOvulationPeak;

                  if (isSelected) {
                    cellBg = '#0F172A';
                    cellTextColor = '#FFFFFF';
                  } else {
                    switch (item.phase) {
                      case 'menstrual':
                        cellBg = '#FEE2E2';
                        cellTextColor = '#EF4444';
                        break;
                      case 'follicular':
                        cellBg = '#FEF3C7';
                        cellTextColor = '#D97706';
                        break;
                      case 'fertile':
                        cellBg = '#DCFCE7';
                        cellTextColor = '#16A34A';
                        break;
                      case 'ovulation':
                        cellBg = '#F3E8FF';
                        cellTextColor = '#9333EA';
                        break;
                      case 'luteal':
                        cellBg = '#DBEAFE';
                        cellTextColor = '#2563EB';
                        break;
                      default:
                        cellBg = '#FFFFFF';
                        cellTextColor = '#334155';
                    }
                  }

                  return (
                    <View key={`day-${item.dayNumber}`} style={styles.dayCell}>
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => setSelectedDayNumber(item.dayNumber)}
                        style={[
                          styles.dayCircle,
                          { backgroundColor: cellBg },
                          isSelected && styles.dayCircleSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayNumberText,
                            { color: cellTextColor },
                            item.phase !== 'normal' && { fontWeight: '700' },
                          ]}
                        >
                          {item.dayNumber}
                        </Text>
                        {hasStar && !isSelected && (
                          <Text style={styles.starIcon}>⭐</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              {/* Phase Color Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendRow}>
                  <View style={[styles.legendChip, { backgroundColor: '#FEE2E2' }]}>
                    <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={[styles.legendText, { color: '#EF4444' }]}>Menstrual</Text>
                  </View>

                  <View style={[styles.legendChip, { backgroundColor: '#DCFCE7' }]}>
                    <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
                    <Text style={[styles.legendText, { color: '#16A34A' }]}>Fertile</Text>
                  </View>

                  <View style={[styles.legendChip, { backgroundColor: '#F3E8FF' }]}>
                    <View style={[styles.legendDot, { backgroundColor: '#9333EA' }]} />
                    <Text style={[styles.legendText, { color: '#9333EA' }]}>Ovulation</Text>
                  </View>

                  <View style={[styles.legendChip, { backgroundColor: '#DBEAFE' }]}>
                    <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
                    <Text style={[styles.legendText, { color: '#2563EB' }]}>Luteal</Text>
                  </View>
                </View>

                <View style={[styles.legendRow, { marginTop: 8 }]}>
                  <View style={[styles.legendChip, { backgroundColor: '#FEF3C7' }]}>
                    <View style={[styles.legendDot, { backgroundColor: '#D97706' }]} />
                    <Text style={[styles.legendText, { color: '#D97706' }]}>Follicular</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 2x2 Metric Cards Grid */}
            <View style={styles.metricGrid}>
              {/* Card 1: Fertile Window */}
              <View style={[styles.metricCard, styles.metricCardGreen]}>
                <Text style={styles.metricEmoji}>🌿</Text>
                <Text style={[styles.metricMainText, { color: '#15803D' }]}>20 Feb – 26 Feb</Text>
                <Text style={styles.metricSubText}>Fertile Window</Text>
              </View>

              {/* Card 2: Ovulation Day */}
              <View style={[styles.metricCard, styles.metricCardPurple]}>
                <Text style={styles.metricEmoji}>⭐</Text>
                <Text style={[styles.metricMainText, { color: '#7E22CE' }]}>25 Feb</Text>
                <Text style={styles.metricSubText}>Ovulation Day</Text>
              </View>

              {/* Card 3: Next Period */}
              <View style={[styles.metricCard, styles.metricCardPink]}>
                <Text style={styles.metricEmoji}>🩸</Text>
                <Text style={[styles.metricMainText, { color: '#BE123C' }]}>11 Mar</Text>
                <Text style={styles.metricSubText}>Next Period</Text>
              </View>

              {/* Card 4: Luteal Phase */}
              <View style={[styles.metricCard, styles.metricCardBlue]}>
                <Text style={styles.metricEmoji}>🌙</Text>
                <Text style={[styles.metricMainText, { color: '#1D4ED8' }]}>14 days (typical)</Text>
                <Text style={styles.metricSubText}>Luteal Phase</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= TAB 2: PHASES VIEW ================= */}
        {activeTab === 'phases' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardEmoji}>🩸</Text>
                <Text style={styles.infoCardTitle}>Menstrual Phase (Days 1–5)</Text>
              </View>
              <Text style={styles.infoCardBody}>
                The uterine lining sheds as estrogen and progesterone levels drop. Energy levels may be lower, making rest and iron replenishment essential.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardEmoji}>🌱</Text>
                <Text style={styles.infoCardTitle}>Follicular Phase (Days 6–13)</Text>
              </View>
              <Text style={styles.infoCardBody}>
                FSH stimulates follicles in the ovary. Rising estrogen thickens the uterine lining and promotes egg maturation in preparation for ovulation.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardEmoji}>✨</Text>
                <Text style={styles.infoCardTitle}>Ovulation Phase (Day 14 / Peak)</Text>
              </View>
              <Text style={styles.infoCardBody}>
                An LH surge triggers the release of the mature egg. This 24–48 hour window is the peak fertile opportunity for conception.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardEmoji}>🌙</Text>
                <Text style={styles.infoCardTitle}>Luteal Phase (Days 15–28)</Text>
              </View>
              <Text style={styles.infoCardBody}>
                The ruptured follicle transforms into the corpus luteum, secreting progesterone to support potential implantation or prepare for the next cycle.
              </Text>
            </View>
          </View>
        )}

        {/* ================= TAB 3: TRACKING VIEW ================= */}
        {activeTab === 'tracking' && (
          <View style={styles.tabContentContainer}>
            {/* Basal Body Temperature */}
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <Thermometer size={18} color="#0284C7" />
                <Text style={styles.logTitle}>Basal Body Temp (BBT)</Text>
              </View>
              <View style={styles.bbtControlRow}>
                <TouchableOpacity
                  onPress={() => setBbt((v) => Number((v - 0.1).toFixed(1)))}
                  style={styles.stepperSmallBtn}
                >
                  <Minus size={14} color="#64748B" />
                </TouchableOpacity>
                <Text style={styles.bbtDisplay}>{bbt.toFixed(1)} °C</Text>
                <TouchableOpacity
                  onPress={() => setBbt((v) => Number((v + 0.1).toFixed(1)))}
                  style={styles.stepperSmallBtn}
                >
                  <Plus size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cervical Mucus */}
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <Droplet size={18} color="#059669" />
                <Text style={styles.logTitle}>Cervical Mucus</Text>
              </View>
              <View style={styles.pillOptionsRow}>
                {[
                  { id: 'dry', label: 'Dry 🌵' },
                  { id: 'sticky', label: 'Sticky 🍯' },
                  { id: 'creamy', label: 'Creamy 🥛' },
                  { id: 'eggwhite', label: 'Egg White 🥚' },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setCervicalMucus(opt.id)}
                    style={[
                      styles.choicePill,
                      cervicalMucus === opt.id && styles.choicePillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choicePillText,
                        cervicalMucus === opt.id && styles.choicePillTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* LH Strip Test */}
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <Sparkles size={18} color="#9333EA" />
                <Text style={styles.logTitle}>LH Strip Result</Text>
              </View>
              <View style={styles.pillOptionsRow}>
                {[
                  { id: 'neg', label: 'Negative (-)' },
                  { id: 'faint', label: 'Faint Line' },
                  { id: 'peak', label: 'Peak Surge (+)' },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setLhTest(opt.id)}
                    style={[
                      styles.choicePill,
                      lhTest === opt.id && styles.choicePillActivePurple,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choicePillText,
                        lhTest === opt.id && styles.choicePillTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Intercourse */}
            <View style={styles.logCard}>
              <View style={styles.logHeader}>
                <Heart size={18} color="#E11D48" />
                <Text style={styles.logTitle}>Intercourse / Intimacy</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setHadIntercourse(!hadIntercourse)}
                style={[
                  styles.toggleActionBtn,
                  hadIntercourse && styles.toggleActionBtnActive,
                ]}
              >
                <CheckCircle2 size={16} color={hadIntercourse ? '#FFFFFF' : '#94A3B8'} />
                <Text
                  style={[
                    styles.toggleActionText,
                    hadIntercourse && styles.toggleActionTextActive,
                  ]}
                >
                  {hadIntercourse ? 'Logged for Today' : 'Not Logged Today'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert('Saved 🌸', 'Daily ovulation indicators successfully saved!')
              }
              style={styles.saveLogBtn}
            >
              <Text style={styles.saveLogBtnText}>Save Today's Biomarkers</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= TAB 4: TIPS VIEW ================= */}
        {activeTab === 'tips' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>💡 Sperm Survival Window</Text>
              <Text style={styles.tipBody}>
                Healthy sperm can survive in the reproductive tract for up to 5 days, whereas an egg remains viable for only 12–24 hours post-ovulation.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>⏰ Intercourse Timing</Text>
              <Text style={styles.tipBody}>
                Having intercourse every 1–2 days during the fertile window (especially 2 days before ovulation) yields the highest conception probability.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>🥗 Folic Acid &amp; Hydration</Text>
              <Text style={styles.tipBody}>
                Stay well hydrated to encourage fertile cervical mucus and ensure you are taking 400–800 mcg of daily folic acid prior to conception.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF9F6',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Top Fertile Phase Banner
  fertileBannerCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#EAFBF1',
    borderColor: '#86EFAC',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bannerLeftCol: {
    flex: 1,
  },
  bannerSubText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  sproutEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  phaseTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#15803D',
  },
  cycleSubDetail: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 4,
    fontWeight: '500',
  },
  bannerRightCol: {
    alignItems: 'flex-end',
  },
  ovulationInLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  ovulationDaysCount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#16A34A',
    lineHeight: 36,
  },
  ovulationDaysUnit: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },

  // Timeline Progress Bar
  timelineTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 14,
    backgroundColor: '#E2E8F0',
  },
  timelineSegment: {
    height: '100%',
    position: 'relative',
  },
  timelineCurrentMarker: {
    width: 3.5,
    height: '100%',
    backgroundColor: '#0F172A',
    position: 'absolute',
    left: '40%',
  },
  timelineLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timelineLabelText: {
    fontSize: 10,
    fontWeight: '700',
  },

  // Sub-Navigation Tabs Bar
  tabsBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 14,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  tabButtonText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#7C3AED',
    fontWeight: '800',
  },

  // Cycle Settings Card
  cycleSettingsCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  settingsTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingsCol: {
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 6,
  },
  lastPeriodInputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    minWidth: 80,
    alignItems: 'center',
  },
  lastPeriodDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },

  // Calendar Card
  calendarCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitleText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    width: CALENDAR_DAY_SIZE,
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CALENDAR_DAY_SIZE,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  dayNumberText: {
    fontSize: 13,
    fontWeight: '500',
  },
  starIcon: {
    fontSize: 8,
    marginTop: -2,
  },

  // Legend
  legendContainer: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: '700',
  },

  // 2x2 Metric Cards Grid
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14,
  },
  metricCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  metricCardGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  metricCardPurple: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  metricCardPink: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  metricCardBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  metricEmoji: {
    fontSize: 16,
  },
  metricMainText: {
    fontSize: 13.5,
    fontWeight: '800',
    marginTop: 6,
  },
  metricSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },

  // Other Tabs Content
  tabContentContainer: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoCardEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  infoCardBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  bbtControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bbtDisplay: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0284C7',
    marginHorizontal: 16,
  },
  stepperSmallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choicePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    marginBottom: 8,
  },
  choicePillActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  choicePillActivePurple: {
    backgroundColor: '#F3E8FF',
    borderColor: '#D8B4FE',
  },
  choicePillText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  choicePillTextActive: {
    color: '#1E293B',
    fontWeight: '700',
  },
  toggleActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  toggleActionBtnActive: {
    backgroundColor: '#E11D48',
  },
  toggleActionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 8,
  },
  toggleActionTextActive: {
    color: '#FFFFFF',
  },
  saveLogBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  saveLogBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  tipBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
