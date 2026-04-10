import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(key);
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!priceId || !stripeKey) {
    if (process.env.NODE_ENV === 'development') {
      console.error('STRIPE_PRICE_ID not configured');
    }
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.mnemox.ai';

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { clerk_user_id: userId },
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Stripe checkout session creation failed:', err);
    }
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
