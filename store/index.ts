import { create } from 'zustand';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; }
interface FlashCard { id: string; front: string; back: string; subject: string; mastered: boolean; }
interface StudySession { id: string; subject: string; duration: number; score: number; date: Date; }

interface AppState {
  userProfile: { name: string; email: string; grade: string; goals: string[] };
  subscription: { plan: 'free' | 'pro' | 'premium'; status: string; expiresAt?: string };
  chatHistory: Message[];
  flashCards: FlashCard[];
  studySessions: StudySession[];
  currentSubject: string;
  streakDays: number;
  totalPoints: number;
  setUserProfile: (profile: Partial<AppState['userProfile']>) => void;
  setSubscription: (sub: Partial<AppState['subscription']>) => void;
  addMessage: (msg: Message) => void;
  clearChat: () => void;
  addFlashCard: (card: FlashCard) => void;
  toggleMastered: (id: string) => void;
  addStudySession: (session: StudySession) => void;
  setCurrentSubject: (subject: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userProfile: { name: '', email: '', grade: '', goals: [] },
  subscription: { plan: 'free', status: 'active' },
  chatHistory: [],
  flashCards: [
    { id: '1', front: 'What is the Pythagorean theorem?', back: 'a² + b² = c²', subject: 'math', mastered: false },
    { id: '2', front: 'What is photosynthesis?', back: 'Process by which plants convert light to energy using CO₂ and water', subject: 'science', mastered: true },
    { id: '3', front: 'When did World War II end?', back: '1945 — Germany surrendered May 8, Japan September 2', subject: 'history', mastered: false },
    { id: '4', front: 'What is a metaphor?', back: 'A figure of speech comparing two unlike things without using like or as', subject: 'english', mastered: false },
    { id: '5', front: 'What is Big O notation?', back: 'A way to describe algorithm time/space complexity as input grows', subject: 'programming', mastered: true },
  ],
  studySessions: [],
  currentSubject: 'math',
  streakDays: 7,
  totalPoints: 1250,
  setUserProfile: (profile) => set((s) => ({ userProfile: { ...s.userProfile, ...profile } })),
  setSubscription: (sub) => set((s) => ({ subscription: { ...s.subscription, ...sub } })),
  addMessage: (msg) => set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
  clearChat: () => set({ chatHistory: [] }),
  addFlashCard: (card) => set((s) => ({ flashCards: [...s.flashCards, card] })),
  toggleMastered: (id) => set((s) => ({ flashCards: s.flashCards.map(c => c.id === id ? { ...c, mastered: !c.mastered } : c) })),
  addStudySession: (session) => set((s) => ({ studySessions: [...s.studySessions, session] })),
  setCurrentSubject: (subject) => set({ currentSubject: subject }),
}));