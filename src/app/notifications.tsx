import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCheck,
  RotateCcw,
  Droplet,
  Heart,
  Calendar,
  Apple,
  Sparkles,
  ChevronRight,
  Trash2,
} from 'lucide-react-native';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Health' | 'Baby' | 'Doctor' | 'Diet' | 'Tips';
  iconType: 'droplet' | 'baby' | 'calendar' | 'diet' | 'tip';
  iconBg: string;
  iconColor: string;
  unread: boolean;
  route?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Time to Hydrate! 💧',
    message: 'Drink a fresh glass of water. Good hydration aids amniotic fluid levels and reduces fatigue.',
    time: '10m ago',
    category: 'Health',
    iconType: 'droplet',
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
    unread: true,
    route: '/hydration-tracker',
  },
  {
    id: '2',
    title: 'Track Baby’s Afternoon Kicks 👶',
    message: 'Notice any flutter or kicks? Rest on your left side and log 10 gentle movements.',
    time: '45m ago',
    category: 'Baby',
    iconType: 'baby',
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
    unread: true,
    route: '/kick-counter',
  },
  {
    id: '3',
    title: 'Upcoming Prenatal Visit 🩺',
    message: 'Routine 24-week scan & checkup with Dr. Sarah Sharma tomorrow at 10:30 AM.',
    time: '2h ago',
    category: 'Doctor',
    iconType: 'calendar',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    unread: true,
    route: '/new-appointment',
  },
  {
    id: '4',
    title: 'Recommended Snack: Iron & Folate 🥗',
    message: 'A handful of roasted walnuts and dried figs are ideal for sustained maternal energy.',
    time: '5h ago',
    category: 'Diet',
    iconType: 'diet',
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
    unread: false,
    route: '/pregnancy-diet',
  },
  {
    id: '5',
    title: 'Daily Wisdom: Pelvic Floor Ease 🌸',
    message: 'Try 5 minutes of gentle diaphragmatic breathing tonight to relieve pelvis tension.',
    time: 'Yesterday',
    category: 'Tips',
    iconType: 'tip',
    iconBg: '#FFF1F2',
    iconColor: '#EE4D38',
    unread: false,
    route: '/today-tips',
  },
];

/**
 * Pixel-perfect Sleeping Bell Illustration matching screenshot
 */
function SleepingBellIllustration({ size = 130 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Top Handle Loop */}
      <Path
        d="M52 28 C52 16, 68 16, 68 28"
        stroke="#B87383"
        strokeWidth={4.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* Bell Clapper hanging underneath */}
      <Circle cx="60" cy="85" r="7.5" fill="#B87383" />

      {/* Bell Body */}
      <Path
        d="M33 78 C35 62, 42 50, 44 36 C45 28, 52 24, 60 24 C68 24, 75 28, 76 36 C78 50, 85 62, 87 78 Z"
        fill="#FCEDF0"
        stroke="#B87383"
        strokeWidth={4.5}
        strokeLinejoin="round"
      />

      {/* Bottom Rim Bar with rounded pill ends */}
      <Path
        d="M27 78 C27 75, 30 73, 34 73 L86 73 C90 73, 93 75, 93 78 C93 81.5, 90 83.5, 86 83.5 L34 83.5 C30 83.5, 27 81.5, 27 78 Z"
        fill="#B87383"
      />

      {/* Left Sleeping Eye (Curved happy/asleep arch) */}
      <Path
        d="M48 54 Q52 49 56 54"
        stroke="#B87383"
        strokeWidth={3.2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Right Sleeping Eye (Curved happy/asleep arch) */}
      <Path
        d="M64 54 Q68 49 72 54"
        stroke="#B87383"
        strokeWidth={3.2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Gentle Smiling Mouth */}
      <Path
        d="M57 63 Q60 66.5 63 63"
        stroke="#B87383"
        strokeWidth={2.8}
        strokeLinecap="round"
        fill="none"
      />

      {/* Sleeping "z Z z" Snore Indicators Floating Top Right */}
      {/* Lower small z */}
      <Path
        d="M87 40 H93 L87 47 H93"
        stroke="#B87383"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Middle larger Z */}
      <Path
        d="M93 28 H102 L93 37 H102"
        stroke="#B87383"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Top small z */}
      <Path
        d="M102 18 H107.5 L102 24 H107.5"
        stroke="#B87383"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * Background subtle geometric shapes matching the screenshot
 */
function SubtleBackgroundElements() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {/* Center-bottom soft triangular accent */}
        <Polygon
          points={`${width * 0.52},${height * 0.74} ${width * 0.57},${height * 0.76} ${width * 0.52},${height * 0.78}`}
          fill="#FFFFFF"
          opacity={0.85}
        />
        {/* Bottom-left triangular accents */}
        <Polygon
          points={`${width * 0.35},${height * 0.83} ${width * 0.38},${height * 0.84} ${width * 0.35},${height * 0.855}`}
          fill="#FFFFFF"
          opacity={0.9}
        />
        <Polygon
          points={`${width * 0.27},${height * 0.85} ${width * 0.31},${height * 0.865} ${width * 0.27},${height * 0.88}`}
          fill="#FFFFFF"
          opacity={0.8}
        />
      </Svg>
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Subtle breathing float animation for empty state bell
  const bellAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bellAnim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
        Animated.timing(bellAnim, {
          toValue: 0,
          duration: 2400,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bellAnim]);

  const translateY = bellAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const topPadding = Math.max(insets.top, 20);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const restoreDummy = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const handleNotificationPress = (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );

    // Navigate to related screen if provided
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const removeSingleNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredNotifications =
    activeFilter === 'unread'
      ? notifications.filter((n) => n.unread)
      : notifications;

  const renderIcon = (type: NotificationItem['iconType'], color: string) => {
    switch (type) {
      case 'droplet':
        return <Droplet size={19} color={color} strokeWidth={2.2} />;
      case 'baby':
        return <Heart size={19} color={color} strokeWidth={2.2} />;
      case 'calendar':
        return <Calendar size={19} color={color} strokeWidth={2.2} />;
      case 'diet':
        return <Apple size={19} color={color} strokeWidth={2.2} />;
      case 'tip':
      default:
        return <Sparkles size={19} color={color} strokeWidth={2.2} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* Subtle Background Elements */}
      <SubtleBackgroundElements />

      {/* Header Bar matching Screenshot */}
      <View style={[styles.headerBar, { paddingTop: topPadding + 10 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        {/* Right Header Action Icons */}
        <View style={styles.headerActions}>
          {notifications.length > 0 ? (
            <>
              {unreadCount > 0 && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={markAllAsRead}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.actionIconBtn}
                  accessibilityLabel="Mark all as read"
                >
                  <CheckCheck size={20} color="#64748B" strokeWidth={2.1} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={clearAll}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.actionIconBtn}
                accessibilityLabel="Clear all notifications"
              >
                <Trash2 size={18} color="#94A3B8" strokeWidth={2.1} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={restoreDummy}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.actionIconBtn}
              accessibilityLabel="Reload dummy notifications"
            >
              <RotateCcw size={19} color="#EE4D38" strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs when notifications are present */}
      {notifications.length > 0 && (
        <View style={styles.filterBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveFilter('all')}
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'all' && styles.filterTextActive,
              ]}
            >
              All ({notifications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveFilter('unread')}
            style={[styles.filterChip, activeFilter === 'unread' && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'unread' && styles.filterTextActive,
              ]}
            >
              Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content Area */}
      {filteredNotifications.length > 0 ? (
        <ScrollView
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom, 24) + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#EE4D38"
              colors={['#EE4D38']}
            />
          }
        >
          {filteredNotifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.88}
              onPress={() => handleNotificationPress(item)}
              style={[
                styles.notificationCard,
                item.unread && styles.notificationCardUnread,
              ]}
            >
              {/* Left Category Icon */}
              <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
                {renderIcon(item.iconType, item.iconColor)}
              </View>

              {/* Main Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                  <Text
                    style={[
                      styles.cardTitle,
                      item.unread && styles.cardTitleUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.cardMessage} numberOfLines={2}>
                  {item.message}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>

              {/* Action Chevron or Dismiss */}
              <View style={styles.chevronWrapper}>
                <ChevronRight size={18} color="#CBD5E1" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        /* Empty State with Pixel-Perfect Sleeping Bell Illustration */
        <ScrollView
          contentContainerStyle={styles.emptyScrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#EE4D38"
              colors={['#EE4D38']}
            />
          }
        >
          <View style={styles.emptyContainer}>
            {/* Sleeping Bell Graphic with breathing motion */}
            <Animated.View style={[styles.illustrationWrapper, { transform: [{ translateY }] }]}>
              <SleepingBellIllustration size={135} />
            </Animated.View>

            {/* Heading */}
            <Text style={styles.emptyTitle}>No Notifications Yet</Text>

            {/* Subtitle */}
            <Text style={styles.emptySubtitle}>
              You're all caught up!{'\n'}We'll notify you when something arrives.
            </Text>

            {/* Quick Button to reload dummy notifications */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={restoreDummy}
              style={styles.restoreButton}
            >
              <RotateCcw size={15} color="#EE4D38" style={{ marginRight: 6 }} />
              <Text style={styles.restoreButtonText}>Load Sample Notifications</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18.5,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  headerActions: {
    width: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionIconBtn: {
    padding: 6,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#1E293B',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1.5,
  },
  notificationCardUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FED7D2',
    borderLeftWidth: 3.5,
    borderLeftColor: '#EE4D38',
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: -0.1,
    flex: 1,
    marginRight: 6,
  },
  cardTitleUnread: {
    fontWeight: '700',
    color: '#0F172A',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EE4D38',
  },
  cardMessage: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  timeText: {
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
  },
  chevronWrapper: {
    paddingLeft: 6,
    paddingTop: 10,
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  illustrationWrapper: {
    marginBottom: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14.5,
    fontWeight: '400',
    color: '#8C9BAE',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  restoreButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EE4D38',
  },
});
