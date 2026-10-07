import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
  Droplet,
  Droplets,
  Microscope,
  TestTube,
  Activity,
  Dna,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type FilterCategory = 'all' | '1st' | '2nd' | '3rd';

export interface AntenatalTest {
  id: string;
  title: string;
  type: 'Blood' | 'Urine' | 'Scan' | 'Swab' | 'Physical' | 'Genetic';
  timing: string;
  trimesters: ('1st' | '2nd' | '3rd')[];
  isOptional: boolean;
  whyItsDone: string;
  procedure: string;
  normalRange: string;
  whenToAct: string;
}

const TESTS_DATA: AntenatalTest[] = [
  {
    id: '1',
    title: 'Blood Group & Rh Factor',
    type: 'Blood',
    timing: 'Week 6–8',
    trimesters: ['1st'],
    isOptional: false,
    whyItsDone:
      "Determines your ABO blood group and Rh (positive/negative) status. Critical if you're Rh-negative — you'll need anti-D injections to prevent complications.",
    procedure: 'Single venous blood draw from your arm. Results in 1–2 days.',
    normalRange: 'A, B, AB or O • Rh+ or Rh-',
    whenToAct:
      'Rh-negative mothers carrying Rh-positive babies need anti-D prophylaxis at 28 weeks and after delivery.',
  },
  {
    id: '2',
    title: 'Complete Blood Count (CBC)',
    type: 'Blood',
    timing: 'Week 6–8, repeat at 28–36 weeks',
    trimesters: ['1st', '3rd'],
    isOptional: false,
    whyItsDone:
      'Evaluates hemoglobin levels to screen for anemia, total leukocyte count for underlying infections, and platelet levels essential for normal blood clotting during labor.',
    procedure: 'Standard venous blood draw from your arm.',
    normalRange: 'Hemoglobin: 11.0–14.0 g/dL • Platelets: 150,000–450,000 /µL',
    whenToAct:
      'Hemoglobin below 10.0 g/dL signifies moderate to severe gestational anemia requiring oral iron or intravenous iron therapy.',
  },
  {
    id: '3',
    title: 'Urine Routine & Culture',
    type: 'Urine',
    timing: 'Every prenatal visit',
    trimesters: ['1st', '2nd', '3rd'],
    isOptional: false,
    whyItsDone:
      'Screens for asymptomatic bacteriuria (UTIs), proteinuria (early marker for pre-eclampsia), and glycosuria (gestational diabetes indicator).',
    procedure: 'Clean-catch midstream urine sample collected in a sterile container.',
    normalRange: 'Negative for protein, glucose, ketones, and bacterial growth',
    whenToAct:
      'Presence of protein traces warrants close blood pressure tracking; bacterial colonies > 10^5 CFU/mL requires immediate pregnancy-safe antibiotics.',
  },
  {
    id: '4',
    title: 'Thyroid Function (TSH)',
    type: 'Blood',
    timing: 'Week 6–10',
    trimesters: ['1st'],
    isOptional: false,
    whyItsDone:
      "Maternal thyroxine is essential for fetal neurodevelopment and brain growth during the first trimester before the baby's own thyroid functions.",
    procedure: 'Fasting venous blood draw, ideally taken in the morning.',
    normalRange: '0.1 – 2.5 mIU/L (1st trimester pregnancy target)',
    whenToAct:
      'TSH > 2.5 mIU/L indicates subclinical hypothyroidism requiring Levothyroxine titration to safeguard fetal brain development.',
  },
  {
    id: '5',
    title: 'NT Scan (Nuchal Translucency)',
    type: 'Scan',
    timing: 'Week 11–13+6',
    trimesters: ['1st'],
    isOptional: false,
    whyItsDone:
      "Measures fluid thickness at the back of the fetal neck (nuchal translucency) and evaluates nasal bone to screen for Down syndrome and major congenital cardiac anomalies.",
    procedure: 'High-resolution transabdominal ultrasound scan, best when fetal CRL is 45–84 mm.',
    normalRange: 'Nuchal thickness < 2.5 mm with clearly visible nasal bone',
    whenToAct:
      'NT measurement ≥ 3.0 mm warrants immediate fetal medicine consultation, Double Marker integration, or diagnostic NIPT/CVS.',
  },
  {
    id: '6',
    title: 'Double Marker Test',
    type: 'Blood',
    timing: 'Week 11–13 (alongside NT scan)',
    trimesters: ['1st'],
    isOptional: false,
    whyItsDone:
      'Measures maternal serum Free Beta-hCG and PAPP-A. Combined with the NT scan measurement, it delivers an accurate first-trimester Down syndrome risk calculation.',
    procedure: 'Venous blood collection scheduled on the same day as your NT ultrasound.',
    normalRange: 'Adjusted combined risk ratio < 1:1,000 (Low Risk)',
    whenToAct:
      'Calculated risk > 1:250 is flagged high risk; non-invasive prenatal testing (NIPT) or diagnostic karyotyping is recommended.',
  },
  {
    id: '7',
    title: 'Hepatitis B, HIV & VDRL',
    type: 'Blood',
    timing: 'Week 6–10',
    trimesters: ['1st'],
    isOptional: false,
    whyItsDone:
      'Universal screening panel to prevent vertical transmission of viral hepatitis, HIV, or syphilis to the baby during pregnancy and delivery.',
    procedure: 'Standard venous blood draw.',
    normalRange: 'Non-reactive / Negative for HBsAg, HIV I & II, and VDRL/Syphilis',
    whenToAct:
      'Positive HBsAg requires newborn immunoglobulin within 12 hours of delivery; positive HIV initiates maternal antiretroviral therapy immediately.',
  },
  {
    id: '8',
    title: 'Anomaly Scan (Level 2 USG)',
    type: 'Scan',
    timing: 'Week 18–22',
    trimesters: ['2nd'],
    isOptional: false,
    whyItsDone:
      "Comprehensive structural survey examining baby's brain ventricles, face/palate, spine, four heart chambers, stomach, kidneys, limbs, and placenta position.",
    procedure: 'Detailed 35–45 minute ultrasound scan performed by a fetal medicine specialist.',
    normalRange: 'Normal fetal anatomy, intact 4-chamber heart view, cervical length > 30 mm',
    whenToAct:
      'Any structural variants or abnormal placental positions require targeted fetal echocardiography and high-risk obstetric monitoring.',
  },
  {
    id: '9',
    title: 'Quadruple Marker Test',
    type: 'Blood',
    timing: 'Week 15–20',
    trimesters: ['2nd'],
    isOptional: true,
    whyItsDone:
      'Evaluates AFP, hCG, unconjugated estriol, and inhibin-A for mothers who missed the early first-trimester Double Marker screening window.',
    procedure: 'Venous blood draw taken between 15 and 20 weeks gestation.',
    normalRange: 'Low-risk cut-off: 1 in 1,000 or lower',
    whenToAct:
      'Elevated maternal AFP indicates neural tube defect risk (spina bifida); abnormal composite markers indicate amniocentesis consultation.',
  },
  {
    id: '10',
    title: 'Oral Glucose Tolerance Test (OGTT)',
    type: 'Blood',
    timing: 'Week 24–28',
    trimesters: ['2nd'],
    isOptional: false,
    whyItsDone:
      'Universal diagnostic test for Gestational Diabetes Mellitus (GDM) caused by placental hormones that block maternal insulin action.',
    procedure:
      'Fasting blood draw, consumption of 75g glucose dissolved in water, with repeat blood draws at 1 hour and 2 hours.',
    normalRange: 'Fasting < 92 mg/dL • 1-hr < 180 mg/dL • 2-hr < 153 mg/dL',
    whenToAct:
      'A single value exceeding threshold confirms GDM; requires medical nutrition therapy, self-glucose monitoring, or insulin therapy.',
  },
  {
    id: '11',
    title: 'Indirect Coombs Test + Anti-D',
    type: 'Blood',
    timing: 'Week 28 (Rh negative mothers only)',
    trimesters: ['3rd'],
    isOptional: false,
    whyItsDone:
      'Verifies that an Rh-negative mother has not developed antibodies against fetal red blood cells prior to receiving prophylactic Anti-D injection.',
    procedure: 'Maternal venous blood antibody titer test.',
    normalRange: 'Negative (no iso-immunization antibodies detected)',
    whenToAct:
      'If test is negative, prophylactic 300 mcg Rh immunoglobulin (Anti-D) is administered intramuscularly at 28 weeks.',
  },
  {
    id: '12',
    title: 'Fetal Echocardiography',
    type: 'Scan',
    timing: 'Week 18–24',
    trimesters: ['2nd'],
    isOptional: true,
    whyItsDone:
      'Targeted in-depth ultrasonic evaluation of fetal cardiac chambers, outflow tracts, valves, and rhythm; recommended for IVF, maternal diabetes, or scan anomalies.',
    procedure: 'Detailed 30-minute ultrasound scan focused exclusively on the fetal heart.',
    normalRange: 'Normal 4-chamber view, normal outflow tracts, regular sinus rhythm',
    whenToAct:
      'Congenital cardiac malformations trigger planned delivery at a tertiary center equipped with neonatal pediatric cardiac surgery.',
  },
  {
    id: '13',
    title: 'Growth / Doppler Scan',
    type: 'Scan',
    timing: 'Week 28, 32, 36',
    trimesters: ['3rd'],
    isOptional: false,
    whyItsDone:
      'Tracks fetal growth velocity, estimated fetal weight (EFW), amniotic fluid levels (AFI), and placental umbilical artery blood circulation.',
    procedure: 'Color Doppler ultrasound measuring blood flow resistance indices.',
    normalRange: 'EFW between 10th and 90th percentile • Amniotic Fluid Index (AFI) 8.0–18.0 cm',
    whenToAct:
      'Fetal growth restriction (< 10th percentile) or elevated Doppler resistance prompts bi-weekly monitoring or planned delivery.',
  },
  {
    id: '14',
    title: 'Group B Streptococcus (GBS) Swab',
    type: 'Swab',
    timing: 'Week 35–37',
    trimesters: ['3rd'],
    isOptional: false,
    whyItsDone:
      'Screens for GBS colonization in the lower genital tract, which can transfer to the baby during vaginal delivery and cause neonatal sepsis.',
    procedure: 'Brief, painless swab of lower vagina and rectum; results ready in 48 hours.',
    normalRange: 'GBS culture negative',
    whenToAct:
      'GBS positive status mandates IV intravenous penicillin/ampicillin antibiotics as soon as active labor or membrane rupture begins.',
  },
  {
    id: '15',
    title: 'Non-Stress Test (NST / CTG)',
    type: 'Physical',
    timing: 'Week 32 onwards (as indicated)',
    trimesters: ['3rd'],
    isOptional: false,
    whyItsDone:
      'Assesses fetal central nervous system oxygenation by correlating fetal movements with baseline heart rate accelerations.',
    procedure: 'Two ultrasound sensors belted gently around the abdomen for a 20–30 minute monitoring session.',
    normalRange:
      'Reactive trace: ≥ 2 accelerations of 15 bpm for 15 seconds within 20 mins with baseline 110–160 bpm',
    whenToAct:
      'Non-reactive or decelerating trace requires maternal hydration, biophysical profile scoring, or prompt obstetric evaluation.',
  },
  {
    id: '16',
    title: 'Repeat CBC & Iron Studies',
    type: 'Blood',
    timing: 'Week 28–32',
    trimesters: ['3rd'],
    isOptional: false,
    whyItsDone:
      'Re-evaluates maternal blood count and iron reserves before labor to prevent postpartum hemorrhage and extreme maternal exhaustion.',
    procedure: 'Venous blood collection.',
    normalRange: 'Hemoglobin ≥ 10.5–11.0 g/dL • Serum Ferritin > 30 ng/mL',
    whenToAct:
      'Hemoglobin < 9.0 g/dL in late third trimester requires parenteral iron sucrose or ferric carboxymaltose infusion before delivery.',
  },
  {
    id: '17',
    title: 'NIPT (Non-Invasive Prenatal Test)',
    type: 'Genetic',
    timing: 'Week 10 onwards',
    trimesters: ['1st', '2nd'],
    isOptional: true,
    whyItsDone:
      'Extracts circulating cell-free fetal DNA (cffDNA) from mother’s blood to screen for Down (Trisomy 21), Edwards (18), and Patau (13) with >99% accuracy.',
    procedure: 'Simple venous blood draw from mother; no fetal miscarriage risk.',
    normalRange: 'Low Risk / Negative for common aneuploidies and microdeletions',
    whenToAct:
      'High Risk finding is a screening result and must be definitively confirmed with diagnostic amniocentesis or CVS.',
  },
  {
    id: '18',
    title: 'Chorionic Villus Sampling (CVS)',
    type: 'Genetic',
    timing: 'Week 11–13',
    trimesters: ['1st'],
    isOptional: true,
    whyItsDone:
      'Diagnostic genetic procedure sampling placental tissue to definitively test for chromosomal abnormalities and hereditary single-gene disorders.',
    procedure: 'Fine needle aspiration guided by live ultrasound through cervix or abdomen.',
    normalRange: 'Normal 46,XX or 46,XY chromosomal karyotype',
    whenToAct:
      'Provides conclusive genetic diagnosis after an abnormal NT scan or familial genetic carrier screening.',
  },
  {
    id: '19',
    title: 'Amniocentesis',
    type: 'Genetic',
    timing: 'Week 15–20',
    trimesters: ['2nd'],
    isOptional: true,
    whyItsDone:
      'Definitive diagnostic test sampling amniotic fluid to analyze fetal chromosomes, genetic microarrays, and alpha-fetoprotein levels.',
    procedure: 'Ultrasound-guided thin needle inserted into the amniotic sac to withdraw 15–20 mL of fluid.',
    normalRange: 'Normal chromosomal complement and normal amniotic fluid AFP levels',
    whenToAct:
      'Conclusively confirms or rules out chromosomal abnormalities indicated by screening marker tests.',
  },
];

export default function TypesOfTestsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredTests = TESTS_DATA.filter((test) => {
    if (selectedFilter === 'all') return true;
    return test.trimesters.includes(selectedFilter);
  });

  const renderTestIcon = (type: AntenatalTest['type']) => {
    switch (type) {
      case 'Blood':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Droplet size={18} color="#EF4444" fill="#EF4444" />
          </View>
        );
      case 'Urine':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
            <Droplets size={18} color="#0284C7" fill="#0284C7" />
          </View>
        );
      case 'Scan':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
            <Microscope size={19} color="#7C3AED" />
          </View>
        );
      case 'Swab':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <TestTube size={18} color="#059669" />
          </View>
        );
      case 'Physical':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#FFEDD5' }]}>
            <Activity size={18} color="#EA580C" />
          </View>
        );
      case 'Genetic':
        return (
          <View style={[styles.iconBox, { backgroundColor: '#CCFBF1' }]}>
            <Dna size={18} color="#0D9488" />
          </View>
        );
      default:
        return (
          <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
            <Droplet size={18} color="#64748B" />
          </View>
        );
    }
  };

  const renderTypeTag = (type: AntenatalTest['type']) => {
    switch (type) {
      case 'Blood':
        return (
          <View style={[styles.typeBadge, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.typeBadgeText, { color: '#EF4444' }]}>Blood</Text>
          </View>
        );
      case 'Urine':
        return (
          <View style={[styles.typeBadge, { backgroundColor: '#E0F2FE' }]}>
            <Text style={[styles.typeBadgeText, { color: '#0284C7' }]}>Urine</Text>
          </View>
        );
      case 'Scan':
        return (
          <View style={[styles.typeBadge, { backgroundColor: '#F3E8FF' }]}>
            <Text style={[styles.typeBadgeText, { color: '#7C3AED' }]}>Scan</Text>
          </View>
        );
      case 'Swab':
        return (
          <View style={[styles.typeBadge, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.typeBadgeText, { color: '#059669' }]}>Swab</Text>
          </View>
        );
      case 'Physical':
        return (
          <View style={[styles.typeBadge, { backgroundColor: '#FFEDD5' }]}>
            <Text style={[styles.typeBadgeText, { color: '#EA580C' }]}>Physical</Text>
          </View>
        );
      case 'Genetic':
        return (
          <View style={[styles.typeBadge, { backgroundColor: '#CCFBF1' }]}>
            <Text style={[styles.typeBadgeText, { color: '#0D9488' }]}>Genetic</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Types of Tests</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Notice Box */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIconWrapper}>
            <Info size={14} color="#E11D48" />
          </View>
          <Text style={styles.infoBannerText}>
            This is an informational guide based on Indian antenatal guidelines. Always follow your doctor's personalised advice.
          </Text>
        </View>

        {/* Trimester Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {/* All Test */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedFilter('all')}
            style={[
              styles.filterTab,
              selectedFilter === 'all'
                ? styles.filterTabAllActive
                : styles.filterTabAllInactive,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'all'
                  ? styles.filterTabTextActive
                  : styles.filterTabTextInactiveAll,
              ]}
            >
              All Test
            </Text>
          </TouchableOpacity>

          {/* 1st Trimester */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedFilter('1st')}
            style={[
              styles.filterTab,
              selectedFilter === '1st'
                ? styles.filterTab1stActive
                : styles.filterTab1stInactive,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === '1st'
                  ? styles.filterTabTextActive
                  : styles.filterTab1stTextInactive,
              ]}
            >
              1st Trimester
            </Text>
          </TouchableOpacity>

          {/* 2nd Trimester */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedFilter('2nd')}
            style={[
              styles.filterTab,
              selectedFilter === '2nd'
                ? styles.filterTab2ndActive
                : styles.filterTab2ndInactive,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === '2nd'
                  ? styles.filterTabTextActive
                  : styles.filterTab2ndTextInactive,
              ]}
            >
              2nd Trimester
            </Text>
          </TouchableOpacity>

          {/* 3rd Trimester */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedFilter('3rd')}
            style={[
              styles.filterTab,
              selectedFilter === '3rd'
                ? styles.filterTab3rdActive
                : styles.filterTab3rdInactive,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === '3rd'
                  ? styles.filterTabTextActive
                  : styles.filterTab3rdTextInactive,
              ]}
            >
              3rd Trimester
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Counter Text */}
        <View style={styles.counterRow}>
          <Text style={styles.counterText}>
            Showing <Text style={styles.counterBold}>{filteredTests.length} tests</Text>
          </Text>
        </View>

        {/* 19 Antenatal Test Cards */}
        {filteredTests.map((test) => {
          const isExpanded = expandedId === test.id;

          return (
            <View key={test.id} style={styles.cardContainer}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => toggleExpand(test.id)}
                style={styles.cardHeader}
              >
                {/* Left Test Icon */}
                {renderTestIcon(test.type)}

                {/* Middle Info */}
                <View style={styles.cardMainInfo}>
                  <Text style={styles.cardTitle}>{test.title}</Text>

                  <View style={styles.metaRow}>
                    {renderTypeTag(test.type)}
                    <View style={styles.timingWrapper}>
                      <Clock size={11} color="#94A3B8" style={{ marginRight: 3 }} />
                      <Text style={styles.timingText}>{test.timing}</Text>
                    </View>
                  </View>
                </View>

                {/* Right Badges & Chevron */}
                <View style={styles.rightActionRow}>
                  {test.isOptional && (
                    <View style={styles.optionalBadge}>
                      <Text style={styles.optionalBadgeText}>Optional</Text>
                    </View>
                  )}
                  {isExpanded ? (
                    <ChevronUp size={18} color="#94A3B8" />
                  ) : (
                    <ChevronDown size={18} color="#94A3B8" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Expanded Card Details */}
              {isExpanded && (
                <View style={styles.expandedSection}>
                  <View style={styles.dividerLine} />

                  {/* Why It's Done */}
                  <Text style={styles.sectionHeading}>WHY IT'S DONE</Text>
                  <Text style={styles.sectionBody}>{test.whyItsDone}</Text>

                  {/* Procedure */}
                  <Text style={[styles.sectionHeading, { marginTop: 12 }]}>PROCEDURE</Text>
                  <Text style={styles.sectionBody}>{test.procedure}</Text>

                  {/* Normal Range Box */}
                  <View style={styles.normalRangeBox}>
                    <Text style={styles.normalRangeHeading}>NORMAL RANGE</Text>
                    <Text style={styles.normalRangeContent}>{test.normalRange}</Text>
                  </View>

                  {/* When to Act Box */}
                  <View style={styles.whenToActBox}>
                    <Text style={styles.whenToActHeading}>▲ WHEN TO ACT</Text>
                    <Text style={styles.whenToActContent}>{test.whenToAct}</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
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
  headerRightSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  infoBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
    backgroundColor: '#FFF5F5',
    borderColor: '#FECDD3',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#E11D48',
    lineHeight: 18,
    fontWeight: '500',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterTabAllActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  filterTabAllInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  filterTab1stActive: {
    backgroundColor: '#E11D48',
    borderColor: '#E11D48',
  },
  filterTab1stInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FECDD3',
  },
  filterTab2ndActive: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  filterTab2ndInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FED7AA',
  },
  filterTab3rdActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  filterTab3rdInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#99F6E4',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterTabTextInactiveAll: {
    color: '#475569',
  },
  filterTab1stTextInactive: {
    color: '#E11D48',
  },
  filterTab2ndTextInactive: {
    color: '#EA580C',
  },
  filterTab3rdTextInactive: {
    color: '#0D9488',
  },
  counterRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  counterText: {
    fontSize: 12,
    color: '#64748B',
  },
  counterBold: {
    fontWeight: '800',
    color: '#1E293B',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardMainInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  timingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  rightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  optionalBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginRight: 8,
  },
  optionalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  expandedSection: {
    marginTop: 10,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  sectionBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '400',
  },
  normalRangeBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  normalRangeHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  normalRangeContent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    lineHeight: 16,
  },
  whenToActBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  whenToActHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  whenToActContent: {
    fontSize: 11.5,
    color: '#B91C1C',
    lineHeight: 16.5,
    fontWeight: '500',
  },
});
