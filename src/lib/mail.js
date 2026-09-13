import nodemailer from "nodemailer";

/**
 * Sends a verification email to the specified address.
 * Uses dynamic requestOrigin if provided, falling back to process.env.AUTH_URL.
 * If SMTP credentials are missing, logs the link to the console for seamless local development.
 */
export async function sendVerificationEmail(email, token, requestOrigin = "") {
  let baseUrl = requestOrigin;
  if (!baseUrl) {
    baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  }
  baseUrl = baseUrl.replace(/\/$/, "");

  const confirmLink = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"ResumeIQ AI" <noreply@resumeiq.ai>`;

  // Development / Fallback mode: Print link to console if SMTP is not configured
  if (!host || !user || !pass) {
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

  // Production / SMTP mode
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

    await transporter.sendMail({
      from,
      to: email,
      subject: "Verify your email - ResumeIQ AI",
      html: htmlContent,
    });

    return {
      success: true,
      delivered: true,
      mode: "smtp",
    };
  } catch (error) {
    console.error("Failed to send verification email via SMTP:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
