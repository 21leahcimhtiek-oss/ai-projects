import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store';
import { COLORS, SUBSCRIPTION_PLANS } from '../constants/config';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { subscription, setSubscription } = useAppStore();
  const [selected, setSelected] = useState(subscription.plan === 'free' ? 'pro' : subscription.plan);
  const [annual, setAnnual] = useState(false);

  const planColors: Record<string, string> = { free: COLORS.textSecondary, pro: COLORS.primary, premium: COLORS.gold };
  const planIcons: Record<string, any> = { free: 'leaf', pro: 'rocket', premium: 'diamond' };

  const handleSubscribe = () => {
    if (selected === 'free') { setSubscription({ plan: 'free', status: 'active' }); router.back(); return; }
    Alert.alert('Subscribe', `Start ${selected} plan?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Subscribe', onPress: () => {
        setSubscription({ plan: selected as any, status: 'active', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
        Alert.alert('🚀 Activated!', `Welcome to ${selected}!`, [{ text: 'Let\'s Go!', onPress: () => router.back() }]);
      }},
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>🚀</Text>
        <Text style={styles.headerTitle}>Unlock AI Life OS</Text>
        <Text style={styles.headerSub}>The productivity system that transforms your life</Text>
      </View>

      <View style={styles.billingToggle}>
        <TouchableOpacity style={[styles.billingBtn, !annual && styles.billingActive]} onPress={() => setAnnual(false)}>
          <Text style={[styles.billingText, !annual && styles.billingTextActive]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.billingBtn, annual && styles.billingActive]} onPress={() => setAnnual(true)}>
          <Text style={[styles.billingText, annual && styles.billingTextActive]}>Annual</Text>
          <View style={styles.saveBadge}><Text style={styles.saveText}>Save 17%</Text></View>
        </TouchableOpacity>
      </View>

      <View style={styles.plans}>
        {SUBSCRIPTION_PLANS.map(plan => {
          const isSel = selected === plan.id;
          const price = annual && plan.price > 0 ? (plan.price * 10 / 12).toFixed(2) : plan.price.toFixed(2);
          return (
            <TouchableOpacity key={plan.id} style={[styles.planCard, isSel && { borderColor: planColors[plan.id] }]} onPress={() => setSelected(plan.id)}>
              {plan.id === 'pro' && <View style={styles.popularBadge}><Text style={styles.popularText}>⭐ MOST POPULAR</Text></View>}
              <View style={styles.planHeader}>
                <View style={[styles.planIcon, { backgroundColor: planColors[plan.id] + '20' }]}>
                  <Ionicons name={planIcons[plan.id]} size={22} color={planColors[plan.id]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price === 0 ? 'Free Forever' : `$${price}/month`}</Text>
                </View>
                <View style={[styles.radio, isSel && { borderColor: planColors[plan.id] }]}>
                  {isSel && <View style={[styles.radioInner, { backgroundColor: planColors[plan.id] }]} />}
                </View>
              </View>
              {plan.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={14} color={isSel ? planColors[plan.id] : COLORS.textSecondary} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.trustGrid}>
        {[{ icon: '🤖', t: 'GPT-4o AI', d: 'Most advanced AI' }, { icon: '📊', t: 'Life Score', d: '8 life dimensions' }, { icon: '🔒', t: 'Private', d: 'Your data is safe' }, { icon: '💳', t: 'Cancel Anytime', d: 'No lock-in' }].map((v, i) => (
          <View key={i} style={styles.trustItem}>
            <Text style={styles.trustIcon}>{v.icon}</Text>
            <Text style={styles.trustTitle}>{v.t}</Text>
            <Text style={styles.trustDesc}>{v.d}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cta}>
        <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: planColors[selected] || COLORS.primary }]} onPress={handleSubscribe}>
          <Text style={styles.ctaBtnText}>{selected === 'free' ? 'Continue Free' : `Start ${selected.charAt(0).toUpperCase() + selected.slice(1)} Plan`}</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.ctaNote}>{selected !== 'free' ? '7-day free trial • Cancel anytime' : 'No credit card needed'}</Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', backgroundColor: COLORS.surface, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  closeBtn: { padding: 16, alignSelf: 'flex-end' },
  headerEmoji: { fontSize: 56, marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  headerSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  billingToggle: { flexDirection: 'row', margin: 20, backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: COLORS.border },
  billingBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, gap: 6 },
  billingActive: { backgroundColor: COLORS.primary },
  billingText: { fontWeight: '600', color: COLORS.textSecondary },
  billingTextActive: { color: COLORS.white },
  saveBadge: { backgroundColor: COLORS.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  saveText: { fontSize: 10, fontWeight: 'bold', color: COLORS.white },
  plans: { paddingHorizontal: 20, gap: 14 },
  planCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 18, borderWidth: 2, borderColor: COLORS.border },
  popularBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
  popularText: { fontSize: 11, fontWeight: 'bold', color: COLORS.white },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  planIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  planName: { fontSize: 17, fontWeight: 'bold', color: COLORS.text },
  planPrice: { fontSize: 13, color: COLORS.textSecondary },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  featureText: { fontSize: 13, color: COLORS.textSecondary },
  trustGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: 20, gap: 12 },
  trustItem: { flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  trustIcon: { fontSize: 24, marginBottom: 4 },
  trustTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  trustDesc: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
  cta: { paddingHorizontal: 20, alignItems: 'center' },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 14, padding: 18, gap: 8, width: '100%' },
  ctaBtnText: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  ctaNote: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8 },
});