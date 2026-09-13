import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, and password are required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    // Case-insensitive user lookup
    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: false,
    });

    // Delete existing verification tokens for this email if any
    await VerificationToken.deleteMany({ email: normalizedEmail });

    // Generate crypto verification token (valid for 24h)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await VerificationToken.create({
      email: normalizedEmail,
      token,
      expires,
    });

    // Extract current origin
    const origin = req.headers.get("origin") || req.nextUrl?.origin || "";

    // Send email with dynamic origin
    const mailResult = await sendVerificationEmail(normalizedEmail, token, origin);

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Registration successful. Please verify your email.",
      emailDelivery: mailResult,
      devLink: mailResult.mode === "console" ? mailResult.link : null,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: false,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Registration failed.",
      },
      { status: 500 },
    );
  }
}
