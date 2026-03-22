export const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'sk-placeholder';
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_placeholder';

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free', name: 'Free', price: 0, stripeProductId: '',
    features: ['10 AI questions/day', '3 subjects', 'Basic flashcards', 'Quiz mode', 'Progress tracking'],
  },
  {
    id: 'pro', name: 'Pro', price: 7.99, stripeProductId: 'prod_tutor_pro',
    features: ['Unlimited AI tutoring', 'All subjects', 'Unlimited flashcards', 'Practice tests', 'Essay feedback', 'Study schedule', 'Offline access', 'Analytics'],
  },
  {
    id: 'premium', name: 'Premium', price: 14.99, stripeProductId: 'prod_tutor_premium',
    features: ['Everything in Pro', 'Live AI sessions', 'Personalized curriculum', 'SAT/ACT prep', 'Code tutor', 'Multiple profiles', 'Priority AI'],
  },
];

export const COLORS = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  secondary: '#FF6584',
  accent: '#43E97B',
  background: '#0F0E17',
  surface: '#1A1926',
  surfaceLight: '#252336',
  text: '#FFFFFE',
  textSecondary: '#A7A9BE',
  border: '#2D2B45',
  white: '#FFFFFF',
  error: '#FF5C5C',
  success: '#43E97B',
  warning: '#FFB347',
  gold: '#FFD700',
};

export const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: '📐', color: '#FF6584' },
  { id: 'science', name: 'Science', icon: '🔬', color: '#43E97B' },
  { id: 'history', name: 'History', icon: '📜', color: '#FFB347' },
  { id: 'english', name: 'English', icon: '📚', color: '#6C63FF' },
  { id: 'programming', name: 'Programming', icon: '💻', color: '#00D2FF' },
  { id: 'physics', name: 'Physics', icon: '⚛️', color: '#FF9F43' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: '#48DBFB' },
  { id: 'biology', name: 'Biology', icon: '🧬', color: '#1DD1A1' },
  { id: 'economics', name: 'Economics', icon: '📊', color: '#F9CA24' },
  { id: 'languages', name: 'Languages', icon: '🌍', color: '#E17055' },
];