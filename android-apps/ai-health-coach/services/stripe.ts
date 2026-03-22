import { CONFIG } from '../constants/config';

export interface SubscriptionStatus {
  isActive: boolean;
  plan: 'free' | 'pro' | 'premium';
  expiresAt?: string;
  customerId?: string;
}

export const stripeService = {
  async createCheckoutSession(priceId: string, userId: string): Promise<string> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/stripe/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId, appId: 'ai-health-coach' }),
      });
      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error('Failed to create checkout session');
    }
  },

  async createSubscription(priceId: string, paymentMethodId: string, userId: string): Promise<any> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/stripe/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, paymentMethodId, userId, appId: 'ai-health-coach' }),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to create subscription');
    }
  },

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/stripe/subscription/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return { isActive: false, plan: 'free' };
    }
  },

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/stripe/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      return false;
    }
  },

  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<string> {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/stripe/payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });
      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      throw new Error('Failed to create payment intent');
    }
  },
};