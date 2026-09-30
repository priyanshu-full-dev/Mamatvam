import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export function Loader({
  message,
  size = 'large',
}: {
  message?: string;
  size?: 'small' | 'large';
}) {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <ActivityIndicator size={size} color="#EE4D38" />
      {message && (
        <Text className="text-sm font-medium text-[#6B7280] mt-3">
          {message}
        </Text>
      )}
    </View>
  );
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 12,
  className = '',
}: {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}) {
  return (
    <View
      style={{
        width: typeof width === 'number' ? width : undefined,
        height: typeof height === 'number' ? height : undefined,
        borderRadius,
      }}
      className={`bg-[#F1F5F9] animate-pulse ${typeof width === 'string' ? width : ''} ${
        typeof height === 'string' ? height : ''
      } ${className}`}
    />
  );
}
