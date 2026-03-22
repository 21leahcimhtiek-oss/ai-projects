import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, CONFIG } from '../../constants/config';
import { useAppStore } from '../../store';

const { width } = Dimensions.get('window');

export default function FinancialDashboard() {
  const router = useRouter();
  const { transactions, profile } = useAppStore();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

  const expensesByCategory: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Math.abs(t.amount);
  });

  const topExpenses = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const netWorth = 45000; // demo

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Financial Overview</Text>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/subscription')} style={styles.proBtn}>
          <Text style={styles.proBtnText}>⚡ Pro</Text>
        </TouchableOpacity>
      </View>

      {/* Net Worth Card */}
      <View style={styles.netWorthCard}>
        <Text style={styles.netWorthLabel}>Net Worth</Text>
        <Text style={styles.netWorthValue}>${netWorth.toLocaleString()}</Text>
        <View style={styles.netWorthChange}>
          <Ionicons name="trending-up" size={16} color={COLORS.positive} />
          <Text style={styles.netWorthChangeText}>+$2,340 this month</Text>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { borderTopColor: COLORS.positive }]}>
          <Text style={styles.metricLabel}>Income</Text>
          <Text style={[styles.metricValue, { color: COLORS.positive }]}>${totalIncome.toLocaleString()}</Text>
        </View>
        <View style={[styles.metricCard, { borderTopColor: COLORS.negative }]}>
          <Text style={styles.metricLabel}>Expenses</Text>
          <Text style={[styles.metricValue, { color: COLORS.negative }]}>${totalExpenses.toLocaleString()}</Text>
        </View>
        <View style={[styles.metricCard, { borderTopColor: COLORS.primary }]}>
          <Text style={styles.metricLabel}>Saved</Text>
          <Text style={[styles.metricValue, { color: COLORS.primary }]}>{savingsRate}%</Text>
        </View>
      </View>

      {/* AI Quick Insights */}
      <TouchableOpacity style={styles.aiCard} onPress={() => router.push('/(tabs)/chat')}>
        <View style={styles.aiCardLeft}>
          <Ionicons name="sparkles" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.aiCardContent}>
          <Text style={styles.aiCardTitle}>💡 AI Financial Insight</Text>
          <Text style={styles.aiCardText}>You're spending 24% on housing. Ask your AI advisor how to optimize your finances.</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Spending Breakdown */}
      <Text style={styles.sectionTitle}>Top Spending Categories</Text>
      <View style={styles.spendingCard}>
        {topExpenses.map(([category, amount]) => {
          const pct = totalExpenses > 0 ? (amount / totalExpenses * 100).toFixed(0) : '0';
          const colors = [COLORS.primary, COLORS.secondary, '#FF9F0A', COLORS.danger];
          const idx = topExpenses.findIndex(([c]) => c === category);
          return (
            <View key={category} style={styles.spendingRow}>
              <View style={[styles.spendingDot, { backgroundColor: colors[idx % colors.length] }]} />
              <Text style={styles.spendingCategory}>{category}</Text>
              <View style={styles.spendingBarContainer}>
                <View style={[styles.spendingBar, { width: `${pct}%`, backgroundColor: colors[idx % colors.length] }]} />
              </View>
              <Text style={styles.spendingAmount}>${amount}</Text>
            </View>
          );
        })}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        {[
          { icon: 'calculator', label: 'Debt Planner', color: COLORS.danger, route: '/debt-planner' },
          { icon: 'trending-up', label: 'Invest', color: COLORS.primary, route: '/(tabs)/invest' },
          { icon: 'receipt', label: 'Budget', color: '#FF9F0A', route: '/(tabs)/budget' },
          { icon: 'shield-checkmark', label: 'Tax Tips', color: COLORS.secondary, route: '/(tabs)/chat' },
        ].map((action) => (
          <TouchableOpacity key={action.label} style={styles.quickAction} onPress={() => router.push(action.route as any)}>
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
              <Ionicons name={action.icon as any} size={24} color={action.color} />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <View style={styles.transactionsCard}>
        {transactions.slice(0, 5).map((tx) => (
          <View key={tx.id} style={styles.transactionRow}>
            <View style={[styles.txIcon, { backgroundColor: tx.type === 'income' ? COLORS.positive + '20' : COLORS.danger + '20' }]}>
              <Ionicons name={tx.type === 'income' ? 'arrow-down' : 'arrow-up'} size={16} color={tx.type === 'income' ? COLORS.positive : COLORS.danger} />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txDescription}>{tx.description}</Text>
              <Text style={styles.txCategory}>{tx.category} · {tx.date}</Text>
            </View>
            <Text style={[styles.txAmount, { color: tx.type === 'income' ? COLORS.positive : COLORS.danger }]}>
              {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount)}
            </Text>
          </View>
        ))}
      </View>

      {/* Upsell Banner */}
      {profile.plan === 'free' && (
        <TouchableOpacity style={styles.upsellBanner} onPress={() => router.push('/subscription')}>
          <Text style={styles.upsellTitle}>🚀 Unlock AI Financial Advisor Pro</Text>
          <Text style={styles.upsellText}>Get personalized investment analysis, tax strategies & retirement planning for just $14.99/mo</Text>
          <View style={styles.upsellBtn}><Text style={styles.upsellBtnText}>Start Free Trial →</Text></View>
        </TouchableOpacity>
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: COLORS.surface },
  headerGreeting: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  headerDate: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  proBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  proBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  netWorthCard: { margin: 16, backgroundColor: COLORS.primary, borderRadius: 20, padding: 24, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  netWorthLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  netWorthValue: { fontSize: 42, fontWeight: 'bold', color: '#fff' },
  netWorthChange: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  netWorthChangeText: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  metricsRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  metricCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, borderTopWidth: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  metricLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  metricValue: { fontSize: 20, fontWeight: 'bold' },
  aiCard: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.primary + '30', gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  aiCardLeft: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  aiCardContent: { flex: 1 },
  aiCardTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 3 },
  aiCardText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginBottom: 10, marginTop: 4 },
  spendingCard: { backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 8 },
  spendingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  spendingDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  spendingCategory: { width: 80, fontSize: 13, color: COLORS.text },
  spendingBarContainer: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginHorizontal: 8 },
  spendingBar: { height: 6, borderRadius: 3 },
  spendingAmount: { width: 45, fontSize: 13, color: COLORS.text, textAlign: 'right' },
  quickActions: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 8 },
  quickAction: { flex: 1, alignItems: 'center', padding: 8 },
  quickActionIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  quickActionLabel: { fontSize: 11, color: COLORS.text, textAlign: 'center' },
  transactionsCard: { backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: 14, padding: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 16 },
  transactionRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txDescription: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  txCategory: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: 'bold' },
  upsellBanner: { margin: 16, backgroundColor: COLORS.primary, borderRadius: 16, padding: 20 },
  upsellTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  upsellText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 18, marginBottom: 14 },
  upsellBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center' },
  upsellBtnText: { color: COLORS.primary, fontWeight: 'bold' },
});