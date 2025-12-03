# AI Girlfriend Chat 💕

A beautiful, deployable AI web app that lets users chat with a customizable AI girlfriend. Built with Next.js 14, TypeScript, React, and Tailwind CSS.

## Features

- 💬 **Realistic Chat Experience** - Natural conversations with an AI girlfriend that feels like a real person
- 🎭 **5 Unique Personalities** - Sweet, Calm (free) + Playful, Clingy, Tsundere (premium)
- ✍️ **Customizable** - Set her name, your nickname, backstory, and texting style
- 💰 **Built-in Monetization** - Credit-based system with Stripe payments
- 📱 **Beautiful UI** - Modern, responsive design with smooth animations
- 🚀 **Vercel Ready** - Deploy in minutes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Stripe account (for payments)

### Installation

1. Clone or download the project:

```bash
cd ai-girlfriend-chat
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your keys:

```env
# OpenAI API Key (required)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Stripe Keys (required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
NEXT_PUBLIC_STRIPE_PRICE_100_MESSAGES=price_your-100-messages-price-id
NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED=price_your-unlimited-price-id
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stripe Setup

1. Create a [Stripe account](https://stripe.com)

2. In your Stripe Dashboard, create two products:
   - **100 Messages Pack** - $3.99 one-time payment
   - **Unlimited Chat** - $4.99/month subscription

3. Copy the Price IDs and add them to your `.env.local`

4. For production, set up a webhook endpoint for payment confirmation

## Deployment on Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add your environment variables in Vercel's project settings

4. Deploy!

## Project Structure

```
ai-girlfriend-chat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # OpenAI chat API
│   ├── upgrade/
│   │   └── page.tsx          # Payment page
│   ├── success/
│   │   └── page.tsx          # Payment success
│   ├── cancel/
│   │   └── page.tsx          # Payment cancelled
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main chat page
├── components/
│   ├── AdUnit.tsx            # Google AdSense placeholder
│   ├── ChatPane.tsx          # Main chat interface
│   ├── MessageBubble.tsx     # Individual messages
│   ├── PaywallModal.tsx      # Upgrade prompts
│   ├── Sidebar.tsx           # Settings sidebar
│   └── TypingIndicator.tsx   # Typing animation
├── lib/
│   ├── constants.ts          # App constants
│   ├── storage.ts            # localStorage helpers
│   └── types.ts              # TypeScript types
└── ...config files
```

## Monetization System

### Credit System
- New users start with **25 free messages**
- Each AI response deducts 1 credit
- Credits stored in localStorage

### Pricing
- **100 Messages** - $3.99 one-time
- **Unlimited Chat** - $4.99/month subscription

### Premium Personalities
- Free: Sweet, Calm
- Premium (requires credits or Unlimited): Playful, Clingy, Tsundere

## Google AdSense

The `<AdUnit />` component contains a placeholder for Google AdSense. To enable ads:

1. Sign up for [Google AdSense](https://www.google.com/adsense/)
2. Get your site approved
3. Replace the placeholder in `components/AdUnit.tsx` with your ad code
4. Add the AdSense script to `app/layout.tsx`

## Customization

### Adding New Personalities
Edit `lib/constants.ts` and add to the `PERSONALITIES` array.

### Changing the AI Model
Edit `app/api/chat/route.ts` and change the `model` parameter.

### Styling
Tailwind classes are used throughout. Edit `tailwind.config.js` for custom colors.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (gpt-4o-mini)
- **Payments**: Stripe
- **Hosting**: Vercel

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions, please open a GitHub issue.

---

Made with 💕 for virtual companionship

