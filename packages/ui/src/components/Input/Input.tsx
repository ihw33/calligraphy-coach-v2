import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { colors, typography, spacing } from '../../tokens';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** 입력 필드 라벨 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 힌트 텍스트 */
  hint?: string;
  /** 입력 필드 변형 */
  variant?: 'outlined' | 'filled';
  /** 입력 필드 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 필수 입력 표시 */
  required?: boolean;
  /** 전체 너비 사용 */
  fullWidth?: boolean;
  /** 추가 컨테이너 스타일 */
  containerStyle?: ViewStyle;
  /** 추가 입력 필드 스타일 */
  inputStyle?: TextStyle;
  /** 라벨 스타일 */
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  variant = 'outlined',
  size = 'medium',
  disabled = false,
  required = false,
  fullWidth = true,
  containerStyle,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: unknown) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: unknown) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const containerStyles = [
    styles.container,
    fullWidth && styles.fullWidth,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
  ];

  const inputStyles = [
    styles.input,
    styles[`${size}Input`],
    disabled && styles.disabledInput,
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    required && styles.requiredLabel,
    error && styles.errorLabel,
    labelStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}
          {required && <Text style={styles.asterisk}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        <TextInput
          {...textInputProps}
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          placeholderTextColor={colors.text.hint}
        />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {hint && !error && (
        <Text style={styles.hintText}>{hint}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // 컨테이너 스타일
  container: {
    marginBottom: spacing.component.input.marginBottom,
  },
  fullWidth: {
    width: '100%',
  },

  // 라벨 스타일
  label: {
    ...typography.body.small,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  requiredLabel: {
    // required 상태에서 추가 스타일이 필요하면 여기에
  },
  errorLabel: {
    color: colors.semantic.error,
  },
  asterisk: {
    color: colors.semantic.error,
  },

  // 입력 컨테이너 스타일
  inputContainer: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 변형 스타일
  outlined: {
    borderWidth: 1,
    borderColor: colors.border.medium,
    backgroundColor: colors.background.primary,
  },
  filled: {
    borderWidth: 0,
    backgroundColor: colors.background.secondary,
  },

  // 크기 스타일
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  medium: {
    paddingVertical: spacing.component.input.paddingVertical,
    paddingHorizontal: spacing.component.input.paddingHorizontal,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 52,
  },

  // 상태 스타일
  focused: {
    borderColor: colors.border.focus,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.semantic.error,
  },
  disabled: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.light,
  },

  // 입력 필드 스타일
  input: {
    flex: 1,
    ...typography.body.medium,
    color: colors.text.primary,
    padding: 0, // 기본 패딩 제거
  },
  smallInput: {
    fontSize: typography.fontSize.sm,
  },
  mediumInput: {
    fontSize: typography.fontSize.base,
  },
  largeInput: {
    fontSize: typography.fontSize.lg,
  },
  disabledInput: {
    color: colors.text.disabled,
  },

  // 도움말 텍스트 스타일
  errorText: {
    ...typography.special.caption,
    color: colors.semantic.error,
    marginTop: spacing.xs,
  },
  hintText: {
    ...typography.special.caption,
    color: colors.text.hint,
    marginTop: spacing.xs,
  },
});
