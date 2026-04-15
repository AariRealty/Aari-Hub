import { Resend } from "resend";

type NewLeadEmailInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  instagram_handle: string;
  contact_method: string;
  intent: string | null;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends an email notification when a new lead arrives.
 *
 * Failures are logged but never thrown — the lead is already saved in Supabase,
 * so a failed email shouldn't break the public form submission.
 *
 * Required env vars:
 *   - RESEND_API_KEY        (from https://resend.com/api-keys)
 *   - NOTIFICATION_EMAIL    where new-lead alerts should arrive
 *   - NOTIFICATION_FROM_EMAIL  the From: address (must be on a verified domain
 *                              in Resend, or use "onboarding@resend.dev" for
 *                              testing)
 *
 * Optional:
 *   - NEXT_PUBLIC_SITE_URL  used to render an "Open in CRM" link in the email
 */
export async function sendNewLeadEmail(lead: NewLeadEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  const from = process.env.NOTIFICATION_FROM_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!apiKey || !to || !from) {
    console.warn(
      "[email] Resend env vars not set — skipping new-lead notification.",
    );
    return;
  }

  const resend = new Resend(apiKey);

  const fullName = `${lead.first_name} ${lead.last_name}`;
  const igHandle = lead.instagram_handle.replace(/^@/, "");

  const subject = `New lead: ${fullName}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; color: #1a1a1a;">
      <h2 style="margin: 0 0 16px;">New lead from the connect form</h2>
      <p style="font-size: 18px; font-weight: 600; margin: 0 0 8px;">
        ${escapeHtml(fullName)}
      </p>
      <p style="margin: 4px 0;">
        📞 <a href="tel:${escapeHtml(lead.phone)}" style="color: #1a1a1a;">${escapeHtml(lead.phone)}</a>
      </p>
      <p style="margin: 4px 0;">
        ✉️ <a href="mailto:${escapeHtml(lead.email)}" style="color: #1a1a1a;">${escapeHtml(lead.email)}</a>
      </p>
      <p style="margin: 4px 0;">
        📸 <a href="https://instagram.com/${escapeHtml(igHandle)}" style="color: #1a1a1a;">@${escapeHtml(igHandle)}</a>
      </p>
      <p style="margin: 16px 0 4px;"><strong>Preferred contact:</strong> ${escapeHtml(lead.contact_method)}</p>
      ${lead.intent ? `<p style="margin: 4px 0;"><strong>Intent:</strong> ${escapeHtml(lead.intent)}</p>` : ""}
      <p style="margin: 16px 0 4px;"><strong>Message:</strong></p>
      <blockquote style="border-left: 3px solid #ddd; padding-left: 12px; margin: 8px 0; color: #555; white-space: pre-wrap;">${escapeHtml(lead.message)}</blockquote>
      ${
        siteUrl
          ? `<p style="margin: 24px 0 0;">
               <a href="${siteUrl}/admin" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600;">Open in CRM →</a>
             </p>`
          : ""
      }
    </div>
  `;

  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (err) {
    console.error("[email] Failed to send new-lead notification:", err);
  }
}
