import { STORAGE_KEYS, INITIAL_CREDITS, CREDITS_100_PACK, DEFAULT_SETTINGS } from './constants';
import type { CreditState, UserSettings } from './types';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Get the current credit state from localStorage
 */
export function getCredits(): CreditState {
  if (!isBrowser) {
    return { credits: INITIAL_CREDITS, isUnlimited: false, lastUpdated: new Date().toISOString() };
  }

  try {
    // Check for unlimited flag
    const unlimitedFlag = localStorage.getItem(STORAGE_KEYS.UNLIMITED);
    if (unlimitedFlag === 'true') {
      return { credits: Infinity, isUnlimited: true, lastUpdated: new Date().toISOString() };
    }

    // Get credits
    const stored = localStorage.getItem(STORAGE_KEYS.CREDITS);
    if (stored) {
      const parsed = JSON.parse(stored) as CreditState;
      return parsed;
    }

    // Initialize with default credits for new users
    const initial: CreditState = {
      credits: INITIAL_CREDITS,
      isUnlimited: false,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(initial));
    return initial;
  } catch {
    return { credits: INITIAL_CREDITS, isUnlimited: false, lastUpdated: new Date().toISOString() };
  }
}

/**
 * Deduct one credit after a message
 * Returns the new credit count, or -1 if user has no credits
 */
export function deductCredit(): number {
  if (!isBrowser) return -1;

  const state = getCredits();
  
  // Unlimited users don't lose credits
  if (state.isUnlimited) {
    return Infinity;
  }

  // No credits left
  if (state.credits <= 0) {
    return -1;
  }

  // Deduct credit
  const newState: CreditState = {
    credits: state.credits - 1,
    isUnlimited: false,
    lastUpdated: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(newState));
  return newState.credits;
}

/**
 * Add credits after purchasing 100 messages pack
 */
export function addCredits(amount: number = CREDITS_100_PACK): number {
  if (!isBrowser) return 0;

  const state = getCredits();
  
  // If already unlimited, no need to add credits
  if (state.isUnlimited) {
    return Infinity;
  }

  const newState: CreditState = {
    credits: state.credits + amount,
    isUnlimited: false,
    lastUpdated: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(newState));
  return newState.credits;
}

/**
 * Set unlimited chat access
 */
export function setUnlimited(): void {
  if (!isBrowser) return;

  localStorage.setItem(STORAGE_KEYS.UNLIMITED, 'true');
  
  const state: CreditState = {
    credits: Infinity,
    isUnlimited: true,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.CREDITS, JSON.stringify(state));
}

/**
 * Check if user can send a message (has credits or unlimited)
 */
export function canSendMessage(): boolean {
  const state = getCredits();
  return state.isUnlimited || state.credits > 0;
}

/**
 * Check if user has unlimited access
 */
export function hasUnlimited(): boolean {
  if (!isBrowser) return false;
  return localStorage.getItem(STORAGE_KEYS.UNLIMITED) === 'true';
}

/**
 * Get user settings from localStorage
 */
export function getUserSettings(): UserSettings {
  if (!isBrowser) return DEFAULT_SETTINGS;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user settings to localStorage
 */
export function saveUserSettings(settings: Partial<UserSettings>): void {
  if (!isBrowser) return;

  const current = getUserSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}

/**
 * Clear all stored data (for testing/reset purposes)
 */
export function clearAllData(): void {
  if (!isBrowser) return;

  localStorage.removeItem(STORAGE_KEYS.CREDITS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.UNLIMITED);
}

