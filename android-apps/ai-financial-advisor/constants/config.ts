export const CONFIG = {
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  OPENAI_MODEL: 'gpt-4o',
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.auroraraye.com',
  APP_NAME: 'AI Financial Advisor',
  APP_VERSION: '1.0.0',

  PLANS: {
    FREE: {
      id: 'free', name: 'Free', price: 0,
      features: ['5 AI queries/day', 'Basic budget tracking', 'Expense categories'],
    },
    PRO: {
      id: 'pro', name: 'Pro', price: 14.99,
      stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PRO_PRICE_ID || '',
      features: [
        'Unlimited AI financial advice',
        'Investment portfolio analysis',
        'Tax optimization strategies',
        'Debt payoff planner',
        'Net worth tracking',
        'Bill negotiation AI',
        'Retirement planning',
      ],
    },
    PREMIUM: {
      id: 'premium', name: 'Premium', price: 29.99,
      stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID || '',
      features: [
        'Everything in Pro',
        'Real-time market analysis',
        'AI stock & crypto insights',
        'Business financial planning',
        'Tax filing assistance',
        'Family wealth management',
        'Personal CFO reports',
      ],
    },
  },
};

export const COLORS = {
  primary: '#00C851',
  secondary: '#007BFF',
  accent: '#FFD700',
  danger: '#FF4444',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  success: '#28A745',
  error: '#DC3545',
  positive: '#00C851',
  negative: '#FF4444',
  cardBg: '#FFFFFF',
};