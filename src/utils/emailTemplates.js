/**
 * Email Templates Utility
 * Reusable HTML email templates for newsletters and communications
 */

/**
 * Generate Newsletter Email HTML
 * @param {Object} params - Template parameters
 * @param {string} params.fullName - Recipient's full name
 * @param {string} params.newsletterContent - Main newsletter content (HTML supported)
 * @param {string} params.unsubscribeLink - Unsubscribe URL
 * @param {string} [params.newsletterName] - Newsletter name (default: 'Musical Talent Showcase')
 * @param {string} [params.siteName] - Site name (default: 'Musical Talent Showcase')
 * @param {string} [params.accentColor] - Primary accent color (default: '#c9a227')
 * @returns {Object} { subject, html, text }
 */
export function generateNewsletterEmail({
  fullName,
  newsletterContent,
  unsubscribeLink,
  newsletterName = 'Musical Talent Showcase',
  siteName = 'Musical Talent Showcase',
  accentColor = '#c9a227'
}) {
  const subject = `${newsletterName} — Latest Update`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Georgia', 'Times New Roman', serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 3px solid ${accentColor};">
              <h1 style="margin: 0; font-size: 28px; font-weight: normal; color: #1a1a1a; letter-spacing: 1px;">
                ${newsletterName}
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 35px 40px 10px;">
              <p style="margin: 0; font-size: 18px; color: #333; line-height: 1.6;">
                Dear ${fullName},
              </p>
            </td>
          </tr>

          <!-- Newsletter Content -->
          <tr>
            <td style="padding: 20px 40px 35px;">
              <div style="font-size: 16px; color: #444; line-height: 1.8;">
                ${newsletterContent}
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;" />
            </td>
          </tr>

          <!-- Footer Message -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.7; font-style: italic;">
                You're receiving this because you chose to be part of our little community at <strong style="color: #444;">${siteName}</strong> — and we've truly loved having you here.
              </p>
            </td>
          </tr>

          <!-- Unsubscribe -->
          <tr>
            <td style="padding: 10px 40px 35px;">
              <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.7;">
                If you feel it's time to part ways, we completely understand. You can
                <a href="${unsubscribeLink}" style="color: ${accentColor}; text-decoration: underline;">unsubscribe here</a>.
              </p>
              <p style="margin: 15px 0 0; font-size: 14px; color: #888; line-height: 1.7;">
                We'll take care of it quietly and with no hard feelings — though you'll always be welcome back. 🙂
              </p>
            </td>
          </tr>

          <!-- Bottom Bar -->
          <tr>
            <td style="padding: 20px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain text version for email clients that don't support HTML
  const text = `
${newsletterName} — Latest Update

Dear ${fullName},

${stripHtml(newsletterContent)}

---

You're receiving this because you chose to be part of our little community at ${siteName} — and we've truly loved having you here.

If you feel it's time to part ways, we completely understand. You can unsubscribe here: ${unsubscribeLink}

We'll take care of it quietly and with no hard feelings — though you'll always be welcome back. :)

© ${new Date().getFullYear()} ${siteName}. All rights reserved.
  `.trim();

  return { subject, html, text };
}

/**
 * Strip HTML tags for plain text version
 */
function stripHtml(html) {
  return html.
  replace(/<br\s*\/?>/gi, '\n').
  replace(/<\/p>/gi, '\n\n').
  replace(/<[^>]+>/g, '').
  replace(/&nbsp;/g, ' ').
  replace(/&amp;/g, '&').
  replace(/&lt;/g, '<').
  replace(/&gt;/g, '>').
  replace(/&quot;/g, '"').
  replace(/\n{3,}/g, '\n\n').
  trim();
}

/**
 * Generate unsubscribe URL with email parameter
 * @param {string} email - Recipient email address
 * @param {string} [baseUrl] - Base URL (default: auto-detect from window.location)
 * @returns {string} Full unsubscribe URL
 */
export function generateUnsubscribeLink(email, baseUrl) {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://nzmeltingpot.com');
  return `${base}/unsubscribe?email=${encodeURIComponent(email)}`;
}

/**
 * Generate Unsubscribe Confirmation Email HTML
 * Fixed template (no AI generation) for confirming newsletter unsubscription
 * @param {Object} params - Template parameters
 * @param {string} params.fullName - Recipient's full name
 * @param {string} [params.resubscribeLink] - Re-subscribe URL
 * @param {string} [params.siteName] - Site name (default: 'NZ Melting Pot')
 * @param {string} [params.accentColor] - Primary accent color (default: '#c9a227')
 * @returns {Object} { subject, html, text }
 */
export function generateUnsubscribeConfirmationEmail({
  fullName,
  resubscribeLink,
  siteName = 'NZ Melting Pot',
  accentColor = '#c9a227'
}) {
  const subject = "You've been unsubscribed";
  const displayName = fullName || 'there';
  const subscribeUrl = resubscribeLink || (typeof window !== 'undefined' ? window.location.origin : 'https://nzmeltingpot.com');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Georgia', 'Times New Roman', serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 3px solid ${accentColor};">
              <h1 style="margin: 0; font-size: 24px; font-weight: normal; color: #1a1a1a; letter-spacing: 1px;">
                ${subject}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 35px 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #333; line-height: 1.6;">
                Hi ${displayName},
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #444; line-height: 1.8;">
                You have been successfully removed from our mailing list.
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #444; line-height: 1.8;">
                We're sorry to see you go!
              </p>
              <p style="margin: 0 0 25px; font-size: 16px; color: #444; line-height: 1.8;">
                If this was a mistake, you can re-subscribe here:
              </p>
              <p style="margin: 0 0 30px; text-align: center;">
                <a href="${subscribeUrl}" style="display: inline-block; padding: 12px 28px; background-color: ${accentColor}; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">
                  Re-subscribe
                </a>
              </p>
              <p style="margin: 30px 0 0; font-size: 16px; color: #666; line-height: 1.6;">
                Regards,<br/>
                <strong style="color: #444;">${siteName}</strong>
              </p>
            </td>
          </tr>

          <!-- Bottom Bar -->
          <tr>
            <td style="padding: 20px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain text version
  const text = `
${subject}

Hi ${displayName},

You have been successfully removed from our mailing list.

We're sorry to see you go!

If this was a mistake, you can re-subscribe here: ${subscribeUrl}

Regards,
${siteName}

© ${new Date().getFullYear()} ${siteName}. All rights reserved.
  `.trim();

  return { subject, html, text };
}

/**
 * Send Unsubscribe Confirmation Email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.fullName - Recipient's full name
 * @param {string} [params.resubscribeLink] - Re-subscribe URL
 * @param {string} [params.from] - Sender (default provided)
 * @param {string} [params.siteName] - Site name
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendUnsubscribeConfirmationEmail({
  to,
  fullName,
  resubscribeLink,
  from = 'NZ Melting Pot <noreply@nzmeltingpot.org.nz>',
  siteName
}) {
  const { subject, html, text } = generateUnsubscribeConfirmationEmail({
    fullName,
    resubscribeLink,
    siteName
  });

  try {
    const result = await window.ezsite.apis.sendEmail({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Send Newsletter Email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.fullName - Recipient's full name
 * @param {string} params.newsletterContent - Main newsletter content (HTML)
 * @param {string} [params.unsubscribeLink] - Unsubscribe URL (auto-generated if not provided)
 * @param {string} [params.from] - Sender (default provided)
 * @param {string} [params.newsletterName] - Newsletter name
 * @param {string} [params.siteName] - Site name
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendNewsletterEmail({
  to,
  fullName,
  newsletterContent,
  unsubscribeLink,
  from = 'Musical Talent Showcase <noreply@nzmeltingpot.com>',
  newsletterName,
  siteName
}) {
  // Auto-generate unsubscribe link if not provided
  const recipientEmail = Array.isArray(to) ? to[0] : to;
  const finalUnsubscribeLink = unsubscribeLink || generateUnsubscribeLink(recipientEmail);

  const { subject, html, text } = generateNewsletterEmail({
    fullName,
    newsletterContent,
    unsubscribeLink: finalUnsubscribeLink,
    newsletterName,
    siteName
  });

  try {
    const result = await window.ezsite.apis.sendEmail({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}