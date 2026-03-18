import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

interface ClerkUserEvent {
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    created_at: number;
    updated_at: number;
  };
  type: string;
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  // Get svix headers
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  // Verify signature
  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserEvent;
  } catch (err) {
    console.error('Clerk webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const { data: userData } = event;
  const primaryEmail = userData.email_addresses?.[0]?.email_address ?? null;

  try {
    switch (event.type) {
      case 'user.created':
      case 'user.updated': {
        const { error } = await supabase
          .from('users')
          .upsert(
            {
              clerk_user_id: userData.id,
              email: primaryEmail,
              first_name: userData.first_name,
              last_name: userData.last_name,
              image_url: userData.image_url,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'clerk_user_id' }
          );

        if (error) {
          console.error(`Clerk webhook ${event.type} error:`, error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        break;
      }

      case 'user.deleted': {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('clerk_user_id', userData.id);

        if (error) {
          console.error('Clerk webhook user.deleted error:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error('Clerk webhook handler error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
