'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { addCredits as localAddCredits, setUnlimited as localSetUnlimited } from '@/lib/storage';
import { addCredits, setUnlimited } from '@/lib/supabase/database';
import { CREDITS_100_PACK } from '@/lib/constants';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (processed) return;
    
    const type = searchParams.get('type');
    
    const processPayment = async () => {
      if (type === 'unlimited') {
        if (user) {
          await setUnlimited();
          await refreshProfile();
        } else {
          localSetUnlimited();
        }
      } else {
        if (user) {
          await addCredits(CREDITS_100_PACK);
          await refreshProfile();
        } else {
          localAddCredits(CREDITS_100_PACK);
        }
      }
      setProcessed(true);
    };

    processPayment();
  }, [searchParams, processed, user, refreshProfile]);

  const type = searchParams.get('type');
  const isUnlimited = type === 'unlimited';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gf-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative text-center max-w-md">
        {/* Success animation */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Confetti effect (CSS) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                backgroundColor: ['#ec4899', '#a855f7', '#10b981', '#f59e0b'][i % 4],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>

        <h1 className="text-4xl font-display font-bold gradient-text mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-white/60 text-lg mb-8">
          {isUnlimited ? (
            <>
              Welcome to <strong className="text-gf-pink-400">Unlimited Chat</strong>!
              <br />
              You now have unlimited messages and all premium personalities.
            </>
          ) : (
            <>
              <strong className="text-gf-pink-400">100 credits</strong> have been added to your account!
              <br />
              Enjoy chatting with your AI girlfriend.
            </>
          )}
        </p>

        {/* What you got */}
        <div className="glass rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span>✨</span>
            {isUnlimited ? 'Your Premium Benefits' : 'Your Purchase'}
          </h3>
          
          <ul className="space-y-3">
            {isUnlimited ? (
              <>
                <li className="flex items-center gap-3 text-white/70">
                  <span className="text-green-400 text-lg">✓</span>
                  Unlimited messages forever
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <span className="text-green-400 text-lg">✓</span>
                  All 5 personalities unlocked
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-3 text-white/70">
                  <span className="text-green-400 text-lg">✓</span>
                  100 message credits added
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <span className="text-green-400 text-lg">✓</span>
                  Credits never expire
                </li>
                <li className="flex items-center gap-3 text-white/70">
                  <span className="text-green-400 text-lg">✓</span>
                  Premium personalities while credits last
                </li>
              </>
            )}
          </ul>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full py-4 px-6 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all btn-glow flex items-center justify-center gap-2 text-lg"
        >
          <span>💕</span>
          Start Chatting
        </button>

        <p className="text-white/40 text-sm mt-6">
          A receipt has been sent to your email address.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gf-pink-500"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
