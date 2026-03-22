import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/config';
import { aiFinanceService } from '../../services/ai';

const PORTFOLIO = [
  { asset: 'US Stocks (VTI)', allocation: 40, value: 18000, change: +2.4, color: COLORS.primary },
  { asset: 'Int\'l Stocks (VXUS)', allocation: 20, value: 9000, change: +1.1, color: COLORS.secondary },
  { asset: 'Bonds (BND)', allocation: 20, value: 9000, change: -0.3, color: '#FF9F0A' },
  { asset: 'Real Estate (VNQ)', allocation: 10, value: 4500, change: +0.8, color: '#BF5AF2' },
  { asset: 'Crypto (BTC/ETH)', allocation: 10, value: 4500, change: +5.2, color: '#F7931A' },
];

const MARKET_DATA = [
  { symbol: 'S&P 500', value: '5,248.32', change: '+0.87%', up: true },
  { symbol: 'NASDAQ', value: '16,384.47', change: '+1.24%', up: true },
  { symbol: 'BTC', value: '$68,450', change: '-2.14%', up: false },
  { symbol: 'Gold', value: '$2,340', change: '+0.32%', up: true },
];

export default function InvestScreen() {
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const totalValue = PORTFOLIO.reduce((s, a) => s + a.value, 0);

  const analyzePortfolio = async () => {
    setLoading(true);
    try {
      const portfolioData: Record<string, number> = {};
      PORTFOLIO.forEach(a => { portfolioData[a.asset] = a.allocation; });
      const insight = await aiFinanceService.analyzeInvestments(portfolioData);
      setAiInsight(insight);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Portfolio Summary */}
      <View style={styles.portfolioCard}>
        <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
        <Text style={styles.portfolioValue}>${totalValue.toLocaleString()}</Text>
        <View style={styles.portfolioChange}>
          <Ionicons name="trending-up" size={16} color={COLORS.positive} />
          <Text style={styles.portfolioChangeText}>+$1,240 (2.8%) this month</Text>
        </View>
      </View>

      {/* Market Overview */}
      <Text style={styles.sectionTitle}>Market Overview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.marketRow}>
        {MARKET_DATA.map(m => (
          <View key={m.symbol} style={styles.marketCard}>
            <Text style={styles.marketSymbol}>{m.symbol}</Text>
            <Text style={styles.marketValue}>{m.value}</Text>
            <Text style={[styles.marketChange, { color: m.up ? COLORS.positive : COLORS.negative }]}>{m.change}</Text>
          </View>
        ))}
      </ScrollView>

      {/* AI Portfolio Analysis */}
      <TouchableOpacity style={styles.aiBtn} onPress={analyzePortfolio} disabled={loading}>
        <Ionicons name="sparkles" size={20} color="#fff" />
        <Text style={styles.aiBtnText}>{loading ? 'Analyzing Portfolio...' : '🤖 AI Portfolio Analysis'}</Text>
        {loading && <ActivityIndicator size="small" color="#fff" />}
      </TouchableOpacity>
      {aiInsight ? (
        <View style={styles.aiResult}>
          <Text style={styles.aiResultText}>{aiInsight}</Text>
        </View>
      ) : null}

      {/* Asset Allocation */}
      <Text style={styles.sectionTitle}>Asset Allocation</Text>
      {PORTFOLIO.map(asset => (
        <View key={asset.asset} style={styles.assetCard}>
          <View style={[styles.assetDot, { backgroundColor: asset.color }]} />
          <View style={styles.assetInfo}>
            <Text style={styles.assetName}>{asset.asset}</Text>
            <View style={styles.assetBar}>
              <View style={[styles.assetBarFill, { width: `${asset.allocation}%`, backgroundColor: asset.color }]} />
            </View>
          </View>
          <View style={styles.assetValues}>
            <Text style={styles.assetValue}>${asset.value.toLocaleString()}</Text>
            <Text style={[styles.assetChange, { color: asset.change >= 0 ? COLORS.positive : COLORS.negative }]}>
              {asset.change >= 0 ? '+' : ''}{asset.change}%
            </Text>
          </View>
          <Text style={styles.assetAlloc}>{asset.allocation}%</Text>
        </View>
      ))}

      {/* Investment Strategies */}
      <Text style={styles.sectionTitle}>Investment Strategies</Text>
      {[
        { title: 'Dollar Cost Averaging', desc: 'Invest fixed amounts regularly regardless of market conditions', icon: 'calendar', color: COLORS.primary },
        { title: 'Index Fund Investing', desc: 'Low-cost passive investing that beats most active managers', icon: 'trending-up', color: COLORS.secondary },
        { title: 'Dividend Reinvestment', desc: 'Compound your returns by reinvesting dividend payments', icon: 'refresh', color: COLORS.positive },
      ].map(s => (
        <View key={s.title} style={styles.strategyCard}>
          <View style={[styles.strategyIcon, { backgroundColor: s.color + '15' }]}>
            <Ionicons name={s.icon as any} size={22} color={s.color} />
          </View>
          <View style={styles.strategyInfo}>
            <Text style={styles.strategyTitle}>{s.title}</Text>
            <Text style={styles.strategyDesc}>{s.desc}</Text>
          </View>
        </View>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  portfolioCard: { margin: 16, backgroundColor: COLORS.primary, borderRadius: 20, padding: 24, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  portfolioLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  portfolioValue: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  portfolioChange: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  portfolioChangeText: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginBottom: 10, marginTop: 4 },
  marketRow: { paddingLeft: 16, marginBottom: 8 },
  marketCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginRight: 10, minWidth: 110, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  marketSymbol: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  marketValue: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 },
  marketChange: { fontSize: 13, fontWeight: '600' },
  aiBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, marginHorizontal: 16, marginBottom: 8, borderRadius: 14, padding: 14, gap: 8 },
  aiBtnText: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  aiResult: { marginHorizontal: 16, marginBottom: 12, backgroundColor: COLORS.primary + '10', borderRadius: 12, padding: 14 },
  aiResultText: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  assetCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, gap: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  assetDot: { width: 12, height: 12, borderRadius: 6 },
  assetInfo: { flex: 1 },
  assetName: { fontSize: 13, fontWeight: '500', color: COLORS.text, marginBottom: 6 },
  assetBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  assetBarFill: { height: 4, borderRadius: 2 },
  assetValues: { alignItems: 'flex-end', marginRight: 8 },
  assetValue: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  assetChange: { fontSize: 12, fontWeight: '600' },
  assetAlloc: { fontSize: 14, fontWeight: 'bold', color: COLORS.textSecondary, width: 35, textAlign: 'right' },
  strategyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 14, gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  strategyIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  strategyInfo: { flex: 1 },
  strategyTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 3 },
  strategyDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
});