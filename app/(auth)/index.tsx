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
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <Text style={styles.appName}>AI Tutor</Text>
          <Text style={styles.tagline}>Learn smarter with AI-powered tutoring</Text>
        </View>

        <View style={styles.statsRow}>
          {[{ value: '100K+', label: 'Students' }, { value: '4.9⭐', label: 'Rating' }, { value: '95%', label: 'Pass Rate' }].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            {(['signup', 'login'] as const).map(m => (
              <TouchableOpacity key={m} style={[styles.tab, mode === m && styles.tabActive]} onPress={() => setMode(m)}>
                <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>{m === 'signup' ? 'Sign Up' : 'Sign In'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {mode === 'signup' && (
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={COLORS.textSecondary} value={name} onChangeText={setName} />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={COLORS.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Password" placeholderTextColor={COLORS.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>{mode === 'login' ? 'Sign In' : 'Start Learning Free'}</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            {[{ icon: 'logo-google', label: 'Google', color: '#DB4437' }, { icon: 'logo-apple', label: 'Apple', color: COLORS.text }].map((s, i) => (
              <TouchableOpacity key={i} style={styles.socialButton} onPress={handleAuth}>
                <Ionicons name={s.icon as any} size={20} color={s.color} />
                <Text style={styles.socialButtonText}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.guestButton} onPress={() => { setUserProfile({ name: 'Guest', email: 'guest@example.com' }); router.replace('/(tabs)'); }}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>By signing up you agree to our Terms & Privacy Policy. No credit card required.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: 24 },
  logoContainer: { alignItems: 'center', paddingVertical: 28 },
  logo: { width: 88, height: 88, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 14, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  logoIcon: { fontSize: 44 },
  appName: { fontSize: 28, fontWeight: 'bold', color: COLORS.text },
  tagline: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 50, color: COLORS.text, fontSize: 15 },
  eyeIcon: { padding: 4 },
  authButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: 12, height: 52, gap: 8, marginTop: 4 },
  authButtonText: { fontSize: 16, fontWeight: 'bold', color: COLORS.white },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 18, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 13, color: COLORS.textSecondary },
  socialButtons: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, height: 48, gap: 8 },
  socialButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  guestButton: { alignItems: 'center', paddingVertical: 16 },
  guestButtonText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  disclaimer: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 16 },
});