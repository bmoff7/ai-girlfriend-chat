'use client';

import { useRouter } from 'next/navigation';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'no-credits' | 'premium-personality';
  personalityName?: string;
}

export default function PaywallModal({
  isOpen,
  onClose,
  type,
  personalityName,
}: PaywallModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-chat-surface to-chat-bg border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Heart icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gf-pink-500 to-gf-purple-600 flex items-center justify-center heart-beat">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        {type === 'no-credits' ? (
          <>
            <h2 className="text-xl font-bold text-center gradient-text mb-2">
              You&apos;re out of messages! 💔
            </h2>
            <p className="text-white/60 text-center text-sm mb-6">
              Your free messages have run out. Upgrade to keep chatting with your AI girlfriend!
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-center gradient-text mb-2">
              Unlock {personalityName} Personality 🔒
            </h2>
            <p className="text-white/60 text-center text-sm mb-6">
              Premium personalities require active credits or Unlimited Chat access.
            </p>
          </>
        )}

        {/* Options */}
        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full py-3 px-4 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all btn-glow flex items-center justify-center gap-2"
          >
            <span>💎</span>
            <span>Get Unlimited Chat – $4.99/mo</span>
          </button>

          <button
            onClick={handleUpgrade}
            className="w-full py-3 px-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <span>💬</span>
            <span>Buy 100 Messages – $3.99</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-white/40 text-sm hover:text-white/60 transition-colors"
          >
            Maybe later
          </button>
        </div>

        {/* Benefits */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center mb-3">What you get:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-white/60">
              <span className="text-green-400">✓</span>
              Unlimited messages
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <span className="text-green-400">✓</span>
              All personalities
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

