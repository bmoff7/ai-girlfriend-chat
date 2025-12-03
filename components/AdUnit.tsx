'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  className?: string;
  slot?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
}

export default function AdUnit({ 
  className = '', 
  slot = '1234567890', // Replace with your actual ad slot ID from AdSense
  format = 'auto' 
}: AdUnitProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6858666442862049"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
