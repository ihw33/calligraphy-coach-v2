import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing } from '../../tokens';

export interface ButtonProps {
  /** 버튼 텍스트 */
  title: string;
  /** 버튼 변형 스타일 */
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  /** 버튼 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 클릭 이벤트 핸들러 */
  onPress?: () => void;
  /** 추가 컨테이너 스타일 */
  style?: ViewStyle;
  /** 추가 텍스트 스타일 */
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? colors.text.inverse : colors.primary.main}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // 기본 스타일
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // 변형 스타일
  primary: {
    backgroundColor: colors.primary.main,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  text: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  // 크기 스타일
  small: {
    paddingVertical: spacing.component.button.small.paddingVertical,
    paddingHorizontal: spacing.component.button.small.paddingHorizontal,
    minHeight: 36,
  },
  medium: {
    paddingVertical: spacing.component.button.paddingVertical,
    paddingHorizontal: spacing.component.button.paddingHorizontal,
    minHeight: 44,
  },
  large: {
    paddingVertical: spacing.component.button.large.paddingVertical,
    paddingHorizontal: spacing.component.button.large.paddingHorizontal,
    minHeight: 52,
  },

  // 상태 스타일
  disabled: {
    backgroundColor: colors.ink.light,
    borderColor: colors.border.light,
  },
  fullWidth: {
    width: '100%',
  },

  // 텍스트 스타일
  text: {
    ...typography.special.button,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.inverse,
  },
  outlineText: {
    color: colors.primary.main,
  },
  textText: {
    color: colors.primary.main,
  },

  // 크기별 텍스트 스타일
  smallText: {
    fontSize: typography.fontSize.sm,
  },
  mediumText: {
    fontSize: typography.fontSize.base,
  },
  largeText: {
    fontSize: typography.fontSize.lg,
  },

  // 비활성화 텍스트
  disabledText: {
    color: colors.text.disabled,
  },
});
