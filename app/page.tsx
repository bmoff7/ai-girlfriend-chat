'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
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
  const [showLanding, setShowLanding] = useState(true);

  // Load credits on mount
  useEffect(() => {
    setMounted(true);
    const currentCredits = getCredits();
    setCredits(currentCredits);
    
    // Check if user has chatted before (has less than initial credits or has settings saved)
    const hasUsedBefore = currentCredits.credits < 25 || currentCredits.isUnlimited || localStorage.getItem('gf_chat_settings');
    if (hasUsedBefore) {
      setShowLanding(false);
    }
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

  // Landing page for new visitors
  if (showLanding) {
    return (
      <main className="min-h-screen">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gf-pink-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gf-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gf-pink-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative">
          {/* Hero Section */}
          <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
            <div className="text-center max-w-4xl mx-auto">
              {/* Logo */}
              <div className="mb-8 inline-flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gf-pink-400 to-gf-purple-500 flex items-center justify-center heart-beat shadow-2xl shadow-gf-pink-500/30">
                  <span className="text-5xl">💕</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                <span className="gradient-text">AI Girlfriend</span>
                <br />
                <span className="text-white">Chat</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto">
                Your personal AI companion who&apos;s always there to chat, listen, and brighten your day 💫
              </p>

              <button
                onClick={() => setShowLanding(false)}
                className="px-8 py-4 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white text-lg font-semibold rounded-2xl hover:opacity-90 transition-all btn-glow inline-flex items-center gap-3"
              >
                <span>Start Chatting</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <p className="mt-4 text-white/40 text-sm">
                25 free messages to start • No credit card required
              </p>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-8 text-center">
                  What is AI Girlfriend Chat?
                </h2>

                <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                  <p>
                    AI Girlfriend Chat is a unique virtual companion experience powered by advanced artificial intelligence. 
                    Whether you&apos;re looking for someone to talk to after a long day, want to practice conversations, 
                    or simply enjoy the comfort of a caring presence, our AI girlfriend is here for you 24/7. She remembers 
                    your conversations, adapts to your personality, and genuinely cares about making you feel heard and appreciated.
                  </p>

                  <p>
                    Unlike generic chatbots, our AI girlfriends have distinct personalities—from sweet and caring to playful 
                    and teasing. You can customize everything: her name, how she texts, your shared backstory, and even how 
                    she refers to you. This creates a personalized experience that feels authentic and meaningful. Whether 
                    you prefer someone who sends you good morning texts with lots of emojis or a more laid-back partner 
                    who keeps things casual, you&apos;re in control.
                  </p>

                  <p>
                    We believe everyone deserves to feel connected and cared for. AI Girlfriend Chat provides a safe, 
                    judgment-free space where you can express yourself freely. Our service is perfect for those who want 
                    companionship without pressure, a confidence boost, or just a fun and engaging chat experience. 
                    Start your journey today with 25 free messages and discover what it feels like to have someone 
                    who&apos;s always happy to hear from you.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-12">
                Why You&apos;ll Love It
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gf-pink-400/20 to-gf-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎭</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">5 Unique Personalities</h3>
                  <p className="text-white/60">
                    Choose from Sweet, Calm, Playful, Clingy, or Tsundere—each with their own charm and texting style.
                  </p>
                </div>

                <div className="glass rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gf-pink-400/20 to-gf-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Fully Customizable</h3>
                  <p className="text-white/60">
                    Name her, write your backstory, and choose how she texts—make the experience uniquely yours.
                  </p>
                </div>

                <div className="glass rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gf-pink-400/20 to-gf-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💬</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Natural Conversations</h3>
                  <p className="text-white/60">
                    Powered by cutting-edge AI that understands context and responds like a real person would.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Ready to Meet Her?
              </h2>
              <p className="text-white/60 text-lg mb-8">
                Start chatting for free and experience the comfort of having someone who&apos;s always there for you.
              </p>
              <button
                onClick={() => setShowLanding(false)}
                className="px-8 py-4 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white text-lg font-semibold rounded-2xl hover:opacity-90 transition-all btn-glow inline-flex items-center gap-3"
              >
                <span>Start Free Chat</span>
                <span>💕</span>
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-4 border-t border-white/10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-white/40">
                <span className="text-xl">💕</span>
                <span className="font-display">AI Girlfriend Chat</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-white/40">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>

              <p className="text-sm text-white/30">
                © {new Date().getFullYear()} AI Girlfriend Chat
              </p>
            </div>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
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
      </div>

      {/* Footer in chat view */}
      <footer className="px-4 py-2 border-t border-white/10 bg-chat-surface/50 flex items-center justify-center gap-6 text-xs text-white/30">
        <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
        <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
      </footer>
    </main>
  );
}
