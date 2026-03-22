import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/config';
import { useAppStore } from '../../store';

const { width } = Dimensions.get('window');

const GOALS = ['Lose Weight', 'Build Muscle', 'Improve Stamina', 'Eat Healthier', 'Sleep Better', 'Reduce Stress', 'Track Fitness', 'Manage Condition'];
const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise', icon: 'bed' },
  { id: 'light', label: 'Lightly Active', desc: '1-3 days/week', icon: 'walk' },
  { id: 'moderate', label: 'Moderately Active', desc: '3-5 days/week', icon: 'bicycle' },
  { id: 'active', label: 'Very Active', desc: '6-7 days/week', icon: 'fitness' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState('');
  const [age, setAge] = useState(25);
  const router = useRouter();
  const { setUser } = useAppStore();

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const steps = [
    {
      title: "What are your health goals?",
      subtitle: "Select all that apply",
      content: (
        <View style={styles.goalsGrid}>
          {GOALS.map(goal => (
            <TouchableOpacity
              key={goal}
              style={[styles.goalChip, selectedGoals.includes(goal) && styles.goalChipSelected]}
              onPress={() => toggleGoal(goal)}
            >
              <Text style={[styles.goalChipText, selectedGoals.includes(goal) && styles.goalChipTextSelected]}>{goal}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
    {
      title: "What's your activity level?",
      subtitle: "This helps us personalize your plan",
      content: (
        <View style={styles.activityList}>
          {ACTIVITY_LEVELS.map(level => (
            <TouchableOpacity
              key={level.id}
              style={[styles.activityCard, activityLevel === level.id && styles.activityCardSelected]}
              onPress={() => setActivityLevel(level.id)}
            >
              <Ionicons name={level.icon as any} size={28} color={activityLevel === level.id ? '#fff' : COLORS.primary} />
              <View style={styles.activityInfo}>
                <Text style={[styles.activityLabel, activityLevel === level.id && { color: '#fff' }]}>{level.label}</Text>
                <Text style={[styles.activityDesc, activityLevel === level.id && { color: 'rgba(255,255,255,0.8)' }]}>{level.desc}</Text>
              </View>
              {activityLevel === level.id && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>
      ),
    },
    {
      title: "You're all set! 🎉",
      subtitle: "Your personalized AI Health Coach is ready",
      content: (
        <View style={styles.readyCard}>
          <Ionicons name="sparkles" size={64} color={COLORS.primary} />
          <Text style={styles.readyTitle}>AI Health Coach Ready!</Text>
          <Text style={styles.readySubtitle}>Based on your goals, we've prepared a personalized experience just for you.</Text>
          <View style={styles.readyFeatures}>
            {['Personalized meal plans', 'Custom workout programs', 'AI coaching 24/7', 'Progress tracking'].map(f => (
              <View key={f} style={styles.readyFeature}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.readyFeatureText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>
      ),
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setUser({
        id: Date.now().toString(),
        name: 'User',
        email: '',
        age,
        weight: 75,
        height: 175,
        goals: selectedGoals,
        conditions: [],
        activityLevel,
        plan: 'free',
      });
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressBar}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive, i < step && styles.progressDotComplete]} />
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>{steps[step].title}</Text>
        <Text style={styles.stepSubtitle}>{steps[step].subtitle}</Text>
        {steps[step].content}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, { flex: step > 0 ? 1 : undefined, marginLeft: step > 0 ? 12 : 0 }]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>{step === steps.length - 1 ? 'Get Started 🚀' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  progressBar: { flexDirection: 'row', justifyContent: 'center', padding: 20, gap: 8 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  progressDotActive: { backgroundColor: COLORS.primary, width: 24 },
  progressDotComplete: { backgroundColor: COLORS.success },
  content: { flex: 1, padding: 24 },
  stepTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  stepSubtitle: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 22 },
  goalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  goalChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  goalChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  goalChipText: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  goalChipTextSelected: { color: '#fff' },
  activityList: { gap: 12 },
  activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, borderWidth: 2, borderColor: COLORS.border, gap: 14 },
  activityCardSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  activityInfo: { flex: 1 },
  activityLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  activityDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  readyCard: { alignItems: 'center', padding: 16 },
  readyTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: 16, marginBottom: 8 },
  readySubtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  readyFeatures: { width: '100%', gap: 12 },
  readyFeature: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  readyFeatureText: { fontSize: 15, color: COLORS.text },
  footer: { flexDirection: 'row', padding: 24, paddingTop: 12 },
  backBtn: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, minWidth: 100 },
  backBtnText: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  nextBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', minWidth: 200 },
  nextBtnText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});