import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing } from '../../tokens';

export interface LoadingProps {
  /** 로딩 텍스트 */
  text?: string;
  /** 로딩 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 로딩 색상 */
  color?: string;
  /** 전체 화면 오버레이 */
  overlay?: boolean;
  /** 수직 레이아웃 */
  vertical?: boolean;
  /** 표시 여부 */
  visible?: boolean;
  /** 추가 컨테이너 스타일 */
  style?: ViewStyle;
  /** 추가 텍스트 스타일 */
  textStyle?: TextStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  text,
  size = 'medium',
  color = colors.primary.main,
  overlay = false,
  vertical = true,
  visible = true,
  style,
  textStyle,
}) => {
  if (!visible) {
    return null;
  }

  const containerStyles = [
    styles.container,
    overlay && styles.overlay,
    vertical ? styles.vertical : styles.horizontal,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    textStyle,
  ];

  const getIndicatorSize = () => {
    switch (size) {
      case 'small':
        return 'small' as const;
      case 'large':
        return 'large' as const;
      default:
        return 'small' as const; // medium도 small로 처리 (RN ActivityIndicator는 small/large만 지원)
    }
  };

  return (
    <View style={containerStyles}>
      <ActivityIndicator
        size={getIndicatorSize()}
        color={color}
        style={styles.indicator}
      />
      {text && (
        <Text style={textStyles}>{text}</Text>
      )}
    </View>
  );
};

// 프로그레스 바 컴포넌트
export interface ProgressBarProps {
  /** 진행률 (0-1) */
  progress: number;
  /** 프로그레스 바 높이 */
  height?: number;
  /** 배경 색상 */
  backgroundColor?: string;
  /** 진행 색상 */
  progressColor?: string;
  /** 둥근 모서리 */
  rounded?: boolean;
  /** 애니메이션 사용 */
  animated?: boolean;
  /** 추가 스타일 */
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  backgroundColor = colors.background.secondary,
  progressColor = colors.primary.main,
  rounded = true,
  // animated: _animated = true,
  style,
}) => {
  const containerStyles = [
    styles.progressContainer,
    {
      height,
      backgroundColor,
      borderRadius: rounded ? height / 2 : 0,
    },
    style,
  ];

  const progressStyles = [
    styles.progress,
    {
      width: `${Math.max(0, Math.min(100, progress * 100))}%`,
      backgroundColor: progressColor,
      borderRadius: rounded ? height / 2 : 0,
    },
  ];

  return (
    <View style={containerStyles}>
      <View style={progressStyles} />
    </View>
  );
};

const styles = StyleSheet.create({
  // 로딩 컨테이너 스타일
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay.medium,
    zIndex: 1000,
  },
  vertical: {
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
  },

  // 인디케이터 스타일
  indicator: {
    // ActivityIndicator 자체 스타일은 size와 color로 제어
  },

  // 텍스트 스타일
  text: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
  smallText: {
    ...typography.special.caption,
    marginTop: spacing.xs,
  },
  mediumText: {
    ...typography.body.small,
    marginTop: spacing.sm,
  },
  largeText: {
    ...typography.body.medium,
    marginTop: spacing.md,
  },

  // 프로그레스 바 스타일
  progressContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});
