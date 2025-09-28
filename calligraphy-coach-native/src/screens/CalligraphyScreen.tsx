import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CalligraphyScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* 한글 서예 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🖌️ 한글 서예</Text>
        
        <TouchableOpacity style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>판본체</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>초급</Text>
            </View>
          </View>
          <Text style={styles.courseDescription}>
            조선 궁중의 정갈한 서체를 배워보세요
          </Text>
          <View style={styles.courseInfo}>
            <Text style={styles.infoText}>2개 레슨</Text>
            <Text style={styles.infoText}>• 70분</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>궁서체</Text>
            <View style={[styles.levelBadge, styles.levelIntermediate]}>
              <Text style={styles.levelText}>중급</Text>
            </View>
          </View>
          <Text style={styles.courseDescription}>
            아름다운 곡선미의 궁중 서체
          </Text>
          <View style={styles.courseInfo}>
            <Text style={styles.infoText}>11개 레슨</Text>
            <Text style={styles.infoText}>• 450분</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 한자 서예 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🈲 한자 서예</Text>
        
        <TouchableOpacity style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>서법 92</Text>
            <View style={[styles.levelBadge, styles.levelBasic]}>
              <Text style={styles.levelText}>기초</Text>
            </View>
          </View>
          <Text style={styles.courseDescription}>
            서예의 기본 원칙과 필법 마스터
          </Text>
        </TouchableOpacity>

        {/* 왕희지 컬렉션 */}
        <View style={styles.masterSection}>
          <Text style={styles.masterTitle}>왕희지(王羲之) 컬렉션</Text>
          
          <TouchableOpacity style={styles.masterCard}>
            <Text style={styles.masterCardTitle}>천자문 · 해서</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B46C1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.masterCard}>
            <Text style={styles.masterCardTitle}>집자성교서 · 행서</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B46C1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.masterCard}>
            <Text style={styles.masterCardTitle}>난정서 · 행서</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B46C1" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  courseInfo: {
    flexDirection: 'row',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
  },
  levelBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelIntermediate: {
    backgroundColor: '#FFF8E1',
  },
  levelBasic: {
    backgroundColor: '#E3F2FD',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  masterSection: {
    marginTop: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  masterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
    marginBottom: 12,
  },
  masterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  masterCardTitle: {
    fontSize: 14,
    color: '#333',
  },
});