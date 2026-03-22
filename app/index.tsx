import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppStore } from '../store';

export default function RootIndex() {
  const router = useRouter();
  const { userProfile } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userProfile.email) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}