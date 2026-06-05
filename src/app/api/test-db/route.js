import { connectDB } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
  }
}
