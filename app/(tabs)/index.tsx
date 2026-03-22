import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, LIFE_AREAS } from '../../constants/config';

export default function TodayScreen() {
  const router = useRouter();
  const { userProfile, tasks, habits, goals, toggleTask, toggleHabit, addTask, streakDays, lifeScore, focusMinutes, subscription } = useAppStore();
  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const todayTasks = tasks.filter(t => t.dueDate === 'Today');
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const completedHabits = habits.filter(h => h.completedToday).length;
  const progressPercent = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask({ id: Date.now().toString(), title: newTask.trim(), completed: false, priority: 'medium', area: 'career', dueDate: 'Today' });
    setNewTask('');
    setShowAddTask(false);
  };

  const priorityColor = (p: string) => p === 'high' ? COLORS.error : p === 'medium' ? COLORS.warning : COLORS.textSecondary;
  const areaIcon = (areaId: string) => LIFE_AREAS.find(a => a.id === areaId)?.icon || '📌';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning ☀️</Text>
          <Text style={styles.userName}>{userProfile.name || 'Champion'}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        <TouchableOpacity style={styles.focusButton} onPress={() => router.push('/focus')}>
          <Ionicons name="timer-outline" size={20} color={COLORS.primary} />
          <Text style={styles.focusText}>Focus</Text>
        </TouchableOpacity>
      </View>

      {/* Life Score */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreLeft}>
          <Text style={styles.scoreLabel}>Life Score</Text>
          <Text style={styles.scoreValue}>{lifeScore}</Text>
          <Text style={styles.scoreSubtitle}>+3 from last week 📈</Text>
        </View>
        <View style={styles.scoreRight}>
          <View style={styles.scoreStat}><Text style={styles.scoreStatValue}>{streakDays}🔥</Text><Text style={styles.scoreStatLabel}>Streak</Text></View>
          <View style={styles.scoreStat}><Text style={styles.scoreStatValue}>{focusMinutes}m</Text><Text style={styles.scoreStatLabel}>Focus</Text></View>
          <View style={styles.scoreStat}><Text style={styles.scoreStatValue}>{completedHabits}/{habits.length}</Text><Text style={styles.scoreStatLabel}>Habits</Text></View>
        </View>
      </View>

      {/* Today's Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Today's Tasks</Text>
          <Text style={styles.progressCount}>{completedTasks}/{todayTasks.length}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{progressPercent}% complete</Text>
      </View>

      {/* Tasks Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📋 Tasks</Text>
          <TouchableOpacity onPress={() => setShowAddTask(!showAddTask)}>
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {showAddTask && (
          <View style={styles.addTaskRow}>
            <TextInput
              style={styles.addTaskInput}
              placeholder="Add a new task..."
              placeholderTextColor={COLORS.textSecondary}
              value={newTask}
              onChangeText={setNewTask}
              onSubmitEditing={handleAddTask}
              autoFocus
            />
            <TouchableOpacity style={styles.addTaskBtn} onPress={handleAddTask}>
              <Ionicons name="checkmark" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

        {todayTasks.map(task => (
          <TouchableOpacity key={task.id} style={[styles.taskRow, task.completed && styles.taskRowDone]} onPress={() => toggleTask(task.id)}>
            <View style={[styles.taskCheck, task.completed && styles.taskCheckDone]}>
              {task.completed && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
            </View>
            <Text style={styles.taskAreaIcon}>{areaIcon(task.area)}</Text>
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>{task.title}</Text>
            </View>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor(task.priority) }]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Habits Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ Habits</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/habits')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {habits.map(habit => (
            <TouchableOpacity key={habit.id} style={[styles.habitCard, habit.completedToday && { borderColor: habit.color }]} onPress={() => toggleHabit(habit.id)}>
              <View style={[styles.habitIconBg, { backgroundColor: habit.color + '20' }, habit.completedToday && { backgroundColor: habit.color + '40' }]}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
              </View>
              <Text style={styles.habitName}>{habit.name}</Text>
              <Text style={[styles.habitStreak, { color: habit.color }]}>{habit.streak}🔥</Text>
              {habit.completedToday && <View style={styles.habitDone}><Ionicons name="checkmark-circle" size={16} color={habit.color} /></View>}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Goals Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎯 Goals</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/goals')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {goals.slice(0, 2).map(goal => (
          <View key={goal.id} style={styles.goalRow}>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalProgress}>{goal.progress}{goal.unit} / {goal.target}{goal.unit}</Text>
            </View>
            <View style={styles.goalProgressBg}>
              <View style={[styles.goalProgressFill, { width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }]} />
            </View>
          </View>
        ))}
      </View>

      {/* AI Coach Banner */}
      <TouchableOpacity style={styles.coachBanner} onPress={() => router.push('/(tabs)/coach')}>
        <Text style={styles.coachIcon}>🤖</Text>
        <View style={styles.coachContent}>
          <Text style={styles.coachTitle}>AI Life Coach</Text>
          <Text style={styles.coachSubtitle}>Get your personalized daily briefing</Text>
        </View>
        <Ionicons name="arrow-forward-circle" size={28} color={COLORS.primary} />
      </TouchableOpacity>

      {subscription.plan === 'free' && (
        <TouchableOpacity style={styles.upgradeBanner} onPress={() => router.push('/subscription')}>
          <Text style={styles.upgradeTitle}>🚀 Unlock AI Life OS Pro</Text>
          <Text style={styles.upgradeSubtitle}>Smart scheduling · Unlimited habits · $9.99/mo</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingTop: 50 },
  greeting: { fontSize: 14, color: COLORS.textSecondary },
  userName: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  date: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  focusButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, gap: 6, borderWidth: 1, borderColor: COLORS.primary + '40' },
  focusText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  scoreCard: { flexDirection: 'row', alignItems: 'center', margin: 20, marginTop: 0, backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.primary + '30' },
  scoreLeft: { flex: 1 },
  scoreLabel: { fontSize: 13, color: COLORS.textSecondary },
  scoreValue: { fontSize: 48, fontWeight: 'bold', color: COLORS.primary },
  scoreSubtitle: { fontSize: 12, color: COLORS.success },
  scoreRight: { gap: 12 },
  scoreStat: { alignItems: 'center' },
  scoreStatValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  scoreStatLabel: { fontSize: 10, color: COLORS.textSecondary },
  progressCard: { marginHorizontal: 20, marginBottom: 20, backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  progressCount: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
  progressBarBg: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  progressPercent: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, textAlign: 'right' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  addTaskRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  addTaskInput: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 10, paddingHorizontal: 14, height: 44, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  addTaskBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  taskRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8, gap: 10, borderWidth: 1, borderColor: COLORS.border },
  taskRowDone: { opacity: 0.5 },
  taskCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  taskCheckDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  taskAreaIcon: { fontSize: 18 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  taskTitleDone: { textDecorationLine: 'line-through', color: COLORS.textSecondary },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  habitCard: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, marginRight: 10, minWidth: 90, borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  habitIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  habitIcon: { fontSize: 24 },
  habitName: { fontSize: 11, color: COLORS.text, fontWeight: '600', textAlign: 'center', marginBottom: 2 },
  habitStreak: { fontSize: 11, fontWeight: '700' },
  habitDone: { position: 'absolute', top: 6, right: 6 },
  goalRow: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  goalInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  goalProgress: { fontSize: 12, color: COLORS.textSecondary },
  goalProgressBg: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  goalProgressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  coachBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: COLORS.primary + '15', borderRadius: 16, padding: 18, gap: 12, borderWidth: 1, borderColor: COLORS.primary + '40', marginBottom: 12 },
  coachIcon: { fontSize: 32 },
  coachContent: { flex: 1 },
  coachTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  coachSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  upgradeBanner: { marginHorizontal: 20, backgroundColor: COLORS.warning + '15', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.warning + '40', alignItems: 'center' },
  upgradeTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  upgradeSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});