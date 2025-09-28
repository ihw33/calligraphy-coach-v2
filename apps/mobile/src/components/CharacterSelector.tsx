/**
 * CharacterSelector 컴포넌트
 * 글자 목록을 표시하고 선택할 수 있는 컴포넌트
 */

import React from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import { Character } from '../types/character';
import { characters } from '../data/characters';

interface CharacterSelectorProps {
  onSelect: (character: Character) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ onSelect }) => {
  const renderCharacter = ({ item }: { item: Character }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        margin: 8,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
        minHeight: 80,
      }}
      onPress={() => onSelect(item)}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
        {item.unicode}
      </Text>
      <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      testID="character-list"
      data={characters}
      renderItem={renderCharacter}
      keyExtractor={(item) => item.id}
      numColumns={4}
      scrollEnabled={true}
      style={{ flex: 1, padding: 16 }}
    />
  );
};