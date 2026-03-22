import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, LIFE_AREAS } from '../../constants/config';

export default function HabitsScreen() {
  const router = useRouter();
  const { habits, toggleHabit, streakDays } = useAppStore();
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Habit Tracker</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('Add Habit', 'Use AI Coach to suggest powerful habits for your goals!')}>
          <Ionicons name="add" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: `${completedToday}/${habits.length}`, label: 'Today', icon: '✅' },
          { value: `${streakDays}`, label: 'Day Streak', icon: '🔥' },
          { value: `${totalStreak}`, label: 'Total Streak', icon: '⭐' },
          { value: `${Math.round((completedToday / Math.max(habits.length, 1)) * 100)}%`, label: 'Rate', icon: '📊' },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Today's Habits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        {habits.map(habit => (
          <TouchableOpacity key={habit.id} style={[styles.habitRow, habit.completedToday && styles.habitRowDone]} onPress={() => toggleHabit(habit.id)}>
            <View style={[styles.habitIconBg, { backgroundColor: habit.color + '20' }]}>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
            </View>
            <View style={styles.habitInfo}>
              <Text style={styles.habitName}>{habit.name}</Text>
              <View style={styles.habitMeta}>
                <Text style={[styles.habitStreak, { color: habit.color }]}>{habit.streak} day streak 🔥</Text>
                <View style={[styles.areaTag, { backgroundColor: LIFE_AREAS.find(a => a.id === habit.area)?.color + '20' || COLORS.border }]}>
                  <Text style={[styles.areaTagText, { color: LIFE_AREAS.find(a => a.id === habit.area)?.color || COLORS.textSecondary }]}>
                    {LIFE_AREAS.find(a => a.id === habit.area)?.name || habit.area}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.checkCircle, habit.completedToday && { backgroundColor: habit.color, borderColor: habit.color }]}>
              {habit.completedToday && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Weekly Heatmap */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekGrid}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <View key={i} style={styles.weekDay}>
              <Text style={styles.weekDayLabel}>{day}</Text>
              {habits.slice(0, 4).map((h, j) => (
                <View key={j} style={[styles.heatDot, { backgroundColor: i < 5 ? h.color + '80' : COLORS.border }]} />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* AI Suggestion */}
      <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/(tabs)/coach')}>
        <Text style={styles.aiCardIcon}>🤖</Text>
        <View>
          <Text style={styles.aiCardTitle}>AI Habit Suggestions</Text>
          <Text style={styles.aiCardSubtitle}>Let AI build the perfect habit stack for your goals</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: 10, padding: 8 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  habitRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, marginBottom: 10, gap: 12, borderWidth: 1, borderColor: COLORS.border },
  habitRowDone: { borderColor: COLORS.success + '40', backgroundColor: COLORS.success + '08' },
  habitIconBg: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  habitIcon: { fontSize: 22 },
  habitInfo: { flex: 1 },
  habitName: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  habitMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  habitStreak: { fontSize: 12, fontWeight: '600' },
  areaTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  areaTagText: { fontSize: 10, fontWeight: '600' },
  checkCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  weekGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  weekDay: { alignItems: 'center', gap: 4 },
  weekDayLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 4, fontWeight: '600' },
  heatDot: { width: 12, height: 12, borderRadius: 6 },
  aiCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: COLORS.primary + '15', borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: COLORS.primary + '40' },
  aiCardIcon: { fontSize: 28 },
  aiCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  aiCardSubtitle: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
});