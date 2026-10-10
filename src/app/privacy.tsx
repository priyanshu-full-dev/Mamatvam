import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Shield,
  Database,
  Eye,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    collect: true,
    use: false,
    security: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
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
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Intro Banner Card */}
        <View style={styles.introCard}>
          <View style={styles.introIconRow}>
            <Shield size={20} color="#8B5CF6" strokeWidth={2.2} />
          </View>
          <Text style={styles.introText}>
            At <Text style={styles.boldText}>Mamatvam</Text>, we deeply value the privacy of every
            expecting mother. This policy explains how we collect, use, and protect your personal
            and health information.
          </Text>
        </View>

        {/* Section 1: Information We Collect */}
        <View style={styles.accordionCardLavender}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleSection('collect')}
            style={styles.accordionHeader}
          >
            <View style={styles.headerLeftRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
                <Database size={18} color="#7C3AED" strokeWidth={2.2} />
              </View>
              <Text style={styles.accordionTitle}>Information We Collect</Text>
            </View>
            {expandedSections.collect ? (
              <ChevronUp size={20} color="#94A3B8" />
            ) : (
              <ChevronDown size={20} color="#94A3B8" />
            )}
          </TouchableOpacity>

          {expandedSections.collect && (
            <View style={styles.accordionBody}>
              <View style={styles.bodyBlock}>
                <Text style={styles.bodyHeading}>Personal Information</Text>
                <Text style={styles.bodyText}>
                  When you register, we collect your name, email address, phone number, date of
                  birth, and due date to personalise your experience.
                </Text>
              </View>

              <View style={styles.bodyBlock}>
                <Text style={styles.bodyHeading}>Health & Pregnancy Data</Text>
                <Text style={styles.bodyText}>
                  We collect data you voluntarily input — symptoms, kick counts, hydration levels,
                  mood, weight, and hospital bag status — to provide a personalised pregnancy
                  tracking experience.
                </Text>
              </View>

              <View style={styles.bodyBlock}>
                <Text style={styles.bodyHeading}>Device & Usage Data</Text>
                <Text style={styles.bodyText}>
                  We automatically collect device identifiers, app usage data, and crash reports to
                  improve app performance and stability.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Section 2: How We Use Your Data */}
        <View style={styles.accordionCardBlue}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleSection('use')}
            style={styles.accordionHeader}
          >
            <View style={styles.headerLeftRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Eye size={18} color="#0284C7" strokeWidth={2.2} />
              </View>
              <Text style={styles.accordionTitle}>How We Use Your Data</Text>
            </View>
            {expandedSections.use ? (
              <ChevronUp size={20} color="#94A3B8" />
            ) : (
              <ChevronDown size={20} color="#94A3B8" />
            )}
          </TouchableOpacity>

          {expandedSections.use && (
            <View style={styles.accordionBody}>
              <View style={styles.bodyBlock}>
                <Text style={styles.bodyHeading}>Personalized Insights</Text>
                <Text style={styles.bodyText}>
                  We deliver pregnancy milestones, fetal growth updates, and customized nutrition
                  recommendations suited to your current trimester and health logs.
                </Text>
              </View>

              <View style={styles.bodyBlock}>
                <Text style={styles.bodyHeading}>Doctor & Hospital Coordination</Text>
                <Text style={styles.bodyText}>
                  Enable seamless appointment scheduling, diagnostic report storage, and secure
                  communication with your chosen maternity care hospital.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Section 3: Data Security & Storage */}
        <View style={styles.accordionCardGreen}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleSection('security')}
            style={styles.accordionHeader}
          >
            <View style={styles.headerLeftRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Lock size={18} color="#16A34A" strokeWidth={2.2} />
              </View>
              <Text style={styles.accordionTitle}>Data Security & Storage</Text>
            </View>
            {expandedSections.security ? (
              <ChevronUp size={20} color="#94A3B8" />
            ) : (
              <ChevronDown size={20} color="#94A3B8" />
            )}
          </TouchableOpacity>

          {expandedSections.security && (
            <View style={styles.accordionBody}>
              <View style={styles.bodyBlock}>
                <Text style={styles.bodyHeading}>End-to-End Encryption</Text>
                <Text style={styles.bodyText}>
                  All sensitive medical reports and symptom logs are encrypted both in transit (TLS
                  1.3) and at rest (AES-256).
                </Text>
              </View>

              <View style={styles.bodyBlock}>
                <Text style={styles.bodyHeading}>Zero Data Selling</Text>
                <Text style={styles.bodyText}>
                  We will never sell or monetize your private medical or personal information to
                  third-party advertisers or external brokers.
                </Text>
              </View>
            </View>
          )}
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
  introCard: {
    backgroundColor: '#F8F5FF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 16,
  },
  introIconRow: {
    marginBottom: 8,
  },
  introText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#475569',
  },
  boldText: {
    fontWeight: '800',
    color: '#1E293B',
  },
  accordionCardLavender: {
    backgroundColor: '#FAF9FE',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    marginBottom: 14,
    overflow: 'hidden',
  },
  accordionCardBlue: {
    backgroundColor: '#F0F7FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    marginBottom: 14,
    overflow: 'hidden',
  },
  accordionCardGreen: {
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 14,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  accordionBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 4,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bodyBlock: {
    marginTop: 14,
  },
  bodyHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
});
