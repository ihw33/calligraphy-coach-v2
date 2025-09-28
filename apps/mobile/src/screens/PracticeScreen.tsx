/**
 * 연습 화면 - 캔버스 그리기
 */

import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SimplePracticeCanvas } from '../components/SimplePracticeCanvas';
import { evaluateMask } from '../utils/evaluator';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Practice'>;

export default function PracticeScreen({ navigation, route }: Props) {
  const { character } = route.params;

  const handleComplete = (attempt: any) => {
    // 간단한 평가 (실제로는 마스크 변환 필요)
    const score = {
      total: Math.floor(Math.random() * 40) + 60, // 60-100점 임시
      attemptId: attempt.id,
      timestamp: new Date()
    };

    navigation.navigate('Result', { character, score });
  };

  return (
    <View style={{ flex: 1 }}>
      <SimplePracticeCanvas character={character} onComplete={handleComplete} />
    </View>
  );
}