// App Configuration & Secrets
export const CONFIG = {
  // AI Provider
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  OPENAI_MODEL: 'gpt-4o',

  // Stripe
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_SECRET_KEY: process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY || '',

  // App
  APP_NAME: 'AI Health Coach',
  APP_VERSION: '1.0.0',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.auroraraye.com',

  // Subscription Plans
  PLANS: {
    FREE: {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['3 AI consultations/day', 'Basic health tracking', 'Step counter'],
    },
    PRO: {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
      features: [
        'Unlimited AI consultations',
        'Personalized meal plans',
        'Custom workout programs',
        'Sleep analysis',
        'Biometric tracking',
        'Priority support',
      ],
    },
    PREMIUM: {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      stripePriceId: process.env.EXPO_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
      features: [
        'Everything in Pro',
        'Live AI health coach sessions',
        'Lab result analysis',
        'Medication tracking & reminders',
        'Family health management',
        'Export health reports',
        '24/7 emergency AI support',
      ],
    },
  },

  // In-App Purchases (one-time)
  IAP_PRODUCTS: {
    MEAL_PLAN_PACK: 'com.auroraraye.aihealthcoach.mealplanpack',
    WORKOUT_PACK: 'com.auroraraye.aihealthcoach.workoutpack',
    HEALTH_REPORT: 'com.auroraraye.aihealthcoach.healthreport',
  },
};

export const COLORS = {
  primary: '#0A84FF',
  secondary: '#30D158',
  accent: '#FF6B6B',
  warning: '#FFD60A',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  success: '#34C759',
  error: '#FF3B30',
  gradient: ['#0A84FF', '#5AC8FA'],
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
};