import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import cloudinary from "@/lib/cloudinary";

import Resume from "@/models/Resume";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const resume = await Resume.findById(id);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let resourceType = resume.resourceType;
    if (!resourceType || resourceType === "auto") {
      const isPdf = (resume.fileType && resume.fileType.includes("pdf")) || (resume.fileName && resume.fileName.toLowerCase().endsWith(".pdf"));
      resourceType = isPdf ? "image" : "raw";
    }

    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: resourceType,
    });

    await Resume.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
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
