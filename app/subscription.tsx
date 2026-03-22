import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, CONFIG } from '../constants/config';
import { useAppStore } from '../store';
import { stripeService } from '../services/stripe';

const PlanCard = ({ plan, isCurrentPlan, onSelect }: any) => (
  <TouchableOpacity
    style={[styles.planCard, plan.id === 'pro' && styles.planCardFeatured, isCurrentPlan && styles.planCardActive]}
    onPress={() => onSelect(plan)}
  >
    {plan.id === 'pro' && <View style={styles.popularBadge}><Text style={styles.popularBadgeText}>MOST POPULAR</Text></View>}
    <Text style={styles.planName}>{plan.name}</Text>
    <View style={styles.priceRow}>
      {plan.price > 0 ? (
        <>
          <Text style={styles.planPrice}>${plan.price}</Text>
          <Text style={styles.planPeriod}>/month</Text>
        </>
      ) : (
        <Text style={styles.planPrice}>Free</Text>
      )}
    </View>
    {plan.price > 0 && <Text style={styles.planAnnual}>or ${(plan.price * 10).toFixed(2)}/year (save 17%)</Text>}
    <View style={styles.featuresList}>
      {plan.features.map((feature: string) => (
        <View key={feature} style={styles.featureRow}>
          <Ionicons name="checkmark-circle" size={16} color={plan.id === 'pro' ? COLORS.primary : COLORS.success} />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
    <View style={[styles.selectBtn, plan.id === 'pro' && styles.selectBtnFeatured, isCurrentPlan && styles.selectBtnActive]}>
      <Text style={[styles.selectBtnText, plan.id === 'pro' && styles.selectBtnTextFeatured]}>
        {isCurrentPlan ? '✓ Current Plan' : plan.price === 0 ? 'Get Started Free' : `Start 7-Day Free Trial`}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user, updatePlan } = useAppStore();

  const handleSelectPlan = async (plan: any) => {
    if (plan.id === user?.plan) return;
    if (plan.id === 'free') {
      Alert.alert('Downgrade', 'Are you sure you want to downgrade to the free plan?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Downgrade', style: 'destructive', onPress: () => updatePlan('free') },
      ]);
      return;
    }
    try {
      const checkoutUrl = await stripeService.createCheckoutSession(plan.stripePriceId, user?.id || 'guest');
      // In production: open Stripe checkout in WebView or browser
      Alert.alert('Subscribe', `Opening checkout for ${plan.name} plan at $${plan.price}/mo`, [
        { text: 'Continue', onPress: () => updatePlan(plan.id) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Unable to process subscription. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.heroSection}>
        <Ionicons name="sparkles" size={48} color={COLORS.primary} />
        <Text style={styles.heroTitle}>Transform Your Health with AI</Text>
        <Text style={styles.heroSubtitle}>Join 50,000+ users getting personalized AI health coaching</Text>
      </View>

      {/* Plans */}
      {Object.values(CONFIG.PLANS).map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isCurrentPlan={user?.plan === plan.id}
          onSelect={handleSelectPlan}
        />
      ))}

      {/* Trust Signals */}
      <View style={styles.trustSection}>
        {[
          { icon: 'shield-checkmark', text: 'Cancel anytime' },
          { icon: 'refresh', text: '7-day free trial' },
          { icon: 'lock-closed', text: 'Secure payment' },
          { icon: 'star', text: '4.8★ rating' },
        ].map((item) => (
          <View key={item.text} style={styles.trustItem}>
            <Ionicons name={item.icon as any} size={20} color={COLORS.success} />
            <Text style={styles.trustText}>{item.text}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.legalText}>
        Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.
        Manage subscriptions in your account settings.
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.surface },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  heroSection: { alignItems: 'center', padding: 24, backgroundColor: COLORS.surface, marginBottom: 16 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginTop: 12 },
  heroSubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  planCard: { margin: 16, marginBottom: 8, backgroundColor: COLORS.surface, borderRadius: 20, padding: 24, borderWidth: 2, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  planCardFeatured: { borderColor: COLORS.primary, shadowOpacity: 0.15 },
  planCardActive: { borderColor: COLORS.success },
  popularBadge: { backgroundColor: COLORS.primary, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginBottom: 12 },
  popularBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  planName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  planPrice: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary },
  planPeriod: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 8 },
  planAnnual: { fontSize: 12, color: COLORS.success, marginBottom: 16 },
  featuresList: { marginBottom: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureText: { fontSize: 14, color: COLORS.text, marginLeft: 8, flex: 1 },
  selectBtn: { backgroundColor: COLORS.background, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  selectBtnFeatured: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  selectBtnActive: { backgroundColor: COLORS.success + '20', borderColor: COLORS.success },
  selectBtnText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  selectBtnTextFeatured: { color: '#fff' },
  trustSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 16, gap: 16 },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trustText: { fontSize: 13, color: COLORS.textSecondary },
  legalText: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', padding: 16, lineHeight: 16 },
});