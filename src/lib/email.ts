import { Resend } from 'resend';

// Only initialize if the key exists to prevent crashing during build/setup
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendAdminNotification(subject: string, htmlContent: string, attachments?: any[]) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Email notification skipped.", { subject });
    return false;
  }

  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length === 0) {
    console.warn("ADMIN_EMAILS is not set or empty. Email notification skipped.");
    return false;
  }

  let hasSuccess = false;

  for (const email of allowedEmails) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Hello Life Foundation Notifications <onboarding@resend.dev>', // Resend test email domain
        to: email,
        subject: `[Hello Life Foundation Admin] ${subject}`,
        html: htmlContent,
        attachments: attachments,
      });

      if (error) {
        console.error(`Error sending email via Resend to ${email}:`, error);
      } else {
        hasSuccess = true;
      }
    } catch (err) {
      console.error(`Unexpected error sending email to ${email}:`, err);
    }
  }
  
  return hasSuccess;
}
