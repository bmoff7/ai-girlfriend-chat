import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Girlfriend Chat | Your Virtual Companion',
  description: 'Chat with your AI girlfriend. Experience meaningful conversations with a caring, personalized AI companion.',
  keywords: ['AI girlfriend', 'virtual companion', 'AI chat', 'girlfriend simulator'],
  authors: [{ name: 'AI Girlfriend Chat' }],
  openGraph: {
    title: 'AI Girlfriend Chat',
    description: 'Chat with your AI girlfriend. Experience meaningful conversations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 
          =====================================================
          GOOGLE ADSENSE HEAD SCRIPT (Optional)
          =====================================================
          
          If you want to use Google AdSense, add your AdSense 
          script tag here after getting approved:
          
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
          
          =====================================================
        */}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

