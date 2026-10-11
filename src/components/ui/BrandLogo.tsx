import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  imageSize?: number;
}

export function BrandLogo({
  size = 'md',
  showText = true,
  showTagline = true,
  imageSize,
}: BrandLogoProps) {
  const dimensions = {
    sm: { img: showText ? 90 : 48 },
    md: { img: showText ? 150 : 75 },
    lg: { img: showText ? 190 : 100 },
    xl: { img: showText ? 230 : 120 },
  }[size] || { img: 190 };

  const finalImgSize = imageSize || dimensions.img;

  return (
    <View className="items-center justify-center">
      <Image
        source={
          showText
            ? require('@/assets/images/mamatvam-logo.png')
            : require('@/assets/images/mamatvam-circle-logo.png')
        }
        style={{ width: finalImgSize, height: finalImgSize }}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
    </View>
  );
}
