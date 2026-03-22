import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/config';
import { aiService } from '../../services/ai';
import { useAppStore } from '../../store';

const MACROS = [
  { label: 'Calories', value: 1840, goal: 2000, color: COLORS.accent, unit: 'kcal' },
  { label: 'Protein', value: 98, goal: 150, color: '#FF6B6B', unit: 'g' },
  { label: 'Carbs', value: 210, goal: 250, color: COLORS.warning, unit: 'g' },
  { label: 'Fat', value: 62, goal: 70, color: COLORS.primary, unit: 'g' },
];

const MEALS = [
  { time: 'Breakfast', emoji: '🌅', items: ['Oatmeal with berries', 'Greek yogurt', 'Black coffee'], calories: 420 },
  { time: 'Lunch', emoji: '☀️', items: ['Grilled chicken salad', 'Quinoa', 'Sparkling water'], calories: 580 },
  { time: 'Snack', emoji: '🍎', items: ['Apple', 'Almond butter'], calories: 180 },
  { time: 'Dinner', emoji: '🌙', items: [], calories: 0, empty: true },
];

export default function NutritionScreen() {
  const [mealPlan, setMealPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const { user } = useAppStore();

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const plan = await aiService.generateMealPlan(
        user ? { age: user.age, weight: user.weight, height: user.height, goals: user.goals, conditions: user.conditions, activityLevel: user.activityLevel } :
        { age: 30, weight: 75, height: 175, goals: ['lose weight', 'eat healthy'], conditions: [], activityLevel: 'moderate' }
      );
      setMealPlan(plan);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Macro Summary */}
      <View style={styles.macroCard}>
        <Text style={styles.sectionTitle}>Today's Nutrition</Text>
        {MACROS.map((macro) => (
          <View key={macro.label} style={styles.macroRow}>
            <Text style={styles.macroLabel}>{macro.label}</Text>
            <View style={styles.macroBarContainer}>
              <View style={[styles.macroBar, { width: `${Math.min(100, (macro.value / macro.goal) * 100)}%`, backgroundColor: macro.color }]} />
            </View>
            <Text style={styles.macroValue}>{macro.value}/{macro.goal}{macro.unit}</Text>
          </View>
        ))}
      </View>

      {/* Food Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search food to log..."
          placeholderTextColor={COLORS.textSecondary}
          value={foodSearch}
          onChangeText={setFoodSearch}
        />
      </View>

      {/* Today's Meals */}
      <Text style={styles.sectionTitle}>Today's Meals</Text>
      {MEALS.map((meal) => (
        <View key={meal.time} style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealEmoji}>{meal.emoji}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
            {meal.calories > 0 && <Text style={styles.mealCalories}>{meal.calories} kcal</Text>}
            <TouchableOpacity style={styles.addMealBtn}>
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          {meal.empty ? (
            <Text style={styles.emptyMealText}>Tap + to log your dinner</Text>
          ) : (
            meal.items.map((item) => (
              <Text key={item} style={styles.mealItem}>• {item}</Text>
            ))
          )}
        </View>
      ))}

      {/* AI Meal Plan */}
      <View style={styles.aiCard}>
        <View style={styles.aiCardHeader}>
          <Ionicons name="sparkles" size={22} color={COLORS.secondary} />
          <Text style={styles.aiCardTitle}>AI Meal Planner</Text>
        </View>
        <Text style={styles.aiCardSubtitle}>Get a personalized 7-day meal plan based on your goals and preferences</Text>
        <TouchableOpacity style={[styles.generateBtn, { backgroundColor: COLORS.secondary }]} onPress={generateMealPlan} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.generateBtnText}>🥗 Generate Meal Plan</Text>}
        </TouchableOpacity>
        {mealPlan ? (
          <View style={styles.planResult}>
            <Text style={styles.planText}>{mealPlan}</Text>
          </View>
        ) : null}
      </View>

      {/* Water Tracker */}
      <View style={styles.waterCard}>
        <Text style={styles.waterTitle}>💧 Water Intake</Text>
        <Text style={styles.waterValue}>5 / 8 glasses</Text>
        <View style={styles.waterGlasses}>
          {Array.from({ length: 8 }).map((_, i) => (
            <TouchableOpacity key={i} style={[styles.waterGlass, i < 5 && styles.waterGlassFilled]}>
              <Ionicons name="water" size={24} color={i < 5 ? '#5AC8FA' : COLORS.border} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, margin: 16, marginBottom: 12 },
  macroCard: { backgroundColor: COLORS.surface, margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  macroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  macroLabel: { width: 70, fontSize: 13, color: COLORS.text },
  macroBarContainer: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, marginHorizontal: 10 },
  macroBar: { height: 8, borderRadius: 4 },
  macroValue: { fontSize: 12, color: COLORS.textSecondary, width: 90, textAlign: 'right' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.border },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: COLORS.text },
  mealCard: { backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  mealHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  mealEmoji: { fontSize: 20, marginRight: 8 },
  mealTime: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.text },
  mealCalories: { fontSize: 13, color: COLORS.textSecondary, marginRight: 8 },
  addMealBtn: { padding: 4 },
  emptyMealText: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic' },
  mealItem: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 3 },
  aiCard: { margin: 16, backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  aiCardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginLeft: 8 },
  aiCardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 18 },
  generateBtn: { borderRadius: 12, padding: 14, alignItems: 'center' },
  generateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  planResult: { marginTop: 16, padding: 12, backgroundColor: COLORS.background, borderRadius: 12 },
  planText: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  waterCard: { margin: 16, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  waterTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  waterValue: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 },
  waterGlasses: { flexDirection: 'row', justifyContent: 'space-between' },
  waterGlass: { padding: 4 },
  waterGlassFilled: {},
});