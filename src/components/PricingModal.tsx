'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/lib/subscription-context';
import { SUBSCRIPTION_PLANS, PlanType } from '@/lib/stripe-config';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPlan?: PlanType;
}

export default function PricingModal({ isOpen, onClose, preselectedPlan }: PricingModalProps) {
  const { tier: currentTier, upgradeToPlan, isLoading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = React.useState<PlanType>(preselectedPlan || 'premium');

  const plans = Object.entries(SUBSCRIPTION_PLANS).filter(([key]) => key !== 'free') as [PlanType, typeof SUBSCRIPTION_PLANS.premium][];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Upgrade Your Experience</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {plans.map(([planKey, plan]) => (
                <motion.div
                  key={planKey}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-xl p-6 cursor-pointer transition-all ${
                    selectedPlan === planKey
                      ? 'bg-gradient-to-br from-primary-500/20 to-accent-500/20 border-2 border-primary-500'
                      : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedPlan(planKey)}
                >
                  {planKey === 'vip' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      BEST VALUE
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => upgradeToPlan(selectedPlan)}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : `Upgrade to ${SUBSCRIPTION_PLANS[selectedPlan].name}`}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-gray-500">
              Cancel anytime. All transactions are secure and encrypted.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}