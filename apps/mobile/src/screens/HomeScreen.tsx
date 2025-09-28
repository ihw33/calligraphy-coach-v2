/**
 * 홈 화면 - 글자 선택
 */

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharacterSelector } from '../components/CharacterSelector';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getStatistics } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [stats, setStats] = useState<any>(null);

  // 화면 포커스 시마다 통계 새로고침
  useFocusEffect(
    React.useCallback(() => {
      getStatistics().then(setStats);
    }, [])
  );

  const handleCharacterSelect = (character: any) => {
    navigation.navigate('Practice', { character });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 간단한 통계 표시 */}
      {stats && stats.totalPractices > 0 && (
        <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            총 연습: {stats.totalPractices}회
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            평균 점수: {stats.averageScore}점
          </Text>
          <Text style={{ fontSize: 16 }}>
            최고 점수: {stats.bestScore}점
          </Text>
        </View>
      )}
      
      <CharacterSelector onSelect={handleCharacterSelect} />
    </View>
  );
}