/**
 * Vercel serverless function — creates a Stripe Checkout Session.
 *
 * Endpoint:  POST /api/createStripeCheckout
 *
 * Body (JSON):
 *   amount              integer, NZD cents (e.g. 3000 = $30.00)
 *   currency            "nzd"
 *   registration_code   string  — used as Stripe client_reference_id
 *   customer_email      string  — pre-fills checkout
 *   description         string  — short line shown on Stripe page
 *   success_url         string  — where to redirect after payment
 *   cancel_url          string  — where to redirect if user cancels
 *
 * Returns:
 *   200 { url: "https://checkout.stripe.com/c/pay/cs_xxx" }
 *   400 { error: "..." }   on validation issues
 *   500 { error: "..." }   on Stripe / server errors
 *
 * Env:
 *   STRIPE_SECRET_KEY   sk_test_... (test mode) or sk_live_... (production)
 *   ALLOWED_ORIGIN      (optional) restrict CORS to a single origin.
 *                        If unset, all origins are accepted (matches "*").
 */

import Stripe from 'stripe';

export default async function handler(req, res) {
  // ---- CORS ----------------------------------------------------------------
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // ---- Env check -----------------------------------------------------------
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({
      error: 'STRIPE_SECRET_KEY environment variable is not set on the server.'
    });
  }

  // ---- Parse body ----------------------------------------------------------
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  const {
    amount,
    currency = 'nzd',
    registration_code,
    customer_email,
    description,
    success_url,
    cancel_url
  } = body || {};

  // ---- Validate inputs -----------------------------------------------------
  if (!Number.isInteger(amount) || amount < 50) {
    return res.status(400).json({ error: 'amount must be an integer (cents) of at least 50.' });
  }
  if (typeof currency !== 'string' || currency.length !== 3) {
    return res.status(400).json({ error: 'currency must be a 3-letter ISO code.' });
  }
  if (!registration_code || typeof registration_code !== 'string') {
    return res.status(400).json({ error: 'registration_code is required.' });
  }
  if (!customer_email || typeof customer_email !== 'string') {
    return res.status(400).json({ error: 'customer_email is required.' });
  }
  if (!success_url || !cancel_url) {
    return res.status(400).json({ error: 'success_url and cancel_url are required.' });
  }

  // ---- Create Stripe Checkout Session --------------------------------------
  try {
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'], // Apple Pay / Google Pay are auto-included
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: description || `NZ Melting Pot — ${registration_code}`
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      customer_email,
      client_reference_id: registration_code,
      success_url,
      cancel_url,
      metadata: { registration_code }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to create Stripe Checkout Session.'
    });
  }
}
