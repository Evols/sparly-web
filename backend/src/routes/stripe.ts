
import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: '2020-08-27' });

const router = express.Router();

router.post('/checkoutsession', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    client_reference_id: req.user.sub,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Accompte site éligible au remboursement de l\'État',
            images: ['https://cloverstatic.s3.eu-west-3.amazonaws.com/product-img.jpeg'],
          },
          unit_amount: 5000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://app.sparly.io',
    cancel_url: 'https://sparly.io',
  });

  res.json({ id: session.id });
});

export default router;
