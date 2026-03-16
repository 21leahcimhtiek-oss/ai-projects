'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SUBSCRIPTION_PLANS, PlanType } from './stripe-config';

interface SubscriptionContextType {
  tier: PlanType;
  customerId: string | null;
  subscriptionId: string | null;
  isLoading: boolean;
  upgradeToPlan: (plan: PlanType) => Promise<void>;
  openBillingPortal: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  hasFeature: (feature: string) => boolean;
  canSendMessage: () => boolean;
  canLike: () => boolean;
  remainingLikes: number;
  usedLikesToday: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const FREE_TIER_LIMITS = {
  likesPerDay: 5,
  messagesPerDay: 10,
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<PlanType>('free');
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usedLikesToday, setUsedLikesToday] = useState(0);

  useEffect(() => {
    // Load subscription status from localStorage (in production, fetch from API)
    const storedTier = localStorage.getItem('velvet_subscription_tier') as PlanType;
    const storedCustomerId = localStorage.getItem('velvet_customer_id');
    const storedSubscriptionId = localStorage.getItem('velvet_subscription_id');
    const storedLikesDate = localStorage.getItem('velvet_likes_date');
    const storedLikesCount = parseInt(localStorage.getItem('velvet_likes_count') || '0');

    if (storedTier && Object.keys(SUBSCRIPTION_PLANS).includes(storedTier)) {
      setTier(storedTier);
    }
    if (storedCustomerId) setCustomerId(storedCustomerId);
    if (storedSubscriptionId) setSubscriptionId(storedSubscriptionId);

    // Reset likes if it's a new day
    const today = new Date().toDateString();
    if (storedLikesDate === today) {
      setUsedLikesToday(storedLikesCount);
    } else {
      setUsedLikesToday(0);
      localStorage.setItem('velvet_likes_date', today);
      localStorage.setItem('velvet_likes_count', '0');
    }
  }, []);

  const upgradeToPlan = async (plan: PlanType) => {
    if (plan === 'free') {
      setTier('free');
      localStorage.setItem('velvet_subscription_tier', 'free');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: localStorage.getItem('velvet_user_email') || 'user@example.com',
          plan,
          name: localStorage.getItem('velvet_user_name'),
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openBillingPortal = async () => {
    if (!customerId) return;
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal failed:', error);
    }
  };

  const cancelSubscription = async () => {
    // In production, call API to cancel
    setTier('free');
    localStorage.setItem('velvet_subscription_tier', 'free');
  };

  const hasFeature = (feature: string): boolean => {
    const plan = SUBSCRIPTION_PLANS[tier];
    return plan.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
  };

  const canSendMessage = (): boolean => {
    if (tier !== 'free') return true;
    // Free tier has limited messages - in production, track this
    return true;
  };

  const canLike = (): boolean => {
    if (tier !== 'free') return true;
    return usedLikesToday < FREE_TIER_LIMITS.likesPerDay;
  };

  const remainingLikes = tier === 'free' 
    ? Math.max(0, FREE_TIER_LIMITS.likesPerDay - usedLikesToday)
    : Infinity;

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        customerId,
        subscriptionId,
        isLoading,
        upgradeToPlan,
        openBillingPortal,
        cancelSubscription,
        hasFeature,
        canSendMessage,
        canLike,
        remainingLikes,
        usedLikesToday,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}

// Higher-order component for premium feature gates
export function withPremiumFeature<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureName: string,
  fallback?: React.ReactNode
) {
  return function PremiumFeatureWrapper(props: P) {
    const { tier } = useSubscription();
    
    if (tier === 'free') {
      return fallback ? (
        <>{fallback}</>
      ) : (
        <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/30 text-center">
          <p className="text-primary-400 mb-2">🔒 Premium Feature</p>
          <p className="text-sm text-gray-400">Upgrade to access {featureName}</p>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
}