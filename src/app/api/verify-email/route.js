import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";

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
      email: normalizedEmail,
    });

    if (!existingToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification token.",
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
          message: "Verification token has expired. Please request a new verification email.",
        },
        { status: 400 },
      );
    }

    // Find and update user
    const user = await User.findOne({ email: normalizedEmail });
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
