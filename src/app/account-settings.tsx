import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [keepActivityPrivate, setKeepActivityPrivate] = useState(false);
  const [makePurchasesPublic, setMakePurchasesPublic] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleLanguageChange = () => {
    Alert.alert(
      'Change Language',
      'Select your preferred app language:',
      [
        { text: 'English', onPress: () => setLanguage('English') },
        { text: 'हिंदी (Hindi)', onPress: () => setLanguage('Hindi') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNotificationChange = () => {
    Alert.alert(
      'Notification Settings',
      'Notification preferences updated.',
      [{ text: 'OK' }]
    );
  };

  const handleMobileChange = () => {
    Alert.alert(
      'Change Mobile Number',
      'A verification code will be sent to verify your new mobile number.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => Alert.alert('Notice', 'SMS verification initiated.') },
      ]
    );
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Section 1: PROFILE */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>PROFILE</Text>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.rowTitle}>Keep my activity private</Text>
              <Text style={styles.rowSubtitle}>
                Your feed will only be shown to people you follow back
              </Text>
            </View>
            <Switch
              value={keepActivityPrivate}
              onValueChange={setKeepActivityPrivate}
              trackColor={{ false: '#E2E8F0', true: '#FCA5A5' }}
              thumbColor={keepActivityPrivate ? '#EE4D38' : '#F8FAFC'}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section 2: STORE */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>STORE</Text>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.rowTitle}>Make my purchases public</Text>
              <Text style={styles.rowSubtitle}>
                Your purchases will be visible to people in your profile
              </Text>
            </View>
            <Switch
              value={makePurchasesPublic}
              onValueChange={setMakePurchasesPublic}
              trackColor={{ false: '#E2E8F0', true: '#FCA5A5' }}
              thumbColor={makePurchasesPublic ? '#EE4D38' : '#F8FAFC'}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section 3: NOTIFICATION SETTINGS */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>NOTIFICATION SETTINGS</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Change Notification Settings</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={handleNotificationChange}>
              <Text style={styles.actionLinkText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section 4: LANGUAGE */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>LANGUAGE</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>You are currently using Mamatvam in {language}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={handleLanguageChange}>
              <Text style={styles.actionLinkText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section 5: Logged in with Mobile */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeader}>Logged in with Mobile</Text>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.rowTitle}>Logged in with Mobile</Text>
              <Text style={styles.rowSubtitle}>+917634045123</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleMobileChange}>
              <Text style={styles.actionLinkText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footerBlock}>
          <Text style={styles.versionText}>Version: 1.07.41</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/privacy')}>
            <Text style={styles.policyLink}>Terms of Use & Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionBlock: {
    paddingVertical: 10,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  rowSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 3,
    lineHeight: 18,
  },
  actionLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  footerBlock: {
    marginTop: 28,
    paddingTop: 10,
  },
  versionText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  policyLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
});
