import 'react-native-gesture-handler';
import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: 'white', fontSize: 20 }}>React Native(Web) 렌더링 성공</Text>
    </View>
  );
}