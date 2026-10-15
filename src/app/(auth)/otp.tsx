import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Pressable,
  Alert,
  Keyboard,
  LayoutAnimation,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/ui/Button';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { useAuthStore } from '@/store/useAuthStore';
import { useVerifyOtpMutation, useSendOtpMutation } from '@/api/auth.api';

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const { t } = useTranslation();
  const { phone, location, login } = useAuthStore();

  const userPhone = (params.phone as string) || phone || '';
  const formattedPhone = userPhone
    ? userPhone.startsWith('+')
      ? userPhone
      : `+91 ${userPhone}`
    : 'your Phone Number';

  const subtitleText = t('auth.otpSubtitle', {
    phone: formattedPhone,
    defaultValue: `Enter the 4-digit code we sent to ${formattedPhone}.`,
  });

  const subtitleParts = userPhone ? subtitleText.split(formattedPhone) : [subtitleText];

  const [otp, setOtp] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const verifyOtpMutation = useVerifyOtpMutation();
  const sendOtpMutation = useSendOtpMutation();
  const isVerifyingRef = useRef(false);

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
    if (isVerifyingRef.current || verifyOtpMutation.isPending) return;

    const codeToVerify = otpCode || otp;
    if (codeToVerify.length < 4) {
      setHasError(true);
      setErrorMessage(t('auth.otpError', 'Please enter a valid 4-digit OTP.'));
      return;
    }

    setHasError(false);
    setErrorMessage('');
    isVerifyingRef.current = true;
    Keyboard.dismiss();

    try {
      const res = await verifyOtpMutation.mutateAsync({
        phone: userPhone || '9999999999',
        otp: codeToVerify,
        location,
      });

      await login(res.token, res.user);

      // Navigate to Language Selection Screen
      router.replace('/(auth)/language');
    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err?.message || 'Invalid OTP code');
    } finally {
      isVerifyingRef.current = false;
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await sendOtpMutation.mutateAsync({ phone: userPhone || '9999999999' });
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: isKeyboardOpen ? 4 : 14,
            paddingBottom: isKeyboardOpen ? 16 : 30,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo */}
          <View
            style={{
              alignItems: 'center',
              paddingTop: isKeyboardOpen ? 4 : 14,
              paddingBottom: isKeyboardOpen ? 2 : 6,
            }}
          >
            <BrandLogo size="lg" showText imageSize={160} />
          </View>

          {/* Heading & Subtitle */}
          <View
            style={{
              alignItems: 'center',
              marginTop: isKeyboardOpen ? 2 : 6,
              marginBottom: isKeyboardOpen ? 6 : 16,
            }}
          >
            <Text
              style={{
                fontSize: isKeyboardOpen ? 26 : 30,
                fontWeight: '800',
                color: '#111827',
                textAlign: 'center',
                letterSpacing: -0.5,
              }}
            >
              {t('auth.otpTitle', 'OTP')}
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                color: '#475569',
                textAlign: 'center',
                marginTop: isKeyboardOpen ? 2 : 4,
                paddingHorizontal: 12,
              }}
            >
              {subtitleParts.length > 1 ? (
                <>
                  {subtitleParts[0]}
                  <Text style={{ fontWeight: '700', color: '#111827' }}>
                    {formattedPhone}
                  </Text>
                  {subtitleParts.slice(1).join(formattedPhone)}
                </>
              ) : (
                subtitleText
              )}
            </Text>
          </View>

          {/* OTP Section */}
          <View style={{ width: '100%', marginTop: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E1E', marginBottom: 10, marginLeft: 4 }}>
              {t('auth.otpLabel', 'OTP')}
            </Text>

            <OTPInput
              length={4}
              value={otp}
              onChange={(code) => {
                setOtp(code);
                if (hasError) setHasError(false);
              }}
              hasError={hasError}
            />

            {errorMessage ? (
              <Text style={{ fontSize: 13, color: '#EF4444', textAlign: 'center', marginTop: 8 }}>
                {errorMessage}
              </Text>
            ) : null}

            {/* Resend timer */}
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 14 }}>
              {canResend ? (
                <Pressable onPress={handleResend} hitSlop={10}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#F06292' }}>
                    {t('auth.resendNow', 'Resend OTP')}
                  </Text>
                </Pressable>
              ) : (
                <Text style={{ fontSize: 13, color: '#64748B' }}>
                  {t('auth.resendTimer', `Didn't get the OTP? Resend OTP in ${formatCountdown(countdown)}`, {
                    seconds: formatCountdown(countdown),
                    time: formatCountdown(countdown),
                  })}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Fixed Log in Button at Bottom */}
        <BottomActionBar
          title={t('common.login', 'Log in')}
          onPress={() => handleVerify(otp)}
          disabled={otp.length < 4}
          loading={verifyOtpMutation.isPending}
          containerStyle={isKeyboardOpen ? { paddingBottom: 8 } : undefined}
          style={isKeyboardOpen ? { paddingTop: 4 } : undefined}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
