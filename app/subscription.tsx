import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store';
import { COLORS, SUBSCRIPTION_PLANS } from '../constants/config';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { subscription, setSubscription } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState(subscription.plan === 'free' ? 'pro' : subscription.plan);
  const [annual, setAnnual] = useState(false);

  const handleSubscribe = () => {
    if (selectedPlan === 'free') { setSubscription({ plan: 'free', status: 'active' }); router.back(); return; }
    Alert.alert('Subscribe', `Start your ${selectedPlan} plan?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Subscribe', onPress: () => {
        setSubscription({ plan: selectedPlan as any, status: 'active', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
        Alert.alert('🎉 Welcome!', `You now have ${selectedPlan} access!`, [{ text: 'Start Learning', onPress: () => router.back() }]);
      }},
    ]);
  };

  const planIcons: Record<string, any> = { free: 'leaf', pro: 'rocket', premium: 'diamond' };
  const planColors: Record<string, string> = { free: COLORS.textSecondary, pro: COLORS.primary, premium: COLORS.gold };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>🎓</Text>
          <Text style={styles.headerTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.headerSubtitle}>AI tutoring that adapts to your learning style</Text>
        </View>
      </View>

      {/* Billing Toggle */}
      <View style={styles.billingToggle}>
        <TouchableOpacity style={[styles.billingBtn, !annual && styles.billingBtnActive]} onPress={() => setAnnual(false)}>
          <Text style={[styles.billingText, !annual && styles.billingTextActive]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.billingBtn, annual && styles.billingBtnActive]} onPress={() => setAnnual(true)}>
          <Text style={[styles.billingText, annual && styles.billingTextActive]}>Annual</Text>
          <View style={styles.saveBadge}><Text style={styles.saveText}>Save 17%</Text></View>
        </TouchableOpacity>
      </View>

      {/* Plans */}
      <View style={styles.plans}>
        {SUBSCRIPTION_PLANS.map(plan => {
          const isSelected = selectedPlan === plan.id;
          const price = annual && plan.price > 0 ? (plan.price * 10 / 12).toFixed(2) : plan.price.toFixed(2);
          return (
            <TouchableOpacity key={plan.id} style={[styles.planCard, isSelected && styles.planCardSelected]} onPress={() => setSelectedPlan(plan.id)}>
              {plan.id === 'pro' && <View style={styles.popularBadge}><Text style={styles.popularText}>⭐ MOST POPULAR</Text></View>}
              <View style={styles.planHeader}>
                <View style={[styles.planIcon, { backgroundColor: planColors[plan.id] + '20' }]}>
                  <Ionicons name={planIcons[plan.id]} size={22} color={planColors[plan.id]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price === 0 ? 'Free Forever' : `$${price}/mo`}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>
              <View style={styles.planFeatures}>
                {plan.features.map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={14} color={isSelected ? planColors[plan.id] : COLORS.textSecondary} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Trust */}
      <View style={styles.trust}>
        {[{ icon: '🤖', t: 'GPT-4o Powered', d: 'Smartest AI tutor' }, { icon: '📈', t: '95% Pass Rate', d: 'Proven results' }, { icon: '🔒', t: 'Cancel Anytime', d: 'No commitments' }, { icon: '🌍', t: '100K+ Students', d: 'Join the community' }].map((v, i) => (
          <View key={i} style={styles.trustItem}>
            <Text style={styles.trustIcon}>{v.icon}</Text>
            <Text style={styles.trustTitle}>{v.t}</Text>
            <Text style={styles.trustDesc}>{v.d}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cta}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleSubscribe}>
          <Text style={styles.ctaText}>{selectedPlan === 'free' ? 'Continue Free' : `Start ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`}</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.ctaNote}>{selectedPlan !== 'free' ? '7-day free trial • Cancel anytime' : 'No credit card needed'}</Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingBottom: 24 },
  closeBtn: { padding: 16, alignSelf: 'flex-end' },
  headerContent: { alignItems: 'center', paddingHorizontal: 24 },
  headerEmoji: { fontSize: 56, marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  billingToggle: { flexDirection: 'row', margin: 20, backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: COLORS.border },
  billingBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, gap: 6 },
  billingBtnActive: { backgroundColor: COLORS.primary },
  billingText: { fontWeight: '600', color: COLORS.textSecondary },
  billingTextActive: { color: COLORS.white },
  saveBadge: { backgroundColor: COLORS.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  saveText: { fontSize: 10, fontWeight: 'bold', color: COLORS.white },
  plans: { paddingHorizontal: 20, gap: 12 },
  planCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 18, borderWidth: 2, borderColor: COLORS.border },
  planCardSelected: { borderColor: COLORS.primary },
  popularBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10 },
  popularText: { fontSize: 11, fontWeight: 'bold', color: COLORS.white },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  planIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  planName: { fontSize: 17, fontWeight: 'bold', color: COLORS.text },
  planPrice: { fontSize: 13, color: COLORS.textSecondary },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: COLORS.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  planFeatures: { gap: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: COLORS.textSecondary },
  trust: { flexDirection: 'row', flexWrap: 'wrap', margin: 20, gap: 12 },
  trustItem: { flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  trustIcon: { fontSize: 24, marginBottom: 4 },
  trustTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  trustDesc: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  cta: { paddingHorizontal: 20, alignItems: 'center' },
  ctaButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 14, padding: 18, gap: 8, width: '100%' },
  ctaText: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  ctaNote: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8 },
});