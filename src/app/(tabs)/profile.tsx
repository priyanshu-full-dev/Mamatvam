import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Banknote,
  Bookmark,
  ChevronRight,
  CircleQuestionMark,
  Crown,
  LogOut,
  MessageCircleQuestionMark,
  Shield,
  TicketPercent,
  User,
  Users,
} from 'lucide-react-native';
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const GAP = 12;
const FULL_CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const HALF_CARD_WIDTH = (FULL_CARD_WIDTH - GAP) / 2;

// Custom concentric ripple icon matching "Symptoms Tracker" in design
function SymptomsTrackerIcon({ size = 20, color = '#EE4D38' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="2.5" fill={color} />
      <Path
        d="M15.5 8.5C17.433 10.433 17.433 13.567 15.5 15.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M8.5 15.5C6.567 13.567 6.567 10.433 8.5 8.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M18.5 5.5C22.0899 9.08985 22.0899 14.9101 18.5 18.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M5.5 18.5C1.91015 14.9101 1.91015 9.08985 5.5 5.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out of your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  const handleNavigation = (destination?: string, label?: string) => {
    if (destination) {
      router.push(destination as any);
    } else {
      Alert.alert(label || 'Notice', `${label || 'This section'} will be available soon.`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={38} color="#71717A" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Saved Items'}
            </Text>
            <Text style={styles.pregnancyStage} numberOfLines={1}>
              40 Weeks & 0 Day Pregnant
            </Text>
            <Text style={styles.memberSince} numberOfLines={1}>
              Member since December 2025
            </Text>
          </View>
        </View>

        {/* Section 1: Navigation */}
        <Text style={styles.sectionHeader}>Navigation</Text>

        {/* Full-width "My Coupons" Card */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => handleNavigation(undefined, 'My Coupons')}
          style={styles.fullCard}
        >
          <View style={styles.rowLeft}>
            <TicketPercent size={22} color="#EE4D38" />
            <Text style={styles.cardTitle}>My Coupons</Text>
          </View>
          <ChevronRight size={18} color="#1E1E1E" strokeWidth={2} />
        </TouchableOpacity>

        {/* Two-column Row: Subscription & Cash */}
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleNavigation('/(tabs)/subscription', 'My Subscription')}
            style={styles.halfCard}
          >
            <View style={styles.halfCardLeft}>
              <Crown size={20} color="#EE4D38" />
              <Text style={styles.halfCardTitle} numberOfLines={1}>
                My Subscription
              </Text>
            </View>
            <ChevronRight size={16} color="#1E1E1E" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleNavigation(undefined, 'Cash: 0')}
            style={styles.halfCard}
          >
            <View style={styles.halfCardLeft}>
              <Banknote size={20} color="#EE4D38" />
              <Text style={styles.halfCardTitle} numberOfLines={1}>
                Cash: 0
              </Text>
            </View>
            <ChevronRight size={16} color="#1E1E1E" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Section 2: Community */}
        <Text style={styles.sectionHeader}>Community</Text>

        {/* Community 2x2 Grid - Row 1 */}
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleNavigation(undefined, 'Symptoms Tracker')}
            style={styles.halfCard}
          >
            <View style={styles.halfCardLeft}>
              <SymptomsTrackerIcon size={20} color="#EE4D38" />
              <Text style={styles.halfCardTitle} numberOfLines={1}>
                Symptoms Tracker
              </Text>
            </View>
            <ChevronRight size={16} color="#1E1E1E" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleNavigation(undefined, 'My Saved Items')}
            style={styles.halfCard}
          >
            <View style={styles.halfCardLeft}>
              <Bookmark size={20} color="#EE4D38" />
              <Text style={styles.halfCardTitle} numberOfLines={1}>
                My Saved Items
              </Text>
            </View>
            <ChevronRight size={16} color="#1E1E1E" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Community 2x2 Grid - Row 2 */}
        <View style={[styles.row, { marginTop: GAP }]}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleNavigation('/(tabs)/community', 'Community Guidelines')}
            style={styles.halfCard}
          >
            <View style={styles.halfCardLeft}>
              <Users size={20} color="#EE4D38" />
              <Text style={styles.halfCardMultiLineTitle} numberOfLines={2}>
                Community{'\n'}Guidelines
              </Text>
            </View>
            <ChevronRight size={16} color="#1E1E1E" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleNavigation('/(tabs)/community', 'Unanswered Questions')}
            style={styles.halfCard}
          >
            <View style={styles.halfCardLeft}>
              <MessageCircleQuestionMark size={20} color="#EE4D38" />
              <Text style={styles.halfCardMultiLineTitle} numberOfLines={2}>
                Unanswered{'\n'}Questions
              </Text>
            </View>
            <ChevronRight size={16} color="#1E1E1E" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Section 3: More */}
        <Text style={styles.sectionHeader}>More</Text>

        {/* Account Settings */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => handleNavigation(undefined, 'Account Settings')}
          style={styles.moreCard}
        >
          <View style={styles.moreCardLeft}>
            <User size={22} color="#EE4D38" />
            <View style={styles.moreTextCol}>
              <Text style={styles.moreTitle}>Account Settings</Text>
              <Text style={styles.moreSubtitle}>Manage your account details</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        {/* Privacy */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => handleNavigation(undefined, 'Privacy')}
          style={styles.moreCard}
        >
          <View style={styles.moreCardLeft}>
            <Shield size={22} color="#EE4D38" />
            <View style={styles.moreTextCol}>
              <Text style={styles.moreTitle}>Privacy</Text>
              <Text style={styles.moreSubtitle}>Review privacy settings</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => handleNavigation(undefined, 'Help & Support')}
          style={styles.moreCard}
        >
          <View style={styles.moreCardLeft}>
            <CircleQuestionMark size={22} color="#EE4D38" />
            <View style={styles.moreTextCol}>
              <Text style={styles.moreTitle}>Help & Support</Text>
              <Text style={styles.moreSubtitle}>Get assistance</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleLogout}
          style={styles.moreCard}
        >
          <View style={styles.moreCardLeft}>
            <LogOut size={22} color="#EE4D38" />
            <View style={styles.moreTextCol}>
              <Text style={styles.moreTitle}>Log out</Text>
              <Text style={styles.moreSubtitle}>Your session will be ended</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#9CA3AF" strokeWidth={1.8} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 14,
    paddingBottom: 40,
  },
  profileCard: {
    width: FULL_CARD_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 4,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#1E1E1E',
    letterSpacing: -0.2,
  },
  pregnancyStage: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#374151',
    marginTop: 3,
  },
  memberSince: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    marginTop: 3,
  },
  sectionHeader: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E1E1E',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: -0.1,
  },
  fullCard: {
    width: FULL_CARD_WIDTH,
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E1E1E',
    marginLeft: 12,
  },
  row: {
    width: FULL_CARD_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: HALF_CARD_WIDTH,
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  halfCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 4,
  },
  halfCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E1E1E',
    marginLeft: 8,
    flexShrink: 1,
  },
  halfCardMultiLineTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E1E1E',
    marginLeft: 8,
    lineHeight: 15,
    flexShrink: 1,
  },
  moreCard: {
    width: FULL_CARD_WIDTH,
    minHeight: 66,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  moreCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  moreTextCol: {
    flex: 1,
    marginLeft: 14,
  },
  moreTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  moreSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    marginTop: 2,
  },
});


