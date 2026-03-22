import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, SUBSCRIPTION_PLANS, LIFE_AREAS } from '../../constants/config';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, subscription, streakDays, lifeScore, goals, habits } = useAppStore();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [morningBriefing, setMorningBriefing] = useState(true);

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan) || SUBSCRIPTION_PLANS[0];
  const planColor = subscription.plan === 'premium' ? COLORS.gold : subscription.plan === 'pro' ? COLORS.primary : COLORS.textSecondary;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}</Text>
        </View>
        <Text style={styles.userName}>{userProfile.name || 'User'}</Text>
        <Text style={styles.userEmail}>{userProfile.email || 'user@example.com'}</Text>
        <View style={[styles.planBadge, { backgroundColor: planColor }]}>
          <Ionicons name={subscription.plan === 'premium' ? 'diamond' : subscription.plan === 'pro' ? 'rocket' : 'leaf'} size={12} color={COLORS.white} />
          <Text style={styles.planBadgeText}>{currentPlan.name} Plan</Text>
        </View>
      </View>

      {/* Life Score */}
      <View style={styles.lifeScoreCard}>
        <Text style={styles.lifeScoreLabel}>Your Life Score</Text>
        <Text style={styles.lifeScoreValue}>{lifeScore}/100</Text>
        <View style={styles.lifeAreas}>
          {LIFE_AREAS.slice(0, 4).map((area) => (
            <View key={area.id} style={styles.lifeAreaItem}>
              <Text style={styles.lifeAreaIcon}>{area.icon}</Text>
              <Text style={styles.lifeAreaName}>{area.name.split(' ')[0]}</Text>
              <View style={styles.lifeAreaBarBg}>
                <View style={[styles.lifeAreaBarFill, { width: `${60 + Math.random() * 30}%`, backgroundColor: area.color }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: `${streakDays}🔥`, label: 'Day Streak' },
          { value: `${goals.length}`, label: 'Active Goals' },
          { value: `${habits.filter(h => h.completedToday).length}/${habits.length}`, label: 'Habits Today' },
          { value: `${habits.reduce((s, h) => s + h.streak, 0)}`, label: 'Total Streaks' },
        ].map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Upgrade */}
      {subscription.plan !== 'premium' && (
        <TouchableOpacity style={styles.upgradeCard} onPress={() => router.push('/subscription')}>
          <View>
            <Text style={styles.upgradeTitle}>🚀 Upgrade to {subscription.plan === 'free' ? 'Pro' : 'Premium'}</Text>
            <Text style={styles.upgradeSubtitle}>{subscription.plan === 'free' ? 'Unlock AI life coach · $9.99/mo' : 'Vision board + OKRs · $19.99/mo'}</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color={COLORS.warning} />
        </TouchableOpacity>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {[
            { icon: 'moon-outline', label: 'Dark Mode', value: darkMode, setter: setDarkMode },
            { icon: 'notifications-outline', label: 'Notifications', value: notifications, setter: setNotifications },
            { icon: 'sunny-outline', label: 'Morning Briefing', value: morningBriefing, setter: setMorningBriefing },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name={s.icon as any} size={20} color={COLORS.primary} />
                  <Text style={styles.settingLabel}>{s.label}</Text>
                </View>
                <Switch value={s.value} onValueChange={s.setter} trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }} thumbColor={s.value ? COLORS.primary : COLORS.textSecondary} />
              </View>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsCard}>
          {[
            { icon: 'person-outline', label: 'Edit Profile' },
            { icon: 'sync-outline', label: 'Sync & Integrations' },
            { icon: 'analytics-outline', label: 'Life Analytics' },
            { icon: 'download-outline', label: 'Export Data' },
            { icon: 'help-circle-outline', label: 'Help & Support' },
            { icon: 'star-outline', label: 'Rate AI Life OS' },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={styles.menuRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutBtn} onPress={() => Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/(auth)') }])}>
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
  header: { alignItems: 'center', paddingVertical: 32, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  planBadgeText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
  lifeScoreCard: { margin: 20, backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.primary + '30' },
  lifeScoreLabel: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  lifeScoreValue: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 16 },
  lifeAreas: { gap: 8 },
  lifeAreaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lifeAreaIcon: { fontSize: 16, width: 24 },
  lifeAreaName: { fontSize: 12, color: COLORS.textSecondary, width: 60 },
  lifeAreaBarBg: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  lifeAreaBarFill: { height: '100%', borderRadius: 3 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.surface, padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  upgradeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 20, backgroundColor: COLORS.warning + '15', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.warning + '40' },
  upgradeTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  upgradeSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  settingsCard: { backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 14, color: COLORS.text },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.error + '15', borderRadius: 12, padding: 16, gap: 8, borderWidth: 1, borderColor: COLORS.error + '30' },
  signOutText: { fontSize: 16, fontWeight: '600', color: COLORS.error },
});