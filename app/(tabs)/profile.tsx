import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, CONFIG } from '../../constants/config';
import { useAppStore } from '../../store';

const MENU_ITEMS = [
  { icon: 'person-circle', label: 'Edit Profile', route: null, color: COLORS.primary },
  { icon: 'notifications', label: 'Notifications', route: null, color: '#FF9F0A' },
  { icon: 'heart', label: 'Health Data', route: null, color: '#FF3B30' },
  { icon: 'lock-closed', label: 'Privacy & Security', route: null, color: '#636366' },
  { icon: 'help-circle', label: 'Help & Support', route: null, color: COLORS.secondary },
  { icon: 'star', label: 'Rate the App', route: null, color: '#FFD60A' },
  { icon: 'share', label: 'Share App', route: null, color: COLORS.primary },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAppStore();

  const planColor = user?.plan === 'premium' ? '#FFD60A' : user?.plan === 'pro' ? COLORS.primary : COLORS.textSecondary;
  const planLabel = user?.plan === 'premium' ? '⭐ Premium' : user?.plan === 'pro' ? '⚡ Pro' : '🆓 Free';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Health Warrior'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'Set up your profile'}</Text>
        <View style={[styles.planBadge, { backgroundColor: planColor + '20', borderColor: planColor }]}>
          <Text style={[styles.planText, { color: planColor }]}>{planLabel}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Workouts', value: '12' },
          { label: 'Streak', value: '7d' },
          { label: 'Goal %', value: '68%' },
        ].map((stat) => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Upgrade Banner (if not premium) */}
      {user?.plan !== 'premium' && (
        <TouchableOpacity style={styles.upgradeBanner} onPress={() => router.push('/subscription')}>
          <Ionicons name="sparkles" size={20} color="#FFD60A" />
          <Text style={styles.upgradeBannerText}>
            {user?.plan === 'free' ? 'Upgrade to Pro — $9.99/mo' : 'Upgrade to Premium — $19.99/mo'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Menu */}
      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => item.route && router.push(item.route as any)}>
            <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Subscription Info */}
      <View style={styles.subCard}>
        <Text style={styles.subTitle}>Current Plan: {planLabel}</Text>
        {user?.plan === 'free' ? (
          <Text style={styles.subText}>You're on the free plan. Upgrade for unlimited AI coaching.</Text>
        ) : (
          <Text style={styles.subText}>Thank you for being a valued subscriber! ❤️</Text>
        )}
        <TouchableOpacity style={styles.manageSubBtn} onPress={() => router.push('/subscription')}>
          <Text style={styles.manageSubBtnText}>Manage Subscription</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ])}>
        <Ionicons name="log-out" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>AI Health Coach v{CONFIG.APP_VERSION} · Made with ❤️ by Aurora Raye</Text>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: { backgroundColor: COLORS.surface, padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  planBadge: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  planText: { fontSize: 13, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center', padding: 16 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  upgradeBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, margin: 16, borderRadius: 14, padding: 16, gap: 10 },
  upgradeBannerText: { flex: 1, color: '#fff', fontWeight: '600', fontSize: 15 },
  menuSection: { backgroundColor: COLORS.surface, margin: 16, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, color: COLORS.text },
  subCard: { backgroundColor: COLORS.surface, margin: 16, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  subTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 },
  subText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 14 },
  manageSubBtn: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, padding: 12, alignItems: 'center' },
  manageSubBtnText: { color: COLORS.primary, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, padding: 14, borderRadius: 14, backgroundColor: COLORS.error + '10', gap: 8 },
  logoutText: { color: COLORS.error, fontWeight: '600', fontSize: 16 },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
});