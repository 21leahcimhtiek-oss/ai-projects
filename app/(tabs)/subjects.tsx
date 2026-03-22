import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, SUBJECTS } from '../../constants/config';

export default function SubjectsScreen() {
  const router = useRouter();
  const { setCurrentSubject, flashCards, subscription } = useAppStore();

  const getSubjectProgress = (subjectId: string) => {
    const cards = flashCards.filter(c => c.subject === subjectId);
    if (cards.length === 0) return 0;
    return Math.round((cards.filter(c => c.mastered).length / cards.length) * 100);
  };

  const getCardCount = (subjectId: string) => flashCards.filter(c => c.subject === subjectId).length;

  const featuredSubjects = SUBJECTS.slice(0, 4);
  const allSubjects = SUBJECTS;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Subjects</Text>
        <Text style={styles.headerSubtitle}>{SUBJECTS.length} subjects available</Text>
      </View>

      {/* Featured */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Featured</Text>
        <View style={styles.featuredGrid}>
          {featuredSubjects.map((subject) => {
            const progress = getSubjectProgress(subject.id);
            return (
              <TouchableOpacity
                key={subject.id}
                style={[styles.featuredCard, { borderColor: subject.color + '50' }]}
                onPress={() => { setCurrentSubject(subject.id); router.push('/(tabs)/chat'); }}
              >
                <View style={[styles.featuredIcon, { backgroundColor: subject.color + '20' }]}>
                  <Text style={styles.featuredIconText}>{subject.icon}</Text>
                </View>
                <Text style={styles.featuredName}>{subject.name}</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: subject.color }]} />
                </View>
                <Text style={[styles.progressText, { color: subject.color }]}>{progress}%</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* All Subjects List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Subjects</Text>
        {allSubjects.map((subject) => {
          const progress = getSubjectProgress(subject.id);
          const cardCount = getCardCount(subject.id);
          const isLocked = subscription.plan === 'free' && SUBJECTS.indexOf(subject) > 2;

          return (
            <TouchableOpacity
              key={subject.id}
              style={[styles.subjectRow, isLocked && styles.subjectRowLocked]}
              onPress={() => {
                if (!isLocked) {
                  setCurrentSubject(subject.id);
                  router.push('/(tabs)/chat');
                } else {
                  router.push('/subscription');
                }
              }}
            >
              <View style={[styles.subjectRowIcon, { backgroundColor: subject.color + '20' }]}>
                <Text style={styles.subjectRowIconText}>{subject.icon}</Text>
              </View>
              <View style={styles.subjectRowContent}>
                <View style={styles.subjectRowHeader}>
                  <Text style={styles.subjectRowName}>{subject.name}</Text>
                  {isLocked && <Ionicons name="lock-closed" size={14} color={COLORS.textSecondary} />}
                </View>
                <View style={styles.subjectRowMeta}>
                  <Text style={styles.subjectRowCards}>{cardCount} cards</Text>
                  <View style={styles.subjectRowProgress}>
                    <View style={styles.miniProgressBg}>
                      <View style={[styles.miniProgressFill, { width: `${progress}%`, backgroundColor: subject.color }]} />
                    </View>
                    <Text style={styles.miniProgressText}>{progress}%</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SAT/ACT Prep */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.satCard}
          onPress={() => subscription.plan !== 'free' ? router.push('/(tabs)/chat') : router.push('/subscription')}
        >
          <View style={styles.satContent}>
            <Text style={styles.satIcon}>🎓</Text>
            <View>
              <Text style={styles.satTitle}>SAT / ACT Prep Mode</Text>
              <Text style={styles.satSubtitle}>Full practice tests + AI coaching</Text>
            </View>
          </View>
          {subscription.plan === 'free' ? (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          ) : (
            <Ionicons name="arrow-forward-circle" size={28} color={COLORS.gold} />
          )}
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  featuredGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featuredCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 16, alignItems: 'center', borderWidth: 1,
  },
  featuredIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  featuredIconText: { fontSize: 28 },
  featuredName: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 10, textAlign: 'center' },
  progressBarBg: { width: '100%', height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 11, fontWeight: '700' },
  subjectRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, gap: 12,
  },
  subjectRowLocked: { opacity: 0.5 },
  subjectRowIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  subjectRowIconText: { fontSize: 22 },
  subjectRowContent: { flex: 1 },
  subjectRowHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  subjectRowName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  subjectRowMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subjectRowCards: { fontSize: 12, color: COLORS.textSecondary },
  subjectRowProgress: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniProgressBg: { width: 60, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  miniProgressFill: { height: '100%', borderRadius: 2 },
  miniProgressText: { fontSize: 11, color: COLORS.textSecondary },
  satCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.gold + '15', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: COLORS.gold + '40',
  },
  satContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  satIcon: { fontSize: 36 },
  satTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  satSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  proBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  proBadgeText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
});