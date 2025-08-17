import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing } from '../../tokens';

export interface CardProps {
  /** 카드 내용 */
  children: React.ReactNode;
  /** 카드 변형 */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** 카드 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 그림자 표시 여부 */
  shadow?: boolean;
  /** 둥근 모서리 여부 */
  rounded?: boolean;
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 추가 스타일 */
  style?: ViewStyle;
  /** 클릭 가능 여부 */
  pressable?: boolean;
  /** 클릭 이벤트 */
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  size = 'medium',
  shadow = true,
  rounded = true,
  fullWidth = false,
  style,
  pressable = false,
  onPress,
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[size],
    shadow && variant === 'elevated' && styles.shadow,
    rounded && styles.rounded,
    fullWidth && styles.fullWidth,
    pressable && styles.pressable,
    style,
  ];

  const CardComponent = pressable ? TouchableOpacity : View;

  return (
    <CardComponent
      style={cardStyles}
      onPress={pressable ? onPress : undefined}
      activeOpacity={pressable ? 0.8 : 1}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  // 기본 스타일
  base: {
    padding: spacing.component.card.padding,
    margin: spacing.component.card.margin,
  },

  // 변형 스타일
  elevated: {
    backgroundColor: colors.background.elevated,
    borderWidth: 0,
  },
  outlined: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  filled: {
    backgroundColor: colors.background.secondary,
    borderWidth: 0,
  },

  // 크기 스타일
  small: {
    padding: spacing.md,
  },
  medium: {
    padding: spacing.component.card.padding,
  },
  large: {
    padding: spacing.component.card.large.padding,
  },

  // 추가 스타일
  shadow: {
    shadowColor: colors.ink.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },
  rounded: {
    borderRadius: 12,
  },
  fullWidth: {
    width: '100%',
    marginHorizontal: 0,
  },
  pressable: {
    // 클릭 가능한 카드의 추가 스타일
  },
});
