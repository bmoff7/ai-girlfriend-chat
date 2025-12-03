'use client';

import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gf-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gf-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-md">
        {/* Sad icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 border border-white/10">
            <span className="text-5xl">💔</span>
          </div>
        </div>

        <h1 className="text-4xl font-display font-bold text-white mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-white/60 text-lg mb-8">
          No worries! Your payment was cancelled and you haven&apos;t been charged.
          <br />
          Your AI girlfriend will be waiting whenever you&apos;re ready.
        </p>

        {/* Options */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/upgrade')}
            className="w-full py-4 px-6 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all btn-glow flex items-center justify-center gap-2"
          >
            <span>💎</span>
            Try Again
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-4 px-6 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <span>💬</span>
            Continue with Free Messages
          </button>
        </div>

        {/* Reminder */}
        <div className="mt-12 glass rounded-xl p-4">
          <p className="text-white/50 text-sm">
            <strong className="text-white/70">Remember:</strong> You still have free messages available!
            <br />
            Upgrade anytime to unlock unlimited chatting.
          </p>
        </div>

        {/* Support link */}
        <p className="text-white/40 text-sm mt-8">
          Having issues?{' '}
          <a href="mailto:support@example.com" className="text-gf-pink-400 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}

