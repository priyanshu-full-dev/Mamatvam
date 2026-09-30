import React from 'react';
import { View, ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'flat';
  className?: string;
}

export function Card({
  children,
  variant = 'flat',
  className = '',
  style,
  ...props
}: CardProps) {
  let variantStyle = 'bg-white rounded-3xl p-5 border border-[#F1F5F9]';
  if (variant === 'elevated') {
    variantStyle = 'bg-white rounded-3xl p-5 shadow-sm shadow-black/5 border border-[#F8FAFC]';
  } else if (variant === 'outlined') {
    variantStyle = 'bg-transparent rounded-3xl p-5 border border-[#E2E8F0]';
  }

  return (
    <View className={`${variantStyle} ${className}`} style={style} {...props}>
      {children}
    </View>
  );
}
