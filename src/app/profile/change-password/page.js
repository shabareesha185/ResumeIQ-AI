import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export const metadata = {
  title: "Change Password | ResumeIQ",
  description: "Update your password secure credentials on ResumeIQ.",
};

export default async function ChangePasswordPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const dbUser = await User.findById(session.user.id);

  // If user is Google OAuth user, they don't have a password. Redirect to profile.
  if (!dbUser || dbUser.provider !== "credentials") {
    redirect("/profile");
  }

  return (
    <div className="mx-auto max-w-4xl relative">
      <ChangePasswordForm />
    </div>
  );
}
