import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found with this email address.",
        },
        { status: 404 },
      );
    }

    if (user.isEmailVerified !== false) {
      return NextResponse.json(
        {
          success: false,
          message: "This email address is already verified. You can proceed to log in.",
        },
        { status: 400 },
      );
    }

    // Delete existing tokens
    await VerificationToken.deleteMany({ email: normalizedEmail });

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await VerificationToken.create({
      email: normalizedEmail,
      token,
      expires,
    });

    const origin = req.headers.get("origin") || req.nextUrl?.origin || "";

    const mailResult = await sendVerificationEmail(normalizedEmail, token, origin);

    return NextResponse.json({
      success: true,
      message: "A new verification link has been generated.",
      emailDelivery: mailResult,
      devLink: mailResult.mode === "console" ? mailResult.link : null,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to resend verification email.",
      },
      { status: 500 },
    );
  }
}
