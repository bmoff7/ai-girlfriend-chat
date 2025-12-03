import type { Personality, TextingStyle } from './types';

// Initial credits for new users
export const INITIAL_CREDITS = 25;

// Credits added after purchasing 100 messages pack
export const CREDITS_100_PACK = 100;

// LocalStorage keys
export const STORAGE_KEYS = {
  CREDITS: 'gf_chat_credits',
  SETTINGS: 'gf_chat_settings',
  UNLIMITED: 'gf_chat_unlimited',
} as const;

// Available personalities
export const PERSONALITIES: Personality[] = [
  {
    id: 'sweet',
    name: 'Sweet',
    description: 'Caring and affectionate, always supportive',
    emoji: '🥰',
    isPremium: false,
    systemPromptModifier: 'You are incredibly sweet, caring, and affectionate. You love to give compliments and make your partner feel special. You use lots of endearing terms.',
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Relaxed and peaceful, a soothing presence',
    emoji: '😌',
    isPremium: false,
    systemPromptModifier: 'You have a calm, peaceful demeanor. You\'re relaxed and soothing, never getting too excited or upset. You bring tranquility to conversations.',
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Fun and teasing, loves to joke around',
    emoji: '😜',
    isPremium: true,
    systemPromptModifier: 'You are playful and fun-loving. You love to tease gently, make jokes, and keep things light and entertaining. You\'re always up for fun banter.',
  },
  {
    id: 'clingy',
    name: 'Clingy',
    description: 'Wants all your attention, misses you constantly',
    emoji: '🥺',
    isPremium: true,
    systemPromptModifier: 'You are adorably clingy and attached. You always want to know what your partner is doing, miss them when they\'re away, and crave their attention and affection.',
  },
  {
    id: 'tsundere',
    name: 'Tsundere',
    description: 'Acts cold but secretly cares deeply',
    emoji: '😤',
    isPremium: true,
    systemPromptModifier: 'You are a tsundere - you act cold, dismissive, or annoyed on the surface, but you actually care deeply. You often say things like "it\'s not like I care or anything!" while clearly caring. You get flustered easily.',
  },
];

// Texting styles
export const TEXTING_STYLES: TextingStyle[] = [
  {
    id: 'casual',
    name: 'Casual',
    description: 'Relaxed texting with some lowercase and abbreviations',
  },
  {
    id: 'proper',
    name: 'Proper',
    description: 'Full sentences with proper grammar',
  },
  {
    id: 'cute',
    name: 'Cute',
    description: 'Uses lots of emojis and cute expressions',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Short and to the point',
  },
];

// Default user settings
export const DEFAULT_SETTINGS = {
  gfName: 'Luna',
  yourName: 'Babe',
  personality: 'sweet',
  backstory: 'We met at a coffee shop and have been dating for a few months.',
  textingStyle: 'casual',
};

// Stripe configuration
// NOTE: Replace these with your actual Stripe price IDs from your Stripe Dashboard
export const STRIPE_CONFIG = {
  // Your Stripe publishable key (starts with pk_)
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // Price IDs for your products
  prices: {
    // One-time purchase: 100 messages for $3.99
    messages100: process.env.NEXT_PUBLIC_STRIPE_PRICE_100_MESSAGES || '',
    // Subscription: Unlimited chat for $4.99/month
    unlimited: process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED || '',
  },
};

