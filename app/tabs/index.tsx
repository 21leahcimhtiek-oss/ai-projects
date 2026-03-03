import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Sparkles size={14} color="#c026d3" />
          <Text style={styles.badgeText}>AI-Powered Stories</Text>
        </View>
        <Text style={styles.heroTitle}>Stories That Star{"\n"}Your Child ✨</Text>
        <Text style={styles.heroSubtitle}>
          Create magical personalized storybooks featuring your child as the hero.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push("/tabs/create")}>
          <Text style={styles.ctaButtonText}>Create a Story</Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Sample Books */}
      <Text style={styles.sectionTitle}>Popular Themes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.booksRow}>
        {[
          { emoji: "🐉", title: "Dragon Quest", color: "#f5d0fe" },
          { emoji: "🚀", title: "Space Explorer", color: "#bfdbfe" },
          { emoji: "🌸", title: "Magic Garden", color: "#bbf7d0" },
          { emoji: "🦕", title: "Dino World", color: "#fef08a" },
          { emoji: "🦸", title: "Superhero", color: "#fed7aa" },
        ].map((book) => (
          <TouchableOpacity
            key={book.title}
            style={[styles.bookCard, { backgroundColor: book.color }]}
            onPress={() => router.push("/tabs/create")}
          >
            <Text style={styles.bookEmoji}>{book.emoji}</Text>
            <Text style={styles.bookTitle}>{book.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Features */}
      <Text style={styles.sectionTitle}>Why Kids Love It</Text>
      {[
        { icon: "✨", title: "Personalized", desc: "Your child is the hero of every story" },
        { icon: "🛡️", title: "Safe Content", desc: "Age-appropriate stories, always" },
        { icon: "📖", title: "Instant Stories", desc: "Ready in under 60 seconds" },
      ].map((f) => (
        <View key={f.title} style={styles.featureCard}>
          <Text style={styles.featureIcon}>{f.icon}</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  content: { padding: 20, paddingBottom: 40 },
  hero: {
    backgroundColor: "#fdf4ff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fae8ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: { color: "#c026d3", fontSize: 12, fontWeight: "600" },
  heroTitle: { fontSize: 28, fontWeight: "800", color: "#111827", textAlign: "center", lineHeight: 36, marginBottom: 12 },
  heroSubtitle: { fontSize: 15, color: "#6b7280", textAlign: "center", lineHeight: 22, marginBottom: 20 },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#d946ef",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 14 },
  booksRow: { marginBottom: 28, marginHorizontal: -4 },
  bookCard: {
    width: 110,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
  },
  bookEmoji: { fontSize: 32, marginBottom: 8 },
  bookTitle: { fontSize: 12, fontWeight: "600", color: "#374151", textAlign: "center" },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: { fontSize: 28, marginRight: 14 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 2 },
  featureDesc: { fontSize: 13, color: "#6b7280" },
});