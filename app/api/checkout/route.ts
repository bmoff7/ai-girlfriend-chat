import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { priceId, mode } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'https://shemissesyou.vercel.app';

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode === 'subscription' ? 'subscription' : 'payment',
      success_url: `${origin}/success?type=${mode === 'subscription' ? 'unlimited' : 'credits'}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

