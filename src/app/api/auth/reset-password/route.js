import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";

export async function POST(req) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Token, email, and new password are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    // Validate token
    const resetToken = await PasswordResetToken.findOne({
      token,
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (!resetToken) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset link." },
        { status: 400 },
      );
    }

    // Check expiry
    const hasExpired = new Date(resetToken.expires) < new Date();
    if (hasExpired) {
      await PasswordResetToken.deleteOne({ _id: resetToken._id });
      return NextResponse.json(
        { success: false, message: "Reset link has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 },
      );
    }

    // Update password and mark email as verified
    user.password = await bcrypt.hash(password, 10);
    user.isEmailVerified = true;
    await user.save();

    // Delete used token
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset password." },
      { status: 500 },
    );
  }
}
