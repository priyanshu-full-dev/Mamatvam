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
    sm: { img: 64, title: 'text-xl', tagline: 'text-[9px]' },
    md: { img: 110, title: 'text-2xl', tagline: 'text-[10px]' },
    lg: { img: 140, title: 'text-3xl', tagline: 'text-xs' },
  }[size];

  return (
    <View className="items-center justify-center">
      <Image
        source={require('@/assets/images/mamatvam-logo.png')}
        style={{ width: dimensions.img, height: dimensions.img }}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
      {showText && (
        <Text className={`${dimensions.title} font-bold tracking-[3px] text-[#EE4D38] mt-2`}>
          MAMATVAM
        </Text>
      )}
      {showTagline && (
        <Text className={`${dimensions.tagline} font-medium tracking-[2.5px] text-[#EE4D38] mt-1 uppercase`}>
          SCIENCE, SOUL & SUPPORT
        </Text>
      )}
    </View>
  );
}
