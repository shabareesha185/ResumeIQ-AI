import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 },
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Block Google-only accounts from using password reset
    if (!user.password) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Delete any existing reset tokens for this user
    await PasswordResetToken.deleteMany({ email: normalizedEmail });

    // Generate a new secure token (expires in 1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordResetToken.create({
      email: normalizedEmail,
      token,
      expires,
    });

    const origin = req.headers.get("origin") || req.nextUrl?.origin || "";
    const mailResult = await sendPasswordResetEmail(normalizedEmail, token, origin);

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
      devLink: (!mailResult.delivered || mailResult.mode === "console") ? mailResult.link : null,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send reset email." },
      { status: 500 },
    );
  }
}
