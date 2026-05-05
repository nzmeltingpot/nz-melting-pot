/**
 * Brevo bulk-email helper.
 *
 * Calls our Vercel `/api/sendBulkEmail` endpoint, which uses the Brevo
 * transactional API under the hood. Reserve this for newsletter blasts
 * and other bulk sends. For one-off transactional emails (form submissions,
 * payment confirmations, contact form replies) keep using
 * window.ezsite.apis.sendEmail (Resend).
 *
 * Required env at build:
 *   VITE_STRIPE_BACKEND_URL  — same Vercel deployment used for Stripe
 *                              (the bulk email function is hosted alongside it).
 */

const BACKEND_URL = import.meta.env.VITE_STRIPE_BACKEND_URL || '';

/**
 * Send the same email (with per-recipient personalisation) to many people via Brevo.
 *
 * @param {Object} params
 * @param {Object} params.from         — { email, name? }
 * @param {Object} [params.replyTo]    — { email, name? }
 * @param {string} params.subject      — default subject (per-recipient subject overrides)
 * @param {Array<{email:string,name?:string,html:string,text?:string,subject?:string}>} params.recipients
 *
 * @returns {Promise<{ sent: number, failed: number, failures: Array<{email,error}>, durationMs?: number, error?: string }>}
 */
export async function sendBulkEmail(params) {
  if (!params?.recipients?.length) {
    return { sent: 0, failed: 0, failures: [], error: 'No recipients provided.' };
  }

  const endpoint = `${BACKEND_URL}/api/sendBulkEmail`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        sent: 0,
        failed: params.recipients.length,
        failures: params.recipients.map((r) => ({
          email: r.email,
          error: json?.error || `HTTP ${res.status}`
        })),
        error: json?.error || `Backend returned ${res.status}`
      };
    }

    return {
      sent: json.sent || 0,
      failed: json.failed || 0,
      failures: json.failures || [],
      durationMs: json.durationMs
    };
  } catch (err) {
    return {
      sent: 0,
      failed: params.recipients.length,
      failures: params.recipients.map((r) => ({
        email: r.email,
        error: err?.message || 'network error'
      })),
      error: err?.message || 'Network error contacting bulk-email backend.'
    };
  }
}
