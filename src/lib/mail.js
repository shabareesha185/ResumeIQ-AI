import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  return { host, port, user, pass };
}

function getFrom(host, user) {
  const defaultFrom = host?.includes("gmail")
    ? `"ResumeIQ AI" <${user || "noreply@resumeiq.ai"}>`
    : `"ResumeIQ AI" <noreply@resumeiq.ai>`;

  return process.env.SMTP_FROM || defaultFrom;
}

async function sendEmail({ to, subject, html, link }) {
  const { host, port, user, pass } = createTransporter();
  const from = getFrom(host, user);

  // Development Fallback: Log to console if SMTP credentials are missing
  if (!host || !user || !pass) {
    console.log("\n=======================================================");
    console.log("             [DEVELOPMENT EMAIL SERVICE]");
    console.log(` To: ${to}`);
    console.log(` Subject: ${subject}`);
    console.log(` Link: ${link}`);
    console.log("=======================================================\n");

    return {
      success: true,
      delivered: false,
      mode: "console",
      link,
    };
  }

  // SMTP Mode (Gmail App Password / Custom SMTP)
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({ from, to, subject, html });

    console.log(`[SMTP] Email successfully sent to ${to}`);
    return {
      success: true,
      delivered: true,
      mode: "smtp",
    };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return {
      success: false,
      mode: "smtp",
      error: error.message,
      link,
    };
  }
}

function buildBaseUrl(requestOrigin = "") {
  let baseUrl = requestOrigin;
  if (!baseUrl) {
    baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  }
  return baseUrl.replace(/\/$/, "");
}

/**
 * Sends an email verification link to the user.
 */
export async function sendVerificationEmail(email, token, requestOrigin = "") {
  const baseUrl = buildBaseUrl(requestOrigin);
  const link = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0d1117; color: #f0f6fc; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #38bdf8; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">ResumeIQ AI</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Smart Resume & Career Intelligence</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 600; margin-top: 0; color: #ffffff;">Verify Your Email Address</h2>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
          Thank you for registering with ResumeIQ AI. Please click the button below to verify your email address and activate your account.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${link}" style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 15px; box-shadow: 0 4px 14px rgba(37,99,235,0.3);">
            Verify Email Address
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${link}" style="color: #38bdf8; word-break: break-all;">${link}</a>
        </p>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
        This link will expire in 24 hours. If you did not create a ResumeIQ AI account, you can safely ignore this message.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Verify your email - ResumeIQ AI",
    html,
    link,
  });
}

/**
 * Sends a password reset link to the user.
 */
export async function sendPasswordResetEmail(email, token, requestOrigin = "") {
  const baseUrl = buildBaseUrl(requestOrigin);
  const link = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0d1117; color: #f0f6fc; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #38bdf8; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">ResumeIQ AI</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Smart Resume & Career Intelligence</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 600; margin-top: 0; color: #ffffff;">Reset Your Password</h2>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
          We received a request to reset the password for your ResumeIQ AI account. Click the button below to choose a new password.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${link}" style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; padding: 14px 32px; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 15px; box-shadow: 0 4px 14px rgba(79,70,229,0.3);">
            Reset Password
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${link}" style="color: #38bdf8; word-break: break-all;">${link}</a>
        </p>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
        This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this message.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Reset your password - ResumeIQ AI",
    html,
    link,
  });
}
