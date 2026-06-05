import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="mt-4">
        <p>Name: {session.user.name}</p>
        <p>Email: {session.user.email}</p>
      </div>
    </div>
  );
}
