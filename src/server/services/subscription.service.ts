import prisma from '../prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2025-02-24.acacia' as any,
});

export const createSubscription = async (userId: string, plan: string, paymentMethodId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
  if (!user) throw new Error('User not found');

  let customerId = user.subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    customerId = customer.id;
  }

  // Expect plan to be like 'PRO_MONTHLY', 'PRO_ANNUAL', 'ENTERPRISE_MONTHLY', 'ENTERPRISE_ANNUAL'
  const priceId = process.env[`STRIPE_PRICE_ID_${plan.toUpperCase()}`] || 'price_123';

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
  }) as any;

  const currentPeriodStart = new Date(subscription.current_period_start * 1000);
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: subscription.status.toUpperCase(),
      currentPeriodStart,
      currentPeriodEnd,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      cancelAtPeriodEnd: false,
    },
    create: {
      userId,
      plan,
      status: subscription.status.toUpperCase(),
      currentPeriodStart,
      currentPeriodEnd,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      cancelAtPeriodEnd: false,
    },
  });

  return { success: true, subscriptionId: subscription.id, status: subscription.status };
};

export const cancelSubscription = async (userId: string) => {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub || !sub.stripeSubscriptionId) throw new Error('No active subscription found');

  // Cancel at period end (Grace Period)
  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: true },
  });

  return { success: true, message: 'Subscription will be canceled at the end of the billing period' };
};

export const reactivateSubscription = async (userId: string) => {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub || !sub.stripeSubscriptionId) throw new Error('No active subscription found');

  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  await prisma.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: false },
  });

  return { success: true, message: 'Subscription reactivated' };
};

export const getSubscriptionStatus = async (userId: string) => {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub) return { status: 'INACTIVE' };

  // Check if past due or unpaid
  const isGracePeriod = sub.cancelAtPeriodEnd && sub.currentPeriodEnd > new Date();
  const isActive = sub.status === 'ACTIVE' || sub.status === 'TRIALING' || isGracePeriod;

  return {
    plan: sub.plan,
    status: sub.status,
    isActive,
    isGracePeriod,
    currentPeriodEnd: sub.currentPeriodEnd,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
  };
};
