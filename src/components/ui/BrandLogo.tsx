import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showTagline?: boolean;
}

export function BrandLogo({
  size = 'md',
  showText = true,
  showTagline = true,
}: BrandLogoProps) {
  const dimensions = {
    sm: { img: showText ? 80 : 44 },
    md: { img: showText ? 140 : 70 },
    lg: { img: showText ? 200 : 100 },
  }[size];

  return (
    <View className="items-center justify-center">
      <Image
        source={
          showText
            ? require('@/assets/images/mamatvam-logo.png')
            : require('@/assets/images/mamatvam-icon.png')
        }
        style={{ width: dimensions.img, height: dimensions.img }}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
    </View>
  );
}
