import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, CONFIG } from '../../constants/config';
import { useAppStore } from '../../store';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useAppStore();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      // Simulate auth - in production connect to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: Date.now().toString(),
        name: name || email.split('@')[0],
        email,
        age: 30,
        weight: 75,
        height: 175,
        goals: ['lose weight', 'build muscle'],
        conditions: [],
        activityLevel: 'moderate',
        plan: 'free',
      });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="heart-circle" size={60} color="#fff" />
          </View>
          <Text style={styles.appName}>{CONFIG.APP_NAME}</Text>
          <Text style={styles.tagline}>Your Personal AI Health Coach</Text>
        </View>

        {/* Auth Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>{isLogin ? 'Welcome Back! 👋' : 'Create Account 🚀'}</Text>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={COLORS.textSecondary} value={name} onChangeText={setName} autoCapitalize="words" />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={COLORS.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor={COLORS.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.authBtn} onPress={handleAuth} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authBtnText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>}
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialBtnText}>🍎 Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialBtnText}>🔵 Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>{isLogin ? "Don't have an account? " : 'Already have an account? '}</Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.switchLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Guest Access */}
        <TouchableOpacity style={styles.guestBtn} onPress={() => {
          setUser({ id: 'guest', name: 'Guest', email: '', age: 30, weight: 70, height: 170, goals: ['get healthy'], conditions: [], activityLevel: 'beginner', plan: 'free' });
          router.replace('/(tabs)');
        }}>
          <Text style={styles.guestBtnText}>Continue as Guest</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, padding: 24 },
  logoContainer: { alignItems: 'center', paddingVertical: 32 },
  logo: { width: 96, height: 96, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  appName: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginTop: 16 },
  tagline: { fontSize: 15, color: COLORS.textSecondary, marginTop: 4 },
  form: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  formTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 24 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 14, paddingHorizontal: 14, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.text },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { color: COLORS.primary, fontSize: 13 },
  authBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 20 },
  authBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 13, color: COLORS.textSecondary, marginHorizontal: 12 },
  socialButtons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  socialBtn: { flex: 1, backgroundColor: COLORS.background, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  switchContainer: { flexDirection: 'row', justifyContent: 'center' },
  switchText: { fontSize: 14, color: COLORS.textSecondary },
  switchLink: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  guestBtn: { marginTop: 16, padding: 14, alignItems: 'center' },
  guestBtnText: { fontSize: 15, color: COLORS.textSecondary },
});