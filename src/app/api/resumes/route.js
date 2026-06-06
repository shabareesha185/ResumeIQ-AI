import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import Resume from "@/models/Resume";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const resumes = await Resume.find({
      userId: session.user.id,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      resumes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
