import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store';

export default function RootIndex() {
  const router = useRouter();
  const { userProfile } = useAppStore();
  useEffect(() => {
    const t = setTimeout(() => router.replace(userProfile.email ? '/(tabs)' : '/(auth)'), 100);
    return () => clearTimeout(t);
  }, []);
  return null;
}