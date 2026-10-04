import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  hasError?: boolean;
  autoFocus?: boolean;
}

export function OTPInput({
  length = 4,
  value,
  onChange,
  onComplete,
  hasError = false,
  autoFocus = true,
}: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const digits = value.split('').slice(0, length);

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    onChange(cleaned);
    if (cleaned.length === length) {
      onComplete?.(cleaned);
    }
  };

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable onPress={handlePress} className="w-full items-center my-2">
      {/* Invisible Single TextInput: Keeps soft keyboard open and handles paste/SMS autofill */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[StyleSheet.absoluteFill, { opacity: 0.01 }]}
        caretHidden
      />

      {/* Visual OTP Boxes */}
      <View
        className="flex-row justify-between items-center w-full px-2"
        pointerEvents="none"
      >
        {Array.from({ length }).map((_, index) => {
          const char = digits[index] || '';
          const isCurrentActive =
            isFocused &&
            (index === digits.length || (digits.length === length && index === length - 1));
          const hasValue = !!char;

          return (
            <View
              key={index}
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                backgroundColor: '#FFFFFF',
                borderWidth: isCurrentActive ? 2 : 1.5,
                borderColor: hasError
                  ? '#EF4444'
                  : isCurrentActive
                  ? '#EE4D38'
                  : hasValue
                  ? '#9CA3AF'
                  : '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '700',
                  color: '#1E1E1E',
                }}
              >
                {char}
              </Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}
