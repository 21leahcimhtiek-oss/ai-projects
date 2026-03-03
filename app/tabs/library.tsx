import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, Plus } from "lucide-react-native";

// Placeholder data until tRPC mobile client is wired up
const SAMPLE_BOOKS = [
  { id: 1, title: "Emma's Dragon Quest", childName: "Emma", childAge: 6, theme: "adventure", emoji: "🐉" },
  { id: 2, title: "Liam's Space Adventure", childName: "Liam", childAge: 8, theme: "space", emoji: "🚀" },
];

export default function LibraryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Library</Text>
          <Text style={styles.subtitle}>{SAMPLE_BOOKS.length} stories</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/tabs/create")}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={SAMPLE_BOOKS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bookCard}>
            <View style={styles.bookCover}>
              <Text style={styles.bookEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookMeta}>For {item.childName}, age {item.childAge}</Text>
              <View style={styles.themeBadge}>
                <Text style={styles.themeBadgeText}>{item.theme}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <BookOpen size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No stories yet</Text>
            <Text style={styles.emptySubtitle}>Create your first story!</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/tabs/create")}>
              <Text style={styles.emptyButtonText}>Create Story</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#d946ef",
    alignItems: "center",
    justifyContent: "center",
  },
  list: { padding: 16, gap: 12 },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  bookCover: {
    width: 64,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#fdf4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  bookEmoji: { fontSize: 32 },
  bookInfo: { flex: 1, justifyContent: "center" },
  bookTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 4 },
  bookMeta: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
  themeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fae8ff",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  themeBadgeText: { fontSize: 11, color: "#c026d3", fontWeight: "600", textTransform: "capitalize" },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#9ca3af", marginTop: 8 },
  emptySubtitle: { fontSize: 14, color: "#d1d5db" },
  emptyButton: {
    marginTop: 12,
    backgroundColor: "#d946ef",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: { color: "#fff", fontWeight: "700" },
});