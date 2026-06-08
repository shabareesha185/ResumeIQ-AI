import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import CoverLetter from "@/models/CoverLetter";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const coverLetter = await CoverLetter.findById(id);

    if (!coverLetter) {
      return NextResponse.json({ error: "Cover letter not found" }, { status: 404 });
    }

    // Verify ownership
    if (coverLetter.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await CoverLetter.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Cover letter deleted successfully",
    });
  } catch (error) {
    console.error("Delete cover letter error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete cover letter" },
      { status: 500 }
    );
  }
}
