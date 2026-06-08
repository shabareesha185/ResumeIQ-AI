import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import Resume from "@/models/Resume";
import CoverLetter from "@/models/CoverLetter";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;

    // 1. Fetch all resumes of the user to delete them from Cloudinary
    const resumes = await Resume.find({ userId });
    for (const resume of resumes) {
      if (resume.publicId) {
        try {
          const resourceType = resume.resourceType || (resume.fileType && resume.fileType.includes("pdf") ? "image" : "raw");
          await cloudinary.uploader.destroy(resume.publicId, {
            resource_type: resourceType,
          });
        } catch (cloudinaryErr) {
          console.error(`Failed to delete Cloudinary asset ${resume.publicId}:`, cloudinaryErr);
          // Continue deleting other records even if one Cloudinary call fails
        }
      }
    }

    // 2. Cascade delete records from MongoDB
    await Resume.deleteMany({ userId });
    await CoverLetter.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: "Account and all associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Account delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}
