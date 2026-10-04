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
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const verifyOtpMutation = useVerifyOtpMutation();
  const sendOtpMutation = useSendOtpMutation();

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
      setCountdown(120);
      setCanResend(false);
      setHasError(false);
      setErrorMessage('');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to resend OTP');
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
              {t('auth.otpTitle', 'OTP')}
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24, color: '#475569', textAlign: 'center', marginTop: 8, paddingHorizontal: 12 }}>
              {t(
                'auth.otpSubtitle',
                'Enter the 4-digit code we sent to your Phone Number.'
              )}
            </Text>
          </View>

          {/* OTP Section */}
          <View className="w-full mt-2">
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginBottom: 12, marginLeft: 4 }}>
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
              <Text className="text-sm text-red-500 text-center mt-2.5">
                {errorMessage}
              </Text>
            ) : null}

            {/* Auto verifying indicator */}
            <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginTop: 18 }}>
              {t('auth.autoVerifying', 'Auto verifying your OTP')}
            </Text>

            {/* Resend timer */}
            <View className="items-center justify-center mt-3">
              {canResend ? (
                <Pressable onPress={handleResend} hitSlop={10}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#EE4D38' }}>
                    {t('auth.resendNow', 'Resend OTP')}
                  </Text>
                </Pressable>
              ) : (
                <Text style={{ fontSize: 14, color: '#64748B' }}>
                  {t('auth.resendTimer', `Didn't get the OTP? Resend OTP in ${formatCountdown(countdown)}`, {
                    seconds: formatCountdown(countdown),
                    time: formatCountdown(countdown),
                  })}
                </Text>
              )}
            </View>
          </View>

          {/* Log in Button */}
          <View style={{ marginTop: 28, width: '100%' }}>
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
