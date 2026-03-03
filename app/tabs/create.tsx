import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";

const THEMES = [
  { id: "adventure", label: "Adventure", emoji: "🗺️" },
  { id: "fantasy", label: "Fantasy", emoji: "🧙" },
  { id: "space", label: "Space", emoji: "🚀" },
  { id: "ocean", label: "Ocean", emoji: "🌊" },
  { id: "dinosaurs", label: "Dinosaurs", emoji: "🦕" },
  { id: "superheroes", label: "Superheroes", emoji: "🦸" },
  { id: "animals", label: "Animals", emoji: "🐾" },
  { id: "magic", label: "Magic", emoji: "✨" },
];

export default function CreateScreen() {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("6");
  const [theme, setTheme] = useState("adventure");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!childName.trim()) {
      Alert.alert("Missing Info", "Please enter your child's name");
      return;
    }
    setLoading(true);
    try {
      // TODO: call trpc.books.create
      Alert.alert("✨ Story Created!", `Creating a ${theme} story for ${childName}!`);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create a Story</Text>
      <Text style={styles.subtitle}>Personalize your child's adventure</Text>

      {/* Child Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Child's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Emma"
          value={childName}
          onChangeText={setChildName}
          autoCapitalize="words"
        />
      </View>

      {/* Age */}
      <View style={styles.field}>
        <Text style={styles.label}>Age</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.ageRow}>
            {[2,3,4,5,6,7,8,9,10,11,12].map((age) => (
              <TouchableOpacity
                key={age}
                style={[styles.ageChip, childAge === String(age) && styles.ageChipActive]}
                onPress={() => setChildAge(String(age))}
              >
                <Text style={[styles.ageChipText, childAge === String(age) && styles.ageChipTextActive]}>
                  {age}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Theme */}
      <View style={styles.field}>
        <Text style={styles.label}>Story Theme</Text>
        <View style={styles.themeGrid}>
          {THEMES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.themeCard, theme === t.id && styles.themeCardActive]}
              onPress={() => setTheme(t.id)}
            >
              <Text style={styles.themeEmoji}>{t.emoji}</Text>
              <Text style={[styles.themeLabel, theme === t.id && styles.themeLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Create Button */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>✨ Create Story</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: "#111827", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#6b7280", marginBottom: 24 },
  field: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 10 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  ageRow: { flexDirection: "row", gap: 8 },
  ageChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  ageChipActive: { backgroundColor: "#d946ef" },
  ageChipText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  ageChipTextActive: { color: "#fff" },
  themeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  themeCard: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  themeCardActive: { borderColor: "#d946ef", backgroundColor: "#fdf4ff" },
  themeEmoji: { fontSize: 24, marginBottom: 4 },
  themeLabel: { fontSize: 10, fontWeight: "600", color: "#6b7280", textAlign: "center" },
  themeLabelActive: { color: "#c026d3" },
  createButton: {
    backgroundColor: "#d946ef",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});