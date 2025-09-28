import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../locales';

export default function LearnScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* K-Culture Section - Always in English */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {i18n.t('kculture.title')}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {i18n.t('kculture.subtitle')}
        </Text>
        
        <TouchableOpacity style={styles.courseCard}>
          <View style={styles.courseIcon}>
            <Text style={styles.courseEmoji}>🎵</Text>
          </View>
          <View style={styles.courseContent}>
            <Text style={styles.courseTitle}>K-Pop Korean</Text>
            <Text style={styles.courseDescription}>
              BTS, BLACKPINK, Stray Kids
            </Text>
            <View style={styles.courseStats}>
              <Text style={styles.statText}>12 lessons</Text>
              <Text style={styles.statText}>• Beginner</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B46C1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.courseCard}>
          <View style={styles.courseIcon}>
            <Text style={styles.courseEmoji}>🍜</Text>
          </View>
          <View style={styles.courseContent}>
            <Text style={styles.courseTitle}>K-Food Korean</Text>
            <Text style={styles.courseDescription}>
              Kimchi, Bulgogi, Bibimbap
            </Text>
            <View style={styles.courseStats}>
              <Text style={styles.statText}>8 lessons</Text>
              <Text style={styles.statText}>• Beginner</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B46C1" />
        </TouchableOpacity>
      </View>

      {/* Study Hanja Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {i18n.t('sections.studyHanja')}
        </Text>
        
        <TouchableOpacity style={[styles.courseCard, styles.comingSoon]}>
          <View style={styles.courseIcon}>
            <Text style={styles.courseEmoji}>📚</Text>
          </View>
          <View style={styles.courseContent}>
            <Text style={styles.courseTitle}>한자능력시험 8급</Text>
            <Text style={styles.courseDescription}>
              기초 50자 마스터
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>
          </View>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3E5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  courseEmoji: {
    fontSize: 24,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: 'row',
  },
  statText: {
    fontSize: 12,
    color: '#999',
  },
  comingSoon: {
    opacity: 0.6,
  },
  badge: {
    backgroundColor: '#FFE4B5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF6B35',
  },
});