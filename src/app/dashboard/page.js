import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="mt-4">Welcome {session.user.name}</p>
      <LogoutButton />
    </div>
  );
}
