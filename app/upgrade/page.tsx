'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '@/lib/constants';
import { getCredits } from '@/lib/storage';

/**
 * Upgrade Page - Stripe Checkout Integration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Stripe account at https://stripe.com
 * 
 * 2. In your Stripe Dashboard, create two products:
 *    - "100 Messages" - One-time payment of $3.99
 *    - "Unlimited Chat" - Recurring subscription of $4.99/month
 * 
 * 3. Copy the Price IDs for each product and add them to your .env.local:
 *    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 *    NEXT_PUBLIC_STRIPE_PRICE_100_MESSAGES=price_...
 *    NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED=price_...
 * 
 * 4. For production, create a webhook endpoint at /api/webhook to:
 *    - Handle successful payments
 *    - Add credits or set unlimited flag
 *    - Verify payment signatures
 * 
 * NOTE: This implementation uses client-side Stripe Checkout.
 * For a production app, consider server-side checkout for better security.
 */

// Initialize Stripe (lazy load)
const getStripe = () => {
  if (!STRIPE_CONFIG.publishableKey) {
    console.warn('Stripe publishable key is not configured');
    return null;
  }
  return loadStripe(STRIPE_CONFIG.publishableKey);
};

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [isUnlimited, setIsUnlimited] = useState(false);

  useEffect(() => {
    const state = getCredits();
    setCredits(state.credits);
    setIsUnlimited(state.isUnlimited);
  }, []);

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!priceId) {
      alert('Stripe is not configured. Please add your Stripe Price ID to the environment variables.');
      return;
    }

    setLoading(priceId);

    try {
      const stripe = await getStripe();
      
      if (!stripe) {
        alert('Stripe is not configured. Please add your Stripe Publishable Key to the environment variables.');
        setLoading(null);
        return;
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: mode,
        successUrl: `${window.location.origin}/success?type=${mode === 'subscription' ? 'unlimited' : 'credits'}`,
        cancelUrl: `${window.location.origin}/cancel`,
      });

      if (error) {
        console.error('Stripe error:', error);
        alert(error.message);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gf-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gf-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="mb-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Chat
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gf-pink-400 to-gf-purple-500 mb-6 heart-beat">
            <span className="text-4xl">💎</span>
          </div>
          <h1 className="text-4xl font-display font-bold gradient-text mb-4">
            Upgrade Your Experience
          </h1>
          <p className="text-white/60 text-lg max-w-md mx-auto">
            Unlock unlimited conversations with your AI girlfriend and premium personalities
          </p>
          
          {/* Current status */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
            <span className="text-white/60 text-sm">Current:</span>
            {isUnlimited ? (
              <span className="text-gf-pink-400 font-medium">Unlimited ✨</span>
            ) : (
              <span className="text-white font-medium">{credits} messages left</span>
            )}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* 100 Messages Pack */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-gf-pink-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gf-pink-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">💬</span>
                <h3 className="text-xl font-bold text-white">100 Messages</h3>
              </div>
              
              <p className="text-white/60 text-sm mb-6">
                Perfect for casual chatting. Get 100 additional messages to use anytime.
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold gradient-text">$3.99</span>
                <span className="text-white/40 text-sm ml-2">one-time</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-green-400">✓</span>
                  100 message credits
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-green-400">✓</span>
                  Access to all free personalities
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-green-400">✓</span>
                  Credits never expire
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-green-400">✓</span>
                  Premium personalities while credits last
                </li>
              </ul>

              <button
                onClick={() => handleCheckout(STRIPE_CONFIG.prices.messages100, 'payment')}
                disabled={loading !== null}
                className="w-full py-3 px-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading === STRIPE_CONFIG.prices.messages100 ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>
          </div>

          {/* Unlimited Plan */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden group border-gf-pink-500/30 hover:border-gf-pink-500/50 transition-all">
            {/* Popular badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-gf-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gf-pink-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">💎</span>
                <h3 className="text-xl font-bold text-white">Unlimited Chat</h3>
              </div>
              
              <p className="text-white/60 text-sm mb-6">
                The ultimate experience. Chat as much as you want with all premium features.
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold gradient-text">$4.99</span>
                <span className="text-white/40 text-sm ml-2">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-green-400">✓</span>
                  <strong className="text-white">Unlimited messages</strong>
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-green-400">✓</span>
                  <strong className="text-white">All personalities unlocked</strong>
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-green-400">✓</span>
                  Cancel anytime
                </li>
              </ul>

              <button
                onClick={() => handleCheckout(STRIPE_CONFIG.prices.unlimited, 'subscription')}
                disabled={loading !== null}
                className="w-full py-3 px-4 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-glow flex items-center justify-center gap-2"
              >
                {loading === STRIPE_CONFIG.prices.unlimited ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-6 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL Encrypted
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
              </svg>
              Powered by Stripe
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-center text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <details className="group glass rounded-xl p-4">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                Can I cancel my subscription anytime?
                <svg className="w-5 h-5 text-white/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-white/60 text-sm">
                Yes! You can cancel your Unlimited Chat subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </details>

            <details className="group glass rounded-xl p-4">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                Do message credits expire?
                <svg className="w-5 h-5 text-white/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-white/60 text-sm">
                No! Your purchased message credits never expire. Use them whenever you want.
              </p>
            </details>

            <details className="group glass rounded-xl p-4">
              <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                What payment methods do you accept?
                <svg className="w-5 h-5 text-white/40 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-white/60 text-sm">
                We accept all major credit cards, debit cards, and various local payment methods through Stripe.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

