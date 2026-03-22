import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, LIFE_AREAS } from '../../constants/config';

export default function GoalsScreen() {
  const router = useRouter();
  const { goals, updateGoalProgress } = useAppStore();
  const [activeArea, setActiveArea] = useState('all');

  const filteredGoals = activeArea === 'all' ? goals : goals.filter(g => g.area === activeArea);
  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress / g.target) * 100, 0) / goals.length)
    : 0;

  const getAreaColor = (areaId: string) => LIFE_AREAS.find(a => a.id === areaId)?.color || COLORS.primary;
  const getAreaIcon = (areaId: string) => LIFE_AREAS.find(a => a.id === areaId)?.icon || '🎯';

  const daysUntilDeadline = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Goals</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/coach')}>
          <Ionicons name="add" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Overall Progress */}
      <View style={styles.overallCard}>
        <Text style={styles.overallLabel}>Overall Goal Progress</Text>
        <Text style={styles.overallValue}>{overallProgress}%</Text>
        <View style={styles.overallBarBg}>
          <View style={[styles.overallBarFill, { width: `${overallProgress}%` }]} />
        </View>
        <Text style={styles.overallSub}>{goals.filter(g => g.progress >= g.target).length} of {goals.length} goals achieved</Text>
      </View>

      {/* Area Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.areaFilter}>
        {[{ id: 'all', name: 'All', icon: '🎯', color: COLORS.primary }, ...LIFE_AREAS].map(area => (
          <TouchableOpacity
            key={area.id}
            style={[styles.areaChip, activeArea === area.id && { backgroundColor: area.color + '30', borderColor: area.color }]}
            onPress={() => setActiveArea(area.id)}
          >
            <Text style={styles.areaChipIcon}>{area.icon}</Text>
            <Text style={[styles.areaChipText, activeArea === area.id && { color: area.color }]}>{area.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Goals List */}
      <View style={styles.goalsList}>
        {filteredGoals.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>No goals in this area</Text>
            <TouchableOpacity style={styles.addGoalBtn} onPress={() => router.push('/(tabs)/coach')}>
              <Text style={styles.addGoalBtnText}>Set Goals with AI</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredGoals.map(goal => {
            const percent = Math.min(Math.round((goal.progress / goal.target) * 100), 100);
            const color = getAreaColor(goal.area);
            const days = daysUntilDeadline(goal.deadline);
            const achieved = goal.progress >= goal.target;

            return (
              <View key={goal.id} style={[styles.goalCard, achieved && styles.goalCardDone]}>
                <View style={styles.goalCardHeader}>
                  <View style={[styles.goalAreaIcon, { backgroundColor: color + '20' }]}>
                    <Text style={styles.goalAreaIconText}>{getAreaIcon(goal.area)}</Text>
                  </View>
                  <View style={styles.goalCardInfo}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <View style={styles.goalMeta}>
                      <Text style={styles.goalArea}>{LIFE_AREAS.find(a => a.id === goal.area)?.name}</Text>
                      <Text style={[styles.goalDeadline, days < 30 && { color: COLORS.warning }]}>
                        {achieved ? '✅ Achieved!' : `${days} days left`}
                      </Text>
                    </View>
                  </View>
                  {achieved && <Ionicons name="trophy" size={24} color={COLORS.gold} />}
                </View>

                <View style={styles.goalProgress}>
                  <View style={styles.goalProgressHeader}>
                    <Text style={styles.goalProgressText}>{goal.progress}{goal.unit} / {goal.target}{goal.unit}</Text>
                    <Text style={[styles.goalPercent, { color }]}>{percent}%</Text>
                  </View>
                  <View style={styles.goalProgressBg}>
                    <View style={[styles.goalProgressFill, { width: `${percent}%`, backgroundColor: color }]} />
                  </View>
                </View>

                {/* Quick Update Buttons */}
                {!achieved && (
                  <View style={styles.quickUpdate}>
                    <Text style={styles.quickUpdateLabel}>Quick update:</Text>
                    {[10, 25, 50].map(pct => (
                      <TouchableOpacity
                        key={pct}
                        style={[styles.updateBtn, { borderColor: color + '60' }]}
                        onPress={() => updateGoalProgress(goal.id, Math.min(goal.target, goal.progress + (goal.target * pct / 100)))}
                      >
                        <Text style={[styles.updateBtnText, { color }]}>+{pct}%</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* AI Goal Coach */}
      <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/(tabs)/coach')}>
        <Text style={styles.aiCardIcon}>🤖</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiCardTitle}>AI Goal Coach</Text>
          <Text style={styles.aiCardSubtitle}>Get a personalized action plan to achieve your goals faster</Text>
        </View>
        <Ionicons name="arrow-forward-circle" size={28} color={COLORS.primary} />
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
  overallCard: { margin: 20, marginTop: 0, backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.primary + '30', alignItems: 'center' },
  overallLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
  overallValue: { fontSize: 52, fontWeight: 'bold', color: COLORS.primary },
  overallBarBg: { width: '100%', height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginVertical: 12 },
  overallBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  overallSub: { fontSize: 13, color: COLORS.textSecondary },
  areaFilter: { paddingHorizontal: 20, marginBottom: 16 },
  areaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  areaChipIcon: { fontSize: 16 },
  areaChipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  goalsList: { paddingHorizontal: 20, gap: 14 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 16 },
  addGoalBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  addGoalBtnText: { color: COLORS.white, fontWeight: '700' },
  goalCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.border },
  goalCardDone: { borderColor: COLORS.gold + '60' },
  goalCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  goalAreaIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  goalAreaIconText: { fontSize: 22 },
  goalCardInfo: { flex: 1 },
  goalTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  goalMeta: { flexDirection: 'row', gap: 10 },
  goalArea: { fontSize: 12, color: COLORS.textSecondary },
  goalDeadline: { fontSize: 12, color: COLORS.textSecondary },
  goalProgress: { marginBottom: 12 },
  goalProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  goalProgressText: { fontSize: 13, color: COLORS.textSecondary },
  goalPercent: { fontSize: 14, fontWeight: 'bold' },
  goalProgressBg: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  goalProgressFill: { height: '100%', borderRadius: 4 },
  quickUpdate: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  quickUpdateLabel: { fontSize: 12, color: COLORS.textSecondary },
  updateBtn: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  updateBtnText: { fontSize: 12, fontWeight: '600' },
  aiCard: { flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 8, backgroundColor: COLORS.primary + '15', borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: COLORS.primary + '40' },
  aiCardIcon: { fontSize: 28 },
  aiCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  aiCardSubtitle: { fontSize: 12, color: COLORS.textSecondary },
});