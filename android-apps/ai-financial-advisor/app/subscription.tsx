import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store';
import { COLORS, SUBSCRIPTION_PLANS } from '../constants/config';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { subscription, setSubscription } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState(subscription.plan || 'pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = () => {
    if (selectedPlan === 'free') {
      setSubscription({ plan: 'free', status: 'active' });
      router.back();
      return;
    }
    Alert.alert(
      'Subscribe',
      `Start your ${selectedPlan} plan? You can cancel anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: () => {
            setSubscription({ plan: selectedPlan as any, status: 'active', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
            Alert.alert('🎉 Welcome!', `You're now on the ${selectedPlan} plan!`, [
              { text: 'Start Investing', onPress: () => router.back() },
            ]);
          },
        },
      ]
    );
  };

  const getAnnualPrice = (monthly: number) => (monthly * 10).toFixed(2);
  const getSavingsPercent = () => '17%';

  const planIcons: Record<string, string> = { free: 'leaf', pro: 'rocket', premium: 'diamond' };
  const planColors: Record<string, string> = { free: COLORS.textSecondary, pro: COLORS.primary, premium: '#FFD700' };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="trending-up" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>Unlock Your Financial Potential</Text>
          <Text style={styles.headerSubtitle}>
            AI-powered financial advice that helps you build wealth faster
          </Text>
        </View>
      </View>

      {/* Billing Toggle */}
      <View style={styles.billingToggle}>
        <TouchableOpacity
          style={[styles.billingOption, billingCycle === 'monthly' && styles.billingOptionActive]}
          onPress={() => setBillingCycle('monthly')}
        >
          <Text style={[styles.billingText, billingCycle === 'monthly' && styles.billingTextActive]}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.billingOption, billingCycle === 'annual' && styles.billingOptionActive]}
          onPress={() => setBillingCycle('annual')}
        >
          <Text style={[styles.billingText, billingCycle === 'annual' && styles.billingTextActive]}>
            Annual
          </Text>
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>Save {getSavingsPercent()}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Plans */}
      <View style={styles.plansContainer}>
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isPopular = plan.id === 'pro';
          const displayPrice = billingCycle === 'annual' && plan.price > 0
            ? parseFloat(getAnnualPrice(plan.price)) / 12
            : plan.price;

          return (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, isSelected && styles.planCardSelected, isPopular && styles.planCardPopular]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>⭐ MOST POPULAR</Text>
                </View>
              )}
              <View style={styles.planHeader}>
                <View style={[styles.planIcon, { backgroundColor: planColors[plan.id] + '20' }]}>
                  <Ionicons name={planIcons[plan.id] as any} size={24} color={planColors[plan.id]} />
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>
                    {plan.price === 0 ? 'Free Forever' : `$${displayPrice.toFixed(2)}/mo`}
                  </Text>
                  {billingCycle === 'annual' && plan.price > 0 && (
                    <Text style={styles.annualNote}>
                      Billed ${getAnnualPrice(plan.price)}/year
                    </Text>
                  )}
                </View>
                <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={isSelected ? planColors[plan.id] : COLORS.textSecondary}
                    />
                    <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Value Props */}
      <View style={styles.valueProps}>
        <Text style={styles.valuePropTitle}>Why 50,000+ users trust us</Text>
        {[
          { icon: '📈', title: 'Average 23% savings increase', desc: 'Users save more within 3 months' },
          { icon: '🤖', title: 'GPT-4o Powered Analysis', desc: 'Expert-level financial intelligence' },
          { icon: '🔒', title: 'Bank-level security', desc: '256-bit encryption, read-only access' },
          { icon: '💳', title: 'Cancel anytime', desc: 'No commitments, no hidden fees' },
        ].map((prop, i) => (
          <View key={i} style={styles.valuePropRow}>
            <Text style={styles.valuePropIcon}>{prop.icon}</Text>
            <View>
              <Text style={styles.valuePropItemTitle}>{prop.title}</Text>
              <Text style={styles.valuePropDesc}>{prop.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>
            {selectedPlan === 'free' ? 'Continue Free' : `Start ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.trialNote}>
          {selectedPlan !== 'free' ? '7-day free trial · Cancel anytime' : 'No credit card required'}
        </Text>
      </View>

      {/* Trust Signals */}
      <View style={styles.trustRow}>
        {['🔒 Secure', '⭐ 4.8 Rating', '50K+ Users', '💬 24/7 Support'].map((t, i) => (
          <Text key={i} style={styles.trustItem}>{t}</Text>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingBottom: 24 },
  closeButton: { padding: 16, alignSelf: 'flex-end' },
  headerContent: { alignItems: 'center', paddingHorizontal: 24 },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  billingToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  billingOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, gap: 6 },
  billingOptionActive: { backgroundColor: COLORS.primary },
  billingText: { fontWeight: '600', color: COLORS.textSecondary },
  billingTextActive: { color: COLORS.white },
  savingsBadge: { backgroundColor: '#4CAF50', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  savingsText: { fontSize: 10, fontWeight: 'bold', color: COLORS.white },
  plansContainer: { paddingHorizontal: 20, gap: 12 },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  planCardSelected: { borderColor: COLORS.primary },
  planCardPopular: { borderColor: COLORS.primary + '60' },
  popularBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularText: { fontSize: 11, fontWeight: 'bold', color: COLORS.white },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  planIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  planInfo: { flex: 1 },
  planName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  planPrice: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  annualNote: { fontSize: 11, color: COLORS.textSecondary },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: { borderColor: COLORS.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  planFeatures: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: COLORS.textSecondary },
  featureTextSelected: { color: COLORS.text },
  valueProps: { margin: 20, backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  valuePropTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 16, textAlign: 'center' },
  valuePropRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  valuePropIcon: { fontSize: 24, width: 36, textAlign: 'center' },
  valuePropItemTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  valuePropDesc: { fontSize: 12, color: COLORS.textSecondary },
  ctaContainer: { paddingHorizontal: 20, alignItems: 'center' },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 18,
    gap: 8,
    width: '100%',
  },
  subscribeButtonText: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  trialNote: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8 },
  trustRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingVertical: 20 },
  trustItem: { fontSize: 11, color: COLORS.textSecondary },
});