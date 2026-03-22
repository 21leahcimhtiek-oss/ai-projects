import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS, SUBSCRIPTION_PLANS } from '../../constants/config';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, subscription, setSubscription } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [marketAlerts, setMarketAlerts] = useState(false);

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan) || SUBSCRIPTION_PLANS[0];

  const financialStats = [
    { label: 'Net Worth', value: '$47,850', icon: 'trending-up', color: COLORS.primary },
    { label: 'Monthly Savings', value: '$1,240', icon: 'wallet', color: '#4CAF50' },
    { label: 'Investments', value: '$23,450', icon: 'bar-chart', color: '#2196F3' },
    { label: 'Credit Score', value: '742', icon: 'shield-checkmark', color: '#FF9800' },
  ];

  const menuItems = [
    { icon: 'person-outline', label: 'Personal Information', action: () => {} },
    { icon: 'card-outline', label: 'Connected Accounts', action: () => {} },
    { icon: 'document-text-outline', label: 'Financial Reports', action: () => {} },
    { icon: 'shield-outline', label: 'Security & Privacy', action: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', action: () => {} },
    { icon: 'star-outline', label: 'Rate the App', action: () => {} },
  ];

  const getPlanBadgeColor = () => {
    if (subscription.plan === 'premium') return '#FFD700';
    if (subscription.plan === 'pro') return COLORS.primary;
    return COLORS.textSecondary;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={[styles.planBadge, { backgroundColor: getPlanBadgeColor() }]}>
            <Text style={styles.planBadgeText}>{currentPlan.name}</Text>
          </View>
        </View>
        <Text style={styles.userName}>{userProfile.name || 'User'}</Text>
        <Text style={styles.userEmail}>{userProfile.email || 'user@example.com'}</Text>
        <Text style={styles.memberSince}>Member since January 2024</Text>
      </View>

      {/* Financial Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.statsGrid}>
          {financialStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Subscription Card */}
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <View>
            <Text style={styles.subscriptionTitle}>
              {currentPlan.name} Plan
            </Text>
            <Text style={styles.subscriptionPrice}>
              {currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}/month`}
            </Text>
          </View>
          <Ionicons
            name={subscription.plan === 'premium' ? 'diamond' : subscription.plan === 'pro' ? 'rocket' : 'leaf'}
            size={32}
            color={getPlanBadgeColor()}
          />
        </View>

        {subscription.plan !== 'premium' && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => router.push('/subscription')}
          >
            <Ionicons name="arrow-up-circle" size={18} color={COLORS.white} />
            <Text style={styles.upgradeButtonText}>
              Upgrade for More Features
            </Text>
          </TouchableOpacity>
        )}

        {subscription.plan !== 'free' && (
          <View style={styles.subscriptionFeatures}>
            {currentPlan.features.slice(0, 3).map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }}
              thumbColor={notifications ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
          <View style={styles.settingDivider} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Weekly Report</Text>
            </View>
            <Switch
              value={weeklyReport}
              onValueChange={setWeeklyReport}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }}
              thumbColor={weeklyReport ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
          <View style={styles.settingDivider} />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="trending-up-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Market Alerts</Text>
            </View>
            <Switch
              value={marketAlerts}
              onValueChange={setMarketAlerts}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '60' }}
              thumbColor={marketAlerts ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity style={styles.menuItem} onPress={item.action}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.settingDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Achievement Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { icon: '🎯', label: 'Budget Master', earned: true },
            { icon: '💰', label: 'Saver Pro', earned: true },
            { icon: '📈', label: 'Investor', earned: false },
            { icon: '🏆', label: 'Debt Free', earned: false },
            { icon: '🔥', label: '30-Day Streak', earned: true },
          ].map((badge, i) => (
            <View key={i} style={[styles.badge, !badge.earned && styles.badgeLocked]}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={[styles.badgeLabel, !badge.earned && styles.badgeLabelLocked]}>
                {badge.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/(auth)') },
          ])}
        >
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
  header: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  planBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  planBadgeText: { fontSize: 10, fontWeight: 'bold', color: COLORS.white },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  memberSince: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statsContainer: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  subscriptionCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  subscriptionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  subscriptionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  subscriptionPrice: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  upgradeButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  subscriptionFeatures: { marginTop: 12, gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: COLORS.textSecondary },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 14, color: COLORS.text },
  settingDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemLabel: { fontSize: 14, color: COLORS.text },
  badge: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    minWidth: 80,
  },
  badgeLocked: { opacity: 0.4, borderColor: COLORS.border },
  badgeIcon: { fontSize: 28, marginBottom: 4 },
  badgeLabel: { fontSize: 11, color: COLORS.text, textAlign: 'center', fontWeight: '600' },
  badgeLabelLocked: { color: COLORS.textSecondary },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error + '15',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  signOutText: { fontSize: 16, fontWeight: '600', color: COLORS.error },
});