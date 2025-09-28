/**
 * 앱 네비게이션 설정
 * 3개 화면: Home, Practice, Result
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Character } from '../types/character';
import { Score } from '../types/score';

// 화면 컴포넌트들
import HomeScreen from '../screens/HomeScreen';
import PracticeScreen from '../screens/PracticeScreen';
import ResultScreen from '../screens/ResultScreen';

export type RootStackParamList = {
  Home: undefined;
  Practice: { character: Character };
  Result: { character: Character; score: Score };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4ecdc4',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '서예 연습' }}
        />
        <Stack.Screen 
          name="Practice" 
          component={PracticeScreen}
          options={({ route }) => ({ 
            title: `${route.params.character.unicode} 연습` 
          })}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen}
          options={{ title: '결과' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}