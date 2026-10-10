import React from 'react';
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
  AlertOctagon,
  Heart,
  Shield,
  MessageSquare,
  Ban,
  AlertTriangle,
  Lock,
  Users,
  Sparkles,
} from 'lucide-react-native';

interface GuidelineRule {
  id: string;
  ruleNumber: number;
  title: string;
  description: string;
  bullets: string[];
  icon: any;
  iconColor: string;
  bgColor: string;
  borderColor: string;
}

export default function CommunityGuidelinesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rules: GuidelineRule[] = [
    {
      id: 'rule_1',
      ruleNumber: 1,
      title: 'Be supportive and helpful',
      description:
        "Help us make this community your best friend during pregnancy and parenting days — the friend whom you can count on during your unique post/post pregnancy journey. Our users are from all walks of life and there's a lot you can offer to each other. Let's help each other, let's be supportive just as a family would do. Together, let's make the Community better and stronger. And for this, we all must remember the following:",
      bullets: [
        'Be polite and frank',
        'Be constructive in your criticism',
        'Share information and resources generously',
      ],
      icon: Heart,
      iconColor: '#EC4899',
      bgColor: '#FDF2F8',
      borderColor: '#FCE7F3',
    },
    {
      id: 'rule_2',
      ruleNumber: 2,
      title: 'Protect privacy & personal information',
      description:
        'We respect and value the privacy of every member. Please do not share personal details — including phone numbers, home addresses, or private photographs — of yourself or others without explicit consent.',
      bullets: [
        'Never share another user’s personal data',
        'Avoid posting identifiable photos of babies without parental consent',
        'Report suspicious messages or requests immediately',
      ],
      icon: Shield,
      iconColor: '#3B82F6',
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
    },
    {
      id: 'rule_3',
      ruleNumber: 3,
      title: 'Keep it relevant & on-topic',
      description:
        "Share content related to pregnancy, parenting, motherhood, and related health topics. We encourage discussions that are meaningful, informative, and supportive of our community's core purpose.",
      bullets: [
        'Stick to pregnancy & parenting topics',
        'No promotional or spam content',
        'Commercial posts require admin approval',
      ],
      icon: MessageSquare,
      iconColor: '#22C55E',
      bgColor: '#F0FDF4',
      borderColor: '#DCFCE7',
    },
    {
      id: 'rule_4',
      ruleNumber: 4,
      title: 'Zero tolerance for hate & abuse',
      description:
        'This is a safe space for all mothers, expecting mothers, and parents. Hateful, abusive, discriminatory, or threatening language of any kind is strictly prohibited and will result in immediate removal from the community.',
      bullets: [
        'No hate speech or discrimination',
        'No bullying or harassment of any member',
        'No content promoting harm or self-harm',
        'No religious, caste-based or racial slurs',
      ],
      icon: Ban,
      iconColor: '#F97316',
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
    },
    {
      id: 'rule_5',
      ruleNumber: 5,
      title: 'Do not spread misinformation',
      description:
        'Health misinformation can be dangerous, especially during pregnancy. Please ensure any medical advice you share is verified and sourced from credible healthcare professionals or government bodies.',
      bullets: [
        'Always cite your sources when sharing medical info',
        'Don’t diagnose or prescribe — suggest seeing a doctor',
        'Report unverified health claims immediately',
      ],
      icon: AlertTriangle,
      iconColor: '#EAB308',
      bgColor: '#FFFBEB',
      borderColor: '#FEF3C7',
    },
    {
      id: 'rule_6',
      ruleNumber: 6,
      title: 'No gender prediction or determination',
      description:
        'We strictly adhere to the guidelines of the Government of India regarding gender determination of an unborn child. This community DOES NOT support gender prediction in any way, shape, or form.',
      bullets: [
        'No posts hinting at or predicting baby’s gender',
        'No sharing of methods for gender selection',
        'Report any such content immediately',
      ],
      icon: Lock,
      iconColor: '#A855F7',
      bgColor: '#FAF5FF',
      borderColor: '#F3E8FF',
    },
    {
      id: 'rule_7',
      ruleNumber: 7,
      title: 'Respect moderator decisions',
      description:
        'Our team of community moderators work hard to keep this a safe, supportive and positive space. Please respect their decisions. If you believe a moderator decision was in error, you may appeal respectfully via the Help section.',
      bullets: [
        'Accept post remove decisions gracefully',
        'Do not attempt to bypass community rules',
        'Reach out to support for genuine appeals',
      ],
      icon: Users,
      iconColor: '#14B8A6',
      bgColor: '#F0FDFA',
      borderColor: '#CCFBF1',
    },
  ];

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
        <Text style={styles.headerTitle}>Community Guidelines</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Government Disclaimer Banner */}
        <View style={styles.disclaimerCard}>
          <AlertOctagon size={18} color="#EF4444" style={{ marginBottom: 6 }} />
          <Text style={styles.disclaimerText}>
            We at this community would like to clarify that we stand strongly and firmly with the
            guidelines of the <Text style={styles.boldText}>Government of India</Text> regarding
            the gender determination of an unborn child. This community{' '}
            <Text style={styles.boldText}>DOES NOT SUPPORT</Text> gender prediction in any way.
          </Text>
        </View>

        {/* Intro text */}
        <Text style={styles.introParagraph}>
          In this community, you can share the joy and worries of pregnancy and motherhood, vent out
          freely and even gossip a bit! Better still, you can empower each other and make this an
          awesome community. And for all this to happen, there are certain rules that you need to
          follow:
        </Text>

        {/* 7 Rule Cards */}
        {rules.map((rule) => {
          const IconComp = rule.icon;
          return (
            <View
              key={rule.id}
              style={[
                styles.ruleCard,
                { backgroundColor: rule.bgColor, borderColor: rule.borderColor },
              ]}
            >
              <View style={styles.ruleHeaderRow}>
                <View style={styles.ruleIconContainer}>
                  <IconComp size={18} color={rule.iconColor} strokeWidth={2.2} />
                </View>
                <Text style={styles.ruleTitle}>
                  Rule {rule.ruleNumber}. {rule.title}
                </Text>
              </View>

              <Text style={styles.ruleDesc}>{rule.description}</Text>

              <View style={styles.bulletList}>
                {rule.bullets.map((b, bIdx) => (
                  <View key={bIdx} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: rule.iconColor }]} />
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* Closing Note Card */}
        <View style={styles.closingCard}>
          <Sparkles size={16} color="#F59E0B" style={{ marginBottom: 6 }} />
          <Text style={styles.closingText}>
            These guidelines exist to ensure a{' '}
            <Text style={styles.boldText}>safe, supportive, and empowering</Text> space for every
            mama. Violations may result in warnings, temporary suspension, or permanent removal
            from the community. Thank you for being a wonderful part of this journey. 🌸
          </Text>
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
  disclaimerCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#334155',
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  introParagraph: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
    marginBottom: 16,
  },
  ruleCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  ruleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleIconContainer: {
    marginRight: 10,
  },
  ruleTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
  },
  ruleDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
  },
  bulletList: {
    gap: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  closingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 6,
    marginBottom: 12,
  },
  closingText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475569',
  },
});
