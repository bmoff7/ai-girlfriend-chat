'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.push('/');
    return null;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        setEmailSent(true);
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        router.push('/');
      }
    }

    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
          <p className="text-white/60 mb-6">
            We sent a confirmation link to <strong className="text-white">{email}</strong>. 
            Click the link to complete your signup.
          </p>
          <button
            onClick={() => setEmailSent(false)}
            className="text-gf-pink-400 hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gf-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gf-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="glass rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gf-pink-400 to-gf-purple-500 mb-4">
              <span className="text-3xl">💕</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-white/60">
              {isSignUp 
                ? 'Sign up to save your chats and settings' 
                : 'Sign in to continue your conversation'}
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gf-pink-500/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gf-pink-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-white/60 text-sm mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-gf-pink-400 hover:underline font-medium"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-6 glass rounded-xl p-4">
          <p className="text-white/60 text-sm text-center mb-3">Why create an account?</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-white/70">
              <span className="text-green-400">✓</span>
              Your AI girlfriend remembers you
            </li>
            <li className="flex items-center gap-2 text-white/70">
              <span className="text-green-400">✓</span>
              Chat history saved forever
            </li>
            <li className="flex items-center gap-2 text-white/70">
              <span className="text-green-400">✓</span>
              Access from any device
            </li>
            <li className="flex items-center gap-2 text-white/70">
              <span className="text-green-400">✓</span>
              Purchases sync automatically
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

