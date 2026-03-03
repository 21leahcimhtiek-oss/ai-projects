import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { User, CreditCard, BookOpen, LogOut, ChevronRight } from "lucide-react-native";

export default function AccountScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={32} color="#d946ef" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Guest User</Text>
          <Text style={styles.profileEmail}>Sign in to access your stories</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <BookOpen size={20} color="#d946ef" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Stories</Text>
        </View>
        <View style={styles.statCard}>
          <CreditCard size={20} color="#10b981" />
          <Text style={styles.statValue}>Free</Text>
          <Text style={styles.statLabel}>Plan</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {[
          { icon: <CreditCard size={18} color="#6b7280" />, label: "Subscription & Billing", onPress: () => {} },
          { icon: <BookOpen size={18} color="#6b7280" />, label: "My Stories", onPress: () => router.push("/tabs/library") },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={16} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign In / Out */}
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign In / Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton}>
        <LogOut size={16} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>StoryForge Kids v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  content: { padding: 20, paddingBottom: 40 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fdf4ff",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: "700", color: "#111827" },
  profileEmail: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: "800", color: "#111827" },
  statLabel: { fontSize: 12, color: "#6b7280" },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuItemLabel: { fontSize: 15, color: "#374151", fontWeight: "500" },
  signInButton: {
    backgroundColor: "#d946ef",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  signInButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  signOutText: { color: "#ef4444", fontWeight: "600", fontSize: 14 },
  version: { textAlign: "center", fontSize: 12, color: "#d1d5db" },
});