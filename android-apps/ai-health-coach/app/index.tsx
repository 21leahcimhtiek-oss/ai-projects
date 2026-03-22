import { Redirect } from 'expo-router';
import { useAppStore } from '../store';

export default function Index() {
  const { user } = useAppStore();
  return <Redirect href={user ? '/(tabs)' : '/(auth)'} />;
}