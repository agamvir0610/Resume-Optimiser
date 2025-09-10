import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const { quantity = 1 } = await req.json();
    if (!process.env.STRIPE_PRICE_ID || !process.env.APP_URL) {
      return NextResponse.json({ error: 'Missing Stripe config' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity,
        },
      ],
      success_url: `${process.env.APP_URL}/?success=1`,
      cancel_url: `${process.env.APP_URL}/?canceled=1`,
    });
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


