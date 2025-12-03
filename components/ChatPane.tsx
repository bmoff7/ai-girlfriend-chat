'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, UserSettings, CreditState } from '@/lib/types';
import { PERSONALITIES } from '@/lib/constants';
import { deductCredit, canSendMessage } from '@/lib/storage';
import { useAuth } from '@/components/AuthProvider';
import { 
  getChatHistory, 
  saveMessage, 
  deductCredit as dbDeductCredit,
  updateProfile 
} from '@/lib/supabase/database';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import PaywallModal from './PaywallModal';

interface ChatPaneProps {
  settings: UserSettings;
  credits: CreditState;
  onCreditsChange: () => void;
}

export default function ChatPane({ settings, credits, onCreditsChange }: ChatPaneProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Load chat history from database for authenticated users
  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        setIsLoadingHistory(true);
        const history = await getChatHistory(100);
        
        if (history.length > 0) {
          // Convert DB messages to local format
          const loadedMessages: Message[] = history.map((msg) => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }));
          setMessages(loadedMessages);
          setHasInitialized(true);
        }
        setIsLoadingHistory(false);
      } else {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user]);

  // Send girlfriend's first message when app opens (if no history)
  useEffect(() => {
    if (!hasInitialized && settings.gfName && !isLoadingHistory) {
      // Don't send greeting if we loaded history from DB
      if (messages.length > 0) {
        setHasInitialized(true);
        return;
      }

      setHasInitialized(true);
      
      // Generate a greeting based on personality
      let greeting = '';
      switch (settings.personality) {
        case 'sweet':
          greeting = `hey ${settings.yourName}! 💕 i was just thinking about you. how's your day going?`;
          break;
        case 'calm':
          greeting = `hi ${settings.yourName}. hope you're having a peaceful day. what's on your mind?`;
          break;
        case 'playful':
          greeting = `heyyyy ${settings.yourName}! 😜 finally decided to text me huh? what took you so long~`;
          break;
        case 'clingy':
          greeting = `${settings.yourName}!!! 🥺 i missed you so much!! where have you been?? i was waiting for you to text me!`;
          break;
        case 'tsundere':
          greeting = `oh, it's you. took you long enough to message me. not that i was waiting or anything... 😤`;
          break;
        default:
          greeting = `hey ${settings.yourName}! 💕 missed you. what's up?`;
      }

      const firstMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: greeting,
        timestamp: new Date(),
      };
      setMessages([firstMessage]);

      // Save greeting to database for authenticated users
      if (user) {
        saveMessage('assistant', greeting);
      }
    }
  }, [hasInitialized, settings.gfName, settings.yourName, settings.personality, user, isLoadingHistory, messages.length]);

  // Reset chat when girlfriend name changes
  useEffect(() => {
    if (hasInitialized) {
      setMessages([]);
      setHasInitialized(false);
    }
  }, [settings.gfName]);

  // Check if user can send message
  const checkCanSend = (): boolean => {
    if (user && profile) {
      return profile.is_unlimited || profile.credits > 0;
    }
    return canSendMessage();
  };

  // Handle sending a message
  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isTyping) return;

    // Check credits before sending
    if (!checkCanSend()) {
      setShowPaywall(true);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Save user message to database
    if (user) {
      await saveMessage('user', trimmedInput);
    }

    try {
      // Get chat history for AI memory
      let chatHistoryForAI = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // For authenticated users, we might want more history
      if (user) {
        const fullHistory = await getChatHistory(50);
        if (fullHistory.length > 0) {
          chatHistoryForAI = fullHistory.map((m) => ({
            role: m.role,
            content: m.content,
          }));
          // Add the current message if not already included
          if (chatHistoryForAI[chatHistoryForAI.length - 1]?.content !== trimmedInput) {
            chatHistoryForAI.push({ role: 'user', content: trimmedInput });
          }
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistoryForAI,
          gfName: settings.gfName,
          yourName: settings.yourName,
          personality: settings.personality,
          backstory: settings.backstory,
          style: settings.textingStyle,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Deduct credit for successful response
      if (user) {
        await dbDeductCredit();
        await refreshProfile();
      } else {
        const newCredits = deductCredit();
        if (newCredits === -1 && !credits.isUnlimited) {
          setShowPaywall(true);
        }
      }
      onCreditsChange();

      // Add assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message to database
      if (user) {
        await saveMessage('assistant', data.message);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I couldn't respond right now. Let me try again in a moment... 💔",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto resize
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  const isDisabled = !checkCanSend();

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-chat-bg">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-chat-surface/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gf-pink-400 to-gf-purple-500 flex items-center justify-center text-white text-lg font-bold">
                {settings.gfName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-chat-surface rounded-full" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-white text-lg">
                {settings.gfName}
              </h2>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Online
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full">
                {PERSONALITIES.find((p) => p.id === settings.personality)?.emoji}{' '}
                {PERSONALITIES.find((p) => p.id === settings.personality)?.name}
              </span>
              {user && (
                <span className="text-xs text-green-400/60 bg-green-500/10 px-3 py-1.5 rounded-full">
                  ☁️ Synced
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gf-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white/40 text-sm">Loading your chat history...</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  gfName={settings.gfName}
                  yourName={settings.yourName}
                />
              ))}
              
              {isTyping && <TypingIndicator gfName={settings.gfName} />}
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-white/10 bg-chat-surface/50 backdrop-blur-md">
          {isDisabled && (
            <div className="mb-3 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-center">
              <p className="text-sm text-red-300">
                You&apos;re out of messages!{' '}
                <button
                  onClick={() => setShowPaywall(true)}
                  className="text-gf-pink-400 hover:underline font-medium"
                >
                  Upgrade now
                </button>
              </p>
            </div>
          )}
          
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={isDisabled ? 'Upgrade to continue chatting...' : `Message ${settings.gfName}...`}
                disabled={isDisabled}
                rows={1}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 text-sm resize-none focus:border-gf-pink-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed pr-12"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping || isDisabled}
                className="absolute right-2 bottom-2 p-2 bg-gradient-to-r from-gf-pink-500 to-gf-purple-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          
          <p className="text-[10px] text-white/30 text-center mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        type="no-credits"
      />
    </>
  );
}
