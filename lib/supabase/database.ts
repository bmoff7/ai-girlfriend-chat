import { createClient } from './client';
import type { Database } from './types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

// =====================================================
// PROFILE FUNCTIONS
// =====================================================

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Update user profile settings
 */
export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates as Database['public']['Tables']['profiles']['Update'])
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

/**
 * Deduct one credit from user
 */
export async function deductCredit(): Promise<number> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return -1;

  // Get current profile
  const profile = await getProfile();
  if (!profile) return -1;

  // Unlimited users don't lose credits
  if (profile.is_unlimited) return Infinity;

  // No credits left
  if (profile.credits <= 0) return -1;

  // Deduct credit
  const newCredits = profile.credits - 1;
  const { error } = await supabase
    .from('profiles')
    .update({ credits: newCredits })
    .eq('id', user.id);

  if (error) {
    console.error('Error deducting credit:', error);
    return -1;
  }

  return newCredits;
}

/**
 * Add credits to user account
 */
export async function addCredits(amount: number): Promise<number> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const profile = await getProfile();
  if (!profile) return 0;

  if (profile.is_unlimited) return Infinity;

  const newCredits = profile.credits + amount;
  const { error } = await supabase
    .from('profiles')
    .update({ credits: newCredits })
    .eq('id', user.id);

  if (error) {
    console.error('Error adding credits:', error);
    return 0;
  }

  return newCredits;
}

/**
 * Set user to unlimited
 */
export async function setUnlimited(): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('profiles')
    .update({ is_unlimited: true })
    .eq('id', user.id);

  if (error) {
    console.error('Error setting unlimited:', error);
    return false;
  }

  return true;
}

// =====================================================
// MESSAGE FUNCTIONS
// =====================================================

/**
 * Get chat history for AI memory
 * Returns last N messages for context
 */
export async function getChatHistory(limit: number = 50): Promise<Message[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

/**
 * Save a message to chat history
 */
export async function saveMessage(
  role: 'user' | 'assistant',
  content: string
): Promise<Message | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('messages')
    .insert({
      user_id: user.id,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving message:', error);
    return null;
  }

  return data;
}

/**
 * Clear all chat history (start fresh)
 */
export async function clearChatHistory(): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }

  return true;
}

