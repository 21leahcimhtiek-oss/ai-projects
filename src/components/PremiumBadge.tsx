'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PremiumBadgeProps {
  tier: 'premium' | 'vip';
  size?: 'sm' | 'md' | 'lg';
}

export default function PremiumBadge({ tier, size = 'md' }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  if (tier === 'vip') {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} bg-gradient-to-r from-amber-500 to-yellow-400 text-black`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        VIP
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} bg-gradient-to-r from-primary-500 to-accent-500 text-white`}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Premium
    </motion.span>
  );
}

// Premium feature gate wrapper
interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredTier?: 'premium' | 'vip';
}

export function PremiumGate({ children, fallback, requiredTier = 'premium' }: PremiumGateProps) {
  // In production, check user's actual tier
  const userTier = 'free'; // This would come from useSubscription hook

  const tierHierarchy = { free: 0, premium: 1, vip: 2 };
  const hasAccess = tierHierarchy[userTier] >= tierHierarchy[requiredTier];

  if (!hasAccess) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
        <p className="text-gray-400 text-sm mb-4">
          Upgrade to {requiredTier === 'vip' ? 'VIP' : 'Premium'} to unlock this feature
        </p>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:opacity-90 transition-opacity">
          Upgrade Now
        </button>
      </div>
    );
  }

  return <>{children}</>;
}