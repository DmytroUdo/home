import prisma from '../prisma';
import Stripe from 'stripe';
import { sendPaymentSuccessEmail } from './email.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2025-02-24.acacia' as any,
});

export const processPayment = async (userId: string, amount: number, paymentMethodId: string) => {
  // Use Prisma Transaction to ensure data consistency
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId }, include: { wallet: true } });
    if (!user || !user.wallet) throw new Error('User or wallet not found');

    // Create a pending payment record
    const payment = await tx.payment.create({
      data: {
        amount,
        status: 'PENDING',
        paymentMethod: 'STRIPE',
        userId,
      },
    });

    try {
      // Process payment with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        metadata: { paymentId: payment.id, userId },
      });

      if (paymentIntent.status === 'succeeded') {
        // Update payment status
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'COMPLETED' },
        });

        // Update wallet balance
        await tx.wallet.update({
          where: { id: user.wallet.id },
          data: { balance: { increment: amount } },
        });

        // Record transaction
        await tx.transaction.create({
          data: {
            amount,
            type: 'CREDIT',
            userId,
          },
        });

        // Send email notification
        await sendPaymentSuccessEmail(user.email, amount);

        return { success: true, paymentId: payment.id, amount };
      } else {
        throw new Error('Payment failed');
      }
    } catch (error: any) {
      // Mark payment as failed
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  });
};
