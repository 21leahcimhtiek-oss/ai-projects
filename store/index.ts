import { create } from 'zustand';

interface Task { id: string; title: string; completed: boolean; priority: 'high' | 'medium' | 'low'; area: string; dueDate?: string; aiGenerated?: boolean; }
interface Habit { id: string; name: string; icon: string; streak: number; completedToday: boolean; area: string; frequency: 'daily' | 'weekly'; color: string; }
interface Goal { id: string; title: string; area: string; progress: number; target: number; unit: string; deadline: string; }
interface JournalEntry { id: string; content: string; mood: number; date: string; aiInsight?: string; }
interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; }

interface AppState {
  userProfile: { name: string; email: string; timezone: string; };
  subscription: { plan: 'free' | 'pro' | 'premium'; status: string; expiresAt?: string; };
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  journal: JournalEntry[];
  chatHistory: Message[];
  focusMinutes: number;
  streakDays: number;
  lifeScore: number;
  setUserProfile: (p: Partial<AppState['userProfile']>) => void;
  setSubscription: (s: Partial<AppState['subscription']>) => void;
  addTask: (t: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleHabit: (id: string) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  addJournalEntry: (e: JournalEntry) => void;
  addMessage: (m: Message) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  userProfile: { name: '', email: '', timezone: 'UTC' },
  subscription: { plan: 'free', status: 'active' },
  tasks: [
    { id: '1', title: 'Morning workout', completed: false, priority: 'high', area: 'health', dueDate: 'Today' },
    { id: '2', title: 'Review quarterly goals', completed: true, priority: 'high', area: 'career', dueDate: 'Today' },
    { id: '3', title: 'Read 30 minutes', completed: false, priority: 'medium', area: 'learning', dueDate: 'Today' },
    { id: '4', title: 'Meditate 10 min', completed: false, priority: 'medium', area: 'mindfulness', dueDate: 'Today' },
    { id: '5', title: 'Call family', completed: false, priority: 'low', area: 'relationships', dueDate: 'Today' },
  ],
  habits: [
    { id: '1', name: 'Morning Run', icon: '🏃', streak: 12, completedToday: true, area: 'health', frequency: 'daily', color: '#2ECC71' },
    { id: '2', name: 'Meditate', icon: '🧘', streak: 7, completedToday: false, area: 'mindfulness', frequency: 'daily', color: '#9B59B6' },
    { id: '3', name: 'Read', icon: '📚', streak: 21, completedToday: false, area: 'learning', frequency: 'daily', color: '#3498DB' },
    { id: '4', name: 'Journal', icon: '✍️', streak: 5, completedToday: true, area: 'mindfulness', frequency: 'daily', color: '#FF6B35' },
    { id: '5', name: 'No Sugar', icon: '🍎', streak: 3, completedToday: false, area: 'health', frequency: 'daily', color: '#E91E8C' },
  ],
  goals: [
    { id: '1', title: 'Run a 5K', area: 'health', progress: 3.2, target: 5, unit: 'km', deadline: '2024-06-01' },
    { id: '2', title: 'Save Emergency Fund', area: 'finance', progress: 7500, target: 10000, unit: '$', deadline: '2024-12-31' },
    { id: '3', title: 'Read 24 Books', area: 'learning', progress: 8, target: 24, unit: 'books', deadline: '2024-12-31' },
  ],
  journal: [],
  chatHistory: [],
  focusMinutes: 127,
  streakDays: 14,
  lifeScore: 78,
  setUserProfile: (p) => set((s) => ({ userProfile: { ...s.userProfile, ...p } })),
  setSubscription: (sub) => set((s) => ({ subscription: { ...s.subscription, ...sub } })),
  addTask: (t) => set((s) => ({ tasks: [t, ...s.tasks] })),
  toggleTask: (id) => set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) })),
  toggleHabit: (id) => set((s) => ({ habits: s.habits.map(h => h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : h.streak } : h) })),
  updateGoalProgress: (id, progress) => set((s) => ({ goals: s.goals.map(g => g.id === id ? { ...g, progress } : g) })),
  addJournalEntry: (e) => set((s) => ({ journal: [e, ...s.journal] })),
  addMessage: (m) => set((s) => ({ chatHistory: [...s.chatHistory, m] })),
  clearChat: () => set({ chatHistory: [] }),
}));