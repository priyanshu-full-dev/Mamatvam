import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Pressable, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  hasError?: boolean;
}

export function OTPInput({
  length = 4,
  value,
  onChange,
  onComplete,
  hasError = false,
}: OTPInputProps) {
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const otpDigits = Array.from({ length }, (_, i) => value[i] || '');

  const handleChangeText = (text: string, index: number) => {
    // Handle paste of multiple characters
    if (text.length > 1) {
      const sanitized = text.replace(/[^0-9]/g, '').slice(0, length);
      onChange(sanitized);
      if (sanitized.length === length) {
        inputsRef.current[length - 1]?.focus();
        onComplete?.(sanitized);
      } else {
        inputsRef.current[sanitized.length]?.focus();
      }
      return;
    }

    const sanitizedChar = text.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = sanitizedChar;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    if (sanitizedChar && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.length === length && !newDigits.includes('')) {
      onComplete?.(newOtp);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      }
    }
  };

  return (
    <View className="flex-row justify-between items-center w-full px-2">
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = !!otpDigits[index];

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputsRef.current[index] = ref;
            }}
            value={otpDigits[index]}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            keyboardType="number-pad"
            maxLength={index === 0 ? length : 1}
            textAlign="center"
            className={`w-[68px] h-[68px] rounded-2xl text-2xl font-bold text-[#1E1E1E] bg-white border ${
              hasError
                ? 'border-red-500 bg-red-50/20'
                : isFocused
                ? 'border-[#EE4D38] shadow-sm'
                : hasValue
                ? 'border-[#D1D5DB]'
                : 'border-[#E5E7EB]'
            }`}
            selectTextOnFocus
          />
        );
      })}
    </View>
  );
}
