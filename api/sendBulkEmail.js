/**
 * Vercel serverless function — bulk email via Brevo (formerly Sendinblue).
 *
 * Endpoint:  POST /api/sendBulkEmail
 *
 * Body (JSON):
 *   from         { email, name }              — sender (must be a verified
 *                                                sender/domain in Brevo)
 *   replyTo      { email, name? }   optional  — Reply-To header
 *   subject      string                       — applied to every recipient
 *                                                (optionally override per recipient)
 *   recipients   Array<{
 *                  email:    string,
 *                  name?:    string,
 *                  html:     string,           — fully personalised HTML
 *                  text?:    string,
 *                  subject?: string            — overrides top-level subject
 *                }>
 *
 * Response (200):
 *   {
 *     sent: number,
 *     failed: number,
 *     failures: Array<{ email, error }>,
 *     durationMs: number
 *   }
 *
 * Env:
 *   BREVO_API_KEY    xkeysib-... (Brevo dashboard → SMTP & API → API Keys)
 *   ALLOWED_ORIGIN   optional CORS origin restriction
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';
const SEND_DELAY_MS = 220; // ~4.5/sec — under Brevo's 10/sec limit, safe for free plan

export default async function handler(req, res) {
  // ---- CORS ----------------------------------------------------------------
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // ---- Env check -----------------------------------------------------------
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'BREVO_API_KEY environment variable is not set on the server.'
    });
  }

  // ---- Parse body ----------------------------------------------------------
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  const { from, replyTo, subject, recipients } = body || {};

  // ---- Validate inputs -----------------------------------------------------
  if (!from || !from.email) {
    return res.status(400).json({ error: 'from.email is required.' });
  }
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'recipients array is required and non-empty.' });
  }
  if (recipients.length > 1000) {
    return res.status(400).json({ error: 'Maximum 1000 recipients per request.' });
  }
  for (const r of recipients) {
    if (!r?.email || !r?.html) {
      return res.status(400).json({ error: 'Each recipient needs an email and html field.' });
    }
  }

  // ---- Send loop -----------------------------------------------------------
  const startedAt = Date.now();
  const failures = [];
  let sent = 0;

  for (const r of recipients) {
    const payload = {
      sender: { email: from.email, name: from.name || undefined },
      to: [{ email: r.email, name: r.name || undefined }],
      subject: r.subject || subject || 'Newsletter',
      htmlContent: r.html,
      textContent: r.text || undefined,
      ...(replyTo?.email
        ? { replyTo: { email: replyTo.email, name: replyTo.name || undefined } }
        : {})
    };

    try {
      const brevoRes = await fetch(BREVO_ENDPOINT, {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'content-type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (brevoRes.ok) {
        sent++;
      } else {
        const txt = await brevoRes.text().catch(() => '');
        failures.push({
          email: r.email,
          error: `Brevo ${brevoRes.status}: ${txt.substring(0, 300)}`
        });
      }
    } catch (err) {
      failures.push({ email: r.email, error: err?.message || 'network error' });
    }

    // Rate-limit gently
    if (recipients.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, SEND_DELAY_MS));
    }
  }

  return res.status(200).json({
    sent,
    failed: failures.length,
    failures,
    durationMs: Date.now() - startedAt
  });
}
