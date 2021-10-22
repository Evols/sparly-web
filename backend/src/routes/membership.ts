
import express from 'express';
import { ManagementClient } from 'auth0';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import { DateTime } from 'luxon';

const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: '2020-08-27' });
const endpointSecret = process.env.WEBHOOK_SK!;


const membershipRouter = express.Router();

async function fulfillOrder(session: any) {

  const customer_id = session.client_reference_id;

  const auth0 = new ManagementClient({
    domain: 'clovercloud.eu.auth0.com',
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope: "read:users update:users_app_metadata read:users_app_metadata",
    audience: 'https://clovercloud.eu.auth0.com/api/v2/',
    tokenProvider: {
      enableCache: true,
      cacheTTLInSeconds: 10
    },
  });

  const expiration_date = DateTime.local().plus({ years: 3 });

  const params = { id: customer_id };
  const metadata = { clover_web: expiration_date.toISO() }; // TODO: rename

  await auth0.updateAppMetadata(params, metadata);
}


membershipRouter.get(
  '/',
  async function(req: express.Request, res: express.Response) {

    const user_id = req.user.sub;

    let auth0 = new ManagementClient({
      domain: 'clovercloud.eu.auth0.com',
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      scope: "read:users read:users_app_metadata",
      audience: 'https://clovercloud.eu.auth0.com/api/v2/',
      tokenProvider: {
        enableCache: true,
        cacheTTLInSeconds: 10
      },
    });

    const user = await auth0.getUser({ id: user_id });

    const expRaw = user.app_metadata?.clover_web;
    const isMember = expRaw !== undefined && DateTime.local() < DateTime.fromISO(expRaw);
    return res.status(200).send({ isMember });
  }
);

const stripewhRouter = express.Router();

stripewhRouter.post(
  '/',
  bodyParser.raw({type: 'application/json'}),
  async (request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature']!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await fulfillOrder(session);
    }

    return response.status(204).end();
});

export { membershipRouter, stripewhRouter };
