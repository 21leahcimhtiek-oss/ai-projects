import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/config';
import { useAppStore } from '../../store';

const { width } = Dimensions.get('window');

const MetricCard = ({ icon, label, value, unit, color }: any) => (
  <View style={[styles.metricCard, { borderLeftColor: color }]}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricUnit}>{unit}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

export default function Dashboard() {
  const router = useRouter();
  const { user, metrics } = useAppStore();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const healthScore = Math.min(100, Math.round(
    (metrics.steps / 10000) * 25 +
    (metrics.water / 8) * 20 +
    (metrics.sleep / 8) * 25 +
    30
  ));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()}, {user?.name || 'User'} 👋</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/subscription')} style={styles.upgradeBtn}>
          <Text style={styles.upgradeBtnText}>⚡ Pro</Text>
        </TouchableOpacity>
      </View>

      {/* Health Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Health Score</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{healthScore}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <Text style={styles.scoreLabel}>
          {healthScore >= 80 ? '🌟 Excellent' : healthScore >= 60 ? '💪 Good' : '🎯 Keep Going'}
        </Text>
      </View>

      {/* Quick AI Action */}
      <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/(tabs)/chat')}>
        <View style={styles.aiCardContent}>
          <Ionicons name="sparkles" size={32} color={COLORS.primary} />
          <View style={styles.aiCardText}>
            <Text style={styles.aiCardTitle}>Chat with AI Coach</Text>
            <Text style={styles.aiCardSubtitle}>Get personalized health advice instantly</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </View>
      </TouchableOpacity>

      {/* Today's Metrics */}
      <Text style={styles.sectionTitle}>Today's Metrics</Text>
      <View style={styles.metricsGrid}>
        <MetricCard icon="footsteps" label="Steps" value={metrics.steps.toLocaleString()} unit="steps" color={COLORS.primary} />
        <MetricCard icon="flame" label="Calories" value={metrics.calories} unit="kcal" color={COLORS.accent} />
        <MetricCard icon="water" label="Water" value={metrics.water} unit="glasses" color="#5AC8FA" />
        <MetricCard icon="moon" label="Sleep" value={metrics.sleep} unit="hours" color="#BF5AF2" />
        <MetricCard icon="heart" label="Heart Rate" value={metrics.heartRate || '—'} unit="bpm" color="#FF3B30" />
        <MetricCard icon="fitness" label="Weight" value={metrics.weight || '—'} unit="kg" color={COLORS.secondary} />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        {[
          { icon: 'restaurant', label: 'Log Meal', color: COLORS.secondary, route: '/(tabs)/nutrition' },
          { icon: 'barbell', label: 'Start Workout', color: COLORS.primary, route: '/(tabs)/workouts' },
          { icon: 'bed', label: 'Log Sleep', color: '#BF5AF2', route: null },
          { icon: 'analytics', label: 'View Reports', color: COLORS.accent, route: null },
        ].map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.quickAction}
            onPress={() => action.route && router.push(action.route as any)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
              <Ionicons name={action.icon as any} size={24} color={action.color} />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pro Upsell Banner */}
      {user?.plan === 'free' && (
        <TouchableOpacity style={styles.proBanner} onPress={() => router.push('/subscription')}>
          <Text style={styles.proBannerTitle}>🚀 Unlock AI Health Coach Pro</Text>
          <Text style={styles.proBannerText}>Get unlimited AI consultations, meal plans & workout programs for just $9.99/mo</Text>
          <View style={styles.proBannerBtn}>
            <Text style={styles.proBannerBtnText}>Start Free Trial →</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: COLORS.surface },
  greeting: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  date: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  upgradeBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  upgradeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  scoreCard: { margin: 16, backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  scoreTitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 12 },
  scoreCircle: { flexDirection: 'row', alignItems: 'flex-end' },
  scoreNumber: { fontSize: 64, fontWeight: 'bold', color: COLORS.primary },
  scoreMax: { fontSize: 20, color: COLORS.textSecondary, marginBottom: 12 },
  scoreLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginTop: 8 },
  aiCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: COLORS.primary + '15', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.primary + '30' },
  aiCardContent: { flexDirection: 'row', alignItems: 'center' },
  aiCardText: { flex: 1, marginLeft: 12 },
  aiCardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  aiCardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginBottom: 12, marginTop: 8 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  metricCard: { width: (width - 48) / 3, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, margin: 4, borderLeftWidth: 3, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
  metricUnit: { fontSize: 10, color: COLORS.textSecondary },
  metricLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 16 },
  quickAction: { width: (width - 48) / 4, alignItems: 'center', padding: 8 },
  quickActionIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  quickActionLabel: { fontSize: 11, color: COLORS.text, textAlign: 'center' },
  proBanner: { marginHorizontal: 16, backgroundColor: COLORS.primary, borderRadius: 16, padding: 20 },
  proBannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  proBannerText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 20 },
  proBannerBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginTop: 12, alignItems: 'center' },
  proBannerBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 15 },
});