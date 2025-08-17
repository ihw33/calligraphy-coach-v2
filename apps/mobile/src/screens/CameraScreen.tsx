import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';

export const CameraScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addAnalysis } = useAppStore();
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);
    
    // TODO: Implement actual camera capture
    setTimeout(() => {
      const mockAnalysis = {
        id: Date.now().toString(),
        imageUrl: 'mock-image-url',
        score: 85,
        feedback: '획이 안정적이고 균형이 잘 잡혀있습니다.',
        createdAt: new Date(),
      };
      
      addAnalysis(mockAnalysis);
      setIsCapturing(false);
      
      Alert.alert(
        '분석 완료',
        '서예 분석이 완료되었습니다.',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('Analysis' as any),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>서예 촬영</Text>
        <Text style={styles.subtitle}>
          연습한 서예를 촬영해주세요
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraText}>카메라 미리보기</Text>
        </View>
        
        <View style={styles.guides}>
          <View style={styles.guideCorner} />
          <View style={[styles.guideCorner, styles.topRight]} />
          <View style={[styles.guideCorner, styles.bottomLeft]} />
          <View style={[styles.guideCorner, styles.bottomRight]} />
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          • 명조도가 충분한 곳에서 촬영해주세요
        </Text>
        <Text style={styles.instructionText}>
          • 종이가 화면에 꽉 차도록 조정해주세요
        </Text>
        <Text style={styles.instructionText}>
          • 흔들리지 않도록 주의해주세요
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
        onPress={handleCapture}
        disabled={isCapturing}
      >
        <Text style={styles.captureButtonText}>
          {isCapturing ? '분석 중...' : '촬영하기'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraText: {
    color: '#fff',
    fontSize: 18,
  },
  guides: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  guideCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    top: 20,
    left: 20,
  },
  topRight: {
    borderLeftWidth: 0,
    borderRightWidth: 3,
    left: undefined,
    right: 20,
  },
  bottomLeft: {
    borderTopWidth: 0,
    borderBottomWidth: 3,
    top: undefined,
    bottom: 20,
  },
  bottomRight: {
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    top: undefined,
    bottom: 20,
    left: undefined,
    right: 20,
  },
  instructions: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  captureButton: {
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#999',
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});