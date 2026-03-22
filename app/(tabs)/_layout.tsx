import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/config';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, paddingBottom: 8, height: 60 },
      headerStyle: { backgroundColor: COLORS.surface },
      headerTintColor: COLORS.text,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'AI Advisor', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses" size={size} color={color} /> }} />
      <Tabs.Screen name="budget" options={{ title: 'Budget', tabBarIcon: ({ color, size }) => <Ionicons name="pie-chart" size={size} color={color} /> }} />
      <Tabs.Screen name="invest" options={{ title: 'Invest', tabBarIcon: ({ color, size }) => <Ionicons name="trending-up" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}