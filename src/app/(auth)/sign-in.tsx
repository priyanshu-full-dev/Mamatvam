import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  LayoutAnimation,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
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
  const pincodeInputRef = useRef<TextInput>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsKeyboardOpen(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsKeyboardOpen(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isPhoneValid = inputPhone.trim().length >= 10;
  const isPincodeFilled = pincode.trim().length > 0;
  const isPincodeValid = !isPincodeFilled || (pincode.length === 6 && !!selectedArea);
  const isFormValid = isPhoneValid && isPincodeValid;
  const hasLocations = locations.length > 0;

  const handlePincodeChange = async (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPincode(cleanText);
    setPincodeError('');

    if (cleanText.length === 6) {
      Keyboard.dismiss();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLocations(parsed);
          setSelectedArea((prev) => {
            if (prev && parsed.some((p) => p.name === prev.name)) return prev;
            return parsed[0];
          });
        } else if (!FALLBACK_PINCODES[cleanText]) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      if (locations.length > 0) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setLocations([]);
      setSelectedArea(null);
    }
  };

  const isSubmittingRef = useRef(false);

  const submitWithPhone = async (phoneToSubmit: string) => {
    if (isSubmittingRef.current || sendOtpMutation.isPending) return;

    const clean = phoneToSubmit.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setPhoneError(t('auth.invalidPhone', 'Please enter a valid 10-digit mobile number'));
      return;
    }
    const isPincodeFilled = pincode.trim().length > 0;
    if (isPincodeFilled && pincode.length < 6) {
      setPincodeError('Please enter a full 6-digit PIN code or leave it blank');
      return;
    }
    if (isPincodeFilled && !selectedArea) {
      setPincodeError('Please select your area for the entered PIN code');
      return;
    }

    setPhoneError('');
    setPincodeError('');
    isSubmittingRef.current = true;
    Keyboard.dismiss();

    try {
      setPhone(clean);
      if (selectedArea) {
        setLocation(`${selectedArea.name}, ${selectedArea.district}, ${selectedArea.state}`);
      } else {
        setLocation('');
      }

      await sendOtpMutation.mutateAsync({ phone: clean });

      router.push({
        pathname: '/(auth)/otp',
        params: { phone: clean },
      });
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handlePhoneChange = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, '').slice(0, 10);
    setInputPhone(cleanNumber);
    if (phoneError) setPhoneError('');

    if (cleanNumber.length === 10) {
      setTimeout(() => {
        pincodeInputRef.current?.focus();
      }, 50);
    }
  };

  const handleContinue = () => {
    submitWithPhone(inputPhone);
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
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: isKeyboardOpen ? 4 : (hasLocations ? 6 : 14),
            paddingBottom: isKeyboardOpen ? 12 : 24,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo */}
          <View
            style={{
              alignItems: 'center',
              paddingTop: isKeyboardOpen ? 4 : (hasLocations ? 6 : 14),
              paddingBottom: isKeyboardOpen ? 2 : (hasLocations ? 2 : 6),
            }}
          >
            <BrandLogo
              size="lg"
              showText
              showTagline={!hasLocations && !isKeyboardOpen}
              imageSize={160}
              source={require('@/assets/images/logo/mamatvam-logo2.png')}
            />
          </View>

          {/* Heading & Subtitle */}
          <View
            style={{
              alignItems: 'center',
              marginTop: isKeyboardOpen ? 2 : (hasLocations ? 2 : 6),
              marginBottom: isKeyboardOpen ? 6 : (hasLocations ? 6 : 18),
            }}
          >
            <Text
              style={{
                fontSize: isKeyboardOpen || hasLocations ? 24 : 30,
                fontWeight: '800',
                color: '#111827',
                textAlign: 'center',
                letterSpacing: -0.5,
              }}
            >
              {t('auth.signIn', 'Sign in')}
            </Text>
            {!hasLocations && !isKeyboardOpen && (
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
            )}
          </View>

          {/* Form Fields */}
          <View style={{ width: '100%' }}>
            {/* Phone Number Field */}
            <View>
              <Input
                label={t('auth.phoneNumber', 'Mobile Number')}
                placeholder={t('auth.phonePlaceholder', 'Enter mobile number')}
                value={inputPhone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={10}
                error={phoneError}
              />
            </View>

            {/* PIN Code Field */}
            <View style={{ marginTop: isKeyboardOpen ? 8 : (hasLocations ? 10 : 14) }}>
              <Input
                ref={pincodeInputRef}
                label="PIN Code (Optional)"
                placeholder="Enter 6-digit PIN code (optional)"
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
                <ActivityIndicator size="small" color="#e62a09" />
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
                    contentContainerStyle={{ paddingBottom: 10 }}
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
        <BottomActionBar
          title={t('common.continue', 'Continue')}
          onPress={handleContinue}
          disabled={!isFormValid}
          loading={sendOtpMutation.isPending}
          containerStyle={isKeyboardOpen ? { paddingBottom: 8 } : undefined}
          style={isKeyboardOpen ? { paddingTop: 4 } : undefined}
        />
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
    marginTop: 12,
    marginBottom: 8,
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
    maxHeight: 330,
    borderRadius: 14,
    overflow: 'hidden',
  },
  locationScrollView: {
    maxHeight: 330,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  locationCardSelected: {
    borderColor: '#e62a09',
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
    borderColor: '#e62a09',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e62a09',
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
    color: '#e62a09',
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
