import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
} from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = '',
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`w-full ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-[#1E1E1E] mb-2">{label}</Text>
      )}

      <View
        className={`w-full flex-row items-center bg-white border rounded-2xl px-4 py-3.5 ${
          error
            ? 'border-red-500 bg-red-50/20'
            : isFocused
            ? 'border-[#EE4D38] shadow-sm'
            : 'border-[#E5E7EB]'
        }`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          className="flex-1 text-base text-[#1E1E1E] py-0 font-normal"
          placeholderTextColor="#9CA3AF"
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>

      {error ? (
        <Text className="text-xs text-red-500 mt-1.5 ml-1">{error}</Text>
      ) : helperText ? (
        <Text className="text-xs text-[#6B7280] mt-1.5 ml-1">{helperText}</Text>
      ) : null}
    </View>
  );
}
