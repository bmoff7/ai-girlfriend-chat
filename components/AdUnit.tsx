'use client';

/**
 * AdUnit Component - Google AdSense Placeholder
 * 
 * This is a placeholder component for Google AdSense ads.
 * To implement real ads:
 * 
 * 1. Create a Google AdSense account at https://www.google.com/adsense/
 * 2. Get approved for your website
 * 3. Create an ad unit in your AdSense dashboard
 * 4. Replace the placeholder div below with your actual AdSense code
 * 
 * Example AdSense code (replace with your actual code):
 * 
 * <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 * <ins class="adsbygoogle"
 *      style="display:block"
 *      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *      data-ad-slot="XXXXXXXXXX"
 *      data-ad-format="auto"
 *      data-full-width-responsive="true"></ins>
 * <script>
 *      (adsbygoogle = window.adsbygoogle || []).push({});
 * </script>
 * 
 * IMPORTANT: Make sure your content complies with Google AdSense policies.
 * Adult-oriented content may have restrictions or require specific ad networks.
 */

interface AdUnitProps {
  className?: string;
}

export default function AdUnit({ className = '' }: AdUnitProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* 
        =====================================================
        GOOGLE ADSENSE PLACEHOLDER
        =====================================================
        
        Replace this entire div with your Google AdSense code.
        
        Steps to get your AdSense code:
        1. Go to https://www.google.com/adsense/
        2. Sign up or log in
        3. Add your website and get approved
        4. Go to Ads > By ad unit > Create new ad unit
        5. Choose "Display ads" for sidebar placement
        6. Copy the generated code and paste it here
        
        Note: AdSense approval may take a few days.
        Your site needs to comply with AdSense program policies.
        
        =====================================================
      */}
      <div className="bg-chat-surface/50 border border-white/10 rounded-xl p-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[250px] text-white/30">
          <svg
            className="w-12 h-12 mb-3 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="text-xs font-medium">Ad Space</p>
          <p className="text-[10px] mt-1 opacity-70">
            Insert AdSense code here
          </p>
        </div>
      </div>
    </div>
  );
}

