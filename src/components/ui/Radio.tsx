import React from 'react';
import { View, Pressable } from 'react-native';

export interface RadioProps {
  selected: boolean;
  onPress?: () => void;
  size?: number;
  color?: string;
}

export function Radio({
  selected,
  onPress,
  size = 24,
  color = '#EE4D38',
}: RadioProps) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <View
        className="rounded-full items-center justify-center border-2"
        style={{
          width: size,
          height: size,
          borderColor: selected ? color : '#CBD5E1',
          backgroundColor: selected ? '#FFFFFF' : 'transparent',
        }}
      >
        {selected && (
          <View
            className="rounded-full"
            style={{
              width: size * 0.5,
              height: size * 0.5,
              backgroundColor: color,
            }}
          />
        )}
      </View>
    </Pressable>
  );
}
