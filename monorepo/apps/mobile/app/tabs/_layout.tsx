// ─── Tab Navigator Layout ─────────────────────────────────────────────────────
// TODO: Migrate from my-projects/app/tabs/_layout.tsx

import { Tabs } from "expo-router";
import { BookOpen, PlusCircle, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   "#4f46e5",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown:             false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:    "Home",
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title:    "Create",
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title:    "Library",
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title:    "Account",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}