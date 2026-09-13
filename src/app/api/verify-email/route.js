import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const origin = req.headers.get("origin") || req.nextUrl?.origin || "http://localhost:3000";

  if (!token || !email) {
    return NextResponse.redirect(`${origin}/verify-email?error=invalid_params`);
  }

  return NextResponse.redirect(
    `${origin}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
  );
}

export async function POST(req) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification token and email are required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    // Find token record
    const existingToken = await VerificationToken.findOne({
      token,
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (!existingToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification link.",
        },
        { status: 400 },
      );
    }

    // Check expiry
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      await VerificationToken.deleteOne({ _id: existingToken._id });
      return NextResponse.json(
        {
          success: false,
          message: "Verification link has expired. Please request a new link below.",
        },
        { status: 400 },
      );
    }

    // Find and update user
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 },
      );
    }

    user.isEmailVerified = true;
    await user.save();

    // Delete token after successful verification
    await VerificationToken.deleteOne({ _id: existingToken._id });

    return NextResponse.json({
      success: true,
      message: "Email successfully verified! You can now log in.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Email verification failed.",
      },
      { status: 500 },
    );
  }
}
