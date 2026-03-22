import { create } from 'zustand';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface FinancialProfile {
  income: number;
  savings: number;
  debt: number;
  goals: string[];
  plan: 'free' | 'pro' | 'premium';
}

interface AppState {
  user: { id: string; name: string; email: string } | null;
  profile: FinancialProfile;
  transactions: Transaction[];
  chatHistory: any[];
  isLoading: boolean;
  setUser: (user: any) => void;
  updateProfile: (profile: Partial<FinancialProfile>) => void;
  addTransaction: (tx: Transaction) => void;
  addChatMessage: (msg: any) => void;
  clearChat: () => void;
  setLoading: (val: boolean) => void;
  updatePlan: (plan: 'free' | 'pro' | 'premium') => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  profile: { income: 0, savings: 0, debt: 0, goals: [], plan: 'free' },
  transactions: [
    { id: '1', date: '2026-03-22', description: 'Salary', amount: 5500, category: 'Income', type: 'income' },
    { id: '2', date: '2026-03-21', description: 'Rent', amount: -1800, category: 'Housing', type: 'expense' },
    { id: '3', date: '2026-03-20', description: 'Groceries', amount: -280, category: 'Food', type: 'expense' },
    { id: '4', date: '2026-03-19', description: 'Netflix', amount: -18, category: 'Entertainment', type: 'expense' },
    { id: '5', date: '2026-03-18', description: 'Gas', amount: -65, category: 'Transport', type: 'expense' },
    { id: '6', date: '2026-03-17', description: 'Gym', amount: -45, category: 'Health', type: 'expense' },
    { id: '7', date: '2026-03-16', description: 'Restaurant', amount: -120, category: 'Food', type: 'expense' },
    { id: '8', date: '2026-03-15', description: 'Side Income', amount: 800, category: 'Income', type: 'income' },
  ],
  chatHistory: [],
  isLoading: false,
  setUser: (user) => set({ user }),
  updateProfile: (profile) => set((state) => ({ profile: { ...state.profile, ...profile } })),
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
  addChatMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
  clearChat: () => set({ chatHistory: [] }),
  setLoading: (isLoading) => set({ isLoading }),
  updatePlan: (plan) => set((state) => ({ profile: { ...state.profile, plan } })),
  logout: () => set({ user: null, chatHistory: [] }),
}));