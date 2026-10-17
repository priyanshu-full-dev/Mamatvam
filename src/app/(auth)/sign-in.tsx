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
import { useSendOtpMutation, getPincodeDataApi, PincodeItem } from '@/api/auth.api';

export type PincodeLocation = PincodeItem;

const FALLBACK_PINCODES: Record<string, PincodeLocation[]> = {
  '829301': [
    { id: 20, name: 'Arajoo', district: 'Bokaro', block: 'Bokaro', state: 'Jharkhand', country: 'India', pincode: '829301' },
    { id: 21, name: 'Bahadurpur', district: 'Bokaro', block: 'Bokaro', state: 'Jharkhand', country: 'India', pincode: '829301' },
    { id: 22, name: 'Bandhdih', district: 'Bokaro', block: 'Bokaro', state: 'Jharkhand', country: 'India', pincode: '829301' },
    { id: 23, name: 'Baroo', district: 'Bokaro', block: 'Bokaro', state: 'Jharkhand', country: 'India', pincode: '829301' },
    { id: 24, name: 'Chando', district: 'Bokaro', block: 'Bokaro', state: 'Jharkhand', country: 'India', pincode: '829301' },
    { id: 25, name: 'Chilgada', district: 'Bokaro', block: 'Bokaro', state: 'Jharkhand', country: 'India', pincode: '829301' },
    { id: 26, name: 'Gangjori', district: 'Bokaro', block: 'Bokaro', state: 'Jharkhand', country: 'India', pincode: '829301' },
    { id: 27, name: 'Jaina', district: 'Bokaro', block: 'Bermo', state: 'Jharkhand', country: 'India', pincode: '829301' },
    { id: 28, name: 'Pathuria', district: 'Bokaro', block: 'Bokaro', state: 'Jharkhand', country: 'India', pincode: '829301' },
  ],
  '826001': [
    { id: 101, name: 'Dhanbad Hirapur', district: 'Dhanbad', block: 'Dhanbad', state: 'Jharkhand', country: 'India', pincode: '826001' },
    { id: 102, name: 'D.S.E.', district: 'Dhanbad', block: 'Dhanbad', state: 'Jharkhand', country: 'India', pincode: '826001' },
    { id: 103, name: 'Manaitand', district: 'Dhanbad', block: 'Dhanbad', state: 'Jharkhand', country: 'India', pincode: '826001' },
    { id: 104, name: 'Dhanbad', district: 'Dhanbad', block: 'Dhanbad', state: 'Jharkhand', country: 'India', pincode: '826001' },
    { id: 105, name: 'Dhanbad Bazar', district: 'Dhanbad', block: 'Dhanbad', state: 'Jharkhand', country: 'India', pincode: '826001' },
    { id: 106, name: 'Cmpf', district: 'Dhanbad', block: 'Dhanbad', state: 'Jharkhand', country: 'India', pincode: '826001' },
    { id: 107, name: 'Cmrs', district: 'Dhanbad', block: 'Dhanbad', state: 'Jharkhand', country: 'India', pincode: '826001' },
    { id: 108, name: 'Naya Bazar Wasseypur', district: 'Dhanbad', block: 'Dhanbad', state: 'Jharkhand', country: 'India', pincode: '826001' },
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
  const isPincodeValid = pincode.trim().length === 6 && (locations.length === 0 || !!selectedArea);
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
        const res = await getPincodeDataApi(cleanText);
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLocations(res.data);
          setSelectedArea((prev) => {
            if (prev && res.data.some((p) => p.id === prev.id || p.name === prev.name)) {
              return res.data.find((p) => p.id === prev.id || p.name === prev.name) || res.data[0];
            }
            return res.data[0];
          });
        } else if (!FALLBACK_PINCODES[cleanText]) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLocations([]);
          setSelectedArea(null);
          setPincodeError(res?.message || 'No locations found for this PIN code');
        }
      } catch (err: any) {
        if (!FALLBACK_PINCODES[cleanText]) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLocations([]);
          setSelectedArea(null);
          setPincodeError(err?.message || 'No locations found for this PIN code');
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
    let hasError = false;

    if (!clean) {
      setPhoneError(t('auth.phoneRequired', 'Please enter your mobile number'));
      hasError = true;
    } else if (clean.length < 10) {
      setPhoneError(t('auth.invalidPhone', 'Please enter a valid 10-digit mobile number'));
      hasError = true;
    } else {
      setPhoneError('');
    }

    const cleanPincode = pincode.trim().replace(/[^0-9]/g, '');
    if (!cleanPincode) {
      setPincodeError(t('auth.pincodeRequired', 'Please enter your 6-digit PIN code'));
      hasError = true;
    } else if (cleanPincode.length < 6) {
      setPincodeError(t('auth.invalidPincode', 'Please enter a valid 6-digit PIN code'));
      hasError = true;
    } else if (locations.length > 0 && !selectedArea) {
      setPincodeError(t('auth.selectArea', 'Please select your area for the entered PIN code'));
      hasError = true;
    } else if (pincodeError && pincodeError !== 'Please enter your 6-digit PIN code' && pincodeError !== 'Please enter a valid 6-digit PIN code') {
      hasError = true;
    } else {
      setPincodeError('');
    }

    if (hasError) return;

    setPhoneError('');
    setPincodeError('');
    isSubmittingRef.current = true;
    Keyboard.dismiss();

    try {
      setPhone(clean);
      if (selectedArea) {
        setLocation(`${selectedArea.name}, ${selectedArea.district}, ${selectedArea.state}`);
      } else {
        setLocation(`PIN ${cleanPincode}`);
      }

      const pincodeIdToUse = selectedArea?.id !== undefined ? selectedArea.id : cleanPincode;

      await sendOtpMutation.mutateAsync({
        mobile: clean,
        pincodeId: pincodeIdToUse,
      });

      router.push({
        pathname: '/(auth)/otp',
        params: {
          phone: clean,
          pincode: cleanPincode,
          pincodeId: String(pincodeIdToUse),
        },
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
              source={require('@/assets/images/logo/50360fdf-4693-4fda-a5f0-c2c2a85ea1cd-removebg-preview.png')}
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
                label={t('auth.phoneNumber', 'Mobile Number *')}
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
                label={t('auth.pincode', 'PIN Code *')}
                placeholder={t('auth.pincodePlaceholder', 'Enter 6-digit PIN code')}
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
                <ActivityIndicator size="small" color="#F06292" />
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
                              {item.block && item.block !== item.district ? `${item.block}, ` : ''}{item.district}, {item.state}
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
          disabled={false}
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
    borderColor: '#F06292',
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
    borderColor: '#F06292',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F06292',
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
    color: '#F06292',
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
