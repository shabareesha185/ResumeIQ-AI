import { auth } from "@/auth";
import { redirect } from "next/navigation";
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

  // Pass session.user directly as initial user details
  return (
    <div className="mx-auto max-w-4xl relative">
      <EditProfileForm initialUser={session.user} />
    </div>
  );
}
