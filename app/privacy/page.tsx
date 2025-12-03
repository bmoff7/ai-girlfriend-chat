import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Girlfriend Chat',
  description: 'Privacy Policy for AI Girlfriend Chat - Learn how we protect your data and privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gf-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gf-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Chat
        </Link>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-3xl font-display font-bold gradient-text mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-white/70">
            <p className="text-sm text-white/50">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                Welcome to AI Girlfriend Chat. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Chat Messages:</strong> The conversations you have with your AI companion are processed to generate responses but are not permanently stored on our servers.</li>
                <li><strong className="text-white">Local Storage Data:</strong> Your preferences (girlfriend name, personality settings, etc.) are stored locally in your browser.</li>
                <li><strong className="text-white">Payment Information:</strong> If you make a purchase, payment processing is handled securely by Stripe. We do not store your credit card details.</li>
                <li><strong className="text-white">Analytics:</strong> We may collect anonymous usage data to improve our service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our AI chat service</li>
                <li>Process your transactions securely</li>
                <li>Improve and personalize your experience</li>
                <li>Send you important updates about our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Storage and Security</h2>
              <p>
                Your chat conversations are processed in real-time and are not stored on our servers after the session ends. 
                Your preferences are stored locally on your device using browser local storage. We implement appropriate 
                security measures to protect against unauthorized access, alteration, or destruction of your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
              <p className="mb-3">We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Groq:</strong> For AI language model processing</li>
                <li><strong className="text-white">Stripe:</strong> For secure payment processing</li>
                <li><strong className="text-white">Google AdSense:</strong> For displaying advertisements</li>
                <li><strong className="text-white">Vercel:</strong> For hosting our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Cookies and Advertising</h2>
              <p>
                We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior 
                visits to our website or other websites. You can opt out of personalized advertising by visiting 
                Google&apos;s Ads Settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal data we hold about you</li>
                <li>Request deletion of your data</li>
                <li>Clear your local storage data at any time through your browser settings</li>
                <li>Opt out of personalized advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Age Requirement</h2>
              <p>
                This service is intended for users who are 18 years of age or older. We do not knowingly collect 
                information from anyone under 18. If you are under 18, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new privacy policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our practices, please contact us at{' '}
                <Link href="/contact" className="text-gf-pink-400 hover:underline">our contact page</Link>.
              </p>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-sm text-white/40">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  );
}
