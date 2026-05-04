/**
 * Single helper for talking to our Stripe Checkout backend.
 *
 * Uses Vite's env-replacement at build time:
 *   VITE_STRIPE_BACKEND_URL — base URL of the Vercel app hosting the function.
 *                              e.g. "https://nzmp-website.vercel.app"
 *
 * Falls back to "" (same origin) if not set, which is correct when the React
 * frontend is itself deployed on Vercel.
 *
 * If the env var is not set AND the frontend is deployed on a different origin
 * (e.g. Ezsite), the call will obviously fail — set VITE_STRIPE_BACKEND_URL
 * before building for production.
 */

const STRIPE_BACKEND_URL = import.meta.env.VITE_STRIPE_BACKEND_URL || '';

/**
 * Create a Stripe Checkout Session via our backend.
 *
 * @param {Object} params
 * @param {number} params.amount             — NZD cents (integer, e.g. 3000)
 * @param {string} params.currency           — ISO code (e.g. "nzd")
 * @param {string} params.registration_code  — used as Stripe client_reference_id
 * @param {string} params.customer_email
 * @param {string} params.description
 * @param {string} params.success_url
 * @param {string} params.cancel_url
 * @returns {Promise<{ data?: { url: string }, error?: string }>}
 */
export async function createStripeCheckout(params) {
  const endpoint = `${STRIPE_BACKEND_URL}/api/createStripeCheckout`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: json?.error || `Backend returned ${res.status}` };
    }
    if (!json?.url) {
      return { error: 'Backend did not return a Stripe Checkout URL.' };
    }
    return { data: { url: json.url } };
  } catch (err) {
    return { error: err?.message || 'Network error contacting Stripe backend.' };
  }
}
