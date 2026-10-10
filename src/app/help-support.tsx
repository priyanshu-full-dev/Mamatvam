import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Mail,
  MessageCircle,
  Flag,
  HelpCircle,
  Zap,
  Droplets,
  Activity,
  Footprints,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  questions: FAQItem[];
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    getting_started: true,
  });
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    'getting_started_0': true,
  });

  const categories: FAQCategory[] = [
    {
      id: 'getting_started',
      title: 'Getting Started',
      icon: Zap,
      iconColor: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#FEF3C7',
      questions: [
        {
          q: 'How do I set up my pregnancy details?',
          a: "Go to Home → tap your profile name → Edit Profile. Enter your due date, current week, and doctor's name to personalise your experience.",
        },
        {
          q: 'Can I use Mamatvam for twins?',
          a: 'Yes! Mamatvam provides dedicated dual-growth metrics, multiple kick counters, and customized twin nutrition advice.',
        },
        {
          q: 'Is Mamatvam free to use?',
          a: 'Core tracking features including daily tips, symptom logging, kick counter, and water tracker are completely free for all expecting mothers.',
        },
      ],
    },
    {
      id: 'kick_counter',
      title: 'Kick Counter',
      icon: Footprints,
      iconColor: '#F43F5E',
      bgColor: '#FFF1F2',
      borderColor: '#FFE4E6',
      questions: [
        {
          q: 'When should I start counting kicks?',
          a: 'Most doctors recommend monitoring fetal kicks daily starting from Week 28 of pregnancy.',
        },
        {
          q: 'How many kicks should I feel in an hour?',
          a: 'Healthy babies typically log at least 10 distinct kicks or rolls within a 2-hour window during their active periods.',
        },
      ],
    },
    {
      id: 'water_tracker',
      title: 'Water Tracker',
      icon: Droplets,
      iconColor: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#E0F2FE',
      questions: [
        {
          q: 'How much water should I drink each day?',
          a: 'We recommend 8 to 12 glasses (approx. 2.5 to 3 liters) daily to support healthy blood flow and amniotic fluid volume.',
        },
        {
          q: 'Can I log tender coconut water or soups?',
          a: 'Yes, any hydrating fluids like coconut water, electrolyte drinks, or clear broths count toward your daily total.',
        },
      ],
    },
    {
      id: 'symptom_tracker',
      title: 'Symptom Tracker',
      icon: Activity,
      iconColor: '#9333EA',
      bgColor: '#FAF5FF',
      borderColor: '#F3E8FF',
      questions: [
        {
          q: 'How do I log daily nausea or fatigue?',
          a: 'Navigate to Practical Tools → Record Symptoms, select your symptoms and their intensity, and hit Save.',
        },
        {
          q: 'Can I share symptoms history with my doctor?',
          a: 'Yes, your Symptoms History screen can generate a neat summary to share directly during your clinic appointments.',
        },
        {
          q: 'When should I call my hospital immediately?',
          a: 'Seek immediate care for severe abdominal pain, persistent fluid leakage, sudden face swelling, or severe reduced fetal movement.',
        },
      ],
    },
  ];

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleQuestion = (key: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEmailUs = () => {
    Linking.openURL('mailto:support@mamatvam.com?subject=Mamatvam App Support Request').catch(() => {
      Alert.alert('Email Support', 'Please contact us at support@mamatvam.com');
    });
  };

  const handleLiveChat = () => {
    Alert.alert(
      'Live Support',
      'Our mother care coordinators are available Mon-Sat, 9am-6pm. Would you like to connect on WhatsApp?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open WhatsApp',
          onPress: () => {
            Linking.openURL('https://wa.me/919876543210?text=Hi Mamatvam Support team, I need assistance.');
          },
        },
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report Bug',
      'Notice any glitch or unexpected behavior? We would love to fix it immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Report',
          onPress: () => {
            Linking.openURL('mailto:support@mamatvam.com?subject=Bug Report - Mamatvam App');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            placeholder="Search help articles..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* 3 Action Cards (Email Us, Live Chat, Report Bug) */}
        <View style={styles.actionCardsRow}>
          {/* Card 1: Email Us */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleEmailUs}
            style={styles.actionCardPurple}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Mail size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.actionTitle}>Email Us</Text>
            <Text style={styles.actionSub}>24hr reply</Text>
          </TouchableOpacity>

          {/* Card 2: Live Chat */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLiveChat}
            style={styles.actionCardPink}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FCE7F3' }]}>
              <MessageCircle size={18} color="#EC4899" />
            </View>
            <Text style={styles.actionTitle}>Live Chat</Text>
            <Text style={styles.actionSub}>9am–6pm</Text>
          </TouchableOpacity>

          {/* Card 3: Report Bug */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleReportBug}
            style={styles.actionCardOrange}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FFEDD5' }]}>
              <Flag size={18} color="#F97316" />
            </View>
            <Text style={styles.actionTitle}>Report Bug</Text>
            <Text style={styles.actionSub}>App issue?</Text>
          </TouchableOpacity>
        </View>

        {/* Frequently Asked Questions Title */}
        <View style={styles.faqHeaderRow}>
          <HelpCircle size={18} color="#64748B" />
          <Text style={styles.faqSectionTitle}>Frequently Asked Questions</Text>
        </View>

        {/* Category Accordion Cards */}
        {categories.map((cat) => {
          const isCategoryExpanded = !!expandedCategories[cat.id];
          const IconComponent = cat.icon;

          return (
            <View
              key={cat.id}
              style={[
                styles.categoryCard,
                {
                  backgroundColor: cat.bgColor,
                  borderColor: cat.borderColor,
                },
              ]}
            >
              {/* Category Header */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleCategory(cat.id)}
                style={styles.categoryHeader}
              >
                <View style={styles.categoryHeaderLeft}>
                  <View style={[styles.catIconCircle, { backgroundColor: '#FFFFFF' }]}>
                    <IconComponent size={18} color={cat.iconColor} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                </View>

                <View style={styles.categoryHeaderRight}>
                  <Text style={styles.qCountText}>{cat.questions.length} Q</Text>
                  {isCategoryExpanded ? (
                    <ChevronUp size={18} color="#94A3B8" />
                  ) : (
                    <ChevronDown size={18} color="#94A3B8" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Category Q&A List */}
              {isCategoryExpanded && (
                <View style={styles.categoryBody}>
                  {cat.questions.map((qItem, idx) => {
                    const qKey = `${cat.id}_${idx}`;
                    const isQExpanded = !!expandedQuestions[qKey];

                    return (
                      <View key={idx} style={styles.qnaContainer}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => toggleQuestion(qKey)}
                          style={styles.qRow}
                        >
                          <Text style={styles.qPrefix}>Q</Text>
                          <Text style={styles.qText}>{qItem.q}</Text>
                          {isQExpanded ? (
                            <ChevronUp size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
                          ) : (
                            <ChevronDown size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
                          )}
                        </TouchableOpacity>

                        {isQExpanded && (
                          <View style={styles.aRow}>
                            <Text style={styles.aPrefix}>A</Text>
                            <Text style={styles.aText}>{qItem.a}</Text>
                          </View>
                        )}

                        {idx < cat.questions.length - 1 && <View style={styles.qnaDivider} />}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
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
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  actionCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionCardPurple: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  actionCardPink: {
    flex: 1,
    backgroundColor: '#FDF2F8',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  actionCardOrange: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  faqSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  categoryCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  catIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  categoryBody: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  qnaContainer: {
    paddingVertical: 6,
  },
  qRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  qPrefix: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
    marginRight: 8,
    marginTop: 1,
  },
  qText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 19,
  },
  aRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingLeft: 2,
  },
  aPrefix: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
    marginRight: 8,
    marginTop: 1,
  },
  aText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
  },
  qnaDivider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginVertical: 10,
  },
});
