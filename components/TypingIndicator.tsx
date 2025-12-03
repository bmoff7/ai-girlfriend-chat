'use client';

interface TypingIndicatorProps {
  gfName: string;
}

export default function TypingIndicator({ gfName }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gf-pink-400 to-gf-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {gfName.charAt(0).toUpperCase()}
      </div>
      
      {/* Typing bubble */}
      <div className="bg-chat-surface border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80px]">
        <div className="flex items-center gap-1">
          <div className="typing-dot w-2 h-2 bg-gf-pink-400 rounded-full" />
          <div className="typing-dot w-2 h-2 bg-gf-pink-400 rounded-full" />
          <div className="typing-dot w-2 h-2 bg-gf-pink-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}

