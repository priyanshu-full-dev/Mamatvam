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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Top Logo */}
          <View className="items-center pt-8 pb-4">
            <BrandLogo size="md" showText showTagline />
          </View>

          {/* Heading & Subtitle */}
          <View className="items-center mt-3 mb-6">
            <Text className="text-2xl font-bold text-[#1E1E1E]">
              {t('auth.signIn', 'Sign in')}
            </Text>
            <Text className="text-xs text-[#6B7280] text-center mt-1.5 px-4 leading-relaxed">
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
          <View className="mt-6 mb-8">
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
