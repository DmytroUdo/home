import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../prisma';
import { sendSubscriptionExpiringEmail } from '../services/email.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2025-02-24.acacia' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_123';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify Webhook Signature
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Logic handled in payment service, but can be updated here if async
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as any;
      if (invoice.subscription) {
        // Update subscription status
        const sub = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;
        await prisma.subscription.update({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: sub.status.toUpperCase(),
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
      }
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: deletedSubscription.id },
        data: { status: 'CANCELED' },
      });
      break;

    case 'customer.subscription.trial_will_end':
      const expiringSubscription = event.data.object as Stripe.Subscription;
      const userSub = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: expiringSubscription.id },
        include: { user: true },
      });
      if (userSub) {
        await sendSubscriptionExpiringEmail(userSub.user.email, userSub.currentPeriodEnd);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
