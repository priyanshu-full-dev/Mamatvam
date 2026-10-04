import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { POPULAR_LOCATIONS } from '@/constants/locations';
import { useAuthStore } from '@/store/useAuthStore';
import { useSendOtpMutation } from '@/api/auth.api';

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { phone, setPhone, location, setLocation } = useAuthStore();

  const [inputPhone, setInputPhone] = useState(phone || '');
  const [selectedLocation, setSelectedLocation] = useState(location || '');
  const [error, setError] = useState('');

  const sendOtpMutation = useSendOtpMutation();

  const isPhoneValid = inputPhone.trim().length >= 10;

  const handleContinue = async () => {
    setError('');
    if (!isPhoneValid) {
      setError(t('auth.invalidPhone', 'Please enter a valid 10-digit mobile number'));
      return;
    }

    try {
      setPhone(inputPhone);
      setLocation(selectedLocation);

      await sendOtpMutation.mutateAsync({ phone: inputPhone });

      router.push('/(auth)/otp');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo */}
          <View className="items-center pt-8 pb-4">
            <BrandLogo size="md" showText showTagline />
          </View>

          {/* Heading & Subtitle */}
          <View className="items-center mt-4 mb-8">
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#111827', textAlign: 'center', letterSpacing: -0.5 }}>
              {t('auth.signIn', 'Sign in')}
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24, color: '#475569', textAlign: 'center', marginTop: 8, paddingHorizontal: 12 }}>
              {t(
                'auth.signInSubtitle',
                'Sign in or create an account with your email address.'
              )}
            </Text>
          </View>

          {/* Form Fields */}
          <View className="w-full space-y-4">
            <View>
              <Input
                label={t('auth.phoneNumber', 'Phone Number')}
                placeholder={t('auth.phonePlaceholder', 'Enter phone number')}
                value={inputPhone}
                onChangeText={(text) => {
                  setInputPhone(text);
                  if (error) setError('');
                }}
                keyboardType="phone-pad"
                maxLength={10}
                error={error}
              />
            </View>

            <View className="mt-3">
              <Select
                placeholder={t('auth.selectLocation', 'Select your location')}
                value={selectedLocation}
                options={POPULAR_LOCATIONS}
                onSelect={(opt) => setSelectedLocation(opt.name)}
              />
            </View>
          </View>

          {/* Continue Button */}
          <View style={{ marginTop: 28, width: '100%' }}>
            <Button
              title={t('common.continue', 'Continue')}
              onPress={handleContinue}
              disabled={!isPhoneValid}
              loading={sendOtpMutation.isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
