import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';

export const AnalysisScreen: React.FC = () => {
  const { recentAnalyses } = useAppStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>분석 결과</Text>
        <Text style={styles.subtitle}>
          AI가 분석한 서예 학습 결과를 확인하세요
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {recentAnalyses.length > 0 ? (
          recentAnalyses.map((analysis) => (
            <TouchableOpacity key={analysis.id} style={styles.analysisCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.score}>{analysis.score}점</Text>
                <Text style={styles.date}>
                  {new Date(analysis.createdAt).toLocaleDateString('ko-KR')}
                </Text>
              </View>
              
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>서예 이미지</Text>
              </View>
              
              <Text style={styles.feedback}>{analysis.feedback}</Text>
              
              <View style={styles.metricsContainer}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>균형</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '80%' }]} />
                  </View>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>필압</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '70%' }]} />
                  </View>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>구성</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: '90%' }]} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>분석 결과가 없습니다</Text>
            <Text style={styles.emptyText}>
              카메라 탭에서 서예를 촬영해보세요
            </Text>
          </View>
        )}
      </ScrollView>
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
  analysisCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageText: {
    fontSize: 16,
    color: '#999',
  },
  feedback: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
  },
  metricsContainer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metric: {
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#000',
  },
  emptyState: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 60,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});