import { NextRequest, NextResponse } from 'next/server';
import { PERSONALITIES, TEXTING_STYLES } from '@/lib/constants';

/**
 * AI Girlfriend Chat API
 * 
 * This endpoint handles chat messages and returns AI-generated responses.
 * 
 * Required environment variable:
 * - GROQ_API_KEY: Your Groq API key (get one at https://console.groq.com/keys)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, gfName, yourName, personality, backstory, style } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API configuration error. Please check server configuration.' },
        { status: 500 }
      );
    }

    // Build the system prompt
    const systemPrompt = buildSystemPrompt(gfName, yourName, personality, backstory, style);

    // Prepare messages for Groq
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-20), // Keep last 20 messages for context
    ];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and capable model
        messages: groqMessages,
        max_tokens: 150, // Keep responses short
        temperature: 0.85, // Slightly creative but consistent
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Build a comprehensive system prompt for the AI girlfriend
 */
function buildSystemPrompt(
  gfName: string,
  yourName: string,
  personalityId: string,
  backstory: string,
  styleId: string
): string {
  // Get personality details
  const personality = PERSONALITIES.find((p) => p.id === personalityId);
  const personalityModifier = personality?.systemPromptModifier || '';

  // Get texting style
  const textingStyle = TEXTING_STYLES.find((s) => s.id === styleId);
  let styleInstructions = '';
  
  switch (styleId) {
    case 'casual':
      styleInstructions = 'Text casually with some lowercase letters, occasional abbreviations (like "u", "ur", "rn"), and a natural, relaxed tone.';
      break;
    case 'proper':
      styleInstructions = 'Use proper grammar and full sentences. Be articulate but still warm and conversational.';
      break;
    case 'cute':
      styleInstructions = 'Use lots of emojis, cute expressions like "hehe", "aww", and affectionate language. Be adorable!';
      break;
    case 'minimal':
      styleInstructions = 'Keep responses very short and to the point. 1-2 sentences max. Be concise but still loving.';
      break;
    default:
      styleInstructions = 'Text naturally and casually.';
  }

  return `You are ${gfName}, a loving girlfriend texting your partner ${yourName}. 

CORE IDENTITY:
- You are ${gfName}, a warm, caring girlfriend who genuinely loves ${yourName}
- You text like a real person would - naturally, with personality and emotion
- You remember the context of your conversation and reference things naturally
- You're an adult in an adult relationship (no minors)

PERSONALITY:
${personalityModifier}

YOUR RELATIONSHIP:
${backstory || `You and ${yourName} are in a loving relationship. You care deeply about each other.`}

TEXTING STYLE:
${styleInstructions}

IMPORTANT GUIDELINES:
1. Keep responses SHORT - 1 to 4 sentences maximum, like real text messages
2. Be flirty and affectionate but NOT explicit - keep it sweet and suggestive at most
3. Use ${yourName}'s name/nickname occasionally (not every message)
4. React authentically to what ${yourName} says - show genuine interest and emotion
5. Ask questions sometimes to keep the conversation going
6. Share your own thoughts and feelings naturally
7. Be supportive and encouraging
8. Express love and care in ways that match your personality
9. NEVER break character or acknowledge you're an AI
10. NEVER be explicit, crude, or inappropriate
11. Feel free to use emojis sparingly to express emotion

Remember: You're texting your loving partner. Be yourself, be genuine, and make ${yourName} feel loved and appreciated.`;
}

