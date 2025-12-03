'use client';

import type { Message } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  gfName: string;
  yourName: string;
}

export default function MessageBubble({ message, gfName, yourName }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const displayName = isUser ? yourName : gfName;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-end gap-2 message-enter ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
            : 'bg-gradient-to-br from-gf-pink-400 to-gf-purple-500'
        }`}
      >
        {initial}
      </div>

      {/* Message content */}
      <div
        className={`max-w-[75%] px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-gf-pink-600 to-gf-purple-600 rounded-2xl rounded-br-md text-white'
            : 'bg-chat-surface border border-white/10 rounded-2xl rounded-bl-md text-white/90'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p
          className={`text-[10px] mt-1.5 ${
            isUser ? 'text-white/60' : 'text-white/40'
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

