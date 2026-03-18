import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  create_time: string;
  resource: {
    id: string;
    status: string;
    subscriber?: {
      email_address?: string;
      payer_id?: string;
    };
    custom_id?: string; // clerk_user_id passed during subscription creation
    plan_id?: string;
    start_time?: string;
    billing_info?: {
      next_billing_time?: string;
      last_payment?: {
        amount?: { value: string; currency_code: string };
      };
    };
  };
}

async function verifyPayPalWebhook(
  req: NextRequest,
  body: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.error('PAYPAL_WEBHOOK_ID not configured');
    return false;
  }

  // Check timestamp tolerance
  const transmissionTime = req.headers.get('paypal-transmission-time');
  if (transmissionTime) {
    const eventTime = new Date(transmissionTime).getTime();
    const now = Date.now();
    if (Math.abs(now - eventTime) > TIMESTAMP_TOLERANCE_MS) {
      console.error('PayPal webhook timestamp out of tolerance');
      return false;
    }
  }

  // Get PayPal access token
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('PayPal credentials not configured');
    return false;
  }

  const tokenRes = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenRes.ok) {
    console.error('Failed to get PayPal access token');
    return false;
  }

  const { access_token } = await tokenRes.json();

  // Verify webhook signature via PayPal API
  const verifyRes = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: req.headers.get('paypal-auth-algo'),
        cert_url: req.headers.get('paypal-cert-url'),
        transmission_id: req.headers.get('paypal-transmission-id'),
        transmission_sig: req.headers.get('paypal-transmission-sig'),
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    }
  );

  if (!verifyRes.ok) {
    console.error('PayPal webhook verification request failed');
    return false;
  }

  const { verification_status } = await verifyRes.json();
  return verification_status === 'SUCCESS';
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Verify signature
  const isValid = await verifyPayPalWebhook(req, body);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: PayPalWebhookEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();

  try {
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.UPDATED': {
        const resource = event.resource;
        const clerkUserId = resource.custom_id;

        if (!clerkUserId) {
          console.error('PayPal subscription missing custom_id (clerk_user_id)');
          return NextResponse.json({ error: 'Missing custom_id' }, { status: 400 });
        }

        const { error } = await supabase
          .from('subscriptions')
          .upsert(
            {
              paypal_subscription_id: resource.id,
              clerk_user_id: clerkUserId,
              paypal_plan_id: resource.plan_id,
              status: resource.status?.toLowerCase() ?? 'active',
              paypal_payer_email: resource.subscriber?.email_address ?? null,
              paypal_payer_id: resource.subscriber?.payer_id ?? null,
              start_time: resource.start_time ?? null,
              next_billing_time: resource.billing_info?.next_billing_time ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'paypal_subscription_id' }
          );

        if (error) {
          console.error('PayPal subscription upsert error:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const statusMap: Record<string, string> = {
          'BILLING.SUBSCRIPTION.CANCELLED': 'cancelled',
          'BILLING.SUBSCRIPTION.SUSPENDED': 'suspended',
          'BILLING.SUBSCRIPTION.EXPIRED': 'expired',
        };

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: statusMap[event.event_type],
            updated_at: new Date().toISOString(),
          })
          .eq('paypal_subscription_id', event.resource.id);

        if (error) {
          console.error(`PayPal ${event.event_type} update error:`, error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error('PayPal webhook handler error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
