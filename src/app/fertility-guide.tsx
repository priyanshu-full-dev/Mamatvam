import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

type GuideTab = 'overview' | 'female' | 'male' | 'foods';

interface MythFactItem {
  id: string;
  myth: string;
  fact: string;
}

const MYTHS_FACTS_DATA: MythFactItem[] = [
  {
    id: '1',
    myth: 'Myth: You can get pregnant any day of the month',
    fact: 'Fact: You can only conceive during the fertile window — approximately 6 days per cycle (5 days before ovulation + ovulation day). Knowing your cycle is key.',
  },
  {
    id: '2',
    myth: "Myth: Fertility problems are always the woman's issue",
    fact: 'Fact: Approximately one-third of fertility issues are related to female factors, one-third to male factors, and one-third are combined or unexplained.',
  },
  {
    id: '3',
    myth: 'Myth: Stress is the main cause of infertility',
    fact: 'Fact: While extreme chronic stress can slightly delay ovulation, it is rarely the primary cause of infertility. Underlying physiological causes (PCOS, tubal issues, sperm quality) should always be checked first.',
  },
  {
    id: '4',
    myth: "Myth: You can't get pregnant after 35",
    fact: 'Fact: While egg quantity and quality gradually decline with age, many women over 35 conceive healthy babies naturally or with minimal medical assistance.',
  },
  {
    id: '5',
    myth: 'Myth: Herbal supplements boost fertility significantly',
    fact: 'Fact: Most over-the-counter herbal supplements have little clinical evidence and some can even disrupt delicate hormone balance. Consult your doctor before taking supplements beyond standard folic acid and vitamin D.',
  },
];

export default function FertilityGuideScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<GuideTab>('overview');
  const [expandedMythId, setExpandedMythId] = useState<string | null>('1');

  const handleTabChange = (tab: GuideTab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const toggleMyth = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMythId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backBtn}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fertility Guide</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Pills Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {/* Overview Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('overview')}
            style={[
              styles.tabPill,
              activeTab === 'overview' ? styles.tabPillActive : styles.tabPillInactive,
            ]}
          >
            <Text style={styles.tabIcon}>🌺</Text>
            <Text
              style={[
                styles.tabText,
                activeTab === 'overview' ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>

          {/* Female Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('female')}
            style={[
              styles.tabPill,
              activeTab === 'female' ? styles.tabPillActive : styles.tabPillInactive,
            ]}
          >
            <Text style={styles.tabGenderIcon}>♀</Text>
            <Text
              style={[
                styles.tabText,
                activeTab === 'female' ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>

          {/* Male Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('male')}
            style={[
              styles.tabPill,
              activeTab === 'male' ? styles.tabPillActive : styles.tabPillInactive,
            ]}
          >
            <Text style={styles.tabGenderIcon}>♂</Text>
            <Text
              style={[
                styles.tabText,
                activeTab === 'male' ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>

          {/* Foods Tab */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleTabChange('foods')}
            style={[
              styles.tabPill,
              activeTab === 'foods' ? styles.tabPillActive : styles.tabPillInactive,
            ]}
          >
            <Text style={styles.tabIcon}>🥗</Text>
            <Text
              style={[
                styles.tabText,
                activeTab === 'foods' ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              Foods
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <View>
            {/* 2x2 Metric Stat Cards */}
            <View style={styles.metricGrid}>
              {/* Card 1: 85% */}
              <View style={[styles.metricCard, styles.metricCardPink]}>
                <Text style={styles.metricEmoji}>📊</Text>
                <Text style={[styles.metricNumber, { color: '#E11D48' }]}>85%</Text>
                <Text style={styles.metricCaption}>
                  Couples conceive within 12 months of trying
                </Text>
              </View>

              {/* Card 2: 12-24h */}
              <View style={[styles.metricCard, styles.metricCardPurple]}>
                <Text style={styles.metricEmoji}>⏱️</Text>
                <Text style={[styles.metricNumber, { color: '#7C3AED' }]}>12–24h</Text>
                <Text style={styles.metricCaption}>
                  Window for egg fertilisation after ovulation
                </Text>
              </View>

              {/* Card 3: 5 days */}
              <View style={[styles.metricCard, styles.metricCardBlue]}>
                <Text style={styles.metricEmoji}>🔬</Text>
                <Text style={[styles.metricNumber, { color: '#0284C7' }]}>5 days</Text>
                <Text style={styles.metricCaption}>
                  Sperm can survive inside the female body
                </Text>
              </View>

              {/* Card 4: ~20% */}
              <View style={[styles.metricCard, styles.metricCardGreen]}>
                <Text style={styles.metricEmoji}>🎯</Text>
                <Text style={[styles.metricNumber, { color: '#059669' }]}>~20%</Text>
                <Text style={styles.metricCaption}>
                  Chance of conception per menstrual cycle for healthy couples
                </Text>
              </View>
            </View>

            {/* "What is Fertility?" Card */}
            <View style={styles.whatIsCard}>
              <View style={styles.whatIsTitleRow}>
                <Text style={styles.flowerEmoji}>🌸</Text>
                <Text style={styles.whatIsTitle}>What is Fertility?</Text>
              </View>
              <Text style={styles.whatIsBody}>
                Fertility is the natural capability to produce offspring. For a woman, it depends on the regular release of healthy eggs (ovulation), open fallopian tubes, a receptive uterine lining, and hormonal balance. For a man, it depends on adequate sperm count, motility, and morphology.
              </Text>
            </View>

            {/* Myths vs. Facts Section Header */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.searchEmoji}>🔍</Text>
              <Text style={styles.sectionHeaderTitle}>Myths vs. Facts</Text>
            </View>

            {/* Accordion List */}
            {MYTHS_FACTS_DATA.map((item) => {
              const isExpanded = expandedMythId === item.id;

              return (
                <View key={item.id} style={styles.accordionCard}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => toggleMyth(item.id)}
                    style={styles.accordionHeader}
                  >
                    <Text style={styles.accordionTitle}>{item.myth}</Text>
                    {isExpanded ? (
                      <ChevronUp size={18} color="#94A3B8" />
                    ) : (
                      <ChevronDown size={18} color="#94A3B8" />
                    )}
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.accordionBodyContainer}>
                      <Text style={styles.accordionFactText}>{item.fact}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* ================= TAB 2: FEMALE ================= */}
        {activeTab === 'female' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>👩 Essential Female Fertility Factors</Text>
              <Text style={styles.infoBoxText}>
                • <Text style={styles.boldText}>Regular Ovulation:</Text> An egg must be released from the ovaries each month.
                {'\n'}• <Text style={styles.boldText}>Open Fallopian Tubes:</Text> Allows sperm to reach the egg and the embryo to travel into the uterus.
                {'\n'}• <Text style={styles.boldText}>Uterine Receptivity:</Text> Endometrial lining of 8–12 mm is ideal for successful implantation.
                {'\n'}• <Text style={styles.boldText}>Hormonal Balance:</Text> Balanced FSH, LH, Estrogen, Progesterone, and normal thyroid levels.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🌟 How to Detect Ovulation</Text>
              <Text style={styles.infoBoxText}>
                1. <Text style={styles.boldText}>Cervical Fluid:</Text> Looks like clear, slippery, stretchy raw egg whites.
                {'\n'}2. <Text style={styles.boldText}>LH Urine Strips:</Text> Detect the pre-ovulation surge 24–36 hours beforehand.
                {'\n'}3. <Text style={styles.boldText}>Basal Body Temperature:</Text> A sustained 0.2–0.5 °C rise confirms ovulation has occurred.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🩺 When to Seek Medical Guidance</Text>
              <Text style={styles.infoBoxText}>
                • Under 35: After 12 months of timed, unprotected intercourse.
                {'\n'}• Age 35+: After 6 months of trying without conception.
                {'\n'}• Immediately if periods are highly irregular, absent, or unusually painful.
              </Text>
            </View>
          </View>
        )}

        {/* ================= TAB 3: MALE ================= */}
        {activeTab === 'male' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>👨 Semen Health Criteria (WHO Guidelines)</Text>
              <Text style={styles.infoBoxText}>
                • <Text style={styles.boldText}>Sperm Count:</Text> At least 15 million sperm per milliliter.
                {'\n'}• <Text style={styles.boldText}>Progressive Motility:</Text> At least 40% actively swimming forward.
                {'\n'}• <Text style={styles.boldText}>Morphology:</Text> At least 4% with ideal size and shape.
                {'\n'}• <Text style={styles.boldText}>Sperm Lifecycle:</Text> It takes 72–90 days for new sperm cells to fully develop.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🛡️ Habits That Protect Sperm Quality</Text>
              <Text style={styles.infoBoxText}>
                • <Text style={styles.boldText}>Keep Cool:</Text> Avoid hot tubs, saunas, and resting hot laptops directly on the lap.
                {'\n'}• <Text style={styles.boldText}>Limit Toxins:</Text> Stop smoking, avoid binge drinking, and minimize exposure to plastics (BPA).
                {'\n'}• <Text style={styles.boldText}>Nutrient Boost:</Text> Zinc, Selenium, CoQ10, and Vitamin C support sperm DNA integrity.
              </Text>
            </View>
          </View>
        )}

        {/* ================= TAB 4: FOODS ================= */}
        {activeTab === 'foods' && (
          <View style={styles.tabContentContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🥑 Fertility Superfoods</Text>
              <Text style={styles.infoBoxText}>
                • <Text style={styles.boldText}>Avocados & Olive Oil:</Text> Monounsaturated fats lower inflammation and support cellular health.
                {'\n'}• <Text style={styles.boldText}>Dark Leafy Greens (Spinach, Kale):</Text> Rich in folate and iron essential for healthy egg and sperm development.
                {'\n'}• <Text style={styles.boldText}>Walnuts & Pumpkin Seeds:</Text> Packed with plant omega-3s, zinc, and magnesium.
                {'\n'}• <Text style={styles.boldText}>Lentils & Legumes:</Text> High-fiber plant protein helps maintain steady blood glucose and insulin sensitivity.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>⚠️ Foods to Minimize</Text>
              <Text style={styles.infoBoxText}>
                • <Text style={styles.boldText}>Trans Fats & Deep-Fried Foods:</Text> Directly correlate with increased ovulatory infertility risk.
                {'\n'}• <Text style={styles.boldText}>Refined Sugars & Sodas:</Text> Trigger insulin spikes that impair follicle development.
                {'\n'}• <Text style={styles.boldText}>Excessive Caffeine:</Text> Keep intake under 200 mg per day (approx. 1–2 cups of coffee).
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
  backBtn: {
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

  // Category Pills
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  tabPillActive: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  tabPillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  tabIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  tabGenderIcon: {
    fontSize: 13,
    marginRight: 6,
    fontWeight: '800',
    color: '#475569',
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: '#475569',
  },

  // 2x2 Metric Stat Cards
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 2,
  },
  metricCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  metricCardPink: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
  },
  metricCardPurple: {
    backgroundColor: '#FAF5FF',
    borderColor: '#F3E8FF',
  },
  metricCardBlue: {
    backgroundColor: '#F0F9FF',
    borderColor: '#E0F2FE',
  },
  metricCardGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  metricEmoji: {
    fontSize: 18,
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },
  metricCaption: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 4,
    fontWeight: '500',
  },

  // What is Fertility Card
  whatIsCard: {
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 14,
    backgroundColor: '#FFF5F5',
    borderColor: '#FECDD3',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  whatIsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flowerEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  whatIsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E11D48',
  },
  whatIsBody: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 19,
    marginTop: 8,
    fontWeight: '400',
  },

  // Myths vs Facts Header
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  searchEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  sectionHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
  },

  // Accordion Cards
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    paddingRight: 10,
  },
  accordionBodyContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  accordionFactText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '400',
  },

  // Other Tabs Content
  tabContentContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  infoBoxTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: '#1E293B',
  },
});
