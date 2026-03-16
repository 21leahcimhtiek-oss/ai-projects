import { NextRequest, NextResponse } from 'next/server';
import { createBillingPortalSession } from '@/lib/stripe-config';

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const portalUrl = await createBillingPortalSession(
      customerId,
      `${origin}/settings`
    );

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}