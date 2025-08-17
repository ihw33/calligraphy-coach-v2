import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ModalProps as RNModalProps,
} from 'react-native';
import { colors, typography, spacing } from '../../tokens';

export interface ModalProps extends Omit<RNModalProps, 'children'> {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 모달 제목 */
  title?: string;
  /** 모달 내용 */
  children?: React.ReactNode;
  /** 모달 크기 */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /** 모달 위치 */
  position?: 'center' | 'bottom' | 'top';
  /** 배경 터치 시 닫기 */
  closeOnBackdropPress?: boolean;
  /** 닫기 버튼 표시 */
  showCloseButton?: boolean;
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  /** 취소 버튼 텍스트 */
  cancelText?: string;
  /** 확인 버튼 클릭 */
  onConfirm?: () => void;
  /** 취소 버튼 클릭 */
  onCancel?: () => void;
  /** 추가 컨테이너 스타일 */
  containerStyle?: ViewStyle;
  /** 추가 콘텐츠 스타일 */
  contentStyle?: ViewStyle;
  /** 제목 스타일 */
  titleStyle?: TextStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'medium',
  position = 'center',
  closeOnBackdropPress = true,
  showCloseButton = true,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  containerStyle,
  contentStyle,
  titleStyle,
  ...modalProps
}) => {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const overlayStyles = [
    styles.overlay,
    styles[`${position}Overlay`],
  ];

  const modalStyles = [
    styles.modal,
    styles[size],
    styles[position],
    contentStyle,
  ];

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const titleStyles = [
    styles.title,
    titleStyle,
  ];

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...modalProps}
    >
      <TouchableOpacity
        style={overlayStyles}
        activeOpacity={1}
        onPress={handleBackdropPress}
      >
        <TouchableOpacity
          style={modalStyles}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={containerStyles}>
            {/* 헤더 */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <Text style={titleStyles}>{title}</Text>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* 콘텐츠 */}
            {children && (
              <View style={styles.content}>
                {children}
              </View>
            )}

            {/* 액션 버튼 */}
            {(confirmText || cancelText) && (
              <View style={styles.actions}>
                {cancelText && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                {confirmText && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={handleConfirm}
                  >
                    <Text style={styles.confirmButtonText}>{confirmText}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  // 오버레이 스타일
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.modal,
  },
  centerOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    justifyContent: 'flex-end',
  },
  topOverlay: {
    justifyContent: 'flex-start',
    paddingTop: 100,
  },

  // 모달 스타일
  modal: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // 크기 스타일
  small: {
    width: '80%',
    maxWidth: 300,
  },
  medium: {
    width: '90%',
    maxWidth: 400,
  },
  large: {
    width: '95%',
    maxWidth: 600,
  },
  fullscreen: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },

  // 위치 스타일
  center: {
    // 중앙 정렬은 overlay에서 처리
  },
  bottom: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  top: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  // 내용 스타일
  container: {
    padding: spacing.component.modal.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.heading.h3,
    color: colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.md,
  },
  closeButtonText: {
    ...typography.heading.h4,
    color: colors.text.secondary,
  },
  content: {
    marginBottom: spacing.lg,
  },

  // 액션 버튼 스타일
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  confirmButton: {
    backgroundColor: colors.primary.main,
  },
  cancelButtonText: {
    ...typography.special.button,
    color: colors.text.secondary,
  },
  confirmButtonText: {
    ...typography.special.button,
    color: colors.text.inverse,
  },
});
