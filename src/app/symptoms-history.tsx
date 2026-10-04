import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Line, Rect } from 'react-native-svg';
import { ArrowLeft, Share2 } from 'lucide-react-native';

interface HistoryLog {
  id: string;
  timeLabel: string;
  symptoms: string[];
}

const HISTORY_LOGS: HistoryLog[] = [
  {
    id: 'log_1',
    timeLabel: 'Today • 06:25 PM',
    symptoms: ['Morning Sickness', 'Morning Sickness', 'Morning Sickness'],
  },
  {
    id: 'log_2',
    timeLabel: 'Today • 06:25 PM',
    symptoms: ['Morning Sickness'],
  },
  {
    id: 'log_3',
    timeLabel: 'Today • 06:25 PM',
    symptoms: ['Morning Sickness'],
  },
];

export default function SymptomsHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'My Pregnancy Symptoms History: Tracked with Mamatvam.',
      });
    } catch (e) {}
  };

  const topPadding = Math.max(insets.top, 28) + 8;

  // Chart dimensions
  const chartWidth = 320;
  const chartHeight = 170;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Symptoms History</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleShare}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.shareBtn}
        >
          <Share2 size={20} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
      >
        {/* Top Chart Card matching Image 2 */}
        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {/* Y-axis Labels on Left */}
            <View style={styles.yAxisLabels}>
              <Text style={styles.yAxisText}>2</Text>
              <Text style={styles.yAxisText}>0</Text>
              <Text style={styles.yAxisText}>1</Text>
            </View>

            {/* SVG Grid and Rounded Red/Coral Bars */}
            <Svg width={chartWidth - 30} height={chartHeight} viewBox="0 0 280 150">
              {/* 3 Horizontal Grid Lines */}
              <Line x1="10" y1="20" x2="270" y2="20" stroke="#CBD5E1" strokeWidth="1" />
              <Line x1="10" y1="75" x2="270" y2="75" stroke="#CBD5E1" strokeWidth="1" />
              <Line x1="10" y1="130" x2="270" y2="130" stroke="#CBD5E1" strokeWidth="1" />

              {/* 8 Vertical Dotted/Subtle Grid Lines */}
              {[30, 65, 100, 135, 170, 205, 240, 270].map((xPos, idx) => (
                <Line
                  key={idx}
                  x1={xPos}
                  y1="10"
                  x2={xPos}
                  y2="140"
                  stroke="#94A3B8"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
                />
              ))}

              {/* Bar 1: at x=60 */}
              <Rect
                x="58"
                y="85"
                width="14"
                height="55"
                rx="7"
                ry="7"
                fill="#ED5042"
              />

              {/* Bar 2: at x=110 (Peak Bar reaching near level 2) */}
              <Rect
                x="110"
                y="30"
                width="14"
                height="110"
                rx="7"
                ry="7"
                fill="#ED5042"
              />

              {/* Bar 3: at x=150 (Reaching level ~1.2) */}
              <Rect
                x="150"
                y="55"
                width="14"
                height="85"
                rx="7"
                ry="7"
                fill="#ED5042"
              />
            </Svg>
          </View>
        </View>

        {/* Bottom History Log Card matching Image 2 */}
        <View style={styles.historyLogCard}>
          {HISTORY_LOGS.map((log, idx) => (
            <View
              key={log.id}
              style={[
                styles.logEntry,
                idx === HISTORY_LOGS.length - 1 && { marginBottom: 0 },
              ]}
            >
              <Text style={styles.logTimestamp}>{log.timeLabel}</Text>
              <View style={styles.badgesRow}>
                {log.symptoms.map((symptomName, bIdx) => (
                  <View key={bIdx} style={styles.symptomPill}>
                    <Text style={styles.symptomPillText}>{symptomName}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FAF9F6',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  shareBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisLabels: {
    height: 120,
    justifyContent: 'space-between',
    paddingRight: 6,
    alignItems: 'flex-end',
  },
  yAxisText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  historyLogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  logEntry: {
    marginBottom: 20,
  },
  logTimestamp: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomPill: {
    backgroundColor: '#FFE4E1',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  symptomPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ED5042',
  },
});
