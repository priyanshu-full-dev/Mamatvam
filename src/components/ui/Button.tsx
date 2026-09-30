import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
  ViewStyle,
  StyleProp,
} from 'react-native';

export interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  className = '',
  textClassName = '',
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading || variant === 'disabled';

  const sizeClasses = {
    sm: 'py-2.5 px-4 rounded-lg',
    md: 'py-4 px-6 rounded-2xl',
    lg: 'py-4.5 px-8 rounded-2xl',
  }[size];

  const textSizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-lg font-bold',
  }[size];

  let variantBg = 'bg-[#EE4D38]';
  let variantText = 'text-white';

  if (isDisabled) {
    variantBg = 'bg-[#C5CCD6]';
    variantText = 'text-white';
  } else if (variant === 'secondary') {
    variantBg = 'bg-[#FFF1EE]';
    variantText = 'text-[#EE4D38]';
  } else if (variant === 'outline') {
    variantBg = 'bg-transparent border border-[#EE4D38]';
    variantText = 'text-[#EE4D38]';
  } else if (variant === 'ghost') {
    variantBg = 'bg-transparent';
    variantText = 'text-[#6B7280]';
  }

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        pressed && !isDisabled ? { opacity: 0.9, transform: [{ scale: 0.99 }] } : {},
        style,
      ]}
      className={`items-center justify-center flex-row ${fullWidth ? 'w-full' : ''} ${sizeClasses} ${variantBg} ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'secondary' ? '#EE4D38' : '#FFFFFF'} />
      ) : (
        <>
          {children ? (
            children
          ) : (
            <Text className={`text-center ${textSizeClasses} ${variantText} ${textClassName}`}>
              {title}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}
