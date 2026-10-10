import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Activity,
  Apple,
  Heart,
  UploadCloud,
  CalendarClock,
  Moon,
  Baby,
  Shield,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Milk,
  Droplets,
  TrendingUp,
  FlaskConical,
} from 'lucide-react-native';
import { PregnancyStage } from '@/store/useAppStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3;

interface ToolItem {
  id: string;
  title: string;
  route: string;
  iconType: 'custom_image' | 'lucide';
  customImage?: any;
  lucideIcon?: any;
  bgColor: string;
  iconColor?: string;
  borderColor?: string;
}

export interface HomeHelpfulToolsProps {
  stage?: PregnancyStage | null;
}

export function HomeHelpfulTools({ stage = 'pregnant' }: HomeHelpfulToolsProps) {
  const router = useRouter();
  const currentStage: PregnancyStage = stage || 'pregnant';

  const getToolsForStage = (): ToolItem[] => {
    switch (currentStage) {
      case 'mother':
        return [
          {
            id: 'm1',
            title: 'Vaccination\nSchedule',
            route: '/vaccination-schedule',
            iconType: 'lucide',
            lucideIcon: Shield,
            bgColor: '#E0F7FA',
            iconColor: '#00B4D8',
            borderColor: '#BAE6FD',
          },
          {
            id: 'm2',
            title: 'Diet Chart',
            route: '/pregnancy-diet',
            iconType: 'lucide',
            lucideIcon: Apple,
            bgColor: '#0284C7',
            iconColor: '#FFFFFF',
          },
          {
            id: 'm3',
            title: 'Dadi Nani ke\nNuskhe',
            route: '/dadi-nani-nuskhe',
            iconType: 'custom_image',
            customImage: require('@/assets/images/home/herbal_bowl.jpg'),
            bgColor: '#FFFFFF',
          },
          {
            id: 'm4',
            title: 'Baby Names',
            route: '/baby-names',
            iconType: 'lucide',
            lucideIcon: Baby,
            bgColor: '#FCE7F3',
            iconColor: '#F6349A',
            borderColor: '#FBCFE8',
          },
          {
            id: 'm5',
            title: 'Tips to Grow\nBaby',
            route: '/today-tips',
            iconType: 'lucide',
            lucideIcon: TrendingUp,
            bgColor: '#EEF2FF',
            iconColor: '#4F46E5',
            borderColor: '#C7D2FE',
          },
          {
            id: 'm6',
            title: 'Water\nTracker',
            route: '/hydration-tracker',
            iconType: 'lucide',
            lucideIcon: Droplets,
            bgColor: '#E0F2FE',
            iconColor: '#0284C7',
            borderColor: '#BAE6FD',
          },
        ];

      case 'conceive':
      case 'explore':
        return [
          {
            id: 'c1',
            title: 'Types of\nTests',
            route: '/types-of-tests',
            iconType: 'lucide',
            lucideIcon: FlaskConical,
            bgColor: '#F0F9FF',
            iconColor: '#0284C7',
            borderColor: '#BAE6FD',
          },
          {
            id: 'c2',
            title: 'Diet Chart',
            route: '/pregnancy-diet',
            iconType: 'lucide',
            lucideIcon: Apple,
            bgColor: '#0284C7',
            iconColor: '#FFFFFF',
          },
          {
            id: 'c3',
            title: 'Dadi Nani ke\nNuskhe',
            route: '/dadi-nani-nuskhe',
            iconType: 'custom_image',
            customImage: require('@/assets/images/home/herbal_bowl.jpg'),
            bgColor: '#FFFFFF',
          },
          {
            id: 'c4',
            title: 'Sex Sutra',
            route: '/sex-sutra',
            iconType: 'lucide',
            lucideIcon: Heart,
            bgColor: '#FDF2F8',
            iconColor: '#DB2777',
            borderColor: '#FBCFE8',
          },
          {
            id: 'c5',
            title: 'Upload\nReports',
            route: '/upload-report',
            iconType: 'lucide',
            lucideIcon: UploadCloud,
            bgColor: '#EFF6FF',
            iconColor: '#0369A1',
            borderColor: '#BFDBFE',
          },
          {
            id: 'c6',
            title: 'Next\nAppointment',
            route: '/new-appointment',
            iconType: 'lucide',
            lucideIcon: CalendarClock,
            bgColor: '#FFF1F2',
            iconColor: '#EE4D38',
            borderColor: '#FECDD3',
          },
        ];

      case 'pregnant':
      default:
        return [
          {
            id: 'p1',
            title: 'Record Your\nSymptoms',
            route: '/record-symptoms',
            iconType: 'lucide',
            lucideIcon: Activity,
            bgColor: '#EFF6FF',
            iconColor: '#1D4ED8',
            borderColor: '#3B82F6',
          },
          {
            id: 'p2',
            title: 'Pregnancy Diet\nChart',
            route: '/pregnancy-diet',
            iconType: 'lucide',
            lucideIcon: Apple,
            bgColor: '#0284C7',
            iconColor: '#FFFFFF',
          },
          {
            id: 'p3',
            title: 'Dadi Nani ke\nNuskhe',
            route: '/dadi-nani-nuskhe',
            iconType: 'custom_image',
            customImage: require('@/assets/images/home/herbal_bowl.jpg'),
            bgColor: '#FFFFFF',
          },
          {
            id: 'p4',
            title: 'Sex Sutra',
            route: '/sex-sutra',
            iconType: 'lucide',
            lucideIcon: Heart,
            bgColor: '#DB2777',
            iconColor: '#FFFFFF',
          },
          {
            id: 'p5',
            title: 'Upload reports',
            route: '/upload-report',
            iconType: 'lucide',
            lucideIcon: UploadCloud,
            bgColor: '#BAE6FD',
            iconColor: '#0369A1',
          },
          {
            id: 'p6',
            title: 'Doctor\nAppointment',
            route: '/new-appointment',
            iconType: 'lucide',
            lucideIcon: CalendarClock,
            bgColor: '#E2E8F0',
            iconColor: '#475569',
          },
        ];
    }
  };

  const tools = getToolsForStage();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Helpful Tools</Text>
        <Pressable onPress={() => router.push('/practical-tools')}>
          <Text style={styles.seeMoreText}>See more</Text>
        </Pressable>
      </View>

      {/* 3x2 Grid */}
      <View style={styles.gridRow}>
        {tools.map((tool) => {
          const IconComp = tool.lucideIcon;
          return (
            <Pressable
              key={tool.id}
              onPress={() => router.push(tool.route as any)}
              style={styles.card}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: tool.bgColor },
                  tool.borderColor ? { borderWidth: 1.5, borderColor: tool.borderColor } : null,
                ]}
              >
                {tool.iconType === 'custom_image' ? (
                  <Image
                    source={tool.customImage}
                    style={styles.customImage}
                    contentFit="contain"
                  />
                ) : (
                  <IconComp
                    size={22}
                    color={tool.iconColor || '#FFFFFF'}
                    fill={tool.iconType === 'lucide' && tool.id === 'p4' ? '#FFFFFF' : 'none'}
                  />
                )}
              </View>

              <Text style={styles.cardTitle}>{tool.title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  seeMoreText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    minHeight: 110,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  cardTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 14,
  },
});
