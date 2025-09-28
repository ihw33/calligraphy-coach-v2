import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './src/navigation/MainNavigator';
import { RootStackParamList } from './src/navigation/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainNavigator} />
          {/* 추후 추가될 스크린들 */}
          {/* <Stack.Screen name="CourseDetail" component={CourseDetailScreen} /> */}
          {/* <Stack.Screen name="Practice" component={PracticeScreen} /> */}
          {/* <Stack.Screen name="Result" component={ResultScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}