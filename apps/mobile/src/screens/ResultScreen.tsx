/**
 * 결과 화면 - 점수 표시
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { savePracticeRecord } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ navigation, route }: Props) {
  const { character, score } = route.params;

  // 점수 자동 저장
  useEffect(() => {
    savePracticeRecord(character, score);
  }, [character, score]);

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleTryAgain = () => {
    navigation.navigate('Practice', { character });
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      {/* 글자 정보 */}
      <Text style={{ fontSize: 48, marginBottom: 10 }}>{character.unicode}</Text>
      <Text style={{ fontSize: 18, color: '#666', marginBottom: 40 }}>{character.name}</Text>

      {/* 점수 */}
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Text style={{ fontSize: 24, color: '#666', marginBottom: 10 }}>점수</Text>
        <Text style={{ fontSize: 72, fontWeight: 'bold', color: '#4ecdc4' }}>
          {score.total}
        </Text>
        <Text style={{ fontSize: 18, color: '#666' }}>/ 100</Text>
      </View>

      {/* 버튼들 */}
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#4ecdc4',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12
          }}
          onPress={handleTryAgain}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            다시 연습하기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#666',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center'
          }}
          onPress={handleGoHome}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            홈으로 가기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}