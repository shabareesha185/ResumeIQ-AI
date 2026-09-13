import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      email: user.email,
      provider: user.provider || "credentials",
      isEmailVerified: user.isEmailVerified !== false, // default true for legacy users
    });
  } catch (error) {
    console.error("Check user status error:", error);
    return NextResponse.json(
      { exists: false, error: error.message },
      { status: 500 },
    );
  }
}
