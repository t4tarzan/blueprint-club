import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import env from '@/lib/env';
import { SubscriptionStatus } from '@prisma/client';

const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).json({ message: 'Missing stripe-signature header' });
  }

  const buf = await buffer(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      env.stripeWebhookSecret
    );
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { customer, subscription } = session;

        if (!customer || !subscription) {
          return res.status(400).json({ message: 'Missing customer or subscription' });
        }

        const sub = await stripe.subscriptions.retrieve(subscription as string);
        const price = await stripe.prices.retrieve(sub.items.data[0].price.id);

        await prisma.subscription.create({
          data: {
            stripeId: subscription as string,
            userId: session.client_reference_id!,
            planId: price.lookup_key || 'pro',
            status: sub.status.toUpperCase() as SubscriptionStatus,
            priceId: sub.items.data[0].price.id,
            quantity: sub.items.data[0].quantity || 1,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: { stripeId: subscription.id },
          data: {
            status: subscription.status.toUpperCase() as SubscriptionStatus,
            priceId: subscription.items.data[0].price.id,
            quantity: subscription.items.data[0].quantity || 1,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: { stripeId: subscription.id },
          data: {
            status: subscription.status.toUpperCase() as SubscriptionStatus,
            cancelAtPeriodEnd: false,
          },
        });

        break;
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ message: 'Error processing webhook' });
  }
}
