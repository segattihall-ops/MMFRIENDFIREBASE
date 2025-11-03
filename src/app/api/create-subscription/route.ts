
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// A map of plan identifiers to Stripe Price IDs.
// You will need to create these prices in your Stripe Dashboard.
const PLAN_TO_PRICE_ID: { [key: string]: string } = {
  gold: 'price_for_gold_plan', // Replace with your actual Price ID from Stripe
  platinum: 'price_for_platinum_plan', // Replace with your actual Price ID from Stripe
};


export async function POST(req: Request) {
  try {
    const { paymentMethodId, plan } = await req.json();

    if (!paymentMethodId || !plan) {
      return NextResponse.json({ error: 'Missing paymentMethodId or plan' }, { status: 400 });
    }

    const priceId = PLAN_TO_PRICE_ID[plan];
    if (!priceId) {
        return NextResponse.json({ error: 'Invalid plan specified' }, { status: 400 });
    }

    // 1. Create a new customer in Stripe or retrieve an existing one.
    // For this example, we create a new customer every time.
    // In a real app, you'd likely check if a customer already exists.
    const customer = await stripe.customers.create();

    // 2. Attach the payment method to the customer.
    await stripe.paymentMethods.attach(paymentMethodId, { 
        customer: customer.id 
    });

    // 3. Set the default payment method for the customer's invoices.
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // 4. Create the subscription.
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'], // Expands the latest invoice to get the payment intent status
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    console.error('Stripe API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
