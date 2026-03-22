export const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'sk-placeholder';
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_placeholder';

export const SUBSCRIPTION_PLANS = [
  { id: 'free', name: 'Free', price: 0, stripeProductId: '', features: ['5 AI tasks/day', 'Basic todos', 'Simple habits', '1 goal', 'Daily journal'] },
  { id: 'pro', name: 'Pro', price: 9.99, stripeProductId: 'prod_lifeos_pro', features: ['Unlimited AI tasks', 'Smart scheduling', 'Unlimited habits', 'Unlimited goals', 'AI life coach', 'Focus timer', 'Weekly reviews', 'Analytics'] },
  { id: 'premium', name: 'Premium', price: 19.99, stripeProductId: 'prod_lifeos_premium', features: ['Everything in Pro', 'AI vision board', 'Life areas dashboard', 'Personal OKRs', 'AI daily briefing', 'Yearly planning', 'API integrations', 'Priority support'] },
];

export const COLORS = {
  primary: '#FF6B35',
  primaryDark: '#E55A24',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  background: '#0A0A0F',
  surface: '#14141E',
  surfaceLight: '#1E1E2E',
  text: '#F8F8FF',
  textSecondary: '#9B9BC0',
  border: '#2A2A3E',
  white: '#FFFFFF',
  error: '#FF5C78',
  success: '#4ECDC4',
  warning: '#FFE66D',
  purple: '#9B59B6',
  blue: '#3498DB',
  green: '#2ECC71',
  pink: '#E91E8C',
};

export const LIFE_AREAS = [
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#2ECC71' },
  { id: 'career', name: 'Career & Work', icon: '💼', color: '#3498DB' },
  { id: 'finance', name: 'Finance', icon: '💰', color: '#F39C12' },
  { id: 'relationships', name: 'Relationships', icon: '❤️', color: '#E91E8C' },
  { id: 'learning', name: 'Learning', icon: '📚', color: '#9B59B6' },
  { id: 'mindfulness', name: 'Mindfulness', icon: '🧘', color: '#1ABC9C' },
  { id: 'creativity', name: 'Creativity', icon: '🎨', color: '#FF6B35' },
  { id: 'social', name: 'Social Life', icon: '🌟', color: '#FFE66D' },
];