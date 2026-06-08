import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Google OAuth users should not upload custom profile photos manually
    if (user.provider === "google") {
      return NextResponse.json(
        { error: "Google accounts use their Google profile photo dynamically." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const base64File = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64File}`;
    
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "resumeiq/profiles",
      resource_type: "image",
      access_mode: "public",
      public_id: `profile-${session.user.id}-${Date.now()}`,
    });

    // Update user image URL in database
    user.image = uploadResult.secure_url;
    await user.save();

    return NextResponse.json({
      success: true,
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Profile photo upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload profile photo" },
      { status: 500 }
    );
  }
}
