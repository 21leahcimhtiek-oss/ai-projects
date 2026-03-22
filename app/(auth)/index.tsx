import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store';
import { COLORS } from '../../constants/config';

export default function AuthScreen() {
  const router = useRouter();
  const { setUserProfile } = useAppStore();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    setUserProfile({ name: name || email.split('@')[0], email });
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🚀</Text>
          <Text style={styles.appName}>AI Life OS</Text>
          <Text style={styles.tagline}>Design your ideal life with AI</Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: '🤖', text: 'AI Life Coach powered by GPT-4o' },
            { icon: '⚡', text: 'Smart habits & goal tracking' },
            { icon: '📊', text: 'Life Score across 8 life areas' },
            { icon: '🎯', text: 'Personalized daily planning' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            {(['signup', 'login'] as const).map(m => (
              <TouchableOpacity key={m} style={[styles.tab, mode === m && styles.tabActive]} onPress={() => setMode(m)}>
                <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>{m === 'signup' ? 'Get Started' : 'Sign In'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {mode === 'signup' && (
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor={COLORS.textSecondary} value={name} onChangeText={setName} />
            </View>
          )}

          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor={COLORS.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Password" placeholderTextColor={COLORS.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} /></TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.authBtn} onPress={handleAuth}>
            <Text style={styles.authBtnText}>{mode === 'login' ? 'Sign In' : 'Start My Journey 🚀'}</Text>
          </TouchableOpacity>

          <View style={styles.divider}><View style={styles.divLine} /><Text style={styles.divText}>or</Text><View style={styles.divLine} /></View>

          <View style={styles.socialRow}>
            {[{ icon: 'logo-google', label: 'Google' }, { icon: 'logo-apple', label: 'Apple' }].map((s, i) => (
              <TouchableOpacity key={i} style={styles.socialBtn} onPress={handleAuth}>
                <Ionicons name={s.icon as any} size={20} color={COLORS.text} />
                <Text style={styles.socialBtnText}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.guestBtn} onPress={() => { setUserProfile({ name: 'Guest', email: 'guest@example.com' }); router.replace('/(tabs)'); }}>
          <Text style={styles.guestBtnText}>Explore without account</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Free to start • Cancel anytime • Your data stays private</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: 24 },
  hero: { alignItems: 'center', paddingVertical: 28 },
  heroEmoji: { fontSize: 60, marginBottom: 12 },
  appName: { fontSize: 32, fontWeight: 'bold', color: COLORS.text },
  tagline: { fontSize: 15, color: COLORS.textSecondary, marginTop: 6 },
  features: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 20, width: 28 },
  featureText: { fontSize: 14, color: COLORS.text },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 50, color: COLORS.text, fontSize: 15 },
  authBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 12, height: 52, marginTop: 4 },
  authBtnText: { fontSize: 16, fontWeight: 'bold', color: COLORS.white },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 8 },
  divLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  divText: { fontSize: 12, color: COLORS.textSecondary },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, height: 48, gap: 8 },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  guestBtn: { alignItems: 'center', paddingVertical: 16 },
  guestBtnText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  disclaimer: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
});