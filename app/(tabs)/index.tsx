import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, SUBJECTS } from '../../constants/config';

export default function DashboardScreen() {
  const router = useRouter();
  const { userProfile, subscription, streakDays, totalPoints, studySessions, flashCards } = useAppStore();

  const masteredCards = flashCards.filter(c => c.mastered).length;
  const studyStats = [
    { label: 'Day Streak', value: `${streakDays}🔥`, color: '#FF6584' },
    { label: 'Total Points', value: `${totalPoints}⭐`, color: COLORS.gold },
    { label: 'Cards Mastered', value: `${masteredCards}/${flashCards.length}`, color: COLORS.accent },
    { label: 'Sessions', value: `${studySessions.length + 12}`, color: COLORS.primary },
  ];

  const quickActions = [
    { icon: 'chatbubble-ellipses', label: 'Ask AI Tutor', color: COLORS.primary, action: () => router.push('/(tabs)/chat') },
    { icon: 'layers', label: 'Flashcards', color: '#FF6584', action: () => router.push('/(tabs)/flashcards') },
    { icon: 'help-circle', label: 'Take Quiz', color: '#43E97B', action: () => router.push('/quiz') },
    { icon: 'create', label: 'Grade Essay', color: '#FFB347', action: () => router.push('/(tabs)/chat') },
  ];

  const recentSubjects = SUBJECTS.slice(0, 4);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.userName}>{userProfile.name || 'Student'}</Text>
          <Text style={styles.subtitle}>Ready to learn something new today?</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Streak Banner */}
      <View style={styles.streakBanner}>
        <View style={styles.streakLeft}>
          <Text style={styles.streakFire}>🔥</Text>
          <View>
            <Text style={styles.streakTitle}>{streakDays}-Day Learning Streak!</Text>
            <Text style={styles.streakSubtitle}>Study today to keep it going</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.streakButton} onPress={() => router.push('/(tabs)/chat')}>
          <Text style={styles.streakButtonText}>Study Now</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {studyStats.map((stat, i) => (
          <View key={i} style={[styles.statCard, { borderColor: stat.color + '40' }]}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionCard} onPress={action.action}>
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Goal */}
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>📚 Today's Goal</Text>
          <Text style={styles.goalProgress}>2/3 complete</Text>
        </View>
        {[
          { task: 'Review Math flashcards', done: true },
          { task: 'Complete Science quiz', done: true },
          { task: 'Ask AI tutor 5 questions', done: false },
        ].map((item, i) => (
          <View key={i} style={styles.goalItem}>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={item.done ? COLORS.success : COLORS.textSecondary}
            />
            <Text style={[styles.goalText, item.done && styles.goalTextDone]}>{item.task}</Text>
          </View>
        ))}
      </View>

      {/* Recent Subjects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/subjects')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentSubjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[styles.subjectCard, { borderColor: subject.color + '40' }]}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <Text style={styles.subjectIcon}>{subject.icon}</Text>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <View style={[styles.subjectBadge, { backgroundColor: subject.color + '20' }]}>
                <Text style={[styles.subjectLevel, { color: subject.color }]}>Active</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Upgrade Banner */}
      {subscription.plan === 'free' && (
        <TouchableOpacity style={styles.upgradeBanner} onPress={() => router.push('/subscription')}>
          <View>
            <Text style={styles.upgradeTitle}>🚀 Unlock Pro Features</Text>
            <Text style={styles.upgradeSubtitle}>Unlimited AI tutoring + SAT prep · $7.99/mo</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color={COLORS.gold} />
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
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  notifButton: { padding: 8, backgroundColor: COLORS.surface, borderRadius: 12 },
  streakBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    margin: 20, marginTop: 0, backgroundColor: COLORS.primary + '20',
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakFire: { fontSize: 32 },
  streakTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  streakSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  streakButton: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  streakButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, marginBottom: 8 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 14, alignItems: 'center', borderWidth: 1,
  },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  section: { padding: 20, paddingTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, borderRadius: 14,
    padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: 13, color: COLORS.text, fontWeight: '600', textAlign: 'center' },
  goalCard: {
    margin: 20, marginTop: 4, backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 18, borderWidth: 1, borderColor: COLORS.border,
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  goalTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  goalProgress: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  goalItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  goalText: { fontSize: 14, color: COLORS.text },
  goalTextDone: { color: COLORS.textSecondary, textDecorationLine: 'line-through' },
  subjectCard: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 16,
    alignItems: 'center', marginRight: 12, minWidth: 110, borderWidth: 1,
  },
  subjectIcon: { fontSize: 32, marginBottom: 8 },
  subjectName: { fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  subjectBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  subjectLevel: { fontSize: 10, fontWeight: '700' },
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    margin: 20, marginTop: 4, backgroundColor: COLORS.gold + '15',
    borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.gold + '40',
  },
  upgradeTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  upgradeSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});