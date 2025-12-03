// Message types for chat
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Personality configuration
export interface Personality {
  id: string;
  name: string;
  description: string;
  emoji: string;
  isPremium: boolean;
  systemPromptModifier: string;
}

// Texting style configuration
export interface TextingStyle {
  id: string;
  name: string;
  description: string;
}

// User settings stored in localStorage
export interface UserSettings {
  gfName: string;
  yourName: string;
  personality: string;
  backstory: string;
  textingStyle: string;
}

// Credit system
export interface CreditState {
  credits: number;
  isUnlimited: boolean;
  lastUpdated: string;
}

// API request/response types
export interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  gfName: string;
  yourName: string;
  personality: string;
  backstory: string;
  style: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

