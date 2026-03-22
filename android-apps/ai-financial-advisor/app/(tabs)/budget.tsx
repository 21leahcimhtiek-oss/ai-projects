import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/config';
import { aiFinanceService } from '../../services/ai';
import { useAppStore } from '../../store';

const BUDGET_CATEGORIES = [
  { name: 'Housing', budget: 1800, spent: 1800, icon: 'home', color: COLORS.secondary },
  { name: 'Food', budget: 600, spent: 400, icon: 'restaurant', color: '#FF9F0A' },
  { name: 'Transport', budget: 300, spent: 65, icon: 'car', color: COLORS.primary },
  { name: 'Health', budget: 200, spent: 45, icon: 'medkit', color: '#FF3B30' },
  { name: 'Entertainment', budget: 150, spent: 18, icon: 'tv', color: '#BF5AF2' },
  { name: 'Savings', budget: 1000, spent: 0, icon: 'wallet', color: COLORS.positive },
];

export default function BudgetScreen() {
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const { transactions } = useAppStore();

  const totalBudget = BUDGET_CATEGORIES.reduce((s, c) => s + c.budget, 0);
  const totalSpent = BUDGET_CATEGORIES.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudget - totalSpent;

  const analyzeWithAI = async () => {
    setLoading(true);
    try {
      const expenses: Record<string, number> = {};
      BUDGET_CATEGORIES.forEach(c => { expenses[c.name] = c.spent; });
      const analysis = await aiFinanceService.analyzeBudget(6300, expenses);
      setAiAnalysis(analysis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Monthly Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>March 2026 Budget</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Budget</Text>
            <Text style={styles.summaryValue}>${totalBudget.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={[styles.summaryValue, { color: COLORS.negative }]}>${totalSpent.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, { color: COLORS.positive }]}>${remaining.toLocaleString()}</Text>
          </View>
        </View>
        {/* Overall progress bar */}
        <View style={styles.overallBar}>
          <View style={[styles.overallBarFill, { width: `${Math.min(100, totalSpent / totalBudget * 100)}%`, backgroundColor: totalSpent > totalBudget * 0.9 ? COLORS.danger : COLORS.primary }]} />
        </View>
        <Text style={styles.overallBarLabel}>{(totalSpent / totalBudget * 100).toFixed(0)}% of budget used</Text>
      </View>

      {/* AI Analysis */}
      <TouchableOpacity style={styles.aiBtn} onPress={analyzeWithAI} disabled={loading}>
        <Ionicons name="sparkles" size={20} color={COLORS.primary} />
        <Text style={styles.aiBtnText}>{loading ? 'Analyzing...' : '🤖 AI Budget Analysis'}</Text>
        {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
      </TouchableOpacity>
      {aiAnalysis ? (
        <View style={styles.aiResult}>
          <Text style={styles.aiResultText}>{aiAnalysis}</Text>
        </View>
      ) : null}

      {/* Category Breakdown */}
      <Text style={styles.sectionTitle}>Budget Categories</Text>
      {BUDGET_CATEGORIES.map(cat => {
        const pct = cat.budget > 0 ? Math.min(100, (cat.spent / cat.budget) * 100) : 0;
        const overBudget = cat.spent > cat.budget;
        return (
          <View key={cat.name} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                <Ionicons name={cat.icon as any} size={20} color={cat.color} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryAmounts}>
                  <Text style={{ color: overBudget ? COLORS.danger : COLORS.text }}>${cat.spent}</Text>
                  <Text style={styles.categoryBudgetText}> / ${cat.budget}</Text>
                </Text>
              </View>
              <Text style={[styles.categoryPct, { color: overBudget ? COLORS.danger : COLORS.textSecondary }]}>
                {pct.toFixed(0)}%
              </Text>
            </View>
            <View style={styles.categoryBar}>
              <View style={[styles.categoryBarFill, { width: `${pct}%`, backgroundColor: overBudget ? COLORS.danger : cat.color }]} />
            </View>
          </View>
        );
      })}

      {/* Add Transaction */}
      <TouchableOpacity style={styles.addBtn}>
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={styles.addBtnText}>Log Transaction</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  summaryCard: { margin: 16, backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  summaryItem: { alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  summaryDivider: { width: 1, backgroundColor: COLORS.border },
  overallBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  overallBarFill: { height: 8, borderRadius: 4 },
  overallBarLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
  aiBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, gap: 10, borderWidth: 1, borderColor: COLORS.primary + '40' },
  aiBtnText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.primary },
  aiResult: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.primary + '10', borderRadius: 12, padding: 14 },
  aiResultText: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginBottom: 10 },
  categoryCard: { backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  categoryIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  categoryInfo: { flex: 1 },
  categoryName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  categoryAmounts: { fontSize: 13, marginTop: 2 },
  categoryBudgetText: { color: COLORS.textSecondary },
  categoryPct: { fontSize: 14, fontWeight: 'bold' },
  categoryBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  categoryBarFill: { height: 6, borderRadius: 3 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, margin: 16, borderRadius: 14, padding: 16, gap: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});