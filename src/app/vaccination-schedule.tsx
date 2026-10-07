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
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface VaccineItem {
  id: string;
  name: string;
  desc: string;
  completed: boolean;
  optional?: boolean;
}

interface VaccineCategory {
  id: string;
  title: string;
  dotColor: string;
  borderColor: string;
  headerBg: string;
  items: VaccineItem[];
}

const INITIAL_VACCINES: VaccineCategory[] = [
  {
    id: 'birth',
    title: 'At Birth',
    dotColor: '#EC4899',
    borderColor: '#FCE7F3',
    headerBg: '#FFF1F8',
    items: [
      {
        id: 'vb_1',
        name: 'BCG',
        desc: 'Protects against: Tuberculosis',
        completed: true,
      },
      {
        id: 'vb_2',
        name: 'OPV – 0',
        desc: 'Protects against: Oral Poliovirus birth dose',
        completed: true,
      },
      {
        id: 'vb_3',
        name: 'Hep B – 1',
        desc: 'Protects against: Hepatitis B virus',
        completed: true,
      },
    ],
  },
  {
    id: '6w',
    title: '6 Weeks',
    dotColor: '#F97316',
    borderColor: '#FED7AA',
    headerBg: '#FFF7ED',
    items: [
      {
        id: 'v6_1',
        name: 'DTwP / DTaP – 1',
        desc: 'Protects against: Diphtheria, Tetanus, Whooping Cough',
        completed: true,
      },
      {
        id: 'v6_2',
        name: 'Hib – 1',
        desc: 'Protects against: Meningitis, Pneumonia',
        completed: true,
      },
      {
        id: 'v6_3',
        name: 'IPV – 1',
        desc: 'Protects against: Poliomyelitis',
        completed: true,
      },
      {
        id: 'v6_4',
        name: 'PCV – 1',
        desc: 'Protects against: Pneumococcal disease',
        completed: false,
      },
      {
        id: 'v6_5',
        name: 'Rotavirus – 1',
        desc: 'Protects against: Rotavirus diarrhoea',
        completed: false,
        optional: true,
      },
    ],
  },
  {
    id: '10w',
    title: '10 Weeks',
    dotColor: '#EAB308',
    borderColor: '#FEF08A',
    headerBg: '#FEFCE8',
    items: [
      {
        id: 'v10_1',
        name: 'DTwP / DTaP – 2',
        desc: 'Protects against: Diphtheria, Tetanus, Pertussis booster',
        completed: false,
      },
      {
        id: 'v10_2',
        name: 'Hib – 2',
        desc: 'Protects against: Meningitis, Pneumonia',
        completed: false,
      },
      {
        id: 'v10_3',
        name: 'IPV – 2',
        desc: 'Protects against: Poliomyelitis second dose',
        completed: false,
      },
      {
        id: 'v10_4',
        name: 'Rotavirus – 2',
        desc: 'Protects against: Rotavirus diarrhoea second dose',
        completed: false,
        optional: true,
      },
    ],
  },
  {
    id: '14w',
    title: '14 Weeks',
    dotColor: '#84CC16',
    borderColor: '#D9F99D',
    headerBg: '#F7FEE7',
    items: [
      {
        id: 'v14_1',
        name: 'DTwP / DTaP – 3',
        desc: 'Protects against: Diphtheria, Tetanus, Pertussis third dose',
        completed: false,
      },
      {
        id: 'v14_2',
        name: 'Hib – 3',
        desc: 'Protects against: Meningitis, Pneumonia third dose',
        completed: false,
      },
      {
        id: 'v14_3',
        name: 'IPV – 3',
        desc: 'Protects against: Poliomyelitis third dose',
        completed: false,
      },
      {
        id: 'v14_4',
        name: 'PCV – 2',
        desc: 'Protects against: Pneumococcal disease second dose',
        completed: false,
      },
      {
        id: 'v14_5',
        name: 'Rotavirus – 3',
        desc: 'Protects against: Rotavirus diarrhoea third dose',
        completed: false,
        optional: true,
      },
    ],
  },
  {
    id: '6m',
    title: '6 Months',
    dotColor: '#14B8A6',
    borderColor: '#99F6E4',
    headerBg: '#F0FDFA',
    items: [
      {
        id: 'v6m_1',
        name: 'OPV – 1',
        desc: 'Protects against: Poliovirus follow-up booster',
        completed: false,
      },
      {
        id: 'v6m_2',
        name: 'Hep B – 2',
        desc: 'Protects against: Hepatitis B primary sequence',
        completed: false,
      },
      {
        id: 'v6m_3',
        name: 'Influenza – 1',
        desc: 'Protects against: Seasonal influenza strains',
        completed: false,
      },
    ],
  },
  {
    id: '9m',
    title: '9 Months',
    dotColor: '#0284C7',
    borderColor: '#BAE6FD',
    headerBg: '#F0F9FF',
    items: [
      {
        id: 'v9m_1',
        name: 'MMR – 1',
        desc: 'Protects against: Measles, Mumps, Rubella',
        completed: false,
      },
      {
        id: 'v9m_2',
        name: 'OPV – 2',
        desc: 'Protects against: Poliovirus immunity strengthening',
        completed: false,
      },
      {
        id: 'v9m_3',
        name: 'Vitamin A – Dose 1',
        desc: 'Supports: Vision & immune system maturity',
        completed: false,
      },
    ],
  },
  {
    id: '12m',
    title: '12 Months',
    dotColor: '#8B5CF6',
    borderColor: '#DDD6FE',
    headerBg: '#F5F3FF',
    items: [
      {
        id: 'v12m_1',
        name: 'Hepatitis A – 1',
        desc: 'Protects against: Hepatitis A infection',
        completed: false,
      },
      {
        id: 'v12m_2',
        name: 'PCV Booster',
        desc: 'Protects against: Pneumococcal strains completion',
        completed: false,
      },
      {
        id: 'v12m_3',
        name: 'Japanese Encephalitis – 1',
        desc: 'Recommended in endemic zones',
        completed: false,
        optional: true,
      },
    ],
  },
  {
    id: '15m',
    title: '15–18 Months',
    dotColor: '#F43F5E',
    borderColor: '#FECDD3',
    headerBg: '#FFF1F2',
    items: [
      {
        id: 'v15m_1',
        name: 'MMR – 2',
        desc: 'Protects against: Measles, Mumps, Rubella second dose',
        completed: false,
      },
      {
        id: 'v15m_2',
        name: 'Varicella – 1',
        desc: 'Protects against: Chickenpox virus',
        completed: false,
      },
      {
        id: 'v15m_3',
        name: 'DTwP / DTaP Booster 1',
        desc: 'First primary childhood booster',
        completed: false,
      },
      {
        id: 'v15m_4',
        name: 'Hib Booster',
        desc: 'Protects against: Haemophilus influenzae type b booster',
        completed: false,
      },
    ],
  },
];

export default function VaccinationScheduleScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<VaccineCategory[]>(INITIAL_VACCINES);

  // Accordion state: 6 Weeks is expanded by default (matching screenshot)
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    '6w': true,
  });

  const { totalCount, completedCount, percentage, remainingCount } = useMemo(() => {
    let total = 0;
    let completed = 0;

    categories.forEach((cat) => {
      cat.items.forEach((it) => {
        total++;
        if (it.completed) completed++;
      });
    });

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const remaining = total - completed;

    return {
      totalCount: total,
      completedCount: completed,
      percentage: pct,
      remainingCount: remaining,
    };
  }, [categories]);

  const toggleExpand = (catId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCats((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const toggleItem = (catId: string, itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;
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

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Vaccination Schedule</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Hero Gradient Card Matching Screenshot */}
        <View style={styles.heroCard}>
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#00B4D8" />
                <Stop offset="100%" stopColor="#0284C7" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" rx={20} fill="url(#heroGradient)" />
          </Svg>

          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Vaccines Completed</Text>
              <View style={styles.heroNumberRow}>
                <Text style={styles.heroBigNumber}>{completedCount}</Text>
                <Text style={styles.heroTotalNumber}> / {totalCount}</Text>
              </View>
            </View>

            {/* Circular Shield Badge */}
            <View style={styles.heroIconBadge}>
              <Shield size={26} color="#FFFFFF" strokeWidth={2.2} />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${Math.max(5, percentage)}%` }]} />
          </View>

          {/* Subtext */}
          <Text style={styles.heroSubtext}>
            {percentage}% complete · {remainingCount} remaining
          </Text>
        </View>

        {/* Categories List */}
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => {
            const isExpanded = !!expandedCats[cat.id];
            const catCompleted = cat.items.filter((it) => it.completed).length;
            const catTotal = cat.items.length;
            const isAllCompleted = catCompleted === catTotal && catTotal > 0;

            return (
              <View
                key={cat.id}
                style={[
                  styles.categoryCard,
                  { borderColor: cat.borderColor },
                  isExpanded && { borderColor: cat.dotColor },
                ]}
              >
                {/* Header */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleExpand(cat.id)}
                  style={[
                    styles.categoryHeader,
                    isExpanded && { backgroundColor: cat.headerBg },
                  ]}
                >
                  <View style={styles.catLeftRow}>
                    <View style={[styles.catDot, { backgroundColor: cat.dotColor }]} />
                    <Text style={[styles.catTitle, { color: cat.dotColor }]}>
                      {cat.title}
                    </Text>
                  </View>

                  <View style={styles.catRightRow}>
                    <Text style={styles.catCounterText}>
                      {catCompleted}/{catTotal}
                    </Text>

                    {isAllCompleted && (
                      <CheckCircle2
                        size={17}
                        color="#10B981"
                        strokeWidth={2.4}
                        style={{ marginRight: 6 }}
                      />
                    )}

                    {isExpanded ? (
                      <ChevronUp size={18} color="#94A3B8" />
                    ) : (
                      <ChevronDown size={18} color="#94A3B8" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Items */}
                {isExpanded && (
                  <View style={styles.itemsWrapper}>
                    {cat.items.map((item, idx) => {
                      const isLast = idx === cat.items.length - 1;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          activeOpacity={0.7}
                          onPress={() => toggleItem(cat.id, item.id)}
                          style={[styles.itemRow, !isLast && styles.itemBorderBottom]}
                        >
                          <View style={styles.statusIconBox}>
                            {item.completed ? (
                              <CheckCircle2 size={22} color="#10B981" strokeWidth={2.4} />
                            ) : (
                              <Clock size={20} color="#94A3B8" strokeWidth={1.8} />
                            )}
                          </View>

                          <View style={styles.itemTextBox}>
                            <Text
                              style={[
                                styles.itemName,
                                item.completed && styles.itemNameCompleted,
                              ]}
                            >
                              {item.name}
                            </Text>
                            <Text style={styles.itemDesc}>{item.desc}</Text>
                          </View>

                          {item.optional && (
                            <View style={styles.optionalBadge}>
                              <Text style={styles.optionalBadgeText}>Optional</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  heroBigNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroTotalNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  heroSubtext: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.92)',
    marginTop: 8,
  },
  categoriesContainer: {
    marginTop: 2,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  catLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  catTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  catRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catCounterText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 8,
  },
  itemsWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  statusIconBox: {
    width: 26,
    alignItems: 'flex-start',
    paddingTop: 1,
  },
  itemTextBox: {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 19,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
    fontWeight: '500',
  },
  itemDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  optionalBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  optionalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
});
