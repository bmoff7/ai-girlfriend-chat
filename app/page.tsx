'use client';

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatPane from '@/components/ChatPane';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { getCredits } from '@/lib/storage';
import type { UserSettings, CreditState } from '@/lib/types';

export default function Home() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [credits, setCredits] = useState<CreditState>({
    credits: 25,
    isUnlimited: false,
    lastUpdated: new Date().toISOString(),
  });
  const [mounted, setMounted] = useState(false);

  // Load credits on mount
  useEffect(() => {
    setMounted(true);
    const currentCredits = getCredits();
    setCredits(currentCredits);
  }, []);

  // Refresh credits
  const refreshCredits = useCallback(() => {
    const currentCredits = getCredits();
    setCredits(currentCredits);
  }, []);

  // Handle settings change from sidebar
  const handleSettingsChange = useCallback((newSettings: UserSettings) => {
    setSettings(newSettings);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gf-pink-400 to-gf-purple-500 flex items-center justify-center animate-pulse">
            <span className="text-2xl">💕</span>
          </div>
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        onSettingsChange={handleSettingsChange} 
        credits={credits}
      />
      
      {/* Chat Area */}
      <ChatPane 
        settings={settings} 
        credits={credits}
        onCreditsChange={refreshCredits}
      />
    </main>
  );
}

