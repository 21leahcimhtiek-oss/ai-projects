import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, SUBJECTS } from '../../constants/config';

export default function FlashcardsScreen() {
  const router = useRouter();
  const { flashCards, toggleMastered, currentSubject } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'mastered' | 'learning'>('all');
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [activeSubject, setActiveSubject] = useState('all');

  const filtered = flashCards.filter(c => {
    const subjectMatch = activeSubject === 'all' || c.subject === activeSubject;
    const statusMatch = filter === 'all' || (filter === 'mastered' ? c.mastered : !c.mastered);
    return subjectMatch && statusMatch;
  });

  const masteredCount = flashCards.filter(c => c.mastered).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/chat')}>
          <Ionicons name="add" size={22} color={COLORS.white} />
          <Text style={styles.addButtonText}>AI Generate</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <Text style={styles.progressCount}>{masteredCount}/{flashCards.length} mastered</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${(masteredCount / Math.max(flashCards.length, 1)) * 100}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{Math.round((masteredCount / Math.max(flashCards.length, 1)) * 100)}% complete</Text>
      </View>

      {/* Subject Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectFilter}>
        {[{ id: 'all', name: 'All', icon: '📚', color: COLORS.primary }, ...SUBJECTS.slice(0, 5)].map(s => (
          <TouchableOpacity
            key={s.id}
            style={[styles.subjectChip, activeSubject === s.id && { backgroundColor: s.color + '30', borderColor: s.color }]}
            onPress={() => setActiveSubject(s.id)}
          >
            <Text style={styles.subjectChipIcon}>{s.icon}</Text>
            <Text style={[styles.subjectChipText, activeSubject === s.id && { color: s.color }]}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Status Filter */}
      <View style={styles.statusFilter}>
        {(['all', 'learning', 'mastered'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🃏</Text>
            <Text style={styles.emptyTitle}>No flashcards yet</Text>
            <Text style={styles.emptySubtitle}>Ask the AI tutor to generate flashcards for any topic!</Text>
            <TouchableOpacity style={styles.generateButton} onPress={() => router.push('/(tabs)/chat')}>
              <Text style={styles.generateButtonText}>Generate with AI</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, card.mastered && styles.cardMastered]}
              onPress={() => setFlipped(f => ({ ...f, [card.id]: !f[card.id] }))}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardSubjectBadge}>
                  <Text style={styles.cardSubjectIcon}>
                    {SUBJECTS.find(s => s.id === card.subject)?.icon || '📚'}
                  </Text>
                  <Text style={styles.cardSubjectName}>
                    {SUBJECTS.find(s => s.id === card.subject)?.name || card.subject}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => toggleMastered(card.id)}>
                  <Ionicons
                    name={card.mastered ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={24}
                    color={card.mastered ? COLORS.success : COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.cardFlipHint}>
                {flipped[card.id] ? '👀 Answer' : '❓ Question'} · tap to flip
              </Text>

              <Text style={styles.cardText}>
                {flipped[card.id] ? card.back : card.front}
              </Text>

              {card.mastered && (
                <View style={styles.masteredBadge}>
                  <Ionicons name="star" size={12} color={COLORS.gold} />
                  <Text style={styles.masteredText}>Mastered</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Study Mode Button */}
      {filtered.length > 0 && (
        <TouchableOpacity style={styles.studyModeButton} onPress={() => router.push('/quiz')}>
          <Ionicons name="play-circle" size={24} color={COLORS.white} />
          <Text style={styles.studyModeText}>Start Study Session</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, gap: 4 },
  addButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  progressCard: { margin: 20, marginTop: 0, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  progressCount: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  progressBarBg: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  progressPercent: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, textAlign: 'right' },
  subjectFilter: { paddingHorizontal: 20, marginBottom: 12 },
  subjectChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  subjectChipIcon: { fontSize: 16 },
  subjectChipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  statusFilter: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  filterTextActive: { color: COLORS.white, fontWeight: '600' },
  cardsContainer: { paddingHorizontal: 20, gap: 12 },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border, minHeight: 120 },
  cardMastered: { borderColor: COLORS.success + '40' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardSubjectBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardSubjectIcon: { fontSize: 16 },
  cardSubjectName: { fontSize: 12, color: COLORS.textSecondary },
  cardFlipHint: { fontSize: 11, color: COLORS.primary, marginBottom: 8, fontWeight: '500' },
  cardText: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  masteredBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  masteredText: { fontSize: 11, color: COLORS.gold, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  generateButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  generateButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  studyModeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, margin: 20, marginTop: 16, borderRadius: 14, padding: 16, gap: 8 },
  studyModeText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});