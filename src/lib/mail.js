import nodemailer from "nodemailer";

/**
 * Sends a verification email to the specified address.
 * 1. Resend REST API (if RESEND_API_KEY or SMTP_PASS starting with re_ is set)
 * 2. Nodemailer SMTP (if SMTP_HOST is set)
 * 3. Dev Console Mode (fallback if no keys are provided)
 */
export async function sendVerificationEmail(email, token, requestOrigin = "") {
  let baseUrl = requestOrigin;
  if (!baseUrl) {
    baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  }
  baseUrl = baseUrl.replace(/\/$/, "");

  const confirmLink = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const resendApiKey =
    process.env.RESEND_API_KEY ||
    (process.env.SMTP_PASS?.startsWith("re_") ? process.env.SMTP_PASS : null);

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"ResumeIQ AI" <onboarding@resend.dev>`;

  const htmlContent = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0d1117; color: #f0f6fc; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #38bdf8; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">ResumeIQ AI</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Smart Resume & Career Intelligence</p>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 600; margin-top: 0; color: #ffffff;">Verify Your Email Address</h2>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
          Thank you for registering with ResumeIQ AI. Please click the button below to verify your email address and activate your account.
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${confirmLink}" style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 14px 32px; border-radius: 10px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);">
            Verify Email Address
          </a>
        </div>

        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">
          If the button doesn't work, copy and paste this link into your web browser:
          <br>
          <a href="${confirmLink}" style="color: #38bdf8; word-break: break-all;">${confirmLink}</a>
        </p>
      </div>

      <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
        This link will expire in 24 hours. If you did not create a ResumeIQ AI account, you can safely ignore this message.
      </p>
    </div>
  `;

  // 1. RESEND REST API MODE (Bypasses firewall / port blocking issues)
  if (resendApiKey) {
    try {
      const resendFrom = process.env.SMTP_FROM || "ResumeIQ AI <onboarding@resend.dev>";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [email],
          subject: "Verify your email - ResumeIQ AI",
          html: htmlContent,
        }),
      });

      const resendData = await response.json();

      if (!response.ok) {
        console.error("Resend API Delivery Error:", resendData);
        return {
          success: false,
          mode: "resend-api",
          error: resendData.message || resendData.name || "Resend API call failed",
          link: confirmLink,
        };
      }

      console.log(`[RESEND API] Email successfully sent to ${email} (ID: ${resendData.id})`);
      return {
        success: true,
        delivered: true,
        mode: "resend-api",
        id: resendData.id,
      };
    } catch (err) {
      console.error("Failed to send email via Resend API:", err);
      return {
        success: false,
        mode: "resend-api",
        error: err.message,
        link: confirmLink,
      };
    }
  }

  // 2. NODEMAILER SMTP MODE (Gmail / Custom SMTP)
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from,
        to: email,
        subject: "Verify your email - ResumeIQ AI",
        html: htmlContent,
      });

      console.log(`[SMTP] Email successfully sent to ${email}`);
      return {
        success: true,
        delivered: true,
        mode: "smtp",
      };
    } catch (error) {
      console.error("Failed to send verification email via SMTP:", error);
      return {
        success: false,
        mode: "smtp",
        error: error.message,
        link: confirmLink,
      };
    }
  }

  // 3. DEVELOPMENT CONSOLE FALLBACK MODE
  console.log("\n=======================================================");
  console.log("             [DEVELOPMENT EMAIL SERVICE]");
  console.log(` To: ${email}`);
  console.log(` Verification Link: ${confirmLink}`);
  console.log("=======================================================\n");

  return {
    success: true,
    delivered: false,
    mode: "console",
    link: confirmLink,
  };
}
