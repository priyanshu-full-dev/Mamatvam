import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event?: GestureResponderEvent) => void;
  onClick?: (event?: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string;
  textClassName?: string;
}

export function Button({
  title,
  children,
  onPress,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
}: ButtonProps) {
  const handlePress = onPress || onClick;

  // Primary brand styling
  let containerStyle: ViewStyle = {
    width: '100%',
    height: 54,
    backgroundColor: '#F06292',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  let labelColor = '#FFFFFF';

  if (variant === 'secondary') {
    containerStyle.backgroundColor = '#FCE4EC';
    labelColor = '#F06292';
  } else if (variant === 'outline') {
    containerStyle.backgroundColor = 'transparent';
    containerStyle.borderWidth = 1.5;
    containerStyle.borderColor = '#F06292';
    labelColor = '#F06292';
  } else if (variant === 'ghost') {
    containerStyle.backgroundColor = 'transparent';
    labelColor = '#6B7280';
  }

  // When disabled: keep the button visible with lowered opacity so it is NEVER hidden
  if (disabled) {
    containerStyle.opacity = 0.55;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={disabled || loading ? undefined : handlePress}
      disabled={disabled || loading}
      style={[containerStyle, style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'outline' ? '#F06292' : '#FFFFFF'}
        />
      ) : children ? (
        children
      ) : (
        <Text
          style={[
            {
              color: labelColor,
              fontSize: 16,
              fontWeight: '700',
              textAlign: 'center',
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default Button;
