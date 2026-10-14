import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonProps } from './Button';

export interface BottomActionBarProps {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export function BottomActionBar({
  title,
  onPress,
  disabled = false,
  loading = false,
  buttonProps,
  children,
  style,
  containerStyle,
  backgroundColor = '#FFFFFF',
}: BottomActionBarProps) {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.safeArea,
        { backgroundColor },
        containerStyle,
      ]}
    >
      <View style={[styles.inner, style]}>
        {children ? (
          children
        ) : (
          <Button
            title={title}
            onPress={onPress}
            disabled={disabled}
            loading={loading}
            {...buttonProps}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
    paddingBottom: 24,
  },
  inner: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
});

export default BottomActionBar;
