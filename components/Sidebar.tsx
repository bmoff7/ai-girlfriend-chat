'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PERSONALITIES, TEXTING_STYLES, DEFAULT_SETTINGS } from '@/lib/constants';
import { getUserSettings, saveUserSettings, getCredits, hasUnlimited } from '@/lib/storage';
import { useAuth } from '@/components/AuthProvider';
import { updateProfile } from '@/lib/supabase/database';
import type { UserSettings, CreditState } from '@/lib/types';
import AdUnit from './AdUnit';
import PaywallModal from './PaywallModal';

interface SidebarProps {
  onSettingsChange: (settings: UserSettings) => void;
  credits: CreditState;
}

export default function Sidebar({ onSettingsChange, credits }: SidebarProps) {
  const router = useRouter();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [lockedPersonality, setLockedPersonality] = useState<string>('');

  // Load settings on mount
  useEffect(() => {
    if (user && profile) {
      // Load from Supabase profile
      const profileSettings: UserSettings = {
        gfName: profile.gf_name,
        yourName: profile.your_name,
        personality: profile.personality,
        backstory: profile.backstory,
        textingStyle: profile.texting_style,
      };
      setSettings(profileSettings);
      onSettingsChange(profileSettings);
    } else {
      // Load from localStorage for non-authenticated users
      const saved = getUserSettings();
      setSettings(saved);
      onSettingsChange(saved);
    }
  }, [user, profile, onSettingsChange]);

  // Update settings helper
  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);

    if (user) {
      // Save to Supabase
      const dbKey = key === 'gfName' ? 'gf_name' 
        : key === 'yourName' ? 'your_name'
        : key === 'textingStyle' ? 'texting_style'
        : key;
      
      await updateProfile({ [dbKey]: value });
      await refreshProfile();
    } else {
      // Save to localStorage
      saveUserSettings(newSettings);
    }
  };

  // Handle personality selection
  const handlePersonalitySelect = (personalityId: string) => {
    const personality = PERSONALITIES.find((p) => p.id === personalityId);
    
    if (personality?.isPremium) {
      // Check if user has purchased (unlimited or bought credits)
      const hasPurchased = user && profile 
        ? (profile.is_unlimited || profile.has_purchased)
        : (hasUnlimited() || getCredits().hasPurchased);
      
      if (!hasPurchased) {
        setLockedPersonality(personality.name);
        setShowPaywall(true);
        return;
      }
    }
    
    updateSetting('personality', personalityId);
  };

  return (
    <>
      <aside
        className={`h-full bg-chat-surface/80 backdrop-blur-md border-r border-white/10 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-80'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gf-pink-400 to-gf-purple-500 flex items-center justify-center">
                <span className="text-lg">💕</span>
              </div>
              <div>
                <h1 className="font-display font-bold text-white">AI Girlfriend</h1>
                <p className="text-xs text-white/50">Chat</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* User Status */}
            {user ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-400 font-medium">Signed In</span>
                </div>
                <p className="text-xs text-white/50 truncate">{user.email}</p>
                <button
                  onClick={signOut}
                  className="mt-2 text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="w-full py-2.5 px-4 bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign in to save chats
              </button>
            )}

            {/* Credits Display */}
            <div className="bg-gradient-to-r from-gf-pink-500/20 to-gf-purple-500/20 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-medium">Messages Left</span>
                {credits.isUnlimited && (
                  <span className="text-xs bg-gradient-to-r from-gf-pink-500 to-gf-purple-500 text-white px-2 py-0.5 rounded-full">
                    UNLIMITED
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold gradient-text">
                  {credits.isUnlimited ? '∞' : credits.credits}
                </span>
                {!credits.isUnlimited && (
                  <span className="text-xs text-white/40">credits</span>
                )}
              </div>
              {!credits.isUnlimited && credits.credits <= 5 && credits.credits > 0 && (
                <p className="text-xs text-yellow-400/80 mt-2">
                  ⚠️ Running low on messages!
                </p>
              )}
            </div>

            {/* Upgrade Button */}
            <button
              onClick={() => router.push('/upgrade')}
              className="w-full py-3 px-4 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all btn-glow flex items-center justify-center gap-2"
            >
              <span>💎</span>
              <span>Upgrade</span>
            </button>

            {/* Girlfriend Name */}
            <div>
              <label className="block text-xs text-white/60 font-medium mb-2">
                Her Name
              </label>
              <input
                type="text"
                value={settings.gfName}
                onChange={(e) => updateSetting('gfName', e.target.value)}
                placeholder="Luna"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:border-gf-pink-500/50 transition-colors"
              />
            </div>

            {/* Your Nickname */}
            <div>
              <label className="block text-xs text-white/60 font-medium mb-2">
                She Calls You
              </label>
              <input
                type="text"
                value={settings.yourName}
                onChange={(e) => updateSetting('yourName', e.target.value)}
                placeholder="Babe"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:border-gf-pink-500/50 transition-colors"
              />
            </div>

            {/* Personality Selector */}
            <div>
              <label className="block text-xs text-white/60 font-medium mb-2">
                Personality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PERSONALITIES.map((p) => {
                  const isLocked = p.isPremium && !credits.isUnlimited && !credits.hasPurchased;
                  const isSelected = settings.personality === p.id;
                  
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePersonalitySelect(p.id)}
                      className={`relative px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white'
                          : isLocked
                          ? 'bg-white/5 text-white/30 cursor-pointer'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1">
                        <span>{p.emoji}</span>
                        <span>{p.name}</span>
                        {p.isPremium && (
                          <span className="text-[10px]">
                            {isLocked ? '🔒' : '⭐'}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Texting Style */}
            <div>
              <label className="block text-xs text-white/60 font-medium mb-2">
                Texting Style
              </label>
              <select
                value={settings.textingStyle}
                onChange={(e) => updateSetting('textingStyle', e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-gf-pink-500/50 transition-colors appearance-none cursor-pointer"
              >
                {TEXTING_STYLES.map((style) => (
                  <option key={style.id} value={style.id} className="bg-chat-surface">
                    {style.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Backstory */}
            <div>
              <label className="block text-xs text-white/60 font-medium mb-2">
                Your Backstory
              </label>
              <textarea
                value={settings.backstory}
                onChange={(e) => updateSetting('backstory', e.target.value)}
                placeholder="How did you two meet? What's your relationship like?"
                rows={3}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:border-gf-pink-500/50 transition-colors resize-none"
              />
            </div>

            {/* Ad Unit */}
            {!credits.isUnlimited && <AdUnit />}
          </div>
        )}

        {/* Collapsed state icons */}
        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center py-4 space-y-4">
            <button
              onClick={() => router.push('/upgrade')}
              className="p-3 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 rounded-xl text-white hover:opacity-90 transition-opacity"
              title="Upgrade"
            >
              💎
            </button>
            <div
              className="p-3 bg-white/10 rounded-xl text-white/60"
              title={`${credits.isUnlimited ? 'Unlimited' : credits.credits} credits`}
            >
              {credits.isUnlimited ? '∞' : credits.credits}
            </div>
          </div>
        )}
      </aside>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        type="premium-personality"
        personalityName={lockedPersonality}
      />
    </>
  );
}
