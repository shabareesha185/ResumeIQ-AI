import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import EditProfileForm from "@/components/profile/EditProfileForm";

export const metadata = {
  title: "Edit Profile | ResumeIQ",
  description: "Update your profile details on ResumeIQ.",
};

export default async function EditProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const dbUser = await User.findById(session.user.id);
  if (!dbUser) {
    redirect("/login");
  }

  const initialUser = {
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.image || "",
    provider: dbUser.provider || "credentials",
  };

  return (
    <div className="mx-auto max-w-4xl relative animate-fade-in-up">
      <EditProfileForm initialUser={initialUser} />
    </div>
  );
}
