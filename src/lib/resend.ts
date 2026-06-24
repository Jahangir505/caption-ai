import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = "CaptionAI <noreply@captionai.app>";

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to CaptionAI!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#7c3aed;">Welcome to CaptionAI, ${name || "Creator"}!</h1>
        <p>You're all set to generate viral social media captions with AI.</p>
        <p>Your free plan includes <strong>10 captions per day</strong>.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">
          Start Creating
        </a>
        <p style="color:#888;margin-top:32px;font-size:14px;">
          Upgrade to Pro for unlimited captions at $9/month.
        </p>
      </div>
    `,
  });
}

export async function sendProUpgradeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "You're now a CaptionAI Pro member!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#7c3aed;">You're Pro now, ${name || "Creator"}!</h1>
        <p>Thank you for upgrading to CaptionAI Pro.</p>
        <ul>
          <li>Unlimited caption generation</li>
          <li>All platforms & tones</li>
          <li>Bengali + English support</li>
          <li>Full caption history</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">
          Generate Captions
        </a>
      </div>
    `,
  });
}
