import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/config';
import { aiService } from '../../services/ai';
import { useAppStore } from '../../store';

const WORKOUT_CATEGORIES = [
  { id: 'strength', label: 'Strength', icon: 'barbell', color: '#FF6B6B' },
  { id: 'cardio', label: 'Cardio', icon: 'heart', color: '#FF3B30' },
  { id: 'yoga', label: 'Yoga', icon: 'body', color: '#BF5AF2' },
  { id: 'hiit', label: 'HIIT', icon: 'flash', color: '#FFD60A' },
  { id: 'mobility', label: 'Mobility', icon: 'accessibility', color: '#30D158' },
  { id: 'sport', label: 'Sport', icon: 'football', color: '#0A84FF' },
];

const SAMPLE_WORKOUTS = [
  { name: 'Full Body Blast', duration: '45 min', level: 'Intermediate', calories: 320, exercises: 8 },
  { name: 'Core & Abs', duration: '25 min', level: 'Beginner', calories: 180, exercises: 6 },
  { name: 'Upper Body Power', duration: '40 min', level: 'Advanced', calories: 280, exercises: 7 },
  { name: 'HIIT Cardio', duration: '30 min', level: 'Intermediate', calories: 400, exercises: 10 },
];

export default function WorkoutsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('strength');
  const [aiPlan, setAiPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAppStore();

  const generateAIPlan = async () => {
    setLoading(true);
    try {
      const plan = await aiService.generateWorkoutPlan(
        user ? { age: user.age, weight: user.weight, height: user.height, goals: user.goals, conditions: user.conditions, activityLevel: user.activityLevel } :
        { age: 30, weight: 75, height: 175, goals: ['build muscle', 'lose fat'], conditions: [], activityLevel: 'intermediate' }
      );
      setAiPlan(plan);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
        {WORKOUT_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, selectedCategory === cat.id && { backgroundColor: cat.color }]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons name={cat.icon as any} size={18} color={selectedCategory === cat.id ? '#fff' : cat.color} />
            <Text style={[styles.categoryLabel, selectedCategory === cat.id && { color: '#fff' }]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* AI Plan Generator */}
      <View style={styles.aiCard}>
        <View style={styles.aiCardHeader}>
          <Ionicons name="sparkles" size={24} color={COLORS.primary} />
          <Text style={styles.aiCardTitle}>AI Workout Plan</Text>
        </View>
        <Text style={styles.aiCardSubtitle}>Get a personalized 4-week workout plan tailored to your goals</Text>
        <TouchableOpacity style={styles.generateBtn} onPress={generateAIPlan} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.generateBtnText}>⚡ Generate My Plan</Text>}
        </TouchableOpacity>
        {aiPlan ? (
          <View style={styles.aiPlanResult}>
            <Text style={styles.aiPlanText}>{aiPlan}</Text>
          </View>
        ) : null}
      </View>

      {/* Today's Recommended */}
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      {SAMPLE_WORKOUTS.map((workout) => (
        <TouchableOpacity key={workout.name} style={styles.workoutCard}>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <View style={styles.workoutMeta}>
              <Text style={styles.workoutMetaText}>⏱ {workout.duration}</Text>
              <Text style={styles.workoutMetaText}>🔥 {workout.calories} cal</Text>
              <Text style={styles.workoutMetaText}>💪 {workout.exercises} exercises</Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: workout.level === 'Beginner' ? COLORS.success + '20' : workout.level === 'Advanced' ? COLORS.accent + '20' : COLORS.primary + '20' }]}>
              <Text style={[styles.levelText, { color: workout.level === 'Beginner' ? COLORS.success : workout.level === 'Advanced' ? COLORS.accent : COLORS.primary }]}>{workout.level}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.startBtn}>
            <Text style={styles.startBtnText}>Start</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, margin: 16, marginBottom: 12 },
  categoriesRow: { paddingLeft: 16, marginBottom: 8 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  categoryLabel: { fontSize: 13, fontWeight: '600', marginLeft: 6, color: COLORS.text },
  aiCard: { margin: 16, backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  aiCardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginLeft: 8 },
  aiCardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 18 },
  generateBtn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: 'center' },
  generateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  aiPlanResult: { marginTop: 16, padding: 12, backgroundColor: COLORS.background, borderRadius: 12 },
  aiPlanText: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  workoutCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  workoutInfo: { flex: 1 },
  workoutName: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  workoutMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  workoutMetaText: { fontSize: 12, color: COLORS.textSecondary },
  levelBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  levelText: { fontSize: 11, fontWeight: '600' },
  startBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  startBtnText: { color: '#fff', fontWeight: 'bold' },
});