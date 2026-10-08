import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useSendOtpMutation } from '@/api/auth.api';

export interface PincodeLocation {
  name: string;
  district: string;
  state: string;
  pincode: string;
}

const FALLBACK_PINCODES: Record<string, PincodeLocation[]> = {
  '829301': [
    { name: 'Arajoo', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
    { name: 'Bahadurpur', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
    { name: 'Bandhdih', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
    { name: 'Baroo', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
    { name: 'Chando', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
    { name: 'Chilgada', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
    { name: 'Gangjori', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
    { name: 'Jaina', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
    { name: 'Pathuria', district: 'Bokaro', state: 'Jharkhand', pincode: '829301' },
  ],
  '826001': [
    { name: 'Dhanbad Hirapur', district: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
    { name: 'D.S.E.', district: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
    { name: 'Manaitand', district: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
    { name: 'Dhanbad', district: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
    { name: 'Dhanbad Bazar', district: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
    { name: 'Cmpf', district: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
    { name: 'Cmrs', district: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
    { name: 'Naya Bazar Wasseypur', district: 'Dhanbad', state: 'Jharkhand', pincode: '826001' },
  ],
  '110001': [
    { name: 'Connaught Place', district: 'Central Delhi', state: 'Delhi', pincode: '110001' },
    { name: 'Barakhamba Road', district: 'Central Delhi', state: 'Delhi', pincode: '110001' },
    { name: 'Janpath', district: 'Central Delhi', state: 'Delhi', pincode: '110001' },
  ],
  '400001': [
    { name: 'Fort', district: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    { name: 'Colaba', district: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    { name: 'Marine Lines', district: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  ],
  '560001': [
    { name: 'MG Road', district: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    { name: 'Shivajinagar', district: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    { name: 'Brigade Road', district: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
  ],
};

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { phone, setPhone, setLocation } = useAuthStore();

  const [inputPhone, setInputPhone] = useState(phone || '');
  const [pincode, setPincode] = useState('');
  const [locations, setLocations] = useState<PincodeLocation[]>([]);
  const [selectedArea, setSelectedArea] = useState<PincodeLocation | null>(null);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const sendOtpMutation = useSendOtpMutation();

  const isPhoneValid = inputPhone.trim().length >= 10;
  const isFormValid = isPhoneValid && !!selectedArea;

  const handlePincodeChange = async (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPincode(cleanText);
    setPincodeError('');

    if (cleanText.length === 6) {
      Keyboard.dismiss();
      if (FALLBACK_PINCODES[cleanText]) {
        setLocations(FALLBACK_PINCODES[cleanText]);
        setSelectedArea(FALLBACK_PINCODES[cleanText][0]);
      }

      setIsLoadingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanText}`);
        const data = await res.json();
        if (
          Array.isArray(data) &&
          data[0]?.Status === 'Success' &&
          Array.isArray(data[0]?.PostOffice)
        ) {
          const parsed: PincodeLocation[] = data[0].PostOffice.map((po: any) => ({
            name: po.Name,
            district: po.District,
            state: po.State,
            pincode: po.Pincode,
          }));
          setLocations(parsed);
          setSelectedArea((prev) => {
            if (prev && parsed.some((p) => p.name === prev.name)) return prev;
            return parsed[0];
          });
        } else if (!FALLBACK_PINCODES[cleanText]) {
          setLocations([]);
          setSelectedArea(null);
          setPincodeError('No locations found for this PIN code');
        }
      } catch (err) {
        if (!FALLBACK_PINCODES[cleanText]) {
          setPincodeError('Unable to fetch locations. Please check connection.');
        }
      } finally {
        setIsLoadingPincode(false);
      }
    } else {
      setLocations([]);
      setSelectedArea(null);
    }
  };

  const handleContinue = async () => {
    setPhoneError('');
    setPincodeError('');

    if (!isPhoneValid) {
      setPhoneError(t('auth.invalidPhone', 'Please enter a valid 10-digit mobile number'));
      return;
    }
    if (!selectedArea) {
      setPincodeError('Please enter a valid PIN code and select your area');
      return;
    }

    try {
      setPhone(inputPhone);
      setLocation(`${selectedArea.name}, ${selectedArea.district}, ${selectedArea.state}`);

      await sendOtpMutation.mutateAsync({ phone: inputPhone });

      router.push('/(auth)/otp');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Main Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo */}
          <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 12 }}>
            <BrandLogo size="md" showText showTagline />
          </View>

          {/* Heading & Subtitle */}
          <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: '800',
                color: '#111827',
                textAlign: 'center',
                letterSpacing: -0.5,
              }}
            >
              {t('auth.signIn', 'Sign in')}
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: '#475569',
                textAlign: 'center',
                marginTop: 6,
                paddingHorizontal: 12,
              }}
            >
              {t(
                'auth.signInSubtitle',
                'Sign in or create an account with your mobile number.'
              )}
            </Text>
          </View>

          {/* Form Fields */}
          <View style={{ width: '100%' }}>
            {/* Phone Number Field */}
            <View>
              <Input
                label={t('auth.phoneNumber', 'Mobile Number')}
                placeholder={t('auth.phonePlaceholder', 'Enter mobile number')}
                value={inputPhone}
                onChangeText={(text) => {
                  setInputPhone(text);
                  if (phoneError) setPhoneError('');
                }}
                keyboardType="phone-pad"
                maxLength={10}
                error={phoneError}
              />
            </View>

            {/* PIN Code Field */}
            <View style={{ marginTop: 14 }}>
              <Input
                label="PIN Code"
                placeholder="Enter 6-digit PIN code"
                value={pincode}
                onChangeText={handlePincodeChange}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                maxLength={6}
                error={pincodeError}
              />
            </View>

            {/* Loading Indicator */}
            {isLoadingPincode && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#EE4D38" />
                <Text style={styles.loadingText}>Fetching areas for PIN code...</Text>
              </View>
            )}

            {/* Location Selector Area with Dedicated Scroll Container */}
            {locations.length > 0 && (
              <View style={styles.locationSection}>
                {/* Header Row: "Select your location" and "{N} location(s) found" */}
                <View style={styles.locationHeaderRow}>
                  <Text style={styles.locationHeaderTitle}>Select your location</Text>
                  <Text style={styles.locationFoundCount}>
                    {locations.length} location(s) found
                  </Text>
                </View>

                {/* Only the locations list scrolls inside this container */}
                <View style={styles.locationScrollContainer}>
                  <ScrollView
                    style={styles.locationScrollView}
                    contentContainerStyle={{ paddingBottom: 6 }}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {locations.map((item, index) => {
                      const isSelected = selectedArea?.name === item.name;
                      return (
                        <TouchableOpacity
                          key={`${item.name}-${index}`}
                          activeOpacity={0.8}
                          onPress={() => {
                            Keyboard.dismiss();
                            setSelectedArea(item);
                          }}
                          style={[
                            styles.locationCard,
                            isSelected && styles.locationCardSelected,
                          ]}
                        >
                          {/* Radio Circle */}
                          <View
                            style={[
                              styles.radioCircle,
                              isSelected && styles.radioCircleSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.radioInnerDot} />}
                          </View>

                          {/* Location Details */}
                          <View style={styles.locationDetails}>
                            <Text
                              style={[
                                styles.locationName,
                                isSelected && styles.locationNameSelected,
                              ]}
                            >
                              {item.name}
                            </Text>
                            <Text style={styles.locationSub}>
                              {item.district}, {item.state}
                            </Text>
                            <Text style={styles.locationPincode}>{item.pincode}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* ================= FIXED BOTTOM CONTINUE BUTTON ================= */}
        <View style={[styles.fixedBottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button
            title={t('common.continue', 'Continue')}
            onPress={handleContinue}
            disabled={!isFormValid}
            loading={sendOtpMutation.isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  loadingText: {
    fontSize: 12.5,
    color: '#64748B',
  },
  locationSection: {
    marginTop: 14,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  locationHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  locationFoundCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  locationScrollContainer: {
    maxHeight: 220,
    borderRadius: 14,
    overflow: 'hidden',
  },
  locationScrollView: {
    maxHeight: 220,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  locationCardSelected: {
    borderColor: '#EE4D38',
    backgroundColor: '#FFF7F6',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioCircleSelected: {
    borderColor: '#EE4D38',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EE4D38',
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.1,
  },
  locationNameSelected: {
    color: '#EE4D38',
  },
  locationSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  locationPincode: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  fixedBottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 4,
  },
});
