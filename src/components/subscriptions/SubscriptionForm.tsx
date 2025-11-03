
"use client";

import { useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");


interface CheckoutFormProps {
  plan: 'gold' | 'platinum';
}

const CheckoutForm = ({ plan }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      toast({
        variant: "destructive",
        title: "Stripe not loaded",
        description: "Please try again in a moment.",
      });
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
       toast({
        variant: "destructive",
        title: "Card element not found",
        description: "Something went wrong. Please refresh and try again.",
      });
       setIsLoading(false);
       return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message,
      });
      setIsLoading(false);
    } else {
      try {
        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentMethodId: paymentMethod.id, plan }),
        });

        const subscriptionResult = await response.json();

        if (!response.ok || subscriptionResult.error) {
          throw new Error(subscriptionResult.error || "Failed to create subscription.");
        }

        toast({
          title: "Subscription Successful!",
          description: `You've subscribed to the ${plan} plan.`,
        });
        
        // Here you would typically redirect the user or update the UI
        // For example: router.push('/dashboard');

      } catch (apiError: any) {
        toast({
          variant: "destructive",
          title: "Subscription Error",
          description: apiError.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded-md">
        <CardElement options={cardElementOptions} />
      </div>
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full font-bold"
        variant={plan === 'platinum' ? 'default' : 'secondary'}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Subscribe
      </Button>
    </form>
  );
};


export default function SubscriptionForm({ plan }: { plan: 'gold' | 'platinum' }) {
    const options: StripeElementsOptions = {
        mode: 'subscription',
        amount: plan === 'gold' ? 4900 : 9900,
        currency: 'usd',
    };
    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm plan={plan} />
        </Elements>
    )
}
