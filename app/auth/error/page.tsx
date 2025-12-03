import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-4">
            <span className="text-4xl">😢</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        
        <p className="text-white/60 mb-8">
          Something went wrong during sign in. Please try again.
        </p>
        
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

