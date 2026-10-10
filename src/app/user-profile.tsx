import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';

interface ProfileDetailItem {
  id: string;
  label: string;
  value: string;
  rightText?: string;
}

export default function UserProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const profileDetails: ProfileDetailItem[] = [
    {
      id: 'uuid',
      label: 'UUID',
      value: 'U91967',
    },
    {
      id: 'account_type',
      label: 'Account Type',
      value: 'Conceive',
      rightText: 'English',
    },
    {
      id: 'date_of_conceive',
      label: 'Date of Conceive',
      value: '01 Jan 2026',
    },
    {
      id: 'location',
      label: 'Location',
      value: 'Language',
    },
    {
      id: 'dob',
      label: 'Date of Birth',
      value: '9 Jan 2026',
    },
    {
      id: 'dom',
      label: 'Date of Marriage',
      value: '19 Jan 2026',
    },
    {
      id: 'joined_on',
      label: 'Joined On',
      value: '25 Jan 2026',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar */}
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
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Top User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <User size={34} color="#64748B" strokeWidth={2} />
          </View>
          <View style={styles.userInfoCol}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Shubham Singh'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              shubhamsinha3396@gmail.com
            </Text>
            <Text style={styles.userId} numberOfLines={1}>
              ID:7634045123
            </Text>
          </View>
        </View>

        {/* List of Detail Cards matching exact screenshot */}
        {profileDetails.map((item) => (
          <View key={item.id} style={styles.detailCard}>
            <View style={styles.iconContainer}>
              <Globe size={19} color="#EE4D38" strokeWidth={1.8} />
            </View>

            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>

            {item.rightText && (
              <Text style={styles.detailRightText}>{item.rightText}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoCol: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 3,
  },
  userId: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 3,
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1.5,
  },
  iconContainer: {
    width: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 3,
  },
  detailRightText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#64748B',
  },
});
