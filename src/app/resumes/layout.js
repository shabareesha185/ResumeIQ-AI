import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ResumesLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex">
        <Sidebar />

        <div className="relative flex-1 min-h-screen overflow-hidden">
          {/* Grid Background */}
          <div
            className="
            absolute inset-0
            bg-[linear-gradient(to_right,rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.1)_1px,transparent_1px)]
            bg-[size:64px_64px]
            opacity-30
            pointer-events-none
          "
          />

          <Navbar session={session} />

          <main className="relative z-10 p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
