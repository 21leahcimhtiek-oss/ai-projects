import { create } from 'zustand';

interface HealthMetrics {
  steps: number;
  calories: number;
  water: number;
  sleep: number;
  heartRate: number;
  weight: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  goals: string[];
  conditions: string[];
  activityLevel: string;
  plan: 'free' | 'pro' | 'premium';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AppState {
  user: UserProfile | null;
  metrics: HealthMetrics;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserProfile) => void;
  updateMetrics: (metrics: Partial<HealthMetrics>) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updatePlan: (plan: 'free' | 'pro' | 'premium') => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  metrics: {
    steps: 0,
    calories: 0,
    water: 0,
    sleep: 0,
    heartRate: 0,
    weight: 0,
  },
  chatHistory: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  updateMetrics: (metrics) =>
    set((state) => ({ metrics: { ...state.metrics, ...metrics } })),
  addChatMessage: (message) =>
    set((state) => ({ chatHistory: [...state.chatHistory, message] })),
  clearChat: () => set({ chatHistory: [] }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  updatePlan: (plan) =>
    set((state) => ({ user: state.user ? { ...state.user, plan } : null })),
  logout: () => set({ user: null, chatHistory: [], metrics: { steps: 0, calories: 0, water: 0, sleep: 0, heartRate: 0, weight: 0 } }),
}));