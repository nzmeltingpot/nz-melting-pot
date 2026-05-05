/**
 * Brevo bulk-email helper.
 *
 * Calls Ezsite's Deno backend function `email/sendBulkEmail`, which uses
 * the Brevo transactional API under the hood. Reserve this for newsletter
 * blasts and other bulk sends.
 *
 * For one-off transactional emails (form submissions, payment confirmations,
 * contact form replies) keep using window.ezsite.apis.sendEmail (Resend).
 *
 * Backend signature (Ezsite Deno function):
 *   path:       'email/sendBulkEmail'
 *   methodName: 'sendBulkEmail'
 *   param:      [{ from, replyTo, subject, recipients }]
 *
 *   Reads BREVO_API_KEY from Deno.env, calls Brevo per-recipient,
 *   returns { sent, failed, failures, durationMs }.
 */

/**
 * Send the same email (with per-recipient personalisation) to many people via Brevo.
 *
 * @param {Object} params
 * @param {Object} params.from         — { email, name? }   (must be verified in Brevo)
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

  if (!window?.ezsite?.apis?.run) {
    return {
      sent: 0,
      failed: params.recipients.length,
      failures: params.recipients.map((r) => ({ email: r.email, error: 'Ezsite API not available' })),
      error: 'window.ezsite.apis.run is not available — backend integration missing.'
    };
  }

  try {
    const { data, error } = await window.ezsite.apis.run({
      path: 'email/sendBulkEmail',
      methodName: 'sendBulkEmail',
      param: [params]
    });

    if (error) {
      return {
        sent: 0,
        failed: params.recipients.length,
        failures: params.recipients.map((r) => ({
          email: r.email,
          error: typeof error === 'string' ? error : (error.message || JSON.stringify(error))
        })),
        error: typeof error === 'string' ? error : (error.message || JSON.stringify(error))
      };
    }

    // Backend returns the aggregate result directly in `data`
    return {
      sent: data?.sent || 0,
      failed: data?.failed || 0,
      failures: data?.failures || [],
      durationMs: data?.durationMs
    };
  } catch (err) {
    return {
      sent: 0,
      failed: params.recipients.length,
      failures: params.recipients.map((r) => ({
        email: r.email,
        error: err?.message || 'network error'
      })),
      error: err?.message || 'Network error contacting Ezsite bulk-email backend.'
    };
  }
}
