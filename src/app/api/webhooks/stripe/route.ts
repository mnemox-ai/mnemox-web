import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
    }
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Stripe webhook signature verification failed:', err);
    }
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerk_user_id;

        if (!clerkUserId) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Stripe webhook: missing clerk_user_id in session metadata');
          }
          return NextResponse.json({ error: 'Missing user metadata' }, { status: 400 });
        }

        const { error } = await supabase
          .from('subscriptions')
          .upsert(
            {
              user_id: clerkUserId,
              plan: 'pro',
              status: 'active',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Stripe webhook checkout.session.completed error:', error);
          }
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const plan = subscription.status === 'active' ? 'pro' : 'free';
        const periodEnd = subscription.items.data[0]?.current_period_end;

        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan,
            status: subscription.status,
            ...(periodEnd && {
              current_period_end: new Date(periodEnd * 1000).toISOString(),
            }),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Stripe webhook customer.subscription.updated error:', error);
          }
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Stripe webhook customer.subscription.deleted error:', error);
          }
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Stripe webhook handler error:', err);
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
