import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addCredits, createTransaction } from '@/lib/credits';

// Config moved to route segment config

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook config' }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (session.metadata) {
      const { userId, credits, price } = session.metadata;
      
      // Add credits to user account
      await addCredits(userId, parseInt(credits), 'purchase');
      
      // Create transaction record
      await createTransaction(
        userId,
        session.payment_intent as string,
        parseInt(credits),
        parseFloat(price),
        'completed'
      );
      
      console.log(`Added ${credits} credits to user ${userId}`);
    }
  }

  return NextResponse.json({ received: true });
}

export const dynamic = 'force-dynamic';


