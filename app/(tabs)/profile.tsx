import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, SUBSCRIPTION_PLANS } from '../../constants/config';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, subscription, streakDays, totalPoints, flashCards, studySessions } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan) || SUBSCRIPTION_PLANS[0];
  const masteredCards = flashCards.filter(c => c.mastered).length;

  const achievements = [
    { icon: '🔥', label: `${streakDays} Day Streak`, earned: streakDays >= 7 },
    { icon: '⭐', label: '1000 Points', earned: totalPoints >= 1000 },
    { icon: '🃏', label: 'Card Master', earned: masteredCards >= 5 },
    { icon: '🧠', label: 'Quick Learner', earned: true },
    { icon: '📚', label: 'Book Worm', earned: false },
    { icon: '🏆', label: 'Top Student', earned: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userProfile.name ? userProfile.name[0].toUpperCase() : 'S'}</Text>
        </View>
        <Text style={styles.userName}>{userProfile.name || 'Student'}</Text>
        <Text style={styles.userEmail}>{userProfile.email || 'student@example.com'}</Text>
        <View style={[styles.planBadge, { backgroundColor: subscription.plan === 'premium' ? '#FFD700' : subscription.plan === 'pro' ? COLORS.primary : COLORS.textSecondary }]}>
          <Ionicons name={subscription.plan === 'premium' ? 'diamond' : subscription.plan === 'pro' ? 'rocket' : 'leaf'} size={12} color={COLORS.white} />
          <Text style={styles.planBadgeText}>{currentPlan.name} Plan</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: `${streakDays}🔥`, label: 'Day Streak' },
          { value: `${totalPoints}`, label: 'Points' },
          { value: `${masteredCards}`, label: 'Cards Mastered' },
          { value: `${studySessions.length + 12}`, label: 'Sessions' },
        ].map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Upgrade Banner */}
      {subscription.plan !== 'premium' && (
        <TouchableOpacity style={styles.upgradeCard} onPress={() => router.push('/subscription')}>
          <View>
            <Text style={styles.upgradeTitle}>🚀 Upgrade to {subscription.plan === 'free' ? 'Pro' : 'Premium'}</Text>
            <Text style={styles.upgradeSubtitle}>
              {subscription.plan === 'free' ? 'Unlock unlimited AI tutoring · $7.99/mo' : 'SAT prep + live sessions · $14.99/mo'}
            </Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color={COLORS.gold} />
        </TouchableOpacity>
      )}

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((a, i) => (
            <View key={i} style={[styles.achievementCard, !a.earned && styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>{a.icon}</Text>
              <Text style={[styles.achievementLabel, !a.earned && styles.achievementLabelLocked]}>{a.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {[
            { icon: 'notifications-outline', label: 'Push Notifications', value: notifications, setter: setNotifications },
            { icon: 'alarm-outline', label: 'Daily Study Reminder', value: dailyReminder, setter: setDailyReminder },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name={s.icon as any} size={20} color={COLORS.primary} />
                  <Text style={styles.settingLabel}>{s.label}</Text>
                </View>
                <Switch value={s.value} onValueChange={s.setter} trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }} thumbColor={s.value ? COLORS.primary : COLORS.textSecondary} />
              </View>
              {i === 0 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <View style={styles.settingsCard}>
          {[
            { icon: 'person-outline', label: 'Edit Profile' },
            { icon: 'school-outline', label: 'Learning Preferences' },
            { icon: 'bar-chart-outline', label: 'Study Analytics' },
            { icon: 'help-circle-outline', label: 'Help & Support' },
            { icon: 'star-outline', label: 'Rate the App' },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={() => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/(auth)') }])}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  planBadgeText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.surface, padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  upgradeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 20, backgroundColor: COLORS.gold + '15', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.gold + '40' },
  upgradeTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  upgradeSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementCard: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.primary + '40', minWidth: '30%', flex: 1 },
  achievementLocked: { opacity: 0.35, borderColor: COLORS.border },
  achievementIcon: { fontSize: 28, marginBottom: 4 },
  achievementLabel: { fontSize: 11, color: COLORS.text, fontWeight: '600', textAlign: 'center' },
  achievementLabelLocked: { color: COLORS.textSecondary },
  settingsCard: { backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 14, color: COLORS.text },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: { fontSize: 14, color: COLORS.text },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.error + '15', borderRadius: 12, padding: 16, gap: 8, borderWidth: 1, borderColor: COLORS.error + '30' },
  signOutText: { fontSize: 16, fontWeight: '600', color: COLORS.error },
});