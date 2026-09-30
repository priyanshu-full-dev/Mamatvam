import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useVerifyOtpMutation, useSendOtpMutation } from '@/api/auth.api';

export default function OTPScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { phone, location, login } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const verifyOtpMutation = useVerifyOtpMutation();
  const sendOtpMutation = useSendOtpMutation();

  // Timer countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async (otpCode: string) => {
    setHasError(false);
    setErrorMessage('');

    if (otpCode.length < 4) {
      setHasError(true);
      setErrorMessage(t('auth.otpError', 'Please enter a valid 4-digit OTP.'));
      return;
    }

    try {
      const res = await verifyOtpMutation.mutateAsync({
        phone: phone || '9999999999',
        otp: otpCode,
        location,
      });

      await login(res.token, res.user);

      // Navigate to Language Selection Screen (Figma Screen 5)
      router.push('/(auth)/language');
    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err?.message || 'Invalid OTP code');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await sendOtpMutation.mutateAsync({ phone: phone || '9999999999' });
      setCountdown(30);
      setCanResend(false);
      setHasError(false);
      setErrorMessage('');
      Alert.alert('Success', 'A fresh OTP has been sent to your phone number.');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to resend OTP');
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
              {t('auth.otpTitle', 'OTP')}
            </Text>
            <Text className="text-xs text-[#6B7280] text-center mt-1.5 px-6 leading-relaxed">
              {t(
                'auth.otpSubtitle',
                'Enter the 6-digit code we sent to your Phone Number.'
              )}
            </Text>
          </View>

          {/* OTP Section */}
          <View className="w-full mt-2">
            <Text className="text-sm font-semibold text-[#1E1E1E] mb-3 ml-2">
              {t('auth.otpLabel', 'OTP')}
            </Text>

            <OTPInput
              length={4}
              value={otp}
              onChange={(code) => {
                setOtp(code);
                if (hasError) setHasError(false);
              }}
              onComplete={(code) => handleVerify(code)}
              hasError={hasError}
            />

            {errorMessage ? (
              <Text className="text-xs text-red-500 text-center mt-2">
                {errorMessage}
              </Text>
            ) : null}

            {/* Auto verifying indicator */}
            <Text className="text-xs text-[#94A3B8] text-center mt-4">
              {t('auth.autoVerifying', 'Auto verifying your OTP')}
            </Text>

            {/* Resend timer */}
            <View className="items-center justify-center mt-2">
              {canResend ? (
                <Pressable onPress={handleResend} hitSlop={10}>
                  <Text className="text-xs font-semibold text-[#EE4D38]">
                    {t('auth.resendNow', 'Resend OTP')}
                  </Text>
                </Pressable>
              ) : (
                <Text className="text-xs text-[#64748B]">
                  {t('auth.resendTimer', `Didn't get the OTP? Resend OTP in ${countdown} sec`, {
                    seconds: countdown,
                  })}
                </Text>
              )}
            </View>
          </View>

          {/* Log in Button */}
          <View className="mt-8 mb-8">
            <Button
              title={t('common.login', 'Log in')}
              onPress={() => handleVerify(otp)}
              disabled={otp.length < 4}
              loading={verifyOtpMutation.isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
