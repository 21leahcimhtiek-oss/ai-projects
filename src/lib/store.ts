import { create } from 'zustand'
import { User, Match, Message } from '@/types'

interface AppState {
  // Auth state
  user: User | null
  isAuthenticated: boolean
  isOnboarded: boolean
  
  // UI state
  currentView: 'discover' | 'matches' | 'messages' | 'profile' | 'settings'
  selectedMatch: Match | null
  
  // Data
  matches: Match[]
  messages: Record<string, Message[]>
  potentialMatches: User[]
  
  // Actions
  setUser: (user: User | null) => void
  setOnboarded: (status: boolean) => void
  setCurrentView: (view: AppState['currentView']) => void
  setSelectedMatch: (match: Match | null) => void
  addMatch: (match: Match) => void
  removeMatch: (matchId: string) => void
  addMessage: (matchId: string, message: Message) => void
  setPotentialMatches: (users: User[]) => void
  removePotentialMatch: (userId: string) => void
  logout: () => void
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  currentView: 'discover',
  selectedMatch: null,
  matches: [],
  messages: {},
  potentialMatches: [],
  
  // Actions
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isOnboarded: !!(user?.bio && user?.photos.length > 0)
  }),
  
  setOnboarded: (status) => set({ isOnboarded: status }),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setSelectedMatch: (match) => set({ selectedMatch: match }),
  
  addMatch: (match) => set((state) => ({
    matches: [match, ...state.matches]
  })),
  
  removeMatch: (matchId) => set((state) => ({
    matches: state.matches.filter(m => m.id !== matchId)
  })),
  
  addMessage: (matchId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [matchId]: [...(state.messages[matchId] || []), message]
    }
  })),
  
  setPotentialMatches: (users) => set({ potentialMatches: users }),
  
  removePotentialMatch: (userId) => set((state) => ({
    potentialMatches: state.potentialMatches.filter(u => u.id !== userId)
  })),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    isOnboarded: false,
    matches: [],
    messages: {},
    potentialMatches: []
  })
}))