import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, ImageSource } from 'expo-image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  imageSize?: number;
  animatedOnKeyboard?: boolean;
  compactSize?: number;
  source?: ImageSource | number;
}

export function BrandLogo({
  size = 'lg',
  showText = true,
  showTagline = true,
  imageSize,
  source,
}: BrandLogoProps) {
  const dimensions = {
    sm: { img: showText ? 100 : 54 },
    md: { img: showText ? 140 : 75 },
    lg: { img: showText ? 160 : 100 },
    xl: { img: showText ? 190 : 120 },
  }[size] || { img: 160 };

  const finalImgSize = imageSize || dimensions.img;

  const logoSource =
    source ||
    (showText
      ? require('@/assets/images/logo/mamatvam-logo2.png')
      : require('@/assets/images/mamatvam-circle-logo.png'));

  return (
    <View style={styles.container}>
      <Image
        source={logoSource}
        style={{ width: finalImgSize, height: finalImgSize }}
        contentFit="contain"
        cachePolicy="memory-disk"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
