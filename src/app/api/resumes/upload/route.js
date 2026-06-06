import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongodb";
import cloudinary from "@/lib/cloudinary";

import Resume from "@/models/Resume";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64File = buffer.toString("base64");

    const dataUri = `data:${file.type};base64,${base64File}`;

    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
      access_mode: "public",
      folder: "resumeiq/resumes",
      public_id: Date.now() + "-" + fileNameWithoutExtension,
    });

    const resume = await Resume.create({
      userId: session.user.id,
      fileName: file.name,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: file.type,
    });

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error(error);

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
